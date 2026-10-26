import { loadMessages } from "@/i18n";
import type { AppLocale } from "@/i18n/locales";
import SettingsClient from "@/components/settings/SettingsClient";

export default async function SettingsPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  const messages = await loadMessages(locale);
  return <SettingsClient locale={locale} messages={messages} />;
}

