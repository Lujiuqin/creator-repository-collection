"use client";
import React, { useState, useMemo, useEffect } from "react";
import type { AppLocale } from "@/i18n/locales";
import type { 
  TimelineContent, 
  Subscription, 
  TimelineFilter, 
  SortOption, 
  Platform,
  ContentType 
} from "@/types";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { TimelineContentList } from "./TimelineContentList";
import { ContentSkeleton } from "./ContentSkeleton";

interface TimelineSectionProps {
  content: TimelineContent[];
  subscriptions: Subscription[];
  filter: TimelineFilter;
  sortBy: SortOption;
  isLoading: boolean;
  onFilterChange: (filter: TimelineFilter) => void;
  onSortChange: (sort: SortOption) => void;
  onAddToMaterials: (contentId: string) => void;
  locale: AppLocale;
  messages: any;
}

export function TimelineSection({
  content: initialContent,
  subscriptions,
  filter,
  sortBy,
  isLoading,
  onFilterChange,
  onSortChange,
  onAddToMaterials,
  locale,
  messages
}: TimelineSectionProps) {
  const t = (path: string) => path.split(".").reduce((acc: any, key) => acc?.[key], messages);
  const { push } = useToast();
  
  // 本地状态 - 使用传入的 initialContent 作为初始值
  const [content, setContent] = useState<TimelineContent[]>(initialContent);
  const [displayCount, setDisplayCount] = useState(20);
  const [showFilters, setShowFilters] = useState(false);

  // 当传入的 initialContent 变化时，更新本地状态
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // 筛选和排序内容
  const filteredAndSortedContent = useMemo(() => {
    let filtered = content;

    // 平台筛选
    if (filter.platforms.length > 0) {
      filtered = filtered.filter(item => filter.platforms.includes(item.platform));
    }

    // 来源筛选
    if (filter.sources.length > 0) {
      filtered = filtered.filter(item => filter.sources.includes(item.sourceId));
    }

    // 内容类型筛选
    if (filter.contentTypes.length > 0) {
      filtered = filtered.filter(item => filter.contentTypes.includes(item.contentType));
    }

    // 时间范围筛选
    if (filter.dateRange.start || filter.dateRange.end) {
      filtered = filtered.filter(item => {
        const publishDate = new Date(item.publishedAt);
        const start = filter.dateRange.start ? new Date(filter.dateRange.start) : null;
        const end = filter.dateRange.end ? new Date(filter.dateRange.end) : null;
        
        if (start && publishDate < start) return false;
        if (end && publishDate > end) return false;
        return true;
      });
    }

    // 入库状态筛选
    if (filter.inMaterials !== undefined) {
      filtered = filtered.filter(item => item.isInMaterials === filter.inMaterials);
    }

    // 关键词筛选
    if (filter.keywords) {
      const keywords = filter.keywords.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(keywords) ||
        item.summary?.toLowerCase().includes(keywords) ||
        item.tags.some(tag => tag.toLowerCase().includes(keywords))
      );
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'publishedAt':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'popularity':
          const aScore = (a.viewCount || 0) + (a.likeCount || 0) * 10;
          const bScore = (b.viewCount || 0) + (b.likeCount || 0) * 10;
          return bScore - aScore;
        default:
          return 0;
      }
    });

    return filtered;
  }, [content, filter, sortBy]);

  // 当前显示的内容
  const displayedContent = filteredAndSortedContent.slice(0, displayCount);

  // 按时间分组
  const groupedContent = useMemo(() => {
    const groups: { [key: string]: TimelineContent[] } = {};
    
    displayedContent.forEach(item => {
      const publishDate = new Date(item.publishedAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey: string;
      if (publishDate.toDateString() === today.toDateString()) {
        groupKey = '今天';
      } else if (publishDate.toDateString() === yesterday.toDateString()) {
        groupKey = '昨天';
      } else {
        groupKey = publishDate.toLocaleDateString('zh-CN', {
          month: 'long',
          day: 'numeric'
        });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });
    
    return groups;
  }, [displayedContent]);

  // 加载更多
  const loadMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  // 处理筛选器更新
  const updateFilter = (updates: Partial<TimelineFilter>) => {
    onFilterChange({ ...filter, ...updates });
  };


  // 获取平台图标和样式
  const getPlatformInfo = (platform: Platform) => {
    switch (platform) {
      case 'youtube':
        return { 
          icon: Icons.play, 
          color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
          name: 'YouTube'
        };
      case 'wechat':
        return { 
          icon: Icons.messageCircle, 
          color: 'text-green-500 bg-green-50 dark:bg-green-900/20',
          name: '公众号'
        };
      default:
        return { 
          icon: Icons.globe, 
          color: 'text-gray-500 bg-gray-50 dark:bg-gray-900/20',
          name: '其他'
        };
    }
  };

  // 获取内容类型标签
  const getContentTypeLabel = (type: ContentType) => {
    switch (type) {
      case 'video': return '视频';
      case 'short': return '短视频';
      case 'live': return '直播';
      case 'premiere': return '首播';
      case 'community': return '动态';
      case 'article': return '文章';
      case 'multiArticle': return '多图文';
      default: return type;
    }
  };

  // 如果正在加载内容，显示骨架
  if (isLoading) {
    return <ContentSkeleton count={6} />;
  }

  return (
    <div className="space-y-6">
      {/* 筛选器 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/20 font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Icons.filter className="w-4 h-4" />
            筛选
            {(filter.platforms.length > 0 || filter.sources.length > 0 || filter.contentTypes.length > 0) && (
              <span className="w-2 h-2 bg-green-500 rounded-full shadow-sm" />
            )}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          共 {filteredAndSortedContent.length} 条内容
        </div>
      </div>

      {/* 筛选器展开面板 */}
      {showFilters && (
        <Card className="shadow-lg border-green-100 dark:border-green-800/30 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-900/5">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 平台筛选 */}
              <div>
                <label className="text-sm font-medium mb-2 block">平台</label>
                <div className="space-y-2">
                  {(['youtube', 'wechat'] as Platform[]).map(platform => {
                    const { name } = getPlatformInfo(platform);
                    return (
                      <label key={platform} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filter.platforms.includes(platform)}
                          onChange={(e) => {
                            const platforms = e.target.checked
                              ? [...filter.platforms, platform]
                              : filter.platforms.filter(p => p !== platform);
                            updateFilter({ platforms });
                          }}
                          className="rounded border-border"
                        />
                        {name}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 来源筛选 */}
              <div>
                <label className="text-sm font-medium mb-2 block">来源</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {subscriptions.filter(s => s.status === 'active').map(subscription => (
                    <label key={subscription.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filter.sources.includes(subscription.id)}
                        onChange={(e) => {
                          const sources = e.target.checked
                            ? [...filter.sources, subscription.id]
                            : filter.sources.filter(s => s !== subscription.id);
                          updateFilter({ sources });
                        }}
                        className="rounded border-border"
                      />
                      {subscription.displayName || subscription.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* 内容类型 */}
              <div>
                <label className="text-sm font-medium mb-2 block">内容类型</label>
                <div className="space-y-2">
                  {(['video', 'short', 'article', 'multiArticle'] as ContentType[]).map(type => (
                    <label key={type} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filter.contentTypes.includes(type)}
                        onChange={(e) => {
                          const contentTypes = e.target.checked
                            ? [...filter.contentTypes, type]
                            : filter.contentTypes.filter(t => t !== type);
                          updateFilter({ contentTypes });
                        }}
                        className="rounded border-border"
                      />
                      {getContentTypeLabel(type)}
                    </label>
                  ))}
                </div>
              </div>

              {/* 入库状态 */}
              <div>
                <label className="text-sm font-medium mb-2 block">入库状态</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="inMaterials"
                      checked={filter.inMaterials === undefined}
                      onChange={() => updateFilter({ inMaterials: undefined })}
                      className="rounded-full border-border"
                    />
                    全部
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="inMaterials"
                      checked={filter.inMaterials === false}
                      onChange={() => updateFilter({ inMaterials: false })}
                      className="rounded-full border-border"
                    />
                    未入库
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="inMaterials"
                      checked={filter.inMaterials === true}
                      onChange={() => updateFilter({ inMaterials: true })}
                      className="rounded-full border-border"
                    />
                    已入库
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFilterChange({
                  platforms: [],
                  sources: [],
                  contentTypes: [],
                  dateRange: {},
                })}
              >
                清除筛选
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                收起
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 内容列表 */}
      <TimelineContentList
        content={filteredAndSortedContent}
        subscriptions={subscriptions}
        displayCount={displayCount}
        isLoading={isLoading}
        onAddToMaterials={onAddToMaterials}
        onLoadMore={loadMore}
        addLabel={t("app.actions.addToLibrary")}
      />
    </div>
  );
}