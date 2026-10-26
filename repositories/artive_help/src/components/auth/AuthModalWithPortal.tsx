'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Loader2 } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (user: User) => void
}

// Portal 组件 - 将内容渲染到 document.body
function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null
  
  return createPortal(children, document.body)
}

export default function AuthModalWithPortal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [countdown, setCountdown] = useState(0)
  
  const supabase = createClient()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/api/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    
    if (error) {
      console.error('Google 登录错误:', error)
      setError(error.message)
      setIsLoading(false)
    } else if (!data?.url) {
      setError('登录配置错误，请检查 Supabase 设置')
      setIsLoading(false)
    }
  }

  const handleSendOTP = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })

    setIsLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setStep('otp')
      setCountdown(60)
    }
  }

  const handleVerifyOTP = async (customOtpCode?: string) => {
    const otpCode = customOtpCode || otp.join('')
    if (!otpCode || otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      setError('请输入完整的6位验证码')
      return
    }

    setIsLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'email',
    })

    setIsLoading(false)

    if (error) {
      setError(error.message)
    } else if (data.user) {
      onSuccess?.(data.user)
      handleClose()
    }
  }

  const handleOTPChange = (index: number, value: string) => {
    // 仅允许输入单个数字
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }

    // 6 位输入完成后自动验证（使用最新值）
    const completeOtp = newOtp.join('')
    if (completeOtp.length === 6 && newOtp.every(digit => digit !== '')) {
      handleVerifyOTP(completeOtp)
    }
  }

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleClose = () => {
    setEmail('')
    setOtp(['', '', '', '', '', ''])
    setError(null)
    setStep('email')
    setCountdown(0)
    onClose()
  }

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 使用 Portal 渲染，完全独立于应用的 DOM 树 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
              }}
            />

            {/* 定位容器 - 负责居中 */}
            <div
              style={{
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                width: '90vw',
                maxWidth: '28rem',
              }}
            >
              {/* 动画容器 - 只负责动画效果 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
              <div className="relative rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {step === 'email' ? '欢迎' : '验证邮箱'}
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {step === 'email' 
                        ? '登录以使用全部功能' 
                        : `验证码已发送至 ${email}`}
                    </p>
                  </div>

                  {/* Error message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </motion.div>
                  )}

                  {step === 'email' ? (
                    <>
                      {/* Google Sign In */}
                      <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full mb-4 px-6 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 flex items-center justify-center gap-3 group"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                              使用 Google 账号登录
                            </span>
                          </>
                        )}
                      </button>

                      {/* Divider */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">或</span>
                        </div>
                      </div>

                      {/* Email input */}
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            邮箱地址
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-200"
                          />
                        </div>

                        <button
                          onClick={handleSendOTP}
                          disabled={isLoading || !email}
                          className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              发送中...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <Mail className="w-5 h-5" />
                              发送验证码
                            </span>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* OTP Input */}
                      <div className="space-y-4">
                        <div className="flex justify-center gap-2">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              id={`otp-${index}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOTPChange(index, e.target.value)}
                              onKeyDown={(e) => handleOTPKeyDown(index, e)}
                              className="w-12 h-12 text-center text-lg font-semibold rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-200"
                            />
                          ))}
                        </div>

                        <button
                          onClick={() => handleVerifyOTP(otp.join(''))}
                          disabled={isLoading || otp.join('').length !== 6}
                          className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              验证中...
                            </span>
                          ) : (
                            '验证'
                          )}
                        </button>

                        <div className="text-center">
                          <button
                            onClick={() => {
                              setStep('email')
                              setOtp(['', '', '', '', '', ''])
                              setError(null)
                            }}
                            disabled={countdown > 0}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {countdown > 0 ? `重新发送 (${countdown}s)` : '返回重新发送'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Footer */}
                  <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                    继续即表示您同意我们的服务条款和隐私政策
                  </p>
                </div>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  )
}