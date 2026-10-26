export type HotItem = {
  id: string;
  title: string;
  summary?: string;
  heat?: number;
  source: "weixin" | "weixin_tech" | "zhihu" | "baidu" | "toutiao" | "weibo" | "other";
  url: string;
  cover?: string;
  timestamp?: string;
  mobile_url?: string;
};

export type Material = {
  id: string;
  title: string;
  source: string;
  collectedAt: string;
  cover?: string;
  url?: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
};

export type ContentItem = {
  id: string;
  title: string;
  status: "draft" | "pending" | "published" | "failed";
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};

export type Account = { id: string; name: string };

export type Fingerprint = {
  id: string;
  name: string;
  corePath?: string;
  userDataDir?: string;
};

export type PublishHistoryItem = {
  id: string;
  article: string;
  account: string;
  status: "published" | "failed";
  reason?: string;
  time: string;
};

// Tophub API types
export type TophubNode = {
  hashid: string;
  name: string;
  url: string;
  icon?: string;
  category?: string;
};

export type TophubItem = {
  hashid: string;
  title: string;
  url: string;
  mobile_url?: string;
  thumbnail?: string;
  description?: string;
  hotness?: number;
  views?: number;
  timestamp?: string;
  source?: {
    name: string;
    logo?: string;
  };
};

export type TophubApiResponse<T = any> = {
  error: boolean;
  data: T;
  message?: string;
};

// 灵感集市相关类型
export type Platform = 'youtube' | 'wechat';

export type SubscriptionStatus = 'active' | 'inactive';

export type Subscription = {
  id: string;
  platform: Platform;
  name: string;
  displayName?: string; // 备注名
  avatar: string;
  url: string;
  description?: string;
  followerCount?: number;
  status: SubscriptionStatus;
  tags: string[];
  defaultTags: string[];
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ContentType = 
  | 'video' 
  | 'short' 
  | 'live' 
  | 'premiere' 
  | 'community'
  | 'article' 
  | 'multiArticle';

export type TimelineContent = {
  id: string;
  platform: Platform;
  contentType: ContentType;
  title: string;
  summary?: string;
  thumbnail?: string;
  author?: string;
  sourceId: string;
  sourceName: string;
  sourceAvatar: string;
  publishedAt: string;
  url: string;
  tags: string[];
  isInMaterials: boolean;
  
  // 平台特有字段
  duration?: string; // YouTube视频时长
  viewCount?: number;
  likeCount?: number;
  isLive?: boolean;
  hasSubtitles?: boolean; // YouTube字幕可用性
  digest?: string; // 公众号文章摘要
  isMultiArticle?: boolean; // 是否多图文
  subArticles?: Array<{
    title: string;
    url: string;
    thumbnail?: string;
  }>;
  
  // 元数据
  rawData?: any; // 保存原始API数据，便于后续处理
  createdAt: string;
  updatedAt: string;
};

export type TimelineFilter = {
  platforms: Platform[];
  sources: string[];
  contentTypes: ContentType[];
  dateRange: {
    start?: string;
    end?: string;
  };
  inMaterials?: boolean; // 是否已入库
  keywords?: string;
};

export type SortOption = 'publishedAt' | 'popularity';

export type SubscriptionSearchResult = {
  id: string;
  platform: Platform;
  name: string;
  avatar: string;
  description?: string;
  followerCount?: number;
  url: string;
  isSubscribed?: boolean;
  // 微信公众号特有字段
  biz?: string; // 微信公众号的biz参数，用于API调用
  wxId?: string; // 微信ID，备用标识
  ghid?: string; // 公众号ID，备用标识
};

