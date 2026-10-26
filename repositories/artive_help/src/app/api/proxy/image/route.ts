import { NextRequest, NextResponse } from 'next/server';

// GET - 图片代理服务
export async function GET(request: NextRequest) {
  try {
    // 从查询参数中获取图片URL
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    // 验证图片URL
    if (!imageUrl) {
      return NextResponse.json(
        { error: '缺少图片URL参数' },
        { status: 400 }
      );
    }

    // 验证是否为允许的域名（安全检查）
    const allowedDomains = [
      'mmbiz.qpic.cn',
      'qpic.cn'
    ];
    
    let isAllowedDomain = false;
    try {
      const url = new URL(imageUrl);
      isAllowedDomain = allowedDomains.some(domain => 
        url.hostname === domain || url.hostname.endsWith('.' + domain)
      );
    } catch (e) {
      return NextResponse.json(
        { error: '无效的图片URL' },
        { status: 400 }
      );
    }

    if (!isAllowedDomain) {
      return NextResponse.json(
        { error: '不支持的图片域名' },
        { status: 403 }
      );
    }

    // 请求原图片
    const imageResponse = await fetch(imageUrl, {
      headers: {
        // 模拟浏览器请求头，避免防盗链。关键是 Referer 指向微信域。
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Referer': 'https://mp.weixin.qq.com/',
        'Origin': 'https://mp.weixin.qq.com',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    });

    if (!imageResponse.ok) {
      console.error('获取图片失败:', imageResponse.status, imageResponse.statusText);
      return NextResponse.json(
        { error: '获取图片失败' },
        { status: imageResponse.status }
      );
    }

    // 获取图片数据
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // 返回图片数据
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 缓存1天
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });

  } catch (error) {
    console.error('图片代理错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}