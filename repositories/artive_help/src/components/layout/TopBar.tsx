"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarNav from "@/components/layout/SidebarNav";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthModalWithPortal from "@/components/auth/AuthModalWithPortal";
import { ChevronDown, User, LogOut } from "lucide-react";

export default function TopBar({ locale, messages }: { locale: string; messages: any }) {
  const t = (path: string) => path.split(".").reduce((acc: any, key) => acc?.[key], messages)?.toString?.() ?? "";
  const [open, setOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();

  // Get current page info for breadcrumb
  const getCurrentPage = () => {
    if (pathname.includes('/materials')) return { name: '素材库', icon: Icons.folder };
    if (pathname.includes('/rewrite')) return { name: 'AI改写', icon: Icons.edit };
    if (pathname.includes('/contents')) return { name: '内容管理', icon: Icons.fileText };
    if (pathname.includes('/publish/history')) return { name: '发布历史', icon: Icons.history };
    if (pathname.includes('/publish')) return { name: '内容发布', icon: Icons.share };
    if (pathname.includes('/settings')) return { name: '系统设置', icon: Icons.settings };
    return { name: '控制面板', icon: Icons.trendingUp };
  };

  const currentPage = getCurrentPage();
  const CurrentIcon = currentPage.icon;

  return (
    <div className="px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            aria-label={t("app.common.openMenu")}
            className="lg:hidden p-2 h-10 w-10"
            onClick={() => setOpen(true)}
          >
            <Icons.menu className="h-5 w-5" />
          </Button>
          
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold gradient-text">{t("app.title")}</span>
          </div>
          
          {/* Desktop Breadcrumb */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icons.trendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">工作台</span>
              <Icons.chevronRight className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-sm">
                <CurrentIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg">{currentPage.name}</span>
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Enhanced Search Bar */}
          <div className="relative hidden sm:block">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Icons.search className="w-4 h-4" />
            </div>
            <input
              type="search"
              placeholder={t("app.actions.search") || "搜索内容、素材..."}
              className="input pl-10 w-64 lg:w-80 focus:w-96 transition-all duration-300"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs bg-muted rounded font-mono">⌘K</kbd>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <Icons.sparkles className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 relative">
              <Icons.messageCircle className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </Button>
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <Icons.settings className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Profile / Login */}
          {loading ? (
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : user ? (
            <div className="relative">
              <Button 
                variant="ghost" 
                className="h-10 px-3 gap-2"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline text-sm font-medium truncate max-w-24">
                  {user.email?.split('@')[0] || '用户'}
                </span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
              
              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setUserMenuOpen(false)} 
                  />
                  <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-medium">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.email?.split('@')[0] || '用户'}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          signOut()
                          setUserMenuOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        退出登录
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="h-10 px-4 gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
              onClick={() => setAuthModalOpen(true)}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">登录</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-[320px] glass border-r border-border/50 animate-slide-in">
            {/* Mobile Menu Header */}
            <div className="px-6 py-6 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-bold gradient-text">{t("app.title")}</h1>
                  <p className="text-xs text-muted-foreground">智能创作助手</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                aria-label={t("app.common.closeMenu")} 
                className="h-8 w-8 p-0" 
                onClick={() => setOpen(false)}
              >
                <Icons.close className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Mobile Search */}
            <div className="p-6 border-b border-border/50">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Icons.search className="w-4 h-4" />
                </div>
                <input
                  type="search"
                  placeholder="搜索..."
                  className="input pl-10 w-full"
                />
              </div>
            </div>
            
            {/* Navigation */}
            <div className="p-6 flex-1 overflow-y-auto">
              <SidebarNav locale={locale} messages={messages} onNavigate={() => setOpen(false)} />
            </div>
            
            {/* Mobile Footer */}
            <div className="p-6 border-t border-border/50">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xs font-medium">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.email?.split('@')[0] || '用户'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signOut()
                      setOpen(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true)
                    setOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <User className="w-4 h-4" />
                  登录账户
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModalWithPortal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
