"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { AppLocale } from "@/i18n/locales";
import type { HotItem } from "@/types";
import { addToMaterials, fetchHotItems } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function Hotboards({ locale, messages }: { locale: AppLocale; messages: any }) {
  const t = (path: string) => path.split(".").reduce((acc: any, key) => acc?.[key], messages);
  const [items, setItems] = useState<HotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      const data = await fetchHotItems();
      if (!cancelled) {
        setItems(data);
        setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    return {
      weixin: items.filter((i) => i.source === "weixin"),
      weixin_tech: items.filter((i) => i.source === "weixin_tech"),
      zhihu: items.filter((i) => i.source === "zhihu"),
      baidu: items.filter((i) => i.source === "baidu"),
      toutiao: items.filter((i) => i.source === "toutiao"),
      weibo: items.filter((i) => i.source === "weibo"),
      other: items.filter((i) => i.source === "other"),
    };
  }, [items]);

  // 获取今日最热内容
  const todayTopItem = useMemo(() => {
    if (items.length === 0) return null;
    return items.reduce((prev, current) => {
      const prevHeat = typeof prev.heat === 'number' ? prev.heat : 0;
      const currentHeat = typeof current.heat === 'number' ? current.heat : 0;
      return currentHeat > prevHeat ? current : prev;
    });
  }, [items]);

  async function onAdd(item: HotItem) {
    await addToMaterials(item);
    push(t("app.feedback.addedToMaterials"), "success");
  }

  const sourceConfig = {
    weixin: {
      name: t("app.dashboard.hotboards.weixin") || "微信热点",
      icon: Icons.messageCircle,
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      count: grouped.weixin.length
    },
    weixin_tech: {
      name: t("app.dashboard.hotboards.weixin_tech") || "微信科技",
      icon: Icons.sparkles,
      color: "from-cyan-500 to-teal-600",
      bgColor: "from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20",
      count: grouped.weixin_tech.length
    },
    zhihu: {
      name: t("app.dashboard.hotboards.zhihu") || "知乎热榜",
      icon: Icons.layers,
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      count: grouped.zhihu.length
    },
    baidu: {
      name: t("app.dashboard.hotboards.baidu") || "百度热搜",
      icon: Icons.trendingUp,
      color: "from-red-500 to-orange-600",
      bgColor: "from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
      count: grouped.baidu.length
    },
    toutiao: {
      name: t("app.dashboard.hotboards.toutiao") || "今日头条",
      icon: Icons.newspaper,
      color: "from-purple-500 to-violet-600",
      bgColor: "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
      count: grouped.toutiao.length
    },
    weibo: {
      name: t("app.dashboard.hotboards.weibo") || "微博热搜",
      icon: Icons.hash,
      color: "from-pink-500 to-rose-600",
      bgColor: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
      count: grouped.weibo.length
    },
    other: {
      name: t("app.dashboard.hotboards.other") || "其他平台",
      icon: Icons.globe,
      color: "from-gray-500 to-slate-600",
      bgColor: "from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20",
      count: grouped.other.length
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Apple Style */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
        <div className="relative py-24 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-card/50 backdrop-blur-sm rounded-full border border-border/50 mb-8">
              <Icons.zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">实时热点追踪</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text tracking-tight">
              今日热门
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 font-light leading-relaxed">
              发现全网最热内容，把握流量密码，助力内容创作
            </p>

            {/* Today's Top Content */}
            {todayTopItem && !loading && (
              <div className="max-w-4xl mx-auto mb-16">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-emerald-500/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                  <div className="relative bg-card border border-border/50 rounded-2xl p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Icons.flame className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-medium text-orange-600 dark:text-orange-400">今日最热</span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-4 text-balance">
                      {todayTopItem.title}
                    </h2>
                    {todayTopItem.summary && (
                      <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                        {todayTopItem.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Icons.trendingUp className="w-4 h-4" />
                          <span className="font-medium">{todayTopItem.heat}+ 热度</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icons.eye className="w-4 h-4" />
                          <span>{Math.floor(Math.random() * 50000 + 10000)}+ 阅读</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => onAdd(todayTopItem)}
                          className="gap-2"
                        >
                          <Icons.plus className="w-4 h-4" />
                          添加到素材库
                        </Button>
                        <Button asChild>
                          <a href={todayTopItem.url} target="_blank" rel="noreferrer" className="gap-2">
                            查看详情
                            <Icons.externalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platforms Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">热门平台</h2>
            <p className="text-xl text-muted-foreground">多平台热点内容一览</p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Icons.loader className="w-8 h-8 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">正在加载热点内容...</p>
              </div>
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {Object.entries(sourceConfig)
                .filter(([source]) => grouped[source as keyof typeof grouped].length > 0)
                .map(([source, config], index) => {
                  const Icon = config.icon;
                  const platformItems = grouped[source as keyof typeof grouped].slice(0, 10);
                  
                  return (
                    <div 
                      key={source} 
                      className="group animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-border to-border/50 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300" />
                        <div className="relative bg-card border border-border/50 rounded-2xl p-6 h-[600px] flex flex-col">
                          {/* Platform Header */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className={cn("p-3 rounded-xl bg-gradient-to-br", config.color, "shadow-lg")}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold">{config.name}</h3>
                              <p className="text-sm text-muted-foreground">{config.count} 条热点</p>
                            </div>
                          </div>

                          {/* Platform Content */}
                          <div className="flex-1 overflow-hidden">
                            <div className="space-y-3 h-full overflow-y-auto">
                              {platformItems.map((item, itemIndex) => (
                                <div 
                                  key={item.id} 
                                  className="group/item p-4 rounded-xl hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-border/50"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={cn(
                                      "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0",
                                      itemIndex < 3 
                                        ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-sm" 
                                        : "bg-muted text-muted-foreground"
                                    )}>
                                      {itemIndex + 1}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <a 
                                        href={item.url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="block font-medium text-sm leading-tight hover:text-primary transition-colors line-clamp-2 mb-2"
                                      >
                                        {item.title}
                                      </a>
                                      
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                          <Icons.trendingUp className="w-3 h-3" />
                                          {item.heat ?? "-"}
                                        </div>
                                        <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                          <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => onAdd(item)}
                                            className="h-6 px-2 text-xs"
                                          >
                                            <Icons.plus className="w-3 h-3 mr-1" />
                                            添加
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

