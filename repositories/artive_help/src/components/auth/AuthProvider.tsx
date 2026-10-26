'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('获取会话失败:', error) // 调试日志
        } else {
          console.log('当前会话状态:', session ? '已登录' : '未登录') // 调试日志
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('获取会话时出错:', error) // 调试日志
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('认证状态变化:', event, session ? '已登录' : '未登录') // 调试日志
        
        // 立即更新状态
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // 处理不同的认证事件
        if (event === 'SIGNED_IN') {
          console.log('用户登录成功，用户信息:', session?.user) // 调试日志
          // 不需要刷新页面，状态已经更新
        } else if (event === 'SIGNED_OUT') {
          console.log('用户已退出登录') // 调试日志
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('会话令牌已刷新') // 调试日志
        } else if (event === 'USER_UPDATED') {
          console.log('用户信息已更新') // 调试日志
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}