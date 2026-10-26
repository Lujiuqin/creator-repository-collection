"use client";
import React from "react";
import { usePathname } from "next/navigation";
import SidebarNav from "@/components/layout/SidebarNav";
import SidebarUser from "@/components/layout/SidebarUser";
import TopBar from "@/components/layout/TopBar";

export default function LocaleFrame({ locale, messages, children }: { locale: string; messages: any; children: React.ReactNode }) {
  const pathname = usePathname();
  const isRewrite = pathname?.includes("/rewrite");

  if (isRewrite) {
    // 重写页：隐藏侧边栏，顶部保留导航，主体全屏铺满
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar locale={locale} messages={messages} />
        <main className="flex-1 relative">
          {/* 去掉 container/max-w 约束，使用全宽全高 */}
          <div className="px-0 py-0 h-full w-full">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // 其他页面：保持原有带侧栏布局
  return (
    <div className="min-h-screen grid grid-cols-[280px_1fr] relative">
      {/* Sidebar */}
      <aside className="block relative">
        <div className="fixed top-0 left-0 h-full w-[280px] bg-background/95 border-r border-border/50">
          <div className="h-full px-6 py-8 flex flex-col">
            {/* Brand 简化 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold">{messages?.app?.title ?? "CMS"}</h1>
                </div>
              </div>
            </div>

            <nav className="flex-1">
              <SidebarNav locale={locale} messages={messages} />
            </nav>

            <div className="mt-auto pt-4 border-t border-border/50">
              <SidebarUser locale={locale} messages={messages} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex flex-col min-h-screen">
        <TopBar locale={locale} messages={messages} />
        <main className="flex-1 relative">
          <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
            <div className="relative">
              {children}
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}



