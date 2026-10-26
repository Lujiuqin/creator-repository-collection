'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthCodeErrorPage() {
  const router = useRouter()

  useEffect(() => {
    // 3秒后自动跳转回首页
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            认证失败
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            登录过程中出现错误。可能是因为链接已过期或认证被取消。
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            3秒后将自动返回首页...
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            立即返回首页
          </button>
        </div>
      </div>
    </div>
  )
}