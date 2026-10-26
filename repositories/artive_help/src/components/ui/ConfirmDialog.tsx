"use client";
import React, { createContext, useCallback, useContext, useState } from "react";
import { Icons } from "./Icons";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

interface ConfirmDialog extends ConfirmOptions {
  id: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmContext = createContext<{
  confirm: (options: ConfirmOptions) => Promise<boolean>;
} | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("ConfirmContext not found. Make sure to wrap your component with ConfirmProvider");
  return ctx;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<ConfirmDialog | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = Date.now().toString();
      setDialog({
        ...options,
        id,
        onConfirm: () => {
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setDialog(null);
          resolve(false);
        }
      });
    });
  }, []);

  const getDialogConfig = (type: ConfirmOptions["type"]) => {
    switch (type) {
      case "danger":
        return {
          icon: Icons.alertCircle,
          iconColor: "text-red-500",
          confirmButtonClass: "bg-red-500 hover:bg-red-600 text-white",
          titleColor: "text-red-600"
        };
      case "warning":
        return {
          icon: Icons.alertCircle,
          iconColor: "text-yellow-500",
          confirmButtonClass: "bg-yellow-500 hover:bg-yellow-600 text-white",
          titleColor: "text-yellow-600"
        };
      case "info":
      default:
        return {
          icon: Icons.info,
          iconColor: "text-blue-500",
          confirmButtonClass: "bg-blue-500 hover:bg-blue-600 text-white",
          titleColor: "text-blue-600"
        };
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      
      {/* 对话框遮罩和内容 */}
      {dialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={dialog.onCancel}
          />
          
          {/* 对话框内容 */}
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 fade-in duration-200">
            <div className="p-6">
              {/* 头部 - 图标和标题 */}
              <div className="flex items-start gap-4 mb-4">
                {(() => {
                  const config = getDialogConfig(dialog.type);
                  const Icon = config.icon;
                  return (
                    <>
                      <div className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                        dialog.type === "danger" 
                          ? "bg-red-100 dark:bg-red-900/20" 
                          : dialog.type === "warning"
                          ? "bg-yellow-100 dark:bg-yellow-900/20"
                          : "bg-blue-100 dark:bg-blue-900/20"
                      )}>
                        <Icon className={cn("w-5 h-5", config.iconColor)} />
                      </div>
                      <div className="flex-1">
                        <h3 className={cn("text-lg font-semibold", config.titleColor)}>
                          {dialog.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm leading-relaxed">
                          {dialog.message}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
              
              {/* 按钮区域 */}
              <div className="flex gap-3 justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={dialog.onCancel}
                  className="px-4 py-2"
                >
                  {dialog.cancelText || "取消"}
                </Button>
                <Button
                  onClick={dialog.onConfirm}
                  className={cn(
                    "px-4 py-2",
                    getDialogConfig(dialog.type).confirmButtonClass
                  )}
                >
                  {dialog.confirmText || "确定"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}