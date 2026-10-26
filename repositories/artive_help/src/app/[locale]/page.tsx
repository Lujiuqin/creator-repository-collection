import { loadMessagesWithCache } from "@/lib/i18nCache"; // 使用缓存版本
import type { AppLocale } from "@/i18n/locales";
import { Hotboards } from "@/components/dashboard/Hotboards";

export default async function Dashboard({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  const messages = await loadMessagesWithCache(locale); // 从缓存加载
  return (
    <div className="space-y-6">
      <Hotboards locale={locale} messages={messages} />
    </div>
  );
}

