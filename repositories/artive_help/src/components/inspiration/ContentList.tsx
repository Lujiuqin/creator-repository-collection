"use client";
import React, { useState, useEffect } from "react";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

// 内容项接口定义
interface ContentItem {
  id: string;
  title: string;
  description?: string;
  original_url: string;
  cover_image_url?: string;
  published_at: string;
  position?: number;
  send_to_fans_num?: number;
  created_at: string;
}

// 分页信息接口
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 组件属性接口
interface ContentListProps {
  subscriptionId: string | null; // 当前选中的订阅ID
  subscriptionName?: string; // 订阅名称（用于显示标题）
}

export function ContentList({ subscriptionId, subscriptionName }: ContentListProps) {
  const { push } = useToast();
  
  // 代理微信图片，绕过防盗链
  const getImageSrc = (url?: string) => {
    if (!url) return url as any;
    if (url.includes('mmbiz.qpic.cn') || url.includes('qlogo.cn')) {
      return `/api/proxy/image?url=${encodeURIComponent(url)}`;
    }
    return url;
  };
  
  // 状态管理
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载内容列表
  const loadContents = async (page: number = 1) => {
    if (!subscriptionId) {
      setContents([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 调用获取内容列表的API
      const response = await fetch(`/api/wechat/content?subscriptionId=${subscriptionId}&page=${page}&limit=${pagination.limit}`);
      
      if (!response.ok) {
        throw new Error('获取内容失败');
      }

      const data = await response.json();
      setContents(data.contents || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });

    } catch (error) {
      console.error('加载内容失败:', error);
      setError('加载内容失败，请稍后重试');
      push('加载内容失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 监听订阅ID变化，重新加载内容
  useEffect(() => {
    if (subscriptionId) {
      loadContents(1);
    } else {
      setContents([]);
      setPagination({ page: 1, limit: 20, total: 0, totalPages: 0 });
    }
  }, [subscriptionId]);

  // 处理页面跳转
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadContents(newPage);
    }
  };

  // 格式化时间显示
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    if (diffInMinutes < 43200) return `${Math.floor(diffInMinutes / 1440)}天前`;
    
    // 超过30天显示具体日期
    return date.toLocaleDateString('zh-CN');
  };

  // 格式化粉丝数
  const formatFansCount = (count?: number) => {
    if (!count) return '-';
    if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
    return count.toString();
  };

  // 打开文章链接
  const handleOpenArticle = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="shadow-lg border-blue-100 dark:border-blue-800/30 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
              <Icons.fileText className="w-5 h-5 text-white" />
            </div>
            内容列表
            {subscriptionName && (
              <span className="text-base font-medium text-muted-foreground">
                - {subscriptionName}
              </span>
            )}
          </div>
          
          {/* 刷新按钮 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadContents(pagination.page)}
            disabled={isLoading || !subscriptionId}
          >
            {isLoading ? (
              <Icons.loader className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Icons.refresh className="w-4 h-4 mr-2" />
            )}
            刷新
          </Button>
        </CardTitle>
        
        {/* 总数统计 */}
        {pagination.total > 0 && (
          <div className="text-sm text-muted-foreground">
            共 {pagination.total} 篇文章
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {!subscriptionId ? (
          // 未选择订阅时的提示
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Icons.messageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">请选择订阅</h3>
            <p className="text-sm text-muted-foreground">
              选择一个订阅后即可查看其内容列表
            </p>
          </div>
        ) : isLoading ? (
          // 加载状态
          <div className="text-center py-12">
            <Icons.loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">正在加载内容...</p>
          </div>
        ) : error ? (
          // 错误状态
          <div className="text-center py-12">
            <Icons.alertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <h3 className="font-medium mb-2 text-red-700">加载失败</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => loadContents(pagination.page)}
            >
              重新加载
            </Button>
          </div>
        ) : contents.length === 0 ? (
          // 空状态
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Icons.fileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">暂无内容</h3>
            <p className="text-sm text-muted-foreground">
              该订阅还没有获取到任何内容，请点击"获取最新"按钮获取内容
            </p>
          </div>
        ) : (
          // 内容列表
          <>
            <div className="space-y-4">
              {contents.map((content, index) => (
                <div 
                  key={content.id} 
                  className="group flex gap-4 p-4 border border-border rounded-lg hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleOpenArticle(content.original_url)}
                >
                  {/* 文章封面 */}
                  {content.cover_image_url ? (
                    <div className="flex-shrink-0">
                      <img 
                        src={getImageSrc(content.cover_image_url)} 
                        alt={content.title}
                        className="w-20 h-16 sm:w-24 sm:h-20 rounded-lg object-cover shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const original = content.cover_image_url!;
                          if (target.src.includes('/api/proxy/image') && !target.dataset.directTried) {
                            target.dataset.directTried = 'true';
                            target.src = original;
                            return;
                          }
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    // 无封面时显示占位符
                    <div className="flex-shrink-0">
                      <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-lg bg-muted flex items-center justify-center">
                        <Icons.fileText className="w-6 h-6 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  
                  {/* 文章信息 */}
                  <div className="flex-1 min-w-0">
                    {/* 文章标题 */}
                    <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {content.title}
                    </h3>
                    
                    {/* 文章描述（如果有） */}
                    {content.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {content.description}
                      </p>
                    )}
                    
                    {/* 文章元信息 */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icons.clock className="w-3 h-3" />
                        {formatTimeAgo(content.published_at)}
                      </span>
                      
                      {content.position && (
                        <span className="flex items-center gap-1">
                          <Icons.hash className="w-3 h-3" />
                          位置 {content.position}
                        </span>
                      )}
                      
                      {content.send_to_fans_num && (
                        <span className="flex items-center gap-1">
                          <Icons.users className="w-3 h-3" />
                          {formatFansCount(content.send_to_fans_num)} 人收到
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* 外链图标 */}
                  <div className="flex-shrink-0 self-start mt-1">
                    <Icons.externalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* 分页控制 */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
                <div className="text-sm text-muted-foreground">
                  第 {pagination.page} 页，共 {pagination.totalPages} 页
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1 || isLoading}
                  >
                    上一页
                  </Button>
                  
                  {/* 页码快速跳转 */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNumber;
                      if (pagination.totalPages <= 5) {
                        pageNumber = i + 1;
                      } else {
                        // 智能显示页码
                        const currentPage = pagination.page;
                        if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= pagination.totalPages - 2) {
                          pageNumber = pagination.totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                      }
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={pageNumber === pagination.page ? "primary" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => handlePageChange(pageNumber)}
                          disabled={isLoading}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages || isLoading}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
