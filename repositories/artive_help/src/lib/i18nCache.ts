// i18n消息缓存，避免重复加载
import { loadMessages as originalLoadMessages } from "@/i18n";
import type { AppLocale } from "@/i18n/locales";

// 内存缓存
const messageCache = new Map<AppLocale, any>();

// 带缓存的消息加载器
export async function loadMessagesWithCache(locale: AppLocale) {
  // 检查缓存
  if (messageCache.has(locale)) {
    return messageCache.get(locale);
  }

  // 加载消息
  const messages = await originalLoadMessages(locale);
  
  // 存入缓存
  messageCache.set(locale, messages);
  
  return messages;
}

// 清除缓存（如果需要）
export function clearI18nCache() {
  messageCache.clear();
}