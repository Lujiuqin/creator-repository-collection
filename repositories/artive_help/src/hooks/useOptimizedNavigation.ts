// 优化导航性能的自定义钩子
import { useRouter } from "next/navigation";
import { useTransition, useCallback } from "react";

export function useOptimizedNavigation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 使用React 18的并发特性优化导航
  const navigate = useCallback((href: string) => {
    // 使用startTransition包装导航，避免阻塞UI
    startTransition(() => {
      router.push(href);
    });
  }, [router]);

  // 预加载页面资源
  const prefetch = useCallback((href: string) => {
    router.prefetch(href);
  }, [router]);

  return {
    navigate,
    prefetch,
    isPending, // 可用于显示加载状态
  };
}