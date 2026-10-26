"use client";
import React from "react";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { WechatAccountSearchResult } from "@/lib/api/inspiration";

interface WechatSearchResultProps {
  account: WechatAccountSearchResult;
  isSubscribed: boolean;
  onSubscribe: (account: WechatAccountSearchResult) => void;
}

export function WechatSearchResult({ 
  account, 
  isSubscribed, 
  onSubscribe 
}: WechatSearchResultProps) {
  // 格式化粉丝数
  const formatFollowerCount = (count?: number) => {
    if (!count) return '未知';
    if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
    return count.toString();
  };

  // 格式化最近发布时间
  const formatLatestPublish = (dateString?: string) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return '今天';
    if (diffInDays === 1) return '昨天';
    if (diffInDays < 7) return `${diffInDays}天前`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}周前`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}月前`;
    return '超过一年';
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      {/* 主要信息区 - 更紧凑的布局 */}
      <div className="p-5">
        <div className="flex items-center gap-4">
          {/* 头像 */}
          <div className="relative flex-shrink-0">
            <img 
              src={account.wxAvatar || "https://wx.qlogo.cn/mmhead/Q3auHgzwzM4fgHg/132"} 
              alt={account.wxName}
              className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-white dark:border-gray-700"
              onError={(e) => {
                // 头像加载失败时使用默认头像
                (e.target as HTMLImageElement).src = "https://wx.qlogo.cn/mmhead/Q3auHgzwzM4fgHg/132";
              }}
            />
            {/* 平台标识 */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-gray-700 shadow flex items-center justify-center">
              <Icons.messageCircle className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          
          {/* 基本信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {account.wxName}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Icons.users className="w-3.5 h-3.5" />
                    {formatFollowerCount(account.followerCount)} 粉丝
                  </span>
                  {account.articleCount !== undefined && account.articleCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Icons.fileText className="w-3.5 h-3.5" />
                      {account.articleCount} 文章
                    </span>
                  )}
                  {account.latestPublish && (
                    <span className="flex items-center gap-1">
                      <Icons.clock className="w-3.5 h-3.5" />
                      {formatLatestPublish(account.latestPublish)}
                    </span>
                  )}
                </div>
                {/* 描述信息 */}
                {account.description && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {account.description}
                  </p>
                )}
              </div>
              
              {/* 订阅按钮 */}
              <Button
                variant={isSubscribed ? "outline" : "primary"}
                size="sm"
                disabled={isSubscribed}
                onClick={() => !isSubscribed && onSubscribe(account)}
                className={cn(
                  "min-w-[80px] h-9",
                  !isSubscribed && "bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm"
                )}
              >
                {isSubscribed ? (
                  <>
                    <Icons.check className="w-4 h-4 mr-1" />
                    已订阅
                  </>
                ) : (
                  <>
                    <Icons.plus className="w-4 h-4 mr-1" />
                    订阅
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
