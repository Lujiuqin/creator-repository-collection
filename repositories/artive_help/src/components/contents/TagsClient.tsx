"use client";
import { useState } from "react";
import type { AppLocale } from "@/i18n/locales";

export default function TagsClient({ locale, messages }: { locale: AppLocale; messages: any }) {
  const [list, setList] = useState<string[]>(["AI", "趋势", "快讯"]);
  const [value, setValue] = useState("");

  function add() {
    const v = value.trim();
    if (!v) return;
    if (list.includes(v)) return;
    setList((prev) => [...prev, v]);
    setValue("");
  }
  function remove(name: string) {
    setList((prev) => prev.filter((x) => x !== name));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input value={value} onChange={(e) => setValue(e.target.value)} className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10 bg-transparent" placeholder="新增标签" />
        <button className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10" onClick={add}>新增</button>
      </div>
      <div className="rounded-lg border border-black/10 dark:border-white/10">
        <ul className="divide-y divide-black/5 dark:divide-white/5">
          {list.map((name) => (
            <li key={name} className="flex items-center justify-between p-3 text-sm">
              <span>{name}</span>
              <button className="px-2 py-1 rounded-md border border-black/10 dark:border-white/10" onClick={() => remove(name)}>删除</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

