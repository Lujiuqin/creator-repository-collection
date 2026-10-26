import { loadMessages } from "@/i18n";
import type { AppLocale } from "@/i18n/locales";
import MaterialsTable from "@/components/materials/MaterialsTable";

export default async function MaterialsPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  const messages = await loadMessages(locale);
  return <MaterialsTable locale={locale} messages={messages} />;
}

