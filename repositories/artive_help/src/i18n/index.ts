import { defaultLocale, isSupportedLocale, type AppLocale } from "./locales";

export async function loadMessages(locale: string) {
  const target = isSupportedLocale(locale) ? locale : defaultLocale;
  const mod = await import(`./messages/${target}.json`);
  return mod.default as Record<string, any>;
}

export type Messages = Awaited<ReturnType<typeof loadMessages>>;

