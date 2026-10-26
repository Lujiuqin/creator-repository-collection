import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// 大家啦API配置
const WECHAT_API_BASE = 'https://www.dajiala.com/fbmain/monitor/v3/post_history'; 
const WECHAT_API_KEY = process.env.DAJIALA_API_KEY;

// POST - 获取微信公众号历史内容
export async function POST(request: NextRequest) {
  try {
    // API密钥验证
    if (!WECHAT_API_KEY) {
      return NextResponse.json(
        { error: '服务配置错误，请联系管理员配置DAJIALA_API_KEY' },
        { status: 500 }
      );
    }

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

    // 获取请求参数
    const body = await request.json();
    const { subscriptionId, isManualRefresh = false } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: '缺少订阅ID' },
        { status: 400 }
      );
    }

    // 验证订阅是否属于当前用户
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select(`
        id,
        subscription_type,
        subscription_id,
        last_content_fetch_at,
        content_fetch_count
      `)
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: '订阅不存在或无权限' },
        { status: 404 }
      );
    }

    // 检查1秒刷新限制（仅手动刷新时检查，测试环境）
    if (isManualRefresh && subscription.last_content_fetch_at) {
      const lastFetch = new Date(subscription.last_content_fetch_at);
      const now = new Date();
      const timeDiff = now.getTime() - lastFetch.getTime();
      const secondsDiff = Math.floor(timeDiff / 1000);
      
      if (secondsDiff < 1) {
        return NextResponse.json(
          { 
            error: `请等待 ${1 - secondsDiff} 秒后再试`,
            remainingSeconds: 1 - secondsDiff
          },
          { status: 429 }
        );
      }
    }

    // 获取公众号信息
    const { data: wechatAccount, error: accountError } = await supabase
      .from('wechat_accounts')
      .select('*')
      .eq('id', subscription.subscription_id)
      .single();

    if (accountError || !wechatAccount) {
      return NextResponse.json(
        { error: '公众号信息不存在' },
        { status: 404 }
      );
    }

    // 调用第三方API获取历史内容
    let allArticles: any[] = [];
    let totalNewArticles = 0;
    let fetchedPages = 0;
    const maxPages = 5; // 只获取前5页
    let skipNoLink = 0;
    let existedCount = 0;
    let insertErrorCount = 0;

    // 将大家啦API返回的文章字段归一化
    const normalizeArticle = (item: any) => {
      // 大家啦API字段映射
      const link = item?.url || '';                 // 文章链接
      const title = item?.title || '';              // 文章标题
      const digest = item?.digest || '';            // 文章摘要
      const cover = item?.cover_url || item?.pic_cdn_url_1_1 || ''; // 封面图，优先1:1比例
      const idx = item?.position || 1;             // 发文位置（头条|二条等）
      const mid = item?.appmsgid || '';             // 文章ID
      const sendToFansNum = item?.send_to_fans_num || 0; // 收到群发消息的粉丝数量
      const msgStatus = item?.msg_status || 0;      // 文章状态：2正常，7已删除，6违规失败
      const isDeleted = item?.is_deleted === '1';   // 是否已删除
      const types = item?.types || 0;               // 9群发，1发布
      const original = item?.original || 0;         // 1原创，0未声明，2转载
      const itemShowType = item?.item_show_type || 0; // 0图文，5纯视频等
      
      // 大家啦API使用post_time字段（时间戳）和post_time_str字段（字符串）
      const rawDatetime = item?.post_time ||           // 优先使用时间戳
                          item?.post_time_str ||        // 备用字符串格式
                          item?.update_time ||          // 更新时间
                          item?.datetime || 
                          item?.publish_time || 
                          item?.pub_time || 
                          item?.created_at || 
                          item?.time ||
                          item?.date ||
                          item?.timestamp ||
                          item?.publish_date;
      let publishedISO: string | null = null;
      
      if (typeof rawDatetime === 'number') {
        // 大概率是秒级时间戳
        const ms = rawDatetime > 1e12 ? rawDatetime : rawDatetime * 1000;
        publishedISO = new Date(ms).toISOString();
      } else if (typeof rawDatetime === 'string') {
        const parsed = Date.parse(rawDatetime);
        if (!Number.isNaN(parsed)) {
          publishedISO = new Date(parsed).toISOString();
        }
      }
      
      // 记录时间解析结果用于调试
      if (publishedISO) {
        console.log('文章时间解析成功:', {
          title: title?.substring(0, 30) + '...',
          rawDatetime,
          type: typeof rawDatetime,
          parsedISO: publishedISO
        });
      } else {
        console.warn('文章时间解析失败:', {
          title: title?.substring(0, 30) + '...',
          rawDatetime,
          type: typeof rawDatetime,
          post_time: item?.post_time,
          post_time_str: item?.post_time_str
        });
      }

      return {
        title,
        link,
        cover,
        digest,
        idx,
        mid,
        published_at: publishedISO,
        send_to_fans_num: sendToFansNum,
        msg_status: msgStatus,
        is_deleted: isDeleted,
        types: types,
        original: original,
        item_show_type: itemShowType,
        originalDateTime: rawDatetime, // 保留原始时间数据用于调试
      };
    };

    try {
      // 使用大家啦API获取历史内容
      for (let page = 1; page <= maxPages; page++) {
        // 准备请求参数 - form-urlencoded格式
        const params = new URLSearchParams({
          name: wechatAccount.name, // 使用公众号名称
          page: page.toString(),
          key: WECHAT_API_KEY,
          verifycode: '' // 可选的验证码
        });
        
        // 如果有biz参数，优先使用biz
        if (wechatAccount.account_id) {
          console.log('=== 使用biz参数调用大家啦API ===');
          console.log('公众号名称:', wechatAccount.name);
          console.log('使用的biz参数:', wechatAccount.account_id);
          console.log('页码:', page);
          
          params.set('biz', wechatAccount.account_id);
          params.delete('name'); // 有biz时不需要name参数
        } else {
          console.log('=== 警告：没有biz参数，使用公众号名称 ===');
          console.log('公众号名称:', wechatAccount.name);
          console.log('account_id字段为空或未定义');
        }
        
        const apiResponse = await fetch(WECHAT_API_BASE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          body: params.toString()
        });

        if (!apiResponse.ok) {
          console.error(`第三方API请求失败: ${apiResponse.status}`);
          break;
        }

        const result = await apiResponse.json();
        
        // 大家啦API返回格式：{ code: 0, msg: "success", data: [...] }
        console.log('大家啦API响应:', {
          code: result.code,
          msg: result.msg,
          dataLength: result.data?.length || 0
        });
        
        if (result.code !== 0 || !result.data) {
          console.error('大家啦API返回格式错误:', result);
          // 如果是余额不足等错误，直接跳出
          if (result.code === 20001) {
            throw new Error('API余额不足，请联系管理员充值');
          }
          // 如果是biz参数错误
          if (result.code === 103) {
            console.error('biz参数错误，使用的biz:', wechatAccount.account_id);
            throw new Error(`biz参数不合法: ${wechatAccount.account_id}`);
          }
          break;
        }

        const articles = result.data;
        fetchedPages++;

        // 调试：打印第一篇文章的完整结构来了解API数据格式
        if (articles.length > 0 && page === 1) {
          console.log('=== 大家啦API返回的第一篇文章完整结构 ===');
          console.log('文章字段:', Object.keys(articles[0]));
          console.log('完整数据:', JSON.stringify(articles[0], null, 2));
        }

        // 处理每页的文章 - 归一化字段并过滤无效文章
        for (const raw of articles) {
          const article = normalizeArticle(raw);
          
          // 跳过没有链接的文章
          if (!article.link) {
            skipNoLink++;
            continue;
          }
          
          // 跳过已删除的文章 (is_deleted = '1')
          if (article.is_deleted) {
            console.log('跳过已删除文章:', article.title?.substring(0, 30));
            continue;
          }
          
          // 跳过状态异常的文章 (msg_status = 7已删除, 6违规失败)
          if (article.msg_status === 7 || article.msg_status === 6) {
            console.log('跳过状态异常文章:', {
              title: article.title?.substring(0, 30),
              msg_status: article.msg_status
            });
            continue;
          }
          
          allArticles.push(article);
        }

        // 大家啦API没有分页信息，如果返回的文章数少于预期，可能是最后一页
        if (articles.length < 20) { // 假设每页20篇
          break;
        }
      }

      // 去重并存储文章到数据库
      const seen = new Set<string>();
      for (const article of allArticles) {
        if (!article.link) continue;
        if (seen.has(article.link)) {
          existedCount++;
          continue;
        }
        seen.add(article.link);

        // 检查文章是否已存在（基于URL去重），使用更稳妥的 maybeSingle()
        const { data: existingContent } = await supabase
          .from('contents')
          .select('id')
          .eq('original_url', article.link)
          .maybeSingle?.();

        if (existingContent) {
          existedCount++;
          continue; // 文章已存在，跳过
        }

        // 处理发布时间：如果没有发布时间，根据文章在API中的位置估算时间
        let publishedAt = article.published_at;
        if (!publishedAt) {
          // 如果没有发布时间，我们基于当前时间往前推算
          // 假设每篇文章间隔1小时（这比使用当前时间要合理）
          const hoursAgo = allArticles.length; // 使用已处理文章数量作为小时数
          const estimatedTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
          publishedAt = estimatedTime.toISOString();
          
          console.warn('文章无发布时间，使用估算时间:', {
            title: article.title?.substring(0, 30) + '...',
            estimatedTime: publishedAt,
            hoursAgo
          });
        }
        
        // 创建新的内容记录
        const { error: insertError } = await supabase
          .from('contents')
          .insert({
            source_type: 'wechat',
            source_id: wechatAccount.id,
            content_type: 'article',
            title: article.title || '',
            original_url: article.link,
            cover_image_url: article.cover || '',
            published_at: publishedAt, // 使用真实时间或合理估算时间
            position: article.idx || 1,
            send_to_fans_num: article.send_to_fans_num || 0, // 使用实际推送数
            external_id: article.mid || ''
          });

        if (!insertError) {
          totalNewArticles++;
        } else {
          insertErrorCount++;
          console.error('插入文章失败:', insertError);
        }
      }

      // 更新订阅的最后获取时间和计数
      await supabase
        .from('user_subscriptions')
        .update({
          last_content_fetch_at: new Date().toISOString(),
          content_fetch_count: (subscription.content_fetch_count || 0) + 1
        })
        .eq('id', subscriptionId);

      console.log('内容获取统计:', {
        fetchedPages,
        totalItemsFromAPI: allArticles.length + skipNoLink,
        normalizedArticles: allArticles.length,
        newArticles: totalNewArticles,
        existedCount,
        skipNoLink,
        insertErrorCount
      });

      return NextResponse.json({
        message: '内容获取完成',
        totalArticles: allArticles.length,
        newArticles: totalNewArticles,
        fetchedPages: fetchedPages,
        accountName: wechatAccount.name,
        stats: {
          normalized: allArticles.length,
          existed: existedCount,
          skippedNoLink: skipNoLink,
          insertErrors: insertErrorCount
        }
      });

    } catch (apiError) {
      console.error('调用大家啦API失败:', apiError);
      return NextResponse.json(
        { error: apiError instanceof Error ? apiError.message : '获取内容失败，请稍后重试' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('获取微信内容错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// GET - 获取已存储的微信内容列表
export async function GET(request: NextRequest) {
  try {
    // 创建Supabase客户端
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

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 验证订阅权限
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('subscription_id')
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: '订阅不存在或无权限' },
        { status: 404 }
      );
    }

    // 查询内容列表（按发布时间倒序）
    const { data: contents, error: contentError } = await supabase
      .from('contents')
      .select(`
        id,
        title,
        original_url,
        cover_image_url,
        published_at,
        position,
        send_to_fans_num,
        created_at
      `)
      .eq('source_type', 'wechat')
      .eq('source_id', subscription.subscription_id)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (contentError) {
      console.error('查询内容失败:', contentError);
      return NextResponse.json(
        { error: '查询内容失败' },
        { status: 500 }
      );
    }

    // 获取总数
    const { count, error: countError } = await supabase
      .from('contents')
      .select('*', { count: 'exact', head: true })
      .eq('source_type', 'wechat')
      .eq('source_id', subscription.subscription_id);

    return NextResponse.json({
      contents: contents || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('获取内容列表错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}