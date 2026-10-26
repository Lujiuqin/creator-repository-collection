import { loadMessages } from "@/i18n";
import type { AppLocale } from "@/i18n/locales";
import PublishHistory from "@/components/publish/PublishHistory";

export default async function PublishHistoryPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  const messages = await loadMessages(locale);
  return <PublishHistory locale={locale} messages={messages} />;
}

