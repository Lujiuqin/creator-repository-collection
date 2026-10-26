import { NextRequest, NextResponse } from 'next/server';
import { fetchWechatArticle, cleanWechatHtml, isWechatArticleUrl } from '@/lib/wechat-article';

// POST: 获取文章原文内容
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: '缺少文章链接' }, { status: 400 });
    }

    // 先验证是否为微信文章链接
    if (!isWechatArticleUrl(url)) {
      // 不是微信文章链接，返回默认内容
      return NextResponse.json({
        title: '非微信文章',
        html: '<p>该链接不是微信公众号文章，无法获取原文内容。</p>',
        author: '',
        nickname: '',
        publishTime: '',
        cover: ''
      });
    }

    // 调用极致了API获取微信文章内容
    const article = await fetchWechatArticle(url);
    
    // 清理HTML内容
    const cleanedHtml = cleanWechatHtml(article.html);

    return NextResponse.json({
      title: article.title,
      html: cleanedHtml,
      author: article.author,
      nickname: article.nickname,
      publishTime: article.post_time_str,
      cover: article.cover_url
    });
  } catch (error) {
    console.error('获取原文失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取原文失败' },
      { status: 500 }
    );
  }
}