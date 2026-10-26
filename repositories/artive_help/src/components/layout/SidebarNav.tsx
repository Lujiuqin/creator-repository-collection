"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { memo, useCallback } from "react"; // 使用memo优化重渲染
import { perfMonitor } from "@/lib/performanceMonitor"; // 性能监控

// 使用memo包装组件，避免不必要的重渲染
const SidebarNav = memo(function SidebarNav({ locale, messages, onNavigate }: { locale: string; messages: any; onNavigate?: () => void }) {
  const t = (path: string) => path.split(".").reduce((acc: any, key) => acc?.[key], messages)?.toString?.() ?? "";
  const pathname = usePathname();

  const navItems: { href: string; label: string; icon: React.ElementType; description: string; badge?: string }[] = [
    { 
      href: `/${locale}`, 
      label: t("app.nav.dashboard"), 
      icon: Icons.trendingUp,
      description: "实时热点与数据分析"
    },
    { 
      href: `/${locale}/inspiration`, 
      label: t("app.nav.inspiration") || "灵感集市", 
      icon: Icons.heart,
      description: "订阅创作者，获取灵感",
      badge: "NEW"
    },
    { 
      href: `/${locale}/materials`, 
      label: t("app.nav.materials"), 
      icon: Icons.folder,
      description: "素材库与资源管理"
    },
    { 
      href: `/${locale}/rewrite`, 
      label: t("app.nav.rewrite"), 
      icon: Icons.edit,
      description: "AI智能改写助手"
    },
    { 
      href: `/${locale}/contents`, 
      label: t("app.nav.contents"), 
      icon: Icons.fileText,
      description: "内容创作与管理"
    },
    { 
      href: `/${locale}/publish`, 
      label: t("app.nav.publish"), 
      icon: Icons.share,
      description: "一键发布到平台"
    },
    { 
      href: `/${locale}/publish/history`, 
      label: t("app.nav.publishHistory"), 
      icon: Icons.history,
      description: "发布历史记录"
    },
    { 
      href: `/${locale}/settings`, 
      label: t("app.nav.settings"), 
      icon: Icons.settings,
      description: "系统设置与配置"
    },
  ];

  return (
    <nav className="flex flex-col gap-2">
      {/* 移除“创作工具”文案 */}
      
      {navItems.map((item, index) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        // 优化点击处理
        const handleClick = () => {
          perfMonitor.startMeasure(`navigation-to-${item.label}`);
          onNavigate?.();
          // 在下一帧结束测量
          requestAnimationFrame(() => {
            perfMonitor.endMeasure(`navigation-to-${item.label}`);
          });
        };
        
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleClick}
            prefetch={true} // 预加载页面，加快切换速度
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-150", // 简化动画，只保留颜色过渡
              isActive
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" // 移除渐变背景
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {/* Active indicator - 简化样式 */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full" />
            )}
            
            {/* Icon - 简化样式和动画 */}
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150", // 只保留颜色过渡
              isActive 
                ? "bg-emerald-500 text-white" // 移除渐变和阴影
                : "bg-muted/50 group-hover:bg-muted" // 移除scale变换
            )}>
              <Icon className="w-4 h-4" />
            </div>
            
            {/* Label and description */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="truncate font-medium">
                {item.label}
              </span>
              <span className="text-xs text-muted-foreground/80 truncate">
                {item.description}
              </span>
            </div>
            
            {/* Badge (if any) */}
            {item.badge && (
              <div className="flex items-center justify-center w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                {item.badge}
              </div>
            )}
            
            {/* Hover arrow - 移除动画 */}
            <Icons.chevronRight className={cn(
              "w-4 h-4",
              isActive ? "text-emerald-600" : "text-muted-foreground/50 group-hover:text-muted-foreground"
            )} />
            
            {/* 移除glow效果以提升性能 */}
          </Link>
        );
      })}
      
      {/* 移除 AI 智能助手与快速创作入口 */}
    </nav>
  );
});

export default SidebarNav;


