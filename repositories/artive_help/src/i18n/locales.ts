export const supportedLocales = ["zh-CN", "en-US"] as const;

export type AppLocale = typeof supportedLocales[number];

export const defaultLocale: AppLocale = "zh-CN";

export function isSupportedLocale(locale: string): locale is AppLocale {
  return (supportedLocales as readonly string[]).includes(locale);
}
