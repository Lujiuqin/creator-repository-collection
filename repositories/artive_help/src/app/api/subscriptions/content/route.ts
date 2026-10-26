import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// GET - 获取用户所有订阅的内容时间线
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50'); // 时间线每页显示更多内容
    const offset = (page - 1) * limit;
    const platform = searchParams.get('platform'); // 可选：筛选平台

    // 获取用户的所有活跃订阅
    let subscriptionsQuery = supabase
      .from('user_subscriptions')
      .select(`
        id,
        subscription_type,
        subscription_id
      `)
      .eq('user_id', user.id)
      .eq('is_active', true);

    // 如果指定了平台，进行筛选
    if (platform === 'wechat') {
      subscriptionsQuery = subscriptionsQuery.eq('subscription_type', 'wechat');
    }

    const { data: subscriptions, error: subError } = await subscriptionsQuery;

    if (subError) {
      console.error('获取订阅列表失败:', subError);
      return NextResponse.json(
        { error: '获取订阅列表失败' },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        content: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        },
        subscriptionsCount: 0
      });
    }

    // 提取所有订阅的公众号ID
    const wechatAccountIds = subscriptions.map(sub => sub.subscription_id);

    if (wechatAccountIds.length === 0) {
      return NextResponse.json({
        content: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        },
        subscriptionsCount: 0
      });
    }

    // 分别查询公众号信息
    const { data: wechatAccounts, error: accountError } = await supabase
      .from('wechat_accounts')
      .select(`
        id,
        name,
        description,
        avatar_url
      `)
      .in('id', wechatAccountIds);

    if (accountError) {
      console.error('查询公众号信息失败:', accountError);
      return NextResponse.json(
        { error: '查询公众号信息失败' },
        { status: 500 }
      );
    }

    // 创建公众号ID到公众号信息的映射
    const accountMap = new Map();
    wechatAccounts?.forEach(account => {
      accountMap.set(account.id, account);
    });

    // 查询所有订阅的内容（按发布时间倒序）
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
        created_at,
        source_id
      `)
      .eq('source_type', 'wechat')
      .in('source_id', wechatAccountIds)
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
      .in('source_id', wechatAccountIds);

    // 格式化内容数据，转换为TimelineContent格式
    const timelineContent = contents?.map(content => {
      const account = accountMap.get(content.source_id);
      
      // 调试：打印封面图URL（保留用于调试）
      console.log('内容处理:', {
        title: content.title.substring(0, 30) + '...',
        has_cover: !!content.cover_image_url,
        cover_url_length: content.cover_image_url?.length || 0
      });
      
      return {
        id: content.id,
        platform: 'wechat' as const,
        contentType: 'article' as const,
        title: content.title,
        summary: '', // 微信公众号暂无摘要
        thumbnail: content.cover_image_url || '', // 使用封面图作为缩略图
        author: account?.name || '',
        sourceId: content.source_id,
        sourceName: account?.name || '',
        sourceAvatar: account?.avatar_url || '/default-avatar.svg', // 修正字段名
        publishedAt: content.published_at,
        url: content.original_url,
        tags: [], // 暂时为空数组
        isInMaterials: false, // TODO: 查询是否已入库
        
        // 平台特有字段
        duration: undefined, // 微信文章无时长
        viewCount: content.send_to_fans_num || 0, // 使用推送粉丝数作为阅读数
        likeCount: undefined, // 微信API暂不提供
        isLive: false,
        hasSubtitles: false,
        digest: '', // 微信文章摘要
        isMultiArticle: false, // 暂时设为false
        subArticles: undefined,
        
        // 元数据
        rawData: content, // 保存原始数据
        createdAt: content.created_at,
        updatedAt: content.created_at // 暂用created_at
      };
    }) || [];

    return NextResponse.json({
      content: timelineContent,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      subscriptionsCount: subscriptions.length,
      // 返回订阅信息，用于前端展示统计
      subscriptions: subscriptions.map(sub => {
        const account = accountMap.get(sub.subscription_id);
        return {
          id: sub.id,
          name: account?.name || '',
          displayName: account?.name, // 使用name作为displayName
          avatar: account?.avatar_url || '/default-avatar.svg',
          platform: 'wechat'
        };
      })
    });

  } catch (error) {
    console.error('获取内容时间线错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// POST - 刷新所有订阅的最新内容
export async function POST(request: NextRequest) {
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

    // 获取用户的所有活跃订阅
    const { data: subscriptions, error: subError } = await supabase
      .from('user_subscriptions')
      .select(`
        id,
        subscription_type,
        last_content_fetch_at
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .eq('subscription_type', 'wechat'); // 目前只支持微信公众号

    if (subError) {
      console.error('获取订阅列表失败:', subError);
      return NextResponse.json(
        { error: '获取订阅列表失败' },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        message: '没有需要刷新的订阅',
        refreshed: 0,
        newArticles: 0
      });
    }

    // 检查全局1秒限制（测试环境）
    const now = new Date();
    const recentFetch = subscriptions.find(sub => {
      if (!sub.last_content_fetch_at) return false;
      const lastFetch = new Date(sub.last_content_fetch_at);
      const timeDiff = now.getTime() - lastFetch.getTime();
      const secondsDiff = Math.floor(timeDiff / 1000);
      return secondsDiff < 1;
    });

    if (recentFetch) {
      return NextResponse.json(
        { 
          error: '刷新过于频繁，请稍后再试',
          message: '请等待1秒后再次刷新'
        },
        { status: 429 }
      );
    }

    let totalRefreshed = 0;
    let totalNewArticles = 0;
    const refreshResults = [];

    // 并行刷新所有订阅（限制并发数）
    const batchSize = 3; // 每批处理3个订阅
    for (let i = 0; i < subscriptions.length; i += batchSize) {
      const batch = subscriptions.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (subscription) => {
        try {
          // 调用现有的微信内容获取API
          const response = await fetch(`${request.nextUrl.origin}/api/wechat/content`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': request.headers.get('Cookie') || ''
            },
            body: JSON.stringify({
              subscriptionId: subscription.id,
              isManualRefresh: true
            })
          });

          const result = await response.json();
          
          if (response.ok) {
            totalRefreshed++;
            totalNewArticles += result.newArticles || 0;
            return {
              subscriptionId: subscription.id,
              success: true,
              newArticles: result.newArticles || 0,
              totalArticles: result.totalArticles || 0
            };
          } else {
            console.error(`刷新订阅 ${subscription.id} 失败:`, result.error);
            return {
              subscriptionId: subscription.id,
              success: false,
              error: result.error
            };
          }
        } catch (error) {
          console.error(`刷新订阅 ${subscription.id} 异常:`, error);
          return {
            subscriptionId: subscription.id,
            success: false,
            error: error instanceof Error ? error.message : '未知错误'
          };
        }
      });

      // 等待当前批次完成
      const batchResults = await Promise.all(batchPromises);
      refreshResults.push(...batchResults);

      // 批次间等待，避免请求过于密集
      if (i + batchSize < subscriptions.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
      }
    }

    return NextResponse.json({
      message: '内容刷新完成',
      refreshed: totalRefreshed,
      total: subscriptions.length,
      newArticles: totalNewArticles,
      results: refreshResults
    });

  } catch (error) {
    console.error('刷新内容错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}