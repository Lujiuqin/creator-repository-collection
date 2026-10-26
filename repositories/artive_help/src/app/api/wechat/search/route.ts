import { NextRequest, NextResponse } from 'next/server';

// API配置 - 使用大家啦API
const API_BASE_URL = 'https://www.dajiala.com';
const API_KEY = process.env.DAJIALA_API_KEY;

// 请求限制 - 防止频繁请求
const requestTimestamps = new Map<string, number>();
const MIN_REQUEST_INTERVAL = 1000; // 最小请求间隔1秒

// 大家啦API响应格式
interface DajialaAccountResult {
  name: string;
  biz: string;
  owner_name: string;
  customer_type: string;
  ghid: string;
  wxid: string;
  fans: number;
  avg_top_read: number;
  avg_top_zan: number;
  avatar: string;
  qrcode: string;
  week_articles: string | number;
  lastest_publish: number;
}

interface DajialaApiResponse {
  code: number;
  msg: string;
  cost_money?: number;
  data?: DajialaAccountResult[];
}

export async function POST(request: NextRequest) {
  try {
    // API密钥验证
    if (!API_KEY) {
      return NextResponse.json({
        code: 500,
        message: '服务配置错误，请联系管理员配置DAJIALA_API_KEY',
        data: null
      });
    }

    // 获取请求参数
    const body = await request.json();
    const { keyword } = body;

    // 参数验证
    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json({
        code: 400,
        message: '请输入公众号名称',
        data: null
      });
    }

    // 清理关键词
    const cleanKeyword = keyword.trim();
    if (cleanKeyword.length === 0) {
      return NextResponse.json({
        code: 400,
        message: '请输入有效的公众号名称',
        data: null
      });
    }

    // 获取客户端IP（用于速率限制）
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // 速率限制检查
    const lastRequestTime = requestTimestamps.get(clientIp) || 0;
    const now = Date.now();
    
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      return NextResponse.json({
        code: 429,
        message: '请求过于频繁，请稍后再试',
        data: null
      });
    }
    
    // 更新请求时间戳
    requestTimestamps.set(clientIp, now);

    // 构建API URL - 使用正确的大家啦API路径
    const url = `${API_BASE_URL}/fbmain/monitor/v3/wx_account/search`;
    
    // 准备请求参数 - form-urlencoded格式
    const params = new URLSearchParams({
      keyword: cleanKeyword,
      page: '1',
      size: '1', // 只返回1个搜索结果
      key: API_KEY,
      verifycode: '' // 可选的验证码
    });
    
    // 准备请求头
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };

    console.log('=== 服务端代理搜索公众号 ===');
    console.log('搜索关键词:', cleanKeyword);
    console.log('目标API:', url);
    console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 5)}...` : '未设置');

    // 调用大家啦API
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: params.toString(),
    });

    console.log('大家啦API响应状态:', response.status);

    // 检查响应状态
    if (!response.ok) {
      console.error('大家啦API响应错误:', {
        status: response.status,
        statusText: response.statusText
      });

      // 尝试获取错误信息
      let errorMessage = `API请求失败 (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.msg || errorData.message || errorMessage;
      } catch (e) {
        // 尝试读取文本响应
        try {
          errorMessage = await response.text();
        } catch (textError) {
          // 使用默认错误消息
        }
      }

      return NextResponse.json({
        code: response.status,
        message: errorMessage,
        data: null
      });
    }

    // 解析响应
    const responseText = await response.text();
    console.log('大家啦API原始响应（前200字符）:', responseText.substring(0, 200));

    let result: DajialaApiResponse;
    try {
      result = JSON.parse(responseText);
      console.log('解析后的响应:', {
        code: result.code,
        msg: result.msg,
        dataLength: result.data?.length || 0
      });
    } catch (parseError) {
      console.error('解析API响应失败:', parseError);
      console.error('原始响应内容:', responseText);
      return NextResponse.json({
        code: 500,
        message: '响应格式错误，请稍后重试',
        data: null
      });
    }

    // 处理API响应
    if (result.code === 0 && result.data && result.data.length > 0) {
      // 搜索成功，找到公众号
      const searchKeywordLower = cleanKeyword.toLowerCase();
      
      // 找最匹配的结果
      let bestMatch = result.data.find(item => 
        item.name.toLowerCase() === searchKeywordLower
      );
      
      if (!bestMatch) {
        bestMatch = result.data.find(item => 
          item.name.toLowerCase().includes(searchKeywordLower) ||
          searchKeywordLower.includes(item.name.toLowerCase())
        );
      }
      
      if (!bestMatch) {
        bestMatch = result.data[0];
      }

      // 转换为前端格式
      const transformedResult = {
        wxId: bestMatch.wxid || bestMatch.ghid || `wx_${Date.now()}`,
        wxName: bestMatch.name,
        wxAvatar: bestMatch.avatar || 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM4fgHg/132',
        description: bestMatch.owner_name || bestMatch.customer_type || '',
        followerCount: bestMatch.fans || 0,
        articleCount: parseInt(String(bestMatch.week_articles)) || 0,
        latestPublish: bestMatch.lastest_publish ? 
          new Date(bestMatch.lastest_publish * 1000).toISOString() : undefined,
        biz: bestMatch.biz,
        ghid: bestMatch.ghid
      };

      console.log('搜索成功，返回公众号:', transformedResult.wxName);

      return NextResponse.json({
        code: 200,
        message: '搜索成功',
        data: transformedResult
      });

    } else if (result.code === 0 && (!result.data || result.data.length === 0)) {
      // 搜索成功但没有找到结果
      return NextResponse.json({
        code: 404,
        message: `未找到名为"${cleanKeyword}"的公众号，请检查名称是否正确`,
        data: null
      });

    } else if (result.code === 20001) {
      // API余额不足
      console.error('API余额不足');
      return NextResponse.json({
        code: 403,
        message: 'API余额不足，请联系管理员充值',
        data: null
      });

    } else {
      // 其他错误
      console.error('大家啦API返回错误:', result);
      return NextResponse.json({
        code: result.code || 500,
        message: result.msg || '系统错误，请稍后重试',
        data: null
      });
    }

  } catch (error) {
    // 处理未预期的错误
    console.error('搜索公众号服务错误:', error);
    
    // 网络错误
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json({
        code: 503,
        message: '无法连接到搜索服务，请稍后重试',
        data: null
      });
    }
    
    return NextResponse.json({
      code: 500,
      message: error instanceof Error ? error.message : '服务器内部错误',
      data: null
    });
  }
}

// 处理GET请求（可选，用于测试）
export async function GET(request: NextRequest) {
  // 获取查询参数
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword');
  
  if (!keyword) {
    return NextResponse.json({
      code: 400,
      message: '请提供搜索关键词',
      data: null
    });
  }
  
  // 调用POST处理逻辑
  return POST(new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify({ keyword })
  }));
}