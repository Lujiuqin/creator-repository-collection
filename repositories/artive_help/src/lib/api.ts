// Simple API abstraction with mock implementations. Replace with real fetch later.
import type { Account, Article, ContentItem, Fingerprint, HotItem, Material, PublishHistoryItem, TophubApiResponse, TophubItem, TophubNode } from "@/types";

// Tophub API functions
const TOPHUB_BASE_URL = process.env.TOPHUB_BASE_URL || 'https://www.tophubdata.com/api';
const TOPHUB_API_KEY = process.env.TOPHUB_API_KEY;

async function tophubFetch<T>(endpoint: string): Promise<TophubApiResponse<T>> {
  if (!TOPHUB_API_KEY) {
    console.warn('TOPHUB_API_KEY not found, using mock data');
    throw new Error('Tophub API key not configured');
  }

  const response = await fetch(`${TOPHUB_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': TOPHUB_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Tophub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchTophubNodes(): Promise<TophubNode[]> {
  try {
    const response = await tophubFetch<TophubNode[]>('/nodes');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Tophub nodes:', error);
    return [];
  }
}

export async function fetchTophubHotData(nodeId?: string): Promise<TophubItem[]> {
  try {
    const endpoint = nodeId ? `/nodes/${nodeId}` : '/hot';
    const response = await tophubFetch<TophubItem[]>(endpoint);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Tophub hot data:', error);
    return [];
  }
}

function convertTophubItemToHotItem(tophubItem: TophubItem): HotItem {
  // Map Tophub source names to our internal source types
  const sourceMapping: Record<string, HotItem['source']> = {
    '微信': 'weixin',
    '知乎': 'zhihu', 
    '百度': 'baidu',
    'WeChat': 'weixin',
    'Zhihu': 'zhihu',
    'Baidu': 'baidu',
    '今日头条': 'toutiao',
    '微博': 'weibo'
  };

  const sourceName = tophubItem.source?.name || '';
  const mappedSource = sourceMapping[sourceName] || 'other';

  return {
    id: tophubItem.hashid,
    title: tophubItem.title,
    summary: tophubItem.description,
    heat: tophubItem.hotness || tophubItem.views,
    source: mappedSource,
    url: tophubItem.mobile_url || tophubItem.url,
    cover: tophubItem.thumbnail,
    timestamp: tophubItem.timestamp,
    mobile_url: tophubItem.mobile_url,
  };
}

export async function fetchHotItems(): Promise<HotItem[]> {
  try {
    // 调用我们的 API 路由
    const response = await fetch('/api/hot-items');
    if (!response.ok) {
      throw new Error(`API 错误: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('获取热点数据失败:', error);
    
    // 如果 API 路由也失败了，使用本地模拟数据
    const sources = ["weixin", "zhihu", "baidu"] as const;
    return Array.from({ length: 24 }).map((_, i) => ({
      id: `fallback-${sources[i % 3]}-${i}`,
      title: `热点 ${i + 1}`,
      summary: "这是一段自动生成的摘要，用于占位展示。",
      heat: 1000 - i * 13,
      source: sources[i % 3],
      url: "https://example.com",
    }));
  }
}

export async function addToMaterials(content: string | HotItem): Promise<{ ok: true }>{
  const contentId = typeof content === 'string' ? content : content.id;
  const res = await fetch('/api/materials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentId })
  });
  if (!res.ok) {
    throw new Error('Failed to add to materials');
  }
  return res.json();
}

export async function fetchMaterials(): Promise<Material[]> {
  const res = await fetch('/api/materials', { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 401) return [];
    throw new Error('Failed to fetch materials');
  }
  return res.json();
}

export async function deleteMaterials(contentIds: string[]): Promise<{ ok: true; deleted: number }>{
  const res = await fetch('/api/materials', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentIds })
  });
  if (!res.ok) {
    throw new Error('Failed to delete materials');
  }
  return res.json();
}

export async function fetchOriginalArticle(id: string): Promise<Article> {
  return {
    id,
    title: `示例素材 ${id}`,
    content: "这是原文内容示例。包含若干段落。\n\n第二段用于展示对比布局。",
  };
}

export async function callAiRewrite(params: { article: Article; style: string; prompt?: string }): Promise<string> {
  const { article, style, prompt } = params;
  await new Promise((r) => setTimeout(r, 500));
  return `【${style}】重写结果：\n\n` + (prompt ? `（提示词：${prompt}）\n\n` : "") + article.content
    .split("\n\n")
    .map((p, i) => `第${i + 1}段：${p} ✅`)
    .join("\n\n");
}

export async function saveContent(_result: { id?: string; title: string; content: string }): Promise<{ id: string }>{
  return { id: `c-${Math.random().toString(36).slice(2, 8)}` };
}

export async function fetchContents(): Promise<ContentItem[]> {
  const now = Date.now();
  return Array.from({ length: 24 }).map((_, i) => ({
    id: `c-${i}`,
    title: `改写文章 ${i + 1}`,
    status: ["draft", "pending", "published", "failed"][i % 4] as ContentItem["status"],
    category: ["科技", "资讯", "生活"][i % 3],
    tags: ["AI", "趋势", "快讯"].slice(0, (i % 3) + 1),
    createdAt: new Date(now - i * 5_600_000).toISOString(),
    updatedAt: new Date(now - i * 3_600_000).toISOString(),
  }));
}

export async function fetchAccounts(): Promise<Account[]> {
  return [
    { id: "a-1", name: "科技前沿" },
    { id: "a-2", name: "极客日报" },
    { id: "a-3", name: "科普一刻" },
  ];
}

export async function createPublishTask(_articleIds: string[], _accountIds: string[]): Promise<{ ok: true }>{
  await new Promise((r) => setTimeout(r, 500));
  return { ok: true };
}

export async function fetchPublishHistory(): Promise<PublishHistoryItem[]> {
  const now = Date.now();
  return Array.from({ length: 14 }).map((_, i) => ({
    id: `h-${i}`,
    article: `改写文章 ${i + 1}`,
    account: ["科技前沿", "极客日报"][i % 2],
    status: ["published", "failed"][i % 2] as PublishHistoryItem["status"],
    reason: i % 2 ? "Cookie 过期" : undefined,
    time: new Date(now - i * 9_600_000).toISOString(),
  }));
}

export async function fetchFingerprints(): Promise<Fingerprint[]> {
  return [
    { id: "f-1", name: "Chrome FP 1" },
  ];
}

