import PublishClient from "@/components/publish/PublishClient";
import { loadMessages } from "@/i18n";
import type { AppLocale } from "@/i18n/locales";

export default async function PublishPage({ params, searchParams }: { params: Promise<{ locale: AppLocale }>; searchParams: Promise<{ ids?: string }> }) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const messages = await loadMessages(locale);
  const ids = (sp?.ids ?? "").split(",").filter(Boolean);
  return <PublishClient locale={locale} messages={messages} initialIds={ids} />;
}

