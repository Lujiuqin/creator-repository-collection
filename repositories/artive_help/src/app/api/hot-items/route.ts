import { NextResponse } from 'next/server';
import type { TophubApiResponse, TophubItem, HotItem } from '@/types';

const TOPHUB_BASE_URL = process.env.TOPHUB_BASE_URL || 'https://api.tophubdata.com';
const TOPHUB_API_KEY = process.env.TOPHUB_API_KEY;

// 固定的4个榜单配置
const FIXED_BOARDS = [
  {
    hashid: 'WnBe01o371',
    name: '微信 ‧ 24h热文榜',
    source: 'weixin' as const
  },
  {
    hashid: '5PdMaaadmg', 
    name: '微信 ‧ 科技 ‧ 24h热文榜',
    source: 'weixin_tech' as const
  },
  {
    hashid: 'mproPpoq6O',
    name: '知乎 ‧ 热榜', 
    source: 'zhihu' as const
  },
  {
    hashid: 'KqndgxeLl9',
    name: '微博 ‧ 热搜榜',
    source: 'weibo' as const
  }
];

async function tophubFetch<T>(endpoint: string): Promise<T> {
  // 检查 API 密钥是否配置且有效（不是默认的占位符）
  if (!TOPHUB_API_KEY || TOPHUB_API_KEY.includes('your_') || TOPHUB_API_KEY.includes('api_key_here')) {
    throw new Error('Tophub API key not configured or invalid');
  }

  const fullUrl = `${TOPHUB_BASE_URL}${endpoint}`;
  console.log(`🔗 API 请求: ${fullUrl}`);
  console.log(`🔑 使用密钥: ${TOPHUB_API_KEY.substring(0, 10)}...`);

  const response = await fetch(fullUrl, {
    headers: {
      'Authorization': TOPHUB_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  console.log(`📊 API 响应状态: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API 错误详情: ${errorText}`);
    throw new Error(`Tophub API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log(`✅ API 响应数据类型: ${typeof data}, 包含: ${Object.keys(data || {}).join(', ')}`);
  return data;
}

function convertTophubItemToHotItem(tophubItem: any, source: HotItem['source']): HotItem {
  
  // 解析热度数字
  const extractHeat = (viewsText: string): number => {
    if (!viewsText) return 0;
    const match = viewsText.match(/(\d+(?:\.\d+)?)\s*([万千]?)/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2];
      if (unit === '万') return Math.floor(num * 10000);
      if (unit === '千') return Math.floor(num * 1000);
      return Math.floor(num);
    }
    return 0;
  };

  return {
    id: `${source}-${tophubItem.time || Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: tophubItem.title,
    summary: tophubItem.description,
    heat: extractHeat(tophubItem.views),
    source: source,
    url: tophubItem.url,
    cover: tophubItem.thumbnail,
    timestamp: tophubItem.time ? new Date(parseInt(tophubItem.time) * 1000).toISOString() : undefined,
    mobile_url: tophubItem.url,
  };
}

export async function GET() {
  try {
    // 检查 API 配置
    if (!TOPHUB_API_KEY || TOPHUB_API_KEY.includes('your_') || TOPHUB_API_KEY.includes('api_key_here')) {
      console.log('⚠️ Tophub API 未配置或使用默认值，直接使用模拟数据');
      throw new Error('Tophub API key not configured');
    }

    // 并行获取4个固定榜单的数据
    console.log('🚀 开始获取固定榜单数据...');
    
    const boardPromises = FIXED_BOARDS.map(async (board) => {
      try {
        console.log(`📡 获取 ${board.name} (${board.hashid})`);
        const response = await tophubFetch<any>(`/nodes/${board.hashid}`);
        
        // 简化调试信息
        console.log(`🔍 ${board.name} 响应检查`);
        if (response && response.data && response.data.items) {
          console.log(`📊 榜单信息: ${response.data.name} - ${response.data.display} (${response.data.items.length} 条)`);
        }
        
        // 提取数据数组
        let items: any[] = [];
        if (Array.isArray(response)) {
          items = response;
          console.log(`✅ ${board.name}: 直接数组，长度 ${items.length}`);
        } else if (response && response.data && Array.isArray(response.data.items)) {
          items = response.data.items;
          console.log(`✅ ${board.name}: response.data.items 数组，长度 ${items.length}`);
        } else if (response && Array.isArray(response.data)) {
          items = response.data;
          console.log(`✅ ${board.name}: response.data 数组，长度 ${items.length}`);
        } else {
          console.warn(`⚠️ ${board.name} 数据格式不正确`);
        }
        
        if (items.length > 0) {
          console.log(`✅ ${board.name}: 获取到 ${items.length} 条数据`);
          console.log(`第一条数据示例:`, JSON.stringify(items[0], null, 2));
          
          // 转换数据，传入正确的source类型
          return items.map((item) => convertTophubItemToHotItem(item, board.source));
        } else {
          console.log(`❌ ${board.name}: 没有获取到任何数据`);
          return [];
        }
      } catch (error) {
        console.error(`❌ 获取 ${board.name} 失败:`, error);
        return [];
      }
    });
    
    // 等待所有请求完成
    const boardResults = await Promise.all(boardPromises);
    
    // 合并所有榜单的数据
    const allHotItems = boardResults.flat();
    
    console.log(`🎉 总共获取到 ${allHotItems.length} 条热点数据`);
    console.log(`📊 数据分布: 微信(${allHotItems.filter(i => i.source === 'weixin').length}), 微信科技(${allHotItems.filter(i => i.source === 'weixin_tech').length}), 知乎(${allHotItems.filter(i => i.source === 'zhihu').length}), 微博(${allHotItems.filter(i => i.source === 'weibo').length})`);
    
    if (allHotItems.length === 0) {
      throw new Error('所有榜单都没有获取到数据');
    }
    
    return NextResponse.json(allHotItems);
  } catch (error) {
    console.log('📝 Tophub API 不可用，使用模拟数据');
    
    // 回退到模拟数据 - 提供更真实的示例内容
    const sources = ["weixin", "weixin_tech", "zhihu", "weibo"] as const;
    const mockTitles = [
      "AI 助手技术突破：新一代语言模型发布",
      "科技巨头争相布局人工智能赛道",
      "如何用 AI 提升工作效率？实用技巧分享",
      "热门话题：ChatGPT 与传统搜索引擎的对比",
      "前端开发新趋势：AI 辅助编程工具盘点",
      "深度学习在图像识别领域的最新进展"
    ];
    
    const mockData = Array.from({ length: 24 }).map((_, i) => ({
      id: `mock-${sources[i % 4]}-${i}`,
      title: mockTitles[i % mockTitles.length] || `热点资讯 ${i + 1}`,
      summary: "这是一条模拟的热点资讯摘要，用于展示页面布局和功能。实际使用时会显示真实的热点内容。",
      heat: Math.floor(Math.random() * 5000) + 1000,
      source: sources[i % 4],
      url: "https://example.com",
      cover: undefined,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      mobile_url: "https://example.com"
    }));
    
    return NextResponse.json(mockData);
  }
}