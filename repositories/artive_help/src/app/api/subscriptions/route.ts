import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// GET - 获取用户的订阅列表
export async function GET(request: NextRequest) {
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

    // 查询用户的订阅列表，使用左连接获取公众号信息
    const { data: subscriptions, error } = await supabase
      .from('user_subscriptions')
      .select(`
        id,
        subscription_type,
        subscription_id,
        subscribed_at,
        is_active
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .eq('subscription_type', 'wechat');

    if (error) {
      console.error('查询订阅列表失败:', error);
      return NextResponse.json(
        { error: '查询失败' },
        { status: 500 }
      );
    }

    // 获取所有订阅的公众号详情
    const wechatAccountIds = subscriptions?.map(sub => sub.subscription_id) || [];
    
    let wechatAccounts = [];
    if (wechatAccountIds.length > 0) {
      const { data, error: accountError } = await supabase
        .from('wechat_accounts')
        .select('*')
        .in('id', wechatAccountIds);
      
      if (!accountError && data) {
        wechatAccounts = data;
      }
    }

    // 合并订阅信息和公众号信息
    const formattedSubscriptions = subscriptions?.map(sub => {
      const account = wechatAccounts.find(acc => acc.id === sub.subscription_id);
      return {
        id: sub.id,
        type: sub.subscription_type,
        subscribedAt: sub.subscribed_at,
        account: account || null
      };
    }) || [];

    return NextResponse.json({
      subscriptions: formattedSubscriptions,
      total: formattedSubscriptions.length
    });

  } catch (error) {
    console.error('获取订阅列表错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// POST - 添加订阅
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

    // 获取请求体
    const body = await request.json();
    const { accountId, name, description, avatarUrl, verified } = body;

    console.log('=== 创建订阅调试信息 ===');
    console.log('accountId (应该是biz):', accountId);
    console.log('name:', name);
    console.log('description:', description);
    console.log('avatarUrl:', avatarUrl);

    if (!accountId || !name) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 开始事务处理
    // 1. 先检查或创建公众号记录
    let { data: existingAccount } = await supabase
      .from('wechat_accounts')
      .select('id')
      .eq('account_id', accountId)
      .single();

    let wechatAccountId;
    
    if (!existingAccount) {
      // 创建新的公众号记录
      const { data: newAccount, error: insertError } = await supabase
        .from('wechat_accounts')
        .insert({
          account_id: accountId,
          name: name,
          description: description || '',
          avatar_url: avatarUrl || '',
          verified: verified || false
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('创建公众号记录失败:', insertError);
        return NextResponse.json(
          { error: '创建公众号失败' },
          { status: 500 }
        );
      }
      
      wechatAccountId = newAccount.id;
    } else {
      wechatAccountId = existingAccount.id;
      
      // 更新公众号信息（如果有新信息）
      await supabase
        .from('wechat_accounts')
        .update({
          name: name,
          description: description || '',
          avatar_url: avatarUrl || '',
          verified: verified || false,
          updated_at: new Date().toISOString()
        })
        .eq('id', wechatAccountId);
    }

    // 2. 检查是否已经订阅
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('id, is_active')
      .eq('user_id', user.id)
      .eq('subscription_type', 'wechat')
      .eq('subscription_id', wechatAccountId)
      .single();

    if (existingSubscription) {
      if (existingSubscription.is_active) {
        return NextResponse.json(
          { error: '已经订阅该公众号' },
          { status: 400 }
        );
      } else {
        // 重新激活订阅
        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update({
            is_active: true,
            subscribed_at: new Date().toISOString()
          })
          .eq('id', existingSubscription.id);

        if (updateError) {
          console.error('重新激活订阅失败:', updateError);
          return NextResponse.json(
            { error: '激活订阅失败' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          message: '订阅成功（重新激活）',
          subscriptionId: existingSubscription.id
        });
      }
    }

    // 3. 创建新的订阅关系
    const { data: newSubscription, error: subscribeError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        subscription_type: 'wechat',
        subscription_id: wechatAccountId,
        is_active: true
      })
      .select('id')
      .single();

    if (subscribeError) {
      console.error('创建订阅失败:', subscribeError);
      return NextResponse.json(
        { error: '订阅失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '订阅成功',
      subscriptionId: newSubscription.id
    });

  } catch (error) {
    console.error('订阅错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// DELETE - 取消订阅
export async function DELETE(request: NextRequest) {
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

    // 获取订阅ID
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: '缺少订阅ID' },
        { status: 400 }
      );
    }

    // 获取订阅信息，用于后续删除历史内容
    const { data: subscription, error: getError } = await supabase
      .from('user_subscriptions')
      .select('subscription_id, subscription_type')
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
      .single();

    if (getError || !subscription) {
      console.error('获取订阅信息失败:', getError);
      return NextResponse.json(
        { error: '订阅不存在或无权限' },
        { status: 404 }
      );
    }

    // 删除订阅（实际是设置为不活跃）
    const { error: deleteError } = await supabase
      .from('user_subscriptions')
      .update({ is_active: false })
      .eq('id', subscriptionId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('取消订阅失败:', deleteError);
      return NextResponse.json(
        { error: '取消订阅失败' },
        { status: 500 }
      );
    }

    // 删除该订阅的所有历史内容
    let deletedContentsCount = 0;
    if (subscription.subscription_type === 'wechat') {
      // 先获取所有要删除的content_id
      const { data: contentsToDelete, error: getContentsError } = await supabase
        .from('contents')
        .select('id')
        .eq('source_id', subscription.subscription_id)
        .eq('source_type', 'wechat');

      if (!getContentsError && contentsToDelete && contentsToDelete.length > 0) {
        const contentIds = contentsToDelete.map(c => c.id);
        
        // 先删除content_texts表的相关数据（子表）
        const { error: deleteTextsError } = await supabase
          .from('content_texts')
          .delete()
          .in('content_id', contentIds);

        if (deleteTextsError) {
          console.warn('删除内容文本失败（继续执行）:', deleteTextsError);
        }

        // 删除contents表的数据（主表）
        const { error: deleteContentsError } = await supabase
          .from('contents')
          .delete()
          .eq('source_id', subscription.subscription_id)
          .eq('source_type', 'wechat');

        if (deleteContentsError) {
          console.error('删除历史内容失败:', deleteContentsError);
          // 注意：这里不直接返回错误，因为订阅已经取消了
        } else {
          deletedContentsCount = contentIds.length;
        }
      }
    }

    return NextResponse.json({
      message: '取消订阅成功',
      deletedContents: deletedContentsCount
    });

  } catch (error) {
    console.error('取消订阅错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}