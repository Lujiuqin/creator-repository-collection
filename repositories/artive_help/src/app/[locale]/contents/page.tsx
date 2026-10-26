import { loadMessages } from "@/i18n";
import type { AppLocale } from "@/i18n/locales";
import ContentsTable from "@/components/contents/ContentsTable";

export default async function ContentsPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  const messages = await loadMessages(locale);
  return <ContentsTable locale={locale} messages={messages} />;
}

