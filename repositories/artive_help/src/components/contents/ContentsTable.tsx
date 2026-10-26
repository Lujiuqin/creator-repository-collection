"use client";
import { useEffect, useMemo, useState } from "react";
import type { AppLocale } from "@/i18n/locales";
import { fetchContents } from "@/lib/api";

type Content = {
  id: string;
  title: string;
  status: "draft" | "pending" | "published" | "failed";
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};

export default function ContentsTable({ locale, messages }: { locale: AppLocale; messages: any }) {
  const t = (path: string) => path.split(".").reduce((acc: any, key) => acc?.[key], messages);
  const [data, setData] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("");
  const [kw, setKw] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      const list = await fetchContents();
      if (!cancelled) {
        setData(list);
        setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = data;
    if (status) list = list.filter((d) => d.status === status);
    const keyword = kw.trim();
    if (keyword) list = list.filter((d) => d.title.includes(keyword));
    return list;
  }, [data, status, kw]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input className="input" placeholder={t("app.actions.search")} value={kw} onChange={(e) => setKw(e.target.value)} />
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">{t("app.actions.filter")}</option>
          <option value="draft">{t("app.contents.status.draft")}</option>
          <option value="pending">{t("app.contents.status.pending")}</option>
          <option value="published">{t("app.contents.status.published")}</option>
          <option value="failed">{t("app.contents.status.failed")}</option>
        </select>
      </div>

      <div className="overflow-x-auto surface-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-black/[.03] dark:bg-white/[.03]">
            <tr>
              <th className="p-3 text-left">{t("app.contents.columns.title")}</th>
              <th className="p-3 text-left">{t("app.contents.columns.status")}</th>
              <th className="p-3 text-left">{t("app.contents.columns.category")}</th>
              <th className="p-3 text-left">{t("app.contents.columns.tags")}</th>
              <th className="p-3 text-left">{t("app.contents.columns.createdAt")}</th>
              <th className="p-3 text-left">{t("app.contents.columns.updatedAt")}</th>
              <th className="p-3 text-left">{t("app.contents.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="p-3" colSpan={7}>{t("app.common.loading")}</td>
              </tr>
            )}
            {!loading && filtered.map((d) => (
              <tr key={d.id} className="border-t border-black/5 dark:border-white/5 hover:bg-black/[.02] dark:hover:bg-white/[.02]">
                <td className="p-3">{d.title}</td>
                <td className="p-3">{t(`app.contents.status.${d.status}`)}</td>
                <td className="p-3">{d.category}</td>
                <td className="p-3">{d.tags?.join(", ")}</td>
                <td className="p-3">{new Date(d.createdAt).toLocaleString()}</td>
                <td className="p-3">{new Date(d.updatedAt).toLocaleString()}</td>
                <td className="p-3 space-x-2">
                  <a className="btn btn-sm btn-primary" href={`/${locale}/publish?ids=${d.id}`}>{t("app.actions.publish")}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

