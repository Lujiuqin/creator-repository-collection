"use client";
import React, { useMemo } from "react";
import type { TimelineContent, Subscription } from "@/types";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ContentItem } from "./ContentItem";

interface TimelineContentListProps {
  // 内容数据
  content: TimelineContent[];
  subscriptions: Subscription[];
  
  // 显示控制
  displayCount: number;
  isLoading: boolean;
  
  // 事件处理
  onAddToMaterials: (contentId: string) => void;
  onLoadMore: () => void;
  addLabel?: string;
}

export function TimelineContentList({
  content,
  subscriptions,
  displayCount,
  isLoading,
  onAddToMaterials,
  onLoadMore,
  addLabel
}: TimelineContentListProps) {
  
  // 当前显示的内容
  const displayedContent = content.slice(0, displayCount);

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

  // 加载状态
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-32 h-20 bg-muted rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // 空状态
  if (Object.keys(groupedContent).length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Icons.fileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-2">暂无内容</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {subscriptions.length === 0 
            ? '请先添加一些订阅' 
            : '尝试调整筛选条件或刷新内容'
          }
        </p>
        {subscriptions.length === 0 && (
          <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            去添加订阅
          </Button>
        )}
      </div>
    );
  }

  // 内容列表
  return (
    <div className="space-y-8">
      {Object.entries(groupedContent).map(([dateGroup, items]) => (
        <div key={dateGroup}>
          {/* 日期分组头部 */}
          <div className="sticky top-20 z-10 flex items-center gap-3 py-2 mb-4 bg-background/95 backdrop-blur-sm">
            <h3 className="font-semibold text-lg">{dateGroup}</h3>
            <div className="h-px bg-border flex-1" />
            <span className="text-sm text-muted-foreground">{items.length} 条</span>
          </div>
          
          {/* 内容项列表 */}
          <div className="space-y-4">
            {items.map((item) => (
              <ContentItem
                key={item.id}
                item={item}
                onAddToMaterials={onAddToMaterials}
                addLabel={addLabel}
              />
            ))}
          </div>
        </div>
      ))}
      
      {/* 加载更多按钮 */}
      {displayCount < content.length && (
        <div className="text-center py-8">
          <Button 
            onClick={onLoadMore} 
            variant="outline" 
            className="gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/20 font-medium shadow-sm hover:shadow-md transition-all duration-200 px-6 py-3"
          >
            <Icons.refresh className="w-4 h-4" />
            加载更多 ({content.length - displayCount} 条剩余)
          </Button>
        </div>
      )}
      
      {/* 全部加载完成提示 */}
      {displayCount >= content.length && content.length > 20 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          已显示全部 {content.length} 条内容
        </div>
      )}
    </div>
  );
}