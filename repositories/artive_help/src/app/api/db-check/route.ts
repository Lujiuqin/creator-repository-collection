import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// GET - 检查数据库表结构
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

    // 查询所有表名
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables_info');

    if (tablesError) {
      // 如果RPC函数不存在，尝试直接查询
      const { data: tableList, error: listError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (listError) {
        // 尝试另一种方式 - 查询已知的表
        const knownTables = [
          'wechat_accounts',
          'youtube_channels', 
          'user_subscriptions',
          'contents',
          'content_texts'
        ];
        
        const tableInfo = [];
        
        for (const tableName of knownTables) {
          try {
            // 尝试查询表，如果成功说明表存在
            const { data, error } = await supabase
              .from(tableName)
              .select('*')
              .limit(0);
            
            if (!error) {
              tableInfo.push({
                table_name: tableName,
                exists: true
              });
            } else {
              tableInfo.push({
                table_name: tableName,
                exists: false,
                error: error.message
              });
            }
          } catch (e) {
            tableInfo.push({
              table_name: tableName,
              exists: false,
              error: 'Unknown error'
            });
          }
        }
        
        return NextResponse.json({
          tables: tableInfo
        });
      }
      
      return NextResponse.json({
        tables: tableList
      });
    }

    return NextResponse.json({
      tables: tables
    });

  } catch (error) {
    console.error('检查数据库错误:', error);
    return NextResponse.json(
      { error: '服务器错误', details: error },
      { status: 500 }
    );
  }
}