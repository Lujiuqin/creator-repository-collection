import { loadMessagesWithCache } from "@/lib/i18nCache"; // 使用缓存版本
import type { AppLocale } from "@/i18n/locales";
import { InspirationMarket } from "@/components/inspiration/InspirationMarket";

export default async function InspirationPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  const messages = await loadMessagesWithCache(locale); // 从缓存加载
  
  return (
    <div className="min-h-screen bg-background">
      <InspirationMarket locale={locale} messages={messages} />
    </div>
  );
}

export const metadata = {
  title: "灵感集市 - 创作者内容订阅中心",
  description: "订阅你关注的创作者，获取最新内容灵感，一键入库仿写"
};