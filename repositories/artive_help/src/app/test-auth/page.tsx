'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestAuthPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const supabase = createClient()
  
  // 添加日志函数
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(`[${timestamp}] ${message}`)
  }
  
  // 清除日志
  const clearLogs = () => {
    setLogs([])
  }
  
  // 发送 OTP
  const sendOTP = async () => {
    setIsLoading(true)
    clearLogs()
    addLog('开始发送 OTP...')
    addLog(`目标邮箱: ${email}`)
    
    try {
      // 方式1：使用 signInWithOtp（推荐）
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
          // 不设置 emailRedirectTo，强制使用 OTP 模式
        }
      })
      
      if (error) {
        addLog(`❌ 错误: ${error.message}`)
        addLog(`错误代码: ${error.code || 'N/A'}`)
        addLog(`错误状态: ${error.status || 'N/A'}`)
        
        // 特殊处理 rate limit 错误
        if (error.message.includes('rate limit')) {
          addLog('💡 提示: 邮箱请求过于频繁，请等待 1 小时后再试')
          addLog('💡 或者使用其他邮箱地址进行测试')
        }
      } else {
        addLog('✅ OTP 发送成功！')
        addLog(`返回数据: ${JSON.stringify(data, null, 2)}`)
        addLog('📧 请检查邮箱中的验证码')
      }
    } catch (err: any) {
      addLog(`❌ 异常: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  // 验证 OTP
  const verifyOTP = async () => {
    setIsLoading(true)
    addLog('开始验证 OTP...')
    addLog(`邮箱: ${email}`)
    addLog(`验证码: ${otp}`)
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email', // 明确指定类型为 email
      })
      
      if (error) {
        addLog(`❌ 验证失败: ${error.message}`)
        addLog(`错误代码: ${error.code || 'N/A'}`)
        
        // 详细的错误提示
        if (error.message.includes('expired')) {
          addLog('💡 提示: 验证码已过期，请重新发送')
        } else if (error.message.includes('invalid')) {
          addLog('💡 提示: 验证码无效，请检查是否输入正确')
        }
      } else if (data.user) {
        addLog('✅ 验证成功！')
        addLog(`用户信息: ${JSON.stringify(data.user, null, 2)}`)
        addLog(`Session: ${JSON.stringify(data.session, null, 2)}`)
      }
    } catch (err: any) {
      addLog(`❌ 异常: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  // 检查当前会话
  const checkSession = async () => {
    addLog('检查当前会话...')
    
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      addLog(`❌ 获取会话失败: ${error.message}`)
    } else if (session) {
      addLog('✅ 当前已登录')
      addLog(`用户: ${session.user.email}`)
      addLog(`会话过期时间: ${new Date(session.expires_at! * 1000).toLocaleString()}`)
    } else {
      addLog('ℹ️ 当前未登录')
    }
  }
  
  // 登出
  const signOut = async () => {
    addLog('开始登出...')
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      addLog(`❌ 登出失败: ${error.message}`)
    } else {
      addLog('✅ 登出成功')
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase OTP 测试页面</h1>
        
        {/* 测试面板 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">OTP 测试</h2>
          
          {/* 邮箱输入 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">邮箱地址</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入邮箱地址"
            />
          </div>
          
          {/* 发送 OTP 按钮 */}
          <button
            onClick={sendOTP}
            disabled={!email || isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
          >
            {isLoading ? '处理中...' : '发送 OTP'}
          </button>
          
          {/* OTP 输入 */}
          <div className="mt-4 mb-4">
            <label className="block text-sm font-medium mb-2">验证码</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入6位验证码"
              maxLength={6}
            />
          </div>
          
          {/* 验证 OTP 按钮 */}
          <button
            onClick={verifyOTP}
            disabled={!email || !otp || otp.length !== 6 || isLoading}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
          >
            {isLoading ? '验证中...' : '验证 OTP'}
          </button>
          
          {/* 其他操作 */}
          <div className="mt-4 space-x-2">
            <button
              onClick={checkSession}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              检查会话
            </button>
            <button
              onClick={signOut}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              登出
            </button>
            <button
              onClick={clearLogs}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              清除日志
            </button>
          </div>
        </div>
        
        {/* 日志面板 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">调试日志</h2>
          <div className="bg-gray-100 rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">暂无日志...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1 whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* 说明文档 */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-2">使用说明</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>输入邮箱地址，点击"发送 OTP"</li>
            <li>检查邮箱，获取6位验证码</li>
            <li>输入验证码，点击"验证 OTP"</li>
            <li>查看调试日志了解详细信息</li>
          </ol>
          
          <h3 className="text-lg font-semibold mb-2 mt-4">常见问题</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Rate Limit 错误</strong>：同一邮箱 1 小时内只能请求 3-4 次，请等待或换邮箱</li>
            <li><strong>收不到邮件</strong>：检查垃圾邮件文件夹，或确认 Supabase 邮件模板配置</li>
            <li><strong>验证码无效</strong>：确保输入正确的6位数字，验证码10分钟内有效</li>
          </ul>
        </div>
      </div>
    </div>
  )
}