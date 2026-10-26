import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { rewriteWithAI, type AIModelKey } from '@/lib/openrouter';
import { fetchWechatArticle, cleanWechatHtml, isWechatArticleUrl } from '@/lib/wechat-article';

// GET: 获取用户的改写任务列表
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
          },
        },
      }
    );

    // 检查用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const contentIds = searchParams.get('contentIds')?.split(',').filter(Boolean);
    const status = searchParams.get('status');

    // 构建查询
    let query = supabase
      .from('rewrite_tasks')
      .select(`
        *,
        rewrite_results (
          id,
          version,
          title,
          content_html,
          is_edited,
          edited_content_html,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // 添加筛选条件
    if (contentIds && contentIds.length > 0) {
      query = query.in('content_id', contentIds);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: tasks, error } = await query;

    if (error) {
      console.error('查询改写任务失败:', error);
      return NextResponse.json({ error: '查询失败' }, { status: 500 });
    }

    // 调试日志
    console.log('[GET /api/rewrite] 查询结果:', {
      count: tasks?.length || 0,
      tasks: tasks?.map(t => ({
        id: t.id,
        content_id: t.content_id,
        status: t.status,
        results_count: t.rewrite_results?.length || 0,
        results: t.rewrite_results
      }))
    });

    return NextResponse.json(tasks || []);
  } catch (error) {
    console.error('获取改写任务错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// POST: 创建新的改写任务
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
          },
        },
      }
    );

    // 检查用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 解析请求体
    const body = await request.json();
    const { contentIds, aiModel, promptTemplateId } = body;

    if (!contentIds || !Array.isArray(contentIds) || contentIds.length === 0) {
      return NextResponse.json({ error: '请选择要改写的内容' }, { status: 400 });
    }

    if (!aiModel || !['claude-4', 'gpt-5', 'gemini-pro'].includes(aiModel)) {
      return NextResponse.json({ error: '请选择有效的AI模型' }, { status: 400 });
    }

    // 获取提示词模板
    let promptText = '';
    if (promptTemplateId) {
      const { data: template } = await supabase
        .from('prompt_templates')
        .select('prompt_text')
        .eq('id', promptTemplateId)
        .single();
      
      if (template) {
        promptText = template.prompt_text;
      }
    }

    // 如果没有指定模板，使用默认的
    if (!promptText) {
      const { data: defaultTemplate } = await supabase
        .from('prompt_templates')
        .select('prompt_text')
        .eq('name', '爆款文章模仿')
        .eq('is_system', true)
        .single();
      
      promptText = defaultTemplate?.prompt_text || '';
    }

    // 创建改写任务
    const tasks = contentIds.map((contentId: string) => ({
      user_id: user.id,
      content_id: contentId,
      ai_model: aiModel,
      prompt_template: promptText,
      status: 'pending'
    }));

    const { data: createdTasks, error: createError } = await supabase
      .from('rewrite_tasks')
      .insert(tasks)
      .select();

    if (createError) {
      console.error('创建改写任务失败:', createError);
      return NextResponse.json({ error: '创建任务失败' }, { status: 500 });
    }

    // 改为使用流式API处理，这里只返回创建的任务
    // 前端会调用 /api/rewrite/stream 来处理改写

    return NextResponse.json({
      message: `已创建${createdTasks.length}个改写任务`,
      tasks: createdTasks
    });
  } catch (error) {
    console.error('创建改写任务错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 执行改写任务的内部函数
async function executeRewriteTask(
  taskId: string,
  contentId: string,
  aiModel: AIModelKey,
  promptTemplate: string
) {
  // 使用服务端客户端，绕过RLS
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  console.log('使用的密钥类型:', serviceKey ? 'Service Role Key' : 'Anon Key');
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey || anonKey,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );

  try {
    // 更新任务状态为处理中
    await supabase
      .from('rewrite_tasks')
      .update({
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', taskId);

    // 获取内容信息
    const { data: content, error: contentError } = await supabase
      .from('contents')
      .select('id, title, original_url')
      .eq('id', contentId)
      .single();

    if (contentError || !content) {
      console.error('获取内容失败:', contentError);
      throw new Error('内容不存在');
    }
    
    // 调试：打印内容信息
    console.log('处理内容:', {
      id: content.id,
      title: content.title,
      original_url: content.original_url,
      has_url: !!content.original_url,
      is_wechat: content.original_url ? content.original_url.includes('mp.weixin.qq.com') : false
    });

    // 检查是否有缓存的原文
    const { data: cached } = await supabase
      .from('content_originals')
      .select('original_title, original_html')
      .eq('content_id', contentId)
      .single();
    
    console.log('缓存检查:', { has_cache: !!cached });

    let originalTitle = '';
    let originalHtml = '';

    if (cached) {
      // 使用缓存的原文
      originalTitle = cached.original_title;
      originalHtml = cached.original_html;
    } else if (content.original_url) {
      // 检查是否为微信文章链接
      const isWechat = isWechatArticleUrl(content.original_url);
      console.log('URL验证结果:', { url: content.original_url, isWechat });
      
      if (!isWechat) {
        // 不是微信链接，直接报错
        console.error('非微信链接，拒绝处理:', content.original_url);
        throw new Error('只支持微信公众号文章链接');
      }
      
      // 获取微信文章内容
      try {
        console.log('开始获取微信文章:', content.original_url);
        const article = await fetchWechatArticle(content.original_url);
        originalTitle = article.title;
        originalHtml = cleanWechatHtml(article.html);
        console.log('成功获取文章:', { title: originalTitle });

        // 缓存原文
        await supabase
          .from('content_originals')
          .insert({
            content_id: contentId,
            original_title: originalTitle,
            original_html: originalHtml,
            original_author: article.author,
            source_url: content.original_url
          });
      } catch (error) {
        console.error('获取原文失败:', error);
        throw new Error('获取微信文章内容失败: ' + (error instanceof Error ? error.message : '未知错误'));
      }
    } else {
      // 没有原文链接，直接报错
      console.error(`Content ${contentId} 没有原文链接`);
      throw new Error('素材缺少原文链接');
    }

    // 调用AI进行改写
    const rewriteResult = await rewriteWithAI({
      title: originalTitle,
      content: originalHtml,
      model: aiModel,
      prompt: promptTemplate
    });

    // 保存改写结果
    console.log('[改写任务] 准备保存改写结果:', {
      taskId,
      title: rewriteResult.title,
      contentLength: rewriteResult.content.length
    });
    
    const { data: savedResult, error: resultError } = await supabase
      .from('rewrite_results')
      .insert({
        task_id: taskId,
        version: 1,
        title: rewriteResult.title,
        content_html: rewriteResult.content,
        content_text: rewriteResult.content.replace(/<[^>]*>/g, ' ').trim()
      })
      .select()
      .single();

    if (resultError) {
      console.error('[改写任务] 保存结果失败:', resultError);
      throw resultError;
    }
    
    console.log('[改写任务] 结果保存成功:', savedResult);

    // 更新任务状态为完成
    const { error: updateError } = await supabase
      .from('rewrite_tasks')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', taskId);
      
    if (updateError) {
      console.error('[改写任务] 更新任务状态失败:', updateError);
      throw updateError;
    }
    
    console.log('[改写任务] 任务状态更新为完成:', { taskId, status: 'completed' });

  } catch (error) {
    console.error('执行改写任务失败:', error);
    
    // 更新任务状态为失败
    const { error: updateError } = await supabase
      .from('rewrite_tasks')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : '未知错误',
        completed_at: new Date().toISOString()
      })
      .eq('id', taskId);
    
    if (updateError) {
      console.error('更新失败状态失败:', updateError);
    } else {
      console.log('任务状态已更新为失败');
    }
  }
}

// PUT: 更新改写结果（保存编辑）
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
          },
        },
      }
    );

    // 检查用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 解析请求体
    const body = await request.json();
    const { resultId, title, contentHtml } = body;

    if (!resultId) {
      return NextResponse.json({ error: '缺少结果ID' }, { status: 400 });
    }

    // 更新改写结果
    const { error } = await supabase
      .from('rewrite_results')
      .update({
        title: title,
        edited_content_html: contentHtml,
        is_edited: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', resultId);

    if (error) {
      console.error('更新改写结果失败:', error);
      return NextResponse.json({ error: '更新失败' }, { status: 500 });
    }

    return NextResponse.json({ message: '保存成功' });
  } catch (error) {
    console.error('更新改写结果错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}