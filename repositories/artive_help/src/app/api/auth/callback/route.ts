import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash') // Magic Link token
  const type = searchParams.get('type') // 认证类型
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  console.log('Auth callback 收到参数:', { code, token_hash, type }) // 调试日志

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Code exchange 失败:', error) // 调试日志
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }
    
    console.log('Code exchange 成功，用户:', data.user?.email) // 调试日志
    
    const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === 'development'
    if (isLocalEnv) {
      // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
      return NextResponse.redirect(`${origin}${next}`)
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`)
    } else {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 处理 Magic Link (邮箱验证链接)
  if (token_hash && type === 'magiclink') {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'magiclink',
    })

    if (error) {
      console.error('Magic Link 验证失败:', error) // 调试日志
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    console.log('Magic Link 验证成功，用户:', data.user?.email) // 调试日志
    
    // 登录成功，重定向到主页
    return NextResponse.redirect(`${origin}${next}`)
  }

  // return the user to an error page with instructions
  console.error('Auth callback 未收到有效参数') // 调试日志
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}