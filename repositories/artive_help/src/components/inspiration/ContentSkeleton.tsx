import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Icons } from "@/components/ui/Icons";

interface ContentSkeletonProps {
  count?: number; // 显示几个骨架项
}

export function ContentSkeleton({ count = 6 }: ContentSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* 筛选器骨架 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      {/* 内容列表骨架 */}
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card 
            key={index}
            className="group hover:shadow-lg transition-all duration-200 border-green-100/50 dark:border-green-800/30 bg-gradient-to-br from-white to-green-50/20 dark:from-gray-900 dark:to-green-900/5"
          >
            <CardContent className="p-0">
              <div className="relative">
                <div className="flex gap-2 p-2">
                  {/* 缩略图骨架 */}
                  <div className="relative flex-shrink-0 w-32 h-20">
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  </div>
                  
                  {/* 内容信息骨架 */}
                  <div className="flex-1 min-w-0 pr-16">
                    <div className="space-y-1">
                      {/* 创作者信息骨架 */}
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
                          </div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
                        </div>
                      </div>
                      
                      {/* 内容标题骨架 */}
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                      </div>
                      
                      {/* 摘要骨架 */}
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
                      
                      {/* 数据指标骨架 */}
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          <div className="w-8 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          <div className="w-8 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 操作按钮骨架 */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 加载更多按钮骨架 */}
      <div className="text-center pt-4">
        <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
      </div>
    </div>
  );
}