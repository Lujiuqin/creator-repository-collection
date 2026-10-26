"use client";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Icons } from "./Icons";
import { cn } from "@/lib/utils";

type ToastItem = { id: number; text: string; type?: "success" | "error" | "info" | "warning" };

const ToastContext = createContext<{ push: (text: string, type?: ToastItem["type"]) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("Toast context not found");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<ToastItem[]>([]);

  const push = useCallback((text: string, type: ToastItem["type"] = "info") => {
    setList((prev) => {
      const id = (prev.at(-1)?.id ?? 0) + 1;
      return [...prev, { id, text, type }];
    });
    setTimeout(() => {
      setList((prev) => prev.slice(1));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  const getToastConfig = (type: ToastItem["type"]) => {
    switch (type) {
      case "success":
        return {
          icon: Icons.checkCircle,
          className: "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400",
          shadowColor: "shadow-emerald-500/25"
        };
      case "error":
        return {
          icon: Icons.xCircle,
          className: "bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400",
          shadowColor: "shadow-red-500/25"
        };
      case "warning":
        return {
          icon: Icons.alertCircle,
          className: "bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-yellow-400",
          shadowColor: "shadow-yellow-500/25"
        };
      case "info":
      default:
        return {
          icon: Icons.info,
          className: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-400",
          shadowColor: "shadow-blue-500/25"
        };
    }
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] space-y-3 max-w-sm">
        {list.map((toast, index) => {
          const config = getToastConfig(toast.type);
          const Icon = config.icon;
          
          return (
            <div
              key={toast.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] animate-fade-in shadow-lg cursor-pointer",
                config.className,
                config.shadowColor
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setList(prev => prev.filter(t => t.id !== toast.id))}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-5">{toast.text}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setList(prev => prev.filter(t => t.id !== toast.id));
                }}
                className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors opacity-70 hover:opacity-100"
                aria-label="关闭"
              >
                <Icons.close className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}








