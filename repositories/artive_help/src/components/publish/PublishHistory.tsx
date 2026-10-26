"use client";
import { useEffect, useState } from "react";
import type { AppLocale } from "@/i18n/locales";
import { fetchPublishHistory } from "@/lib/api";

type History = {
  id: string;
  article: string;
  account: string;
  status: "published" | "failed";
  reason?: string;
  time: string;
};

export default function PublishHistory({ locale, messages }: { locale: AppLocale; messages: any }) {
  const t = (path: string) => path.split(".").reduce((acc: any, key) => acc?.[key], messages);
  const [list, setList] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const res = await fetchPublishHistory();
      if (!cancelled) {
        setList(res);
        setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-black/[.04] dark:bg-white/[.04]">
          <tr>
            <th className="p-3 text-left">{t("app.publish.history.columns.article")}</th>
            <th className="p-3 text-left">{t("app.publish.history.columns.account")}</th>
            <th className="p-3 text-left">{t("app.publish.history.columns.status")}</th>
            <th className="p-3 text-left">{t("app.publish.history.columns.reason")}</th>
            <th className="p-3 text-left">{t("app.publish.history.columns.time")}</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td className="p-3" colSpan={5}>{t("app.common.loading")}</td>
            </tr>
          )}
          {!loading && list.map((h) => (
            <tr key={h.id} className="border-t border-black/5 dark:border-white/5 hover:bg-black/[.02] dark:hover:bg-white/[.02]">
              <td className="p-3">{h.article}</td>
              <td className="p-3">{h.account}</td>
              <td className="p-3">{h.status === "published" ? t("app.contents.status.published") : t("app.contents.status.failed")}</td>
              <td className="p-3">{h.reason ?? "-"}</td>
              <td className="p-3">{new Date(h.time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

