"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthModalWithPortal from "@/components/auth/AuthModalWithPortal";
import { LogOut, User } from "lucide-react";
import { useState } from "react";

export default function SidebarUser({ locale, messages }: { locale: string; messages: any }) {
  const t = (path: string) => path.split(".").reduce((acc: any, key) => acc?.[key], messages)?.toString?.() ?? "";
  const { user, loading, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (loading) {
    return <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />;
  }

  return (
    <div className="px-2">
      {user ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm px-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xs font-medium">
              {user.email?.charAt(0).toUpperCase() || t("app.auth.user")?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.email?.split("@")[0] || t("app.auth.user")}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => { signOut(); }}
          >
            <LogOut className="w-4 h-4 mr-2" /> {t("app.auth.logout") || "退出登录"}
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full justify-center hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
          onClick={() => setAuthModalOpen(true)}
        >
          <User className="w-4 h-4 mr-2" /> {t("app.auth.login") || "登录"}
        </Button>
      )}

      <AuthModalWithPortal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />
    </div>
  );
}



