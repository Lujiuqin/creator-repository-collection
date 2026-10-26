import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// GET: 调试接口，查看素材和任务状态
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

    // 1. 获取用户的素材
    const { data: materials, error: matError } = await supabase
      .from('user_materials')
      .select(`
        content_id,
        collected_at,
        contents (
          id,
          title,
          original_url,
          source_type
        )
      `)
      .eq('user_id', user.id)
      .limit(5);

    // 2. 获取改写任务
    const { data: tasks, error: taskError } = await supabase
      .from('rewrite_tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // 3. 测试Service Role Key
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    const debugInfo = {
      user_id: user.id,
      materials: materials?.map(m => ({
        content_id: m.content_id,
        title: (m as any).contents?.title,
        original_url: (m as any).contents?.original_url,
        has_url: !!(m as any).contents?.original_url,
        is_wechat: (m as any).contents?.original_url?.includes('mp.weixin.qq.com')
      })),
      tasks: tasks?.map(t => ({
        id: t.id,
        content_id: t.content_id,
        status: t.status,
        error_message: t.error_message,
        created_at: t.created_at
      })),
      config: {
        has_service_key: hasServiceKey,
        has_openrouter_key: !!process.env.OPENROUTER_API_KEY,
        has_jizhile_key: !!process.env.JIZHILE_API_KEY
      },
      errors: {
        materials: matError?.message,
        tasks: taskError?.message
      }
    };

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('调试接口错误:', error);
    return NextResponse.json({ 
      error: '服务器错误',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}