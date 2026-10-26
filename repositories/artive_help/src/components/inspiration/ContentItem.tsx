"use client";
import React from "react";
import type { TimelineContent, Platform, ContentType } from "@/types";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface ContentItemProps {
  item: TimelineContent;
  onAddToMaterials: (contentId: string) => void;
  addLabel?: string;
}

export function ContentItem({ item, onAddToMaterials, addLabel }: ContentItemProps) {
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

  // 格式化数字
  const formatNumber = (num?: number) => {
    if (!num) return '-';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const platformInfo = getPlatformInfo(item.platform);
  const PlatformIcon = platformInfo.icon;

  // 获取图片URL，如果是微信图片使用代理
  const getImageSrc = (thumbnailUrl: string) => {
    // 如果是微信公众号图片，使用代理服务
    if (thumbnailUrl && thumbnailUrl.includes('mmbiz.qpic.cn')) {
      return `/api/proxy/image?url=${encodeURIComponent(thumbnailUrl)}`;
    }
    return thumbnailUrl;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-green-100/50 dark:border-green-800/30 bg-gradient-to-br from-white to-green-50/20 dark:from-gray-900 dark:to-green-900/5 hover:border-green-200 dark:hover:border-green-700/50">
      <CardContent className="p-0">
        <div className="relative">
          {/* 操作按钮 - 右上角 */}
          <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant={item.isInMaterials ? "outline" : "primary"}
              disabled={item.isInMaterials}
              onClick={() => !item.isInMaterials && onAddToMaterials(item.id)}
              className={cn(
                "h-7 px-2 text-xs font-medium shadow-sm",
                item.isInMaterials 
                  ? "border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-300 dark:bg-green-900/20" 
                  : "bg-green-500 text-white hover:bg-green-600"
              )}
            >
              {item.isInMaterials ? (
                <Icons.checkCircle className="w-3 h-3" />
              ) : (
                <div className="flex items-center gap-1">
                  <Icons.plus className="w-3 h-3" />
                  <span>{addLabel || '添加到素材库'}</span>
                </div>
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(item.url, '_blank')}
              className="h-7 px-2 text-xs border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/20 shadow-sm"
            >
              <Icons.externalLink className="w-3 h-3" />
            </Button>
          </div>

          <div className="flex gap-2 p-2">
            {/* 缩略图 - 放大到与内容等高 */}
            <div className="relative flex-shrink-0 w-32 h-20">
              {item.thumbnail && item.thumbnail !== '' ? (
                <img
                  src={getImageSrc(item.thumbnail)} // 使用代理服务获取图片
                  alt={item.title}
                  onError={(e) => {
                    // 图片加载失败时的处理逻辑
                    const target = e.target as HTMLImageElement;
                    const originalSrc = target.src;
                    
                    // 如果代理失败，尝试直接加载原图
                    if (originalSrc.includes('/api/proxy/image') && !target.hasAttribute('data-direct-tried')) {
                      target.setAttribute('data-direct-tried', 'true');
                      target.src = item.thumbnail || '/placeholder-image.svg'; // 尝试直接加载原图（兜底占位）
                      console.log('代理失败，尝试直接加载:', item.thumbnail);
                      return;
                    }
                    
                    // 最终回退到默认图片
                    target.src = '/placeholder-image.svg';
                    console.warn('封面图加载最终失败，使用默认图片:', item.thumbnail);
                  }}
                  onLoad={() => {
                    console.log('封面图加载成功:', item.thumbnail);
                  }}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy" // 添加懒加载优化
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                  <img
                    src="/placeholder-image.svg"
                    alt="暂无封面"
                    className="w-full h-full object-cover rounded-lg opacity-50"
                  />
                </div>
              )}
              {item.duration && (
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded font-medium">
                  {item.duration}
                </div>
              )}
              {item.isLive && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded font-medium">
                  直播
                </div>
              )}
            </div>
            
            {/* 内容信息 */}
            <div className="flex-1 min-w-0 pr-16">
              <div className="space-y-1">
                {/* 创作者信息 - 突出显示 */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img 
                      src={item.sourceAvatar || '/default-avatar.svg'} 
                      alt={item.sourceName}
                      onError={(e) => {
                        // 头像加载失败时显示默认头像
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-avatar.svg';
                      }}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-white shadow-md bg-muted"
                    />
                    {/* 平台标识 - 更加明显 */}
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border border-white shadow-md flex items-center justify-center",
                      item.platform === 'youtube' 
                        ? "bg-red-500 text-white" 
                        : "bg-green-500 text-white"
                    )}>
                      <PlatformIcon className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-base text-foreground truncate">
                        {item.sourceName}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {formatTime(item.publishedAt)}
                    </p>
                  </div>
                </div>
                
                {/* 内容标题 */}
                <div>
                  <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-1">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {item.title}
                    </a>
                  </h4>
                </div>
                
                {/* 摘要 */}
                {item.summary && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {item.summary}
                  </p>
                )}
                
                {/* 多图文子文章 */}
                {item.isMultiArticle && item.subArticles && (
                  <div>
                    <details className="group/details">
                      <summary className="text-sm text-primary cursor-pointer hover:underline font-medium">
                        查看其他 {item.subArticles.length} 篇文章
                      </summary>
                      <div className="mt-2 pl-4 border-l-2 border-primary/30 space-y-1">
                        {item.subArticles.map((subArticle, index) => (
                          <a
                            key={index}
                            href={subArticle.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {index + 2}. {subArticle.title}
                          </a>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
                
                {/* 数据指标 */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {item.viewCount && (
                    <div className="flex items-center gap-1">
                      <Icons.eye className="w-3 h-3" />
                      <span>{formatNumber(item.viewCount)}</span>
                    </div>
                  )}
                  
                  {item.likeCount && (
                    <div className="flex items-center gap-1">
                      <Icons.heart className="w-3 h-3" />
                      <span>{formatNumber(item.likeCount)}</span>
                    </div>
                  )}
                  
                  {item.hasSubtitles && (
                    <span className="px-1.5 py-0.5 bg-muted rounded text-xs">字幕</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
