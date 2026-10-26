import RewriteClient from "@/components/rewrite/RewriteClientV2";
import { loadMessages } from "@/i18n";
import type { AppLocale } from "@/i18n/locales";

export default async function RewritePage({ params, searchParams }: { params: Promise<{ locale: AppLocale }>; searchParams: Promise<{ ids?: string }> }) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const messages = await loadMessages(locale);
  const ids = (sp?.ids ?? "").split(",").filter(Boolean);
  return <RewriteClient locale={locale} messages={messages} initialIds={ids} />;
}

