"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { AppLocale } from "@/i18n/locales";
import type { Material } from "@/types";
import { fetchMaterials, deleteMaterials } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MODEL_DISPLAY_NAMES, type AIModelKey } from "@/lib/openrouter";

type MaterialRow = Material & { selected?: boolean };

export default function MaterialsTable({ locale, messages }: { locale: AppLocale; messages: any }) {
  const t = (path: string) => path.split(".").reduce((acc: any, key) => acc?.[key], messages);
  const [list, setList] = useState<MaterialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [viewMode, setViewMode] = useState<'grid'>('grid');
  const [platforms, setPlatforms] = useState<{ wechat: boolean; youtube: boolean }>({ wechat: true, youtube: true });
  const { push } = useToast();
  const router = useRouter();
  
  // AI模型选择弹窗状态
  const [showModelDialog, setShowModelDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModelKey>('claude-4');
  const [isCreatingTasks, setIsCreatingTasks] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const data = await fetchMaterials();
        if (!cancelled) {
          setList(data);
        }
      } catch (e) {
        if (!cancelled) {
          setList([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleAll(checked: boolean) {
    setList((prev) => prev.map((m) => ({ ...m, selected: checked })));
  }

  function toggleOne(id: string, checked: boolean) {
    setList((prev) => prev.map((m) => (m.id === id ? { ...m, selected: checked } : m)));
  }

  function batchRewrite() {
    const selectedItems = filtered.filter(m => m.selected);
    if (selectedItems.length === 0) {
      push("请先选择要批量改写的素材", "warning");
      return;
    }
    // 显示模型选择弹窗
    setShowModelDialog(true);
  }
  
  // 确认改写并创建任务
  async function confirmRewrite() {
    const selectedItems = filtered.filter(m => m.selected);
    if (selectedItems.length === 0) {
      push("请先选择要批量改写的素材", "warning");
      return;
    }
    
    setIsCreatingTasks(true);
    
    try {
      // 调用API创建改写任务
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentIds: selectedItems.map(m => m.id),
          aiModel: selectedModel,
        }),
      });
      
      if (!response.ok) {
        throw new Error('创建改写任务失败');
      }
      
      const result = await response.json();
      push(`成功创建 ${selectedItems.length} 个改写任务`, "success");
      
      // 跳转到改写页面
      router.push(`/${locale}/rewrite?ids=${selectedItems.map(m => m.id).join(',')}`);
    } catch (error) {
      console.error('创建改写任务失败:', error);
      push("创建改写任务失败，请稍后重试", "error");
    } finally {
      setIsCreatingTasks(false);
      setShowModelDialog(false);
    }
  }

  function batchDelete() {
    const selectedIds = list.filter(m => m.selected).map(m => m.id);
    if (selectedIds.length === 0) {
      push("请先选择要删除的素材", "warning");
      return;
    }
    deleteMaterials(selectedIds)
      .then((res) => {
        setList((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
        push(`成功删除 ${res.deleted} 个素材`, "success");
      })
      .catch(() => {
        push("删除失败，请稍后重试", "error");
      });
  }

  const filtered: MaterialRow[] = useMemo(() => {
    const kw = keyword.trim();
    if (!kw) return list;
    return list.filter((m) => m.title.includes(kw));
  }, [keyword, list]);

  const allSelected = filtered.length > 0 && filtered.every((m) => m.selected);
  const selectedCount = filtered.filter(m => m.selected).length;

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'wechat':
      case 'weixin':
      case '微信':
        return Icons.messageCircle;
      case 'zhihu':
      case '知乎':
        return Icons.layers;
      case 'baidu':
      case '百度':
        return Icons.trendingUp;
      default:
        return Icons.link;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'wechat':
      case 'weixin':
      case '微信':
        return 'from-green-500 to-emerald-600';
      case 'zhihu':
      case '知乎':
        return 'from-blue-500 to-indigo-600';
      case 'baidu':
      case '百度':
        return 'from-red-500 to-orange-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  const getProxyImage = (url?: string) => {
    if (!url) return url as any;
    if (url.includes('mmbiz.qpic.cn') || url.includes('qlogo.cn')) {
      return `/api/proxy/image?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  return (
    <>
      {/* AI模型选择弹窗 */}
      {showModelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">选择AI模型</h2>
            <p className="text-sm text-muted-foreground mb-6">
              选择用于改写文章的AI模型，不同模型有不同的特点
            </p>
            
            <div className="space-y-3">
              {(Object.keys(MODEL_DISPLAY_NAMES) as AIModelKey[]).map((model) => (
                <label
                  key={model}
                  className={cn(
                    "flex items-center p-4 rounded-lg border cursor-pointer transition-all",
                    selectedModel === model
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <input
                    type="radio"
                    name="aiModel"
                    value={model}
                    checked={selectedModel === model}
                    onChange={(e) => setSelectedModel(e.target.value as AIModelKey)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{MODEL_DISPLAY_NAMES[model]}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {model === 'claude-4' && '擅长理解上下文，生成自然流畅的内容'}
                      {model === 'gpt-5' && '功能全面，适合各种改写场景'}
                      {model === 'gemini-pro' && '支持超长文本，适合长文章改写'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="mt-6 text-xs text-muted-foreground">
              <Icons.info className="inline w-3 h-3 mr-1" />
              已选择 {filtered.filter(m => m.selected).length} 篇文章进行批量改写
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowModelDialog(false)}
                disabled={isCreatingTasks}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                onClick={confirmRewrite}
                disabled={isCreatingTasks}
                className="flex-1 gap-2"
              >
                {isCreatingTasks ? (
                  <>
                    <Icons.loader className="w-4 h-4 animate-spin" />
                    创建中...
                  </>
                ) : (
                  <>
                    <Icons.sparkles className="w-4 h-4" />
                    开始改写
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">素材库管理</h1>
          <p className="text-muted-foreground mt-1">
            管理和组织您的创作素材，一键改写生成新内容
          </p>
        </div>
        
        <div />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>总素材数</CardDescription>
              <Icons.folder className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{list.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              已收集 {list.length} 个素材
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>已选择</CardDescription>
              <Icons.checkCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{selectedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              选中 {selectedCount} 个素材
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>热门来源</CardDescription>
              <Icons.trendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">微信</div>
            <p className="text-xs text-muted-foreground mt-1">
              最活跃的素材来源
            </p>
          </CardContent>
        </Card>

        {/* 移除今日新增模块 */}
      </div>

      {/* Controls */}
      <Card className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3 w-full">
              <div className="relative w-full max-w-xl">
                <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  type="search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={t("app.actions.search") || "搜索素材标题..."}
                  aria-label={t("app.actions.search") || "搜索"}
                  className="input h-11 pr-4 w-full rounded-xl"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
              
              {selectedCount > 0 && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => batchRewrite()}
                    className="gap-2"
                  >
                    <Icons.edit className="w-4 h-4" />
                    批量改写 ({selectedCount})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => batchDelete()}
                    className="gap-2 text-red-600 hover:text-red-700"
                  >
                    <Icons.trash className="w-4 h-4" />
                    批量删除 ({selectedCount})
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* 平台筛选：默认全选，可切换 wechat / youtube */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={platforms.wechat}
                    onChange={(e) => setPlatforms((p) => ({ ...p, wechat: e.target.checked }))}
                    className="rounded border-border"
                  />
                  WeChat
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={platforms.youtube}
                    onChange={(e) => setPlatforms((p) => ({ ...p, youtube: e.target.checked }))}
                    className="rounded border-border"
                  />
                  YouTube
                </label>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Materials Display */}
      <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
        {loading ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-3">
                <Icons.loader className="w-8 h-8 animate-spin text-emerald-600" />
                <p className="text-muted-foreground">{t("app.common.loading") || "加载中..."}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered
              .filter((m) => {
                const src = (m.source || '').toLowerCase();
                const isWeChat = src.includes('wechat') || src.includes('weixin') || m.source === '微信';
                const isYouTube = src.includes('youtube');
                return (platforms.wechat && isWeChat) || (platforms.youtube && isYouTube);
              })
              .map((material, index) => (
              <Card
                key={material.id}
                className={cn(
                  "group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in",
                  material.selected && "ring-2 ring-emerald-500 ring-offset-2 ring-offset-background"
                )}
                style={{ animationDelay: `${index * 40}ms` }}
                onClick={() => toggleOne(material.id, !material.selected)}
              >
                {/* 大封面 */}
                <div className="relative aspect-[16/10] bg-muted">
                  {/* 选择复选框 */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={!!material.selected}
                      onChange={(e) => { e.stopPropagation(); toggleOne(material.id, e.target.checked); }}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 bg-white/90"
                    />
                  </div>
                  {material.cover ? (
                    <img
                      src={getProxyImage(material.cover)}
                      alt={material.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icons.fileText className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
                {/* 标题置底 */}
                <div className="p-4">
                  <h3 className="text-base font-semibold leading-snug line-clamp-2">
                    {material.title}
                  </h3>
                  <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {(() => { const Icon = getSourceIcon(material.source); return <Icon className="w-4 h-4" />; })()}
                      {material.source}
                    </span>
                    <span>
                      {new Date(material.collectedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {/* 显示原文链接 */}
                  {material.url && (
                    <div className="mt-2 pt-2 border-t">
                      <a 
                        href={material.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 truncate"
                      >
                        <Icons.link className="w-3 h-3 flex-shrink-0" />
                        查看原文
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
