import TagsClient from "@/components/contents/TagsClient";
import { loadMessages } from "@/i18n";
import type { AppLocale } from "@/i18n/locales";

export default async function TagsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const messages = await loadMessages(locale);
  return <TagsClient locale={locale} messages={messages} />;
}
