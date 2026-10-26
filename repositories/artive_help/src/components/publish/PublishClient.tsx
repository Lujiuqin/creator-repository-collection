"use client";
import { useEffect, useMemo, useState } from "react";
import type { AppLocale } from "@/i18n/locales";
import { createPublishTask, fetchAccounts } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import type { Account } from "@/types";

export default function PublishClient({ locale, messages, initialIds }: { locale: AppLocale; messages: any; initialIds: string[] }) {
  const t = (path: string) => path.split(".").reduce((acc: any, key) => acc?.[key], messages);
  const [open, setOpen] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    fetchAccounts().then(setAccounts);
  }, []);

  async function confirm() {
    setLoading(true);
    await createPublishTask(initialIds, selected);
    setLoading(false);
    push(t("app.feedback.published"), "success");
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg surface-card shadow-soft p-4 space-y-4">
            <div className="text-lg font-semibold">{t("app.publish.modal.title")}</div>
            <div className="space-y-2">
              <div className="text-sm opacity-80">{t("app.publish.modal.selectAccounts")}</div>
              <div className="grid grid-cols-2 gap-2">
                {accounts.map((a) => {
                  const checked = selected.includes(a.id);
                  return (
                    <label key={a.id} className={`surface-card px-3 py-2 cursor-pointer ${checked ? "ring-2 ring-black/10 dark:ring-white/10" : ""}`}>
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={checked}
                        onChange={(e) =>
                          setSelected((prev) =>
                            e.target.checked ? [...prev, a.id] : prev.filter((x) => x !== a.id)
                          )
                        }
                      />
                      {a.name}
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline" onClick={() => setOpen(false)}>
                {t("app.actions.cancel")}
              </button>
              <button disabled={loading || selected.length === 0} className="btn btn-primary" onClick={confirm}>
                {t("app.publish.modal.publishNow")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm opacity-80">{t("app.publish.preparedLabel")}：{initialIds.join(", ") || "-"}</div>
      <div className="text-sm opacity-60">{t("app.publish.seeHistory")}</div>
    </div>
  );
}

