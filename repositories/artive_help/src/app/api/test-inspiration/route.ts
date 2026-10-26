import { NextResponse } from 'next/server';

export async function GET() {
  // 测试API配置
  const API_BASE_URL = process.env.NEXT_PUBLIC_INSPIRATION_API_URL || 'https://inspiration-hub-api-k5oeg3wd9-artiver-sites-projects.vercel.app';
  const API_KEY = process.env.NEXT_PUBLIC_INSPIRATION_API_KEY;
  
  console.log('=== 测试API连接 ===');
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('API_KEY:', API_KEY ? `${API_KEY.substring(0, 5)}...` : '未设置');
  
  try {
    // 构建请求头
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (API_KEY && API_KEY !== 'your_api_key_here') {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    }
    
    // 测试搜索一个公众号
    const testKeyword = '36氪';
    const url = `${API_BASE_URL}/api/wechat/search?keyword=${encodeURIComponent(testKeyword)}`;
    
    console.log('测试URL:', url);
    console.log('请求头:', headers);
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    
    console.log('响应状态:', response.status);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));
    
    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    console.log('响应数据:', responseData);
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: responseData,
      config: {
        url,
        hasApiKey: !!API_KEY,
        apiKeyPrefix: API_KEY ? API_KEY.substring(0, 5) : null
      }
    });
    
  } catch (error) {
    console.error('测试失败:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        type: error.constructor.name
      } : String(error),
      config: {
        apiBaseUrl: API_BASE_URL,
        hasApiKey: !!API_KEY
      }
    }, { status: 500 });
  }
}