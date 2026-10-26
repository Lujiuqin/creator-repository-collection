import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { isSupportedLocale } from "@/i18n/locales";
import { loadMessagesWithCache } from "@/lib/i18nCache"; // 使用缓存版本
import { ToastProvider } from "@/components/ui/Toast";
import LocaleFrame from "../../components/layout/LocaleFrame";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CMS",
  description: "WeChat Content Manager",
};

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children, params } = props;
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return notFound();
  const messages = await loadMessagesWithCache(locale); // 从缓存加载
  const t = (path: string) => path.split(".").reduce((acc: any, key) => acc?.[key], messages)?.toString?.() ?? "";

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground relative overflow-hidden`}>
      <div className="pointer-events-none select-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 dark:from-slate-900/30 dark:via-slate-800/20 dark:to-slate-900/30" />
      </div>

      <ToastProvider>
        <LocaleFrame locale={locale} messages={messages}>
          {children}
        </LocaleFrame>
      </ToastProvider>
    </div>
  );
}

