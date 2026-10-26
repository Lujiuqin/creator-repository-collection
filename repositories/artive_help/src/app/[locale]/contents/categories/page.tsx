import CategoriesClient from "@/components/contents/CategoriesClient";
import { loadMessages } from "@/i18n";
import type { AppLocale } from "@/i18n/locales";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const messages = await loadMessages(locale);
  return <CategoriesClient locale={locale} messages={messages} />;
}
