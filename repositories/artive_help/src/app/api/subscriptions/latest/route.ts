import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// 定义大加啦API的接口类型（基于实际的post_history接口）
interface DajiaLaContentResponse {
  code: number; // 成功时为0
  msg: string;
  data: DajiaLaArticle[];
  // 其他可选字段
  cost_money?: number;
  head_img?: string;
  masssend_count?: number;
  mp_ghid?: string;
  mp_nickname?: string;
  mp_wxid?: string;
  now_page?: number;
  now_page_articles_num?: number;
  publish_count?: number;
  remain_money?: number;
  total_num?: number;
  total_page?: number;
}

interface DajiaLaArticle {
  appmsgid: number;
  cover_url: string;
  digest: string;
  is_deleted: string;
  item_show_type: number;
  msg_fail_reason: string;
  msg_status: number;
  original: number;
  pic_cdn_url_16_9: string;
  pic_cdn_url_1_1: string;
  pic_cdn_url_235_1: string;
  position: number;
  post_time: number;
  post_time_str: string;
  pre_post_time: number;
  send_to_fans_num: number;
  title: string;
  types: number;
  update_time: number;
  url: string;
}

// POST - 获取当日已订阅公众号的最新内容
export async function POST(request: NextRequest) {
  try {
    // 创建Supabase客户端，使用cookie进行认证
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
            })
          },
        },
      }
    )

    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    // 获取用户的所有活跃微信公众号订阅
    const { data: subscriptions, error: subError } = await supabase
      .from('user_subscriptions')
      .select(`
        id,
        subscription_id
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .eq('subscription_type', 'wechat');

    if (subError) {
      console.error('获取订阅列表失败:', subError);
      return NextResponse.json(
        { error: '获取订阅列表失败' },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        message: '没有活跃的微信公众号订阅',
        newContentCount: 0,
        processedAccounts: 0
      });
    }

    // 获取所有公众号信息
    const wechatAccountIds = subscriptions.map(sub => sub.subscription_id);
    const { data: wechatAccounts, error: accountError } = await supabase
      .from('wechat_accounts')
      .select('id, account_id, name, avatar_url')
      .in('id', wechatAccountIds);

    if (accountError) {
      console.error('获取公众号信息失败:', accountError);
      return NextResponse.json(
        { error: '获取公众号信息失败' },
        { status: 500 }
      );
    }

    if (!wechatAccounts || wechatAccounts.length === 0) {
      return NextResponse.json({
        message: '没有找到公众号信息',
        newContentCount: 0,
        processedAccounts: 0
      });
    }

    // 获取大加啦API配置
    const apiKey = process.env.DAJIALA_API_KEY;
    if (!apiKey) {
      console.error('大加啦API密钥未配置');
      return NextResponse.json(
        { error: 'API配置错误' },
        { status: 500 }
      );
    }

    // 计算今日时间范围
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime() / 1000; // 转为Unix时间戳

    let totalNewContent = 0;
    let processedAccounts = 0;
    const failedAccounts: { name: string; error: string }[] = [];

    // 创建公众号映射
    const accountMap = new Map();
    wechatAccounts.forEach(account => {
      accountMap.set(account.id, account);
    });

    // 批量处理订阅，避免并发过高
    const batchSize = 2; // 每批处理2个订阅，避免API限制
    
    for (let i = 0; i < subscriptions.length; i += batchSize) {
      const batch = subscriptions.slice(i, i + batchSize);
      
      // 并行处理当前批次
      const batchPromises = batch.map(async (subscription) => {
        const account = accountMap.get(subscription.subscription_id);
        if (!account || !account.account_id) {
          console.warn(`订阅 ${subscription.id} 缺少公众号信息`);
          return { success: false, accountName: account?.name || '未知账号', error: '缺少公众号信息' };
        }

        try {
          console.log(`正在获取公众号 ${account.name} (${account.account_id}) 的最新内容...`);

          // 调用大加啦API获取最新内容（使用post_history接口）
          const params = new URLSearchParams({
            biz: account.account_id, // 使用biz参数
            key: apiKey,
            page: '1' // 只获取第一页最新内容
          });

          console.log(`API请求参数:`, { biz: account.account_id, key: apiKey.substring(0, 6) + '***', page: '1' });

          const response = await fetch('https://www.dajiala.com/fbmain/monitor/v3/post_history', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            body: params.toString()
          });

          if (!response.ok) {
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
          }

          const apiResult: DajiaLaContentResponse = await response.json();
          
          console.log(`API响应状态: code=${apiResult.code}, msg=${apiResult.msg}, data条数=${apiResult.data?.length || 0}`);

          // 大加啦API成功状态码是0，不是200
          if (apiResult.code !== 0) {
            throw new Error(apiResult.msg || 'API返回错误');
          }

          if (!apiResult.data || !Array.isArray(apiResult.data)) {
            throw new Error('API未返回有效数据');
          }

          // 筛选出今日发布的内容
          const todayArticles = apiResult.data.filter(article => {
            return article.post_time >= todayStart && 
                   article.is_deleted === '0' && // 未删除
                   article.msg_status === 2; // 正常状态
          });

          console.log(`公众号 ${account.name}: 找到今日文章 ${todayArticles.length} 篇`);

          if (todayArticles.length === 0) {
            return { 
              success: true, 
              accountName: account.name, 
              newArticles: 0,
              message: '今日无新内容'
            };
          }

          let insertedCount = 0;

          // 逐个检查和插入文章
          for (const article of todayArticles) {
            try {
              // 检查该文章是否已存在（只基于URL去重，因为appmsgid不是唯一的）
              console.log(`检查文章是否存在: ${article.title.substring(0, 30)}... URL: ${article.url.substring(0, 50)}...`);
              
              // 只检查URL是否存在（与现有API保持一致）
              const { data: existingContent, error: urlError } = await supabase
                .from('contents')
                .select('id')
                .eq('original_url', article.url)
                .maybeSingle(); // 使用maybeSingle()避免找不到记录时报错

              if (urlError) {
                console.error('URL查询错误:', urlError);
                continue; // 查询出错时跳过这篇文章
              }

              if (existingContent) {
                console.log(`文章已存在，跳过: ${article.title.substring(0, 30)}...`);
                continue;
              }

              console.log(`文章不存在，准备插入: ${article.title.substring(0, 30)}...`);

              // 插入新内容到数据库（只使用数据库中确实存在的字段）
              const contentData = {
                source_type: 'wechat',
                source_id: account.id,
                external_id: article.appmsgid.toString(),
                title: article.title,
                original_url: article.url,
                cover_image_url: article.cover_url || '',
                content_type: 'article', // 统一设为article
                published_at: new Date(article.post_time * 1000).toISOString(),
                position: article.position,
                send_to_fans_num: article.send_to_fans_num
              };

              const { error: insertError } = await supabase
                .from('contents')
                .insert(contentData);

              if (insertError) {
                console.error(`插入文章失败: ${article.title}`, insertError);
              } else {
                insertedCount++;
                console.log(`成功插入文章: ${article.title.substring(0, 30)}...`);
              }

            } catch (articleError) {
              console.error(`处理文章失败: ${article.title}`, articleError);
            }
          }

          return {
            success: true,
            accountName: account.name,
            newArticles: insertedCount,
            totalArticles: todayArticles.length
          };

        } catch (error) {
          console.error(`获取公众号 ${account.name} 内容失败:`, error);
          return {
            success: false,
            accountName: account.name,
            error: error instanceof Error ? error.message : '未知错误'
          };
        }
      });

      // 等待当前批次完成
      const batchResults = await Promise.all(batchPromises);
      
      // 统计结果
      batchResults.forEach(result => {
        if (result.success) {
          processedAccounts++;
          totalNewContent += result.newArticles || 0;
        } else {
          failedAccounts.push({
            name: result.accountName,
            error: result.error || '处理失败'
          });
        }
      });

      // 批次间延迟，避免API限制
      if (i + batchSize < subscriptions.length) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5秒延迟
      }
    }

    // 返回处理结果
    const response = {
      message: '最新内容获取完成',
      processedAccounts,
      totalAccounts: subscriptions.length,
      newContentCount: totalNewContent,
      timestamp: new Date().toISOString()
    };

    // 如果有失败的账号，添加到响应中
    if (failedAccounts.length > 0) {
      (response as any).failedAccounts = failedAccounts;
      (response as any).warningMessage = `${failedAccounts.length} 个公众号处理失败`;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('获取最新内容错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}