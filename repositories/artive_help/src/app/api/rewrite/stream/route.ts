import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { fetchWechatArticle, cleanWechatHtml, isWechatArticleUrl } from '@/lib/wechat-article';
import { AI_MODELS, type AIModelKey } from '@/lib/openrouter';

// 流式响应的改写任务处理
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
      return new Response(JSON.stringify({ error: '未登录' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 解析请求体
    const body = await request.json();
    const { taskId, contentId, aiModel, promptTemplate } = body;

    console.log('[流式改写] 开始处理任务:', { taskId, contentId, aiModel });

    // 创建流式响应
    const encoder = new TextEncoder();
    
    // 创建可读流
    const readableStream = new ReadableStream({
      async start(controller) {
        // 发送初始事件
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'start', 
          message: '开始处理任务...' 
        })}\n\n`));
        
        try {

        // 使用服务端客户端
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        
        const supabaseService = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          serviceKey || anonKey,
          {
            cookies: {
              getAll() { return []; },
              setAll() {},
            },
          }
        );

        // 更新任务状态为处理中
        await supabaseService
          .from('rewrite_tasks')
          .update({
            status: 'processing',
            started_at: new Date().toISOString()
          })
          .eq('id', taskId);

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'status', 
          status: 'processing',
          message: '正在获取原文内容...' 
        })}\n\n`));

        // 获取内容信息
        const { data: content, error: contentError } = await supabaseService
          .from('contents')
          .select('id, title, original_url')
          .eq('id', contentId)
          .single();

        if (contentError || !content) {
          throw new Error('内容不存在');
        }

        // 检查缓存的原文
        const { data: cached } = await supabaseService
          .from('content_originals')
          .select('original_title, original_html')
          .eq('content_id', contentId)
          .single();

        let originalTitle = '';
        let originalHtml = '';

        if (cached) {
          originalTitle = cached.original_title;
          originalHtml = cached.original_html;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'progress', 
            message: '使用缓存的原文内容' 
          })}\n\n`));
        } else if (content.original_url && isWechatArticleUrl(content.original_url)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'progress', 
            message: '正在获取微信文章内容...' 
          })}\n\n`));
          
          const article = await fetchWechatArticle(content.original_url);
          originalTitle = article.title;
          originalHtml = cleanWechatHtml(article.html);
          
          // 缓存原文
          await supabaseService
            .from('content_originals')
            .insert({
              content_id: contentId,
              original_title: originalTitle,
              original_html: originalHtml,
              original_author: article.author,
              source_url: content.original_url
            });
        } else {
          throw new Error('素材缺少有效的原文链接');
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'progress', 
          message: '正在调用AI进行改写...' 
        })}\n\n`));

        // 调用OpenRouter API进行流式改写
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
          throw new Error('OpenRouter API key not configured');
        }

        // 构建提示词
        const prompt = promptTemplate
          .replace('{{title}}', originalTitle)
          .replace('{{content}}', originalHtml);

        // 转换模型ID
        const modelId = AI_MODELS[aiModel as AIModelKey] || aiModel;
        console.log('[流式改写] 使用模型:', { aiModel, modelId });

        // 调用OpenRouter流式API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'Artive Help'
          },
          body: JSON.stringify({
            model: modelId,
            messages: [
              {
                role: 'system',
                content: '你是一个专业的内容创作者。你必须严格按照以下JSON格式返回改写结果，不要添加任何其他字段：\n{"title": "改写后的标题", "content": "改写后的HTML内容"}。\n只返回这个JSON对象，不要有任何其他内容。'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 4000,
            stream: true // 启用流式响应
          })
        });

        if (!response.ok) {
          throw new Error(`OpenRouter API request failed: ${response.status}`);
        }

        // 处理流式响应
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        let accumulatedContent = '';
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                
                if (content) {
                  accumulatedContent += content;
                  
                  // 发送内容片段给前端
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                    type: 'content', 
                    content: content 
                  })}\n\n`));
                }
              } catch (e) {
                console.error('解析流数据失败:', e);
              }
            }
          }
        }

        // 解析完整的AI响应
        console.log('[流式改写] 累积的AI响应长度:', accumulatedContent.length);
        console.log('[流式改写] AI响应内容预览:', accumulatedContent.substring(0, 500));
        
        let result;
        let parseSuccess = false;
        
        try {
          // 首先尝试直接解析
          try {
            result = JSON.parse(accumulatedContent);
            parseSuccess = true;
            console.log('[流式改写] 直接解析JSON成功');
          } catch (e1) {
            // 尝试提取并修复JSON
            const jsonMatch = accumulatedContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              console.log('[流式改写] 找到JSON内容，尝试修复换行符');
              const jsonStr = jsonMatch[0];
              
              // 尝试不同的修复策略
              try {
                // 策略1：简单替换content中的实际换行为转义换行
                const lines = jsonStr.split('\n');
                let inContent = false;
                let fixedJson = '';
                
                for (let i = 0; i < lines.length; i++) {
                  const line = lines[i];
                  if (line.includes('"content"') && line.includes(':')) {
                    inContent = true;
                  }
                  
                  if (inContent && !line.includes('"}') && i > 0) {
                    fixedJson += '\\n' + line;
                  } else {
                    if (i > 0) fixedJson += '\n';
                    fixedJson += line;
                  }
                  
                  if (line.includes('"}')) {
                    inContent = false;
                  }
                }
                
                result = JSON.parse(fixedJson);
                parseSuccess = true;
                console.log('[流式改写] 修复策略1成功');
              } catch (e2) {
                // 策略2：使用eval（谨慎使用）
                try {
                  result = eval('(' + jsonStr + ')');
                  parseSuccess = true;
                  console.log('[流式改写] 使用eval解析成功');
                } catch (e3) {
                  throw new Error('所有解析策略都失败了');
                }
              }
            }
          }
          
          if (parseSuccess) {
            console.log('[流式改写] 解析后的结果:', {
              hasTitle: !!result.title,
              hasContent: !!result.content,
              contentLength: result.content?.length || 0,
              keys: Object.keys(result)
            });
          } else {
            throw new Error('无法解析AI响应');
          }
        } catch (e) {
          console.error('[流式改写] 解析AI响应失败，使用正则提取:', e);
          
          // 最后的尝试：使用正则提取
          const titleMatch = accumulatedContent.match(/"title"\s*:\s*"([^"]+)"/);
          const contentStart = accumulatedContent.indexOf('"content"');
          
          if (titleMatch && contentStart > 0) {
            // 找到content的开始和结束
            const contentEnd = accumulatedContent.lastIndexOf('"}');
            if (contentEnd > contentStart) {
              const contentPart = accumulatedContent.substring(contentStart + 11, contentEnd);
              result = {
                title: titleMatch[1],
                content: contentPart.replace(/\\n/g, '\n').replace(/\\"/g, '"')
              };
              console.log('[流式改写] 正则提取成功');
            }
          }
          
          if (!result) {
            result = {
              title: originalTitle + ' (改写版)',
              content: '<p>改写失败，请重试</p>'
            };
          }
        }

        // 确保result有必需的字段
        if (!result.title) {
          console.warn('[流式改写] 警告：AI响应缺少title字段，使用默认值');
          result.title = originalTitle + ' (改写版)';
        }
        if (!result.content) {
          console.error('[流式改写] 警告：AI响应缺少content字段，使用默认值');
          result.content = '<p>改写内容为空，请重试</p>';
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'progress', 
          message: '正在保存改写结果...' 
        })}\n\n`));

        // 先查询该任务的最大版本号
        const { data: existingResults } = await supabaseService
          .from('rewrite_results')
          .select('version')
          .eq('task_id', taskId)
          .order('version', { ascending: false })
          .limit(1);
        
        const nextVersion = existingResults && existingResults.length > 0 
          ? existingResults[0].version + 1 
          : 1;
        
        console.log('[流式改写] 保存结果版本:', { taskId, nextVersion });

        // 保存改写结果 - 使用正确的版本号
        const { data: savedResult, error: resultError } = await supabaseService
          .from('rewrite_results')
          .insert({
            task_id: taskId,
            version: nextVersion,
            title: result.title || '无标题',
            content_html: result.content || '',
            content_text: (result.content || '').replace(/<[^>]*>/g, ' ').trim()
          })
          .select()
          .single();

        if (resultError) {
          throw resultError;
        }

        // 更新任务状态为完成
        await supabaseService
          .from('rewrite_tasks')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', taskId);

        // 发送完成事件
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'complete',
          status: 'completed',
          result: savedResult
        })}\n\n`));

      } catch (error) {
        console.error('流式改写任务失败:', error);
        
        // 更新任务状态为失败
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        
        const supabaseService = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          serviceKey || anonKey,
          {
            cookies: {
              getAll() { return []; },
              setAll() {},
            },
          }
        );
        
        await supabaseService
          .from('rewrite_tasks')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : '未知错误',
            completed_at: new Date().toISOString()
          })
          .eq('id', taskId);

        // 发送错误事件
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'error',
          status: 'failed',
          error: error instanceof Error ? error.message : '未知错误'
        })}\n\n`));
      } finally {
        controller.close();
      }

      }
    });

    // 返回流式响应
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('创建流式改写任务错误:', error);
    return new Response(JSON.stringify({ error: '服务器错误' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
