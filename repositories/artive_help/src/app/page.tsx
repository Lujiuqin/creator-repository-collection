"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const navLang = typeof navigator !== "undefined" ? navigator.language : "zh-CN";
    const preferred = navLang?.toLowerCase().startsWith("zh") ? "zh-CN" : "en-US";
    router.replace(`/${preferred}`);
  }, [router]);

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="flex items-center gap-3 text-muted-foreground" aria-hidden>
        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>
    </div>
  );
}
