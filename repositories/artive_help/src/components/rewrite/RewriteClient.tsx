"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { AppLocale } from "@/i18n/locales";
import { callAiRewrite, fetchOriginalArticle, saveContent } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type Article = {
  id: string;
  title: string;
  content: string;
};

type StyleKey = "professional" | "plain" | "xiaohongshu" | "zhihu" | "humor";

export default function RewriteClient({ locale, messages, initialIds }: { locale: AppLocale; messages: any; initialIds: string[] }) {
  const t = (path: string) => path.split(".").reduce((acc: any, key) => acc?.[key], messages);
  const [left, setLeft] = useState<Article | null>(null);
  const [right, setRight] = useState<string>("");
  const [style, setStyle] = useState<StyleKey>("xiaohongshu");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState({ original: 0, rewritten: 0 });
  const { push } = useToast();

  useEffect(() => {
    const id = initialIds[0] ?? "m-0";
    fetchOriginalArticle(id).then(setLeft);
  }, [initialIds]);

  useEffect(() => {
    setWordCount({
      original: left?.content?.length || 0,
      rewritten: right.length
    });
  }, [left, right]);

  async function startRewrite() {
    if (!left || !style) {
      push("请先选择文章和改写风格", "warning");
      return;
    }
    
    setLoading(true);
    try {
      const text = await callAiRewrite({ 
        article: left, 
        style: t("app.rewrite.styles." + style), 
        prompt 
      });
      setRight(text);
      push("AI改写完成", "success");
    } catch (error) {
      push("改写失败，请重试", "error");
    } finally {
      setLoading(false);
    }
  }

  function regenerate() {
    startRewrite();
  }

  async function save() {
    if (!right.trim()) {
      push("请先进行改写再保存", "warning");
      return;
    }
    
    try {
      await saveContent({ title: left?.title ?? "", content: right });
      push(t("app.feedback.saved") || "保存成功", "success");
    } catch (error) {
      push("保存失败，请重试", "error");
    }
  }

  function copyToClipboard() {
    if (!right) return;
    navigator.clipboard.writeText(right);
    push("内容已复制到剪贴板", "success");
  }

  const styleOptions: { key: StyleKey; text: string; icon: React.ElementType; description: string; color: string }[] = useMemo(
    () => [
      { 
        key: "professional", 
        text: t("app.rewrite.styles.professional") || "专业商务", 
        icon: Icons.user,
        description: "正式、严谨、商务化",
        color: "from-blue-500 to-indigo-600"
      },
      { 
        key: "plain", 
        text: t("app.rewrite.styles.plain") || "简洁明了", 
        icon: Icons.fileText,
        description: "简洁、直接、易懂",
        color: "from-gray-500 to-slate-600"
      },
      { 
        key: "xiaohongshu", 
        text: t("app.rewrite.styles.xiaohongshu") || "小红书风格", 
        icon: Icons.heart,
        description: "活泼、时尚、生活化",
        color: "from-pink-500 to-rose-600"
      },
      { 
        key: "zhihu", 
        text: t("app.rewrite.styles.zhihu") || "知乎风格", 
        icon: Icons.layers,
        description: "理性、深度、逻辑强",
        color: "from-blue-500 to-cyan-600"
      },
      { 
        key: "humor", 
        text: t("app.rewrite.styles.humor") || "幽默风趣", 
        icon: Icons.sparkles,
        description: "轻松、有趣、接地气",
        color: "from-yellow-500 to-orange-600"
      },
    ],
    [messages, t]
  );

  const selectedStyle = styleOptions.find(s => s.key === style);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-full border border-emerald-200 dark:border-emerald-800">
          <Icons.edit className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">AI智能改写</span>
        </div>
        <h1 className="text-3xl font-bold gradient-text">内容改写工具</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          使用AI技术，将您的内容改写成不同风格，提升内容质量和吸引力
        </p>
      </div>

      {/* Style Selection */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.sparkles className="w-5 h-5" />
            选择改写风格
          </CardTitle>
          <CardDescription>
            不同的写作风格适合不同的平台和受众
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {styleOptions.map((option, index) => {
              const Icon = option.icon;
              const isSelected = style === option.key;
              
              return (
                <div
                  key={option.key}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-fade-in",
                    isSelected 
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" 
                      : "border-border hover:border-emerald-300 hover:bg-muted/50"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setStyle(option.key)}
                >
                  <div className="text-center space-y-3">
                    <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br mx-auto flex items-center justify-center", option.color)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{option.text}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Prompt */}
      <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.messageCircle className="w-5 h-5" />
            自定义提示词（可选）
          </CardTitle>
          <CardDescription>
            添加特殊要求或指导，让AI更好地理解您的需求
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：请突出产品的环保特性，语气要温和友善..."
              className="input min-h-20 w-full resize-none"
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {prompt.length}/500
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button 
              disabled={loading || !left} 
              onClick={startRewrite}
              className="gap-2 min-w-32"
            >
              {loading ? (
                <>
                  <Icons.loader className="w-4 h-4 animate-spin" />
                  改写中...
                </>
              ) : (
                <>
                  <Icons.zap className="w-4 h-4" />
                  开始改写
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              disabled={loading || !right} 
              onClick={regenerate}
              className="gap-2"
            >
              <Icons.refresh className="w-4 h-4" />
              重新生成
            </Button>
            
            <Button 
              variant="outline"
              disabled={!right}
              onClick={copyToClipboard}
              className="gap-2"
            >
              <Icons.copy className="w-4 h-4" />
              复制结果
            </Button>
            
            <Button 
              variant="secondary"
              disabled={!right}
              onClick={save}
              className="gap-2"
            >
              <Icons.save className="w-4 h-4" />
              保存到内容库
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
        {/* Original */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icons.fileText className="w-5 h-5" />
                {t("app.common.original") || "原始内容"}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {wordCount.original} 字
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-muted/30 max-h-[500px] overflow-y-auto">
              {left?.content ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {left.content}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Icons.fileText className="w-12 h-12 mb-4 opacity-50" />
                  <p>暂无原始内容</p>
                  <p className="text-xs mt-1">请从素材库选择内容进行改写</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rewritten */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icons.sparkles className="w-5 h-5 text-emerald-600" />
                {t("app.common.result") || "改写结果"}
              </CardTitle>
              <div className="flex items-center gap-3">
                {selectedStyle && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {React.createElement(selectedStyle.icon, { className: "w-4 h-4" })}
                    {selectedStyle.text}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {wordCount.rewritten} 字
                </div>
              </div>

            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-900/10 dark:to-green-900/10 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Icons.loader className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
                  <p className="text-emerald-600 font-medium">AI正在努力改写中...</p>
                  <p className="text-xs text-muted-foreground mt-2">请稍等片刻</p>
                </div>
              ) : right ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {right}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Icons.sparkles className="w-12 h-12 mb-4 opacity-50" />
                  <p>点击"开始改写"生成内容</p>
                  <p className="text-xs mt-1">AI将根据您选择的风格进行改写</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      {(wordCount.original > 0 || wordCount.rewritten > 0) && (
        <Card className="animate-fade-in" style={{ animationDelay: '500ms' }}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">{wordCount.original}</div>
                <div className="text-sm text-muted-foreground">原始字数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{wordCount.rewritten}</div>
                <div className="text-sm text-muted-foreground">改写字数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {wordCount.original > 0 ? Math.round((wordCount.rewritten / wordCount.original) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">字数比例</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedStyle?.text || "未选择"}
                </div>
                <div className="text-sm text-muted-foreground">改写风格</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

