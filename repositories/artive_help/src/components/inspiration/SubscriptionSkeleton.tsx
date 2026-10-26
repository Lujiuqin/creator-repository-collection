import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Icons } from "@/components/ui/Icons";

interface SubscriptionSkeletonProps {
  count?: number; // 显示几个骨架项
}

export function SubscriptionSkeleton({ count = 3 }: SubscriptionSkeletonProps) {
  return (
    <div className="space-y-8">
      {/* 我的订阅骨架 */}
      <Card className="shadow-lg border-green-100 dark:border-green-800/30 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-900/5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                <Icons.heart className="w-5 h-5 text-white" />
              </div>
              我的订阅
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            
            {/* 状态切换标签骨架 */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* 生成多个订阅项骨架 */}
            {Array.from({ length: count }).map((_, index) => (
              <div 
                key={index} 
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-border rounded-lg"
              >
                {/* 头像骨架 */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
                </div>
                
                {/* 内容信息骨架 */}
                <div className="flex-1 min-w-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-16" />
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-12" />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
                    </div>
                  </div>
                </div>
                
                {/* 按钮组骨架 */}
                <div className="flex flex-wrap gap-2">
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}