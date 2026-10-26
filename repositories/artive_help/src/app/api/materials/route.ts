import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 读取当前用户收藏的素材列表
    const { data: materials, error: matError } = await supabase
      .from('user_materials')
      .select('content_id, collected_at')
      .eq('user_id', user.id)
      .order('collected_at', { ascending: false });

    if (matError) {
      console.error('查询素材库失败:', matError);
      return NextResponse.json({ error: '查询素材库失败' }, { status: 500 });
    }

    if (!materials || materials.length === 0) {
      return NextResponse.json([]);
    }

    const contentIds = materials.map((m) => m.content_id);

    const { data: contents, error: contentError } = await supabase
      .from('contents')
      .select('id, title, source_type, published_at, cover_image_url, original_url')
      .in('id', contentIds);

    if (contentError) {
      console.error('查询内容失败:', contentError);
      return NextResponse.json({ error: '查询内容失败' }, { status: 500 });
    }

    const idToCollectedAt = new Map(materials.map((m) => [m.content_id, m.collected_at]));
    const result = (contents || []).map((c) => ({
      id: c.id as string,
      title: (c as any).title as string,
      source: ((c as any).source_type as string) || 'wechat',
      collectedAt: (idToCollectedAt.get(c.id) as string) || new Date().toISOString(),
      cover: (c as any).cover_image_url as string | undefined,
      url: (c as any).original_url as string | undefined,
    }));
    
    // 调试：打印素材数据
    console.log('素材库数据:', result.map(r => ({
      id: r.id,
      title: r.title,
      url: r.url,
      has_url: !!r.url
    })));

    return NextResponse.json(result);
  } catch (error) {
    console.error('获取素材库错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const body = await request.json();
    const contentId: string | undefined = body?.contentId;
    if (!contentId) {
      return NextResponse.json({ error: '缺少 contentId' }, { status: 400 });
    }

    const { error: insertError } = await supabase
      .from('user_materials')
      .insert({ user_id: user.id, content_id: contentId });

    if (insertError && (insertError as any).code !== '23505') {
      // 非唯一冲突错误
      console.error('加入素材库失败:', insertError);
      return NextResponse.json({ error: '加入素材库失败' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('加入素材库异常:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    let ids: string[] = [];
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    if (idParam) {
      ids = [idParam];
    } else {
      const body = await request.json().catch(() => ({}));
      ids = Array.isArray(body?.contentIds) ? body.contentIds : [];
    }

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: '缺少 contentIds' }, { status: 400 });
    }

    const { error: delError } = await supabase
      .from('user_materials')
      .delete()
      .eq('user_id', user.id)
      .in('content_id', ids);

    if (delError) {
      console.error('删除素材失败:', delError);
      return NextResponse.json({ error: '删除素材失败' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, deleted: ids.length });
  } catch (error) {
    console.error('删除素材异常:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}


