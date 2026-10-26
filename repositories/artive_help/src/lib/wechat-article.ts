// 微信文章内容获取服务
// 使用极致了API获取微信公众号文章内容

// API接口地址
const WECHAT_API_URL = 'https://www.dajiala.com/fbmain/monitor/v3/article_html';

// 请求参数接口
export interface WechatArticleRequest {
  url: string; // 微信文章链接
  verifycode?: string; // 附加码（如果设置了）
}

// 响应数据接口
export interface WechatArticleResponse {
  title: string; // 文章标题
  html: string; // 文章正文HTML
  author: string; // 作者
  nickname: string; // 公众号昵称
  desc: string; // 简介
  cover_url: string; // 封面图片链接
  post_time: number; // 发文时间戳
  post_time_str: string; // 发文时间字符串
  article_url: string; // 文章链接
  biz: string; // 公众号biz
  wxid: string; // 微信ID
  gh_id: string; // 原始ID
  mp_head_img: string; // 公众号头像
  signature: string; // 公众号简介
  copyright: number; // 是否原创（1=原创，0=非原创）
  source_url?: string; // 原文链接
}

// API响应包装
interface ApiResponse {
  code: number; // 状态码
  data: WechatArticleResponse; // 返回数据
  msk: string; // 消息
  cost_money: number; // 扣除金额
  remain_money: number; // 剩余金额
}

/**
 * 获取微信文章内容
 * @param url 微信文章链接
 * @returns 文章内容
 */
export async function fetchWechatArticle(url: string): Promise<WechatArticleResponse> {
  const apiKey = process.env.JIZHILE_API_KEY;
  const verifyCode = process.env.JIZHILE_VERIFY_CODE;
  
  if (!apiKey) {
    throw new Error('极致了API密钥未配置');
  }

  try {
    // 构建请求参数（JSON格式）
    const requestBody = {
      key: apiKey,
      url: url,
      verifycode: verifyCode || '' // 确保verifycode字段存在，即使为空
    };

    console.log('发送请求到极致了API:', {
      url: WECHAT_API_URL,
      body: requestBody
    });

    // 调用API（使用POST方法）
    const response = await fetch(WECHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      throw new Error(`获取文章失败: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    // 检查API返回状态
    if (data.code !== 200 && data.code !== 0) {
      console.error('API returned error:', data);
      throw new Error(data.msk || '获取文章内容失败');
    }

    // 返回文章数据
    return data.data;
  } catch (error) {
    console.error('Error fetching WeChat article:', error);
    throw error;
  }
}

/**
 * 批量获取微信文章内容
 * @param urls 文章链接列表
 * @returns 文章内容映射
 */
export async function fetchWechatArticles(
  urls: string[]
): Promise<Map<string, WechatArticleResponse | Error>> {
  const results = new Map<string, WechatArticleResponse | Error>();
  
  // 按顺序获取，避免并发过多
  for (const url of urls) {
    try {
      const article = await fetchWechatArticle(url);
      results.set(url, article);
      
      // 添加延迟避免触发限流（0.5秒间隔）
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to fetch article ${url}:`, error);
      results.set(url, error as Error);
    }
  }
  
  return results;
}

/**
 * 验证是否为微信文章URL
 */
export function isWechatArticleUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // 微信文章URL格式：https://mp.weixin.qq.com/s/xxxxx 或 https://mp.weixin.qq.com/s?__biz=xxxxx
    // pathname 可能是 /s 或 /s/xxxxx
    return urlObj.hostname === 'mp.weixin.qq.com' && urlObj.pathname.startsWith('/s');
  } catch {
    return false;
  }
}

/**
 * 清理微信文章HTML内容
 * 移除不必要的样式和脚本，保留基本格式
 */
export function cleanWechatHtml(html: string): string {
  if (!html) return '';
  
  // 移除script标签
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // 移除style标签
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // 移除危险的事件属性
  html = html.replace(/\son\w+\s*=\s*"[^"]*"/gi, '');
  html = html.replace(/\son\w+\s*=\s*'[^']*'/gi, '');
  
  // 移除iframe
  html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // 保留必要的标签和属性
  // 这里可以根据需要进一步处理
  
  return html;
}

/**
 * 提取文章纯文本内容
 */
export function extractTextFromHtml(html: string): string {
  if (typeof window === 'undefined') {
    // 服务器端简单处理
    return html
      .replace(/<[^>]*>/g, ' ') // 移除所有HTML标签
      .replace(/\s+/g, ' ') // 合并多个空格
      .trim();
  }
  
  // 客户端使用DOMParser
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}