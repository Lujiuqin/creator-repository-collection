"use client";
import { useMemo, useState } from "react";
import type { AppLocale } from "@/i18n/locales";

type Account = {
  id: string;
  name: string;
  appId?: string;
  appSecret?: string;
  cookie?: string;
  fingerprintId?: string;
};

type Fingerprint = {
  id: string;
  name: string;
  corePath?: string;
  userDataDir?: string;
};

export default function SettingsClient({ locale, messages }: { locale: AppLocale; messages: any }) {
  const t = (path: string) => path.split(".").reduce((acc: any, key) => acc?.[key], messages);
  const [tab, setTab] = useState<"accounts" | "fingerprints">("accounts");
  const [accounts, setAccounts] = useState<Account[]>([
    { id: "a-1", name: "科技前沿", fingerprintId: "f-1" },
  ]);
  const [fps, setFps] = useState<Fingerprint[]>([
    { id: "f-1", name: "Chrome FP 1" },
  ]);

  function addAccount() {
    const id = `a-${accounts.length + 1}`;
    setAccounts((prev) => [...prev, { id, name: `账号 ${id}` }]);
  }
  function removeAccount(id: string) {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }
  function updateAccount(id: string, patch: Partial<Account>) {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function addFp() {
    const id = `f-${fps.length + 1}`;
    setFps((prev) => [...prev, { id, name: `FP ${id}` }]);
  }
  function removeFp(id: string) {
    setFps((prev) => prev.filter((f) => f.id !== id));
  }
  function updateFp(id: string, patch: Partial<Fingerprint>) {
    setFps((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  const fpSelectOptions = useMemo(() => fps.map((f) => ({ value: f.id, label: f.name })), [fps]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <button className={`px-3 py-2 rounded-md border ${tab === "accounts" ? "bg-black/[.04] dark:bg-white/[.04]" : "border-black/10 dark:border-white/10"}`} onClick={() => setTab("accounts")}>
          {t("app.settings.tabs.accounts")}
        </button>
        <button className={`px-3 py-2 rounded-md border ${tab === "fingerprints" ? "bg-black/[.04] dark:bg-white/[.04]" : "border-black/10 dark:border-white/10"}`} onClick={() => setTab("fingerprints")}>
          {t("app.settings.tabs.fingerprints")}
        </button>
      </div>

      {tab === "accounts" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10" onClick={addAccount}>
              {t("app.settings.accounts.add")}
            </button>
          </div>
          <div className="grid gap-3">
            {accounts.map((a) => (
              <div key={a.id} className="rounded-lg border border-black/10 dark:border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{a.name}</div>
                  <div className="space-x-2">
                    <button className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10" onClick={() => removeAccount(a.id)}>
                      {t("app.settings.accounts.delete")}
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <label className="space-y-1">
                    <div className="opacity-70">{t("app.settings.accounts.fields.name")}</div>
                    <input className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10 bg-transparent" value={a.name} onChange={(e) => updateAccount(a.id, { name: e.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <div className="opacity-70">{t("app.settings.accounts.fields.appId")}</div>
                    <input className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10 bg-transparent" value={a.appId ?? ""} onChange={(e) => updateAccount(a.id, { appId: e.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <div className="opacity-70">{t("app.settings.accounts.fields.appSecret")}</div>
                    <input className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10 bg-transparent" value={a.appSecret ?? ""} onChange={(e) => updateAccount(a.id, { appSecret: e.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <div className="opacity-70">{t("app.settings.accounts.fields.cookie")}</div>
                    <input className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10 bg-transparent" value={a.cookie ?? ""} onChange={(e) => updateAccount(a.id, { cookie: e.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <div className="opacity-70">{t("app.settings.accounts.fields.bindFingerprint")}</div>
                    <select className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10 bg-transparent" value={a.fingerprintId ?? ""} onChange={(e) => updateAccount(a.id, { fingerprintId: e.target.value })}>
                      <option value="">-</option>
                      {fpSelectOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "fingerprints" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10" onClick={addFp}>
              {t("app.settings.fingerprints.add")}
            </button>
          </div>
          <div className="grid gap-3">
            {fps.map((f) => (
              <div key={f.id} className="rounded-lg border border-black/10 dark:border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{f.name}</div>
                  <div className="space-x-2">
                    <button className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10" onClick={() => removeFp(f.id)}>
                      {t("app.settings.fingerprints.delete")}
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <label className="space-y-1">
                    <div className="opacity-70">{t("app.settings.fingerprints.fields.name")}</div>
                    <input className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10 bg-transparent" value={f.name} onChange={(e) => updateFp(f.id, { name: e.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <div className="opacity-70">{t("app.settings.fingerprints.fields.corePath")}</div>
                    <input className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10 bg-transparent" value={f.corePath ?? ""} onChange={(e) => updateFp(f.id, { corePath: e.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <div className="opacity-70">{t("app.settings.fingerprints.fields.userDataDir")}</div>
                    <input className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10 bg-transparent" value={f.userDataDir ?? ""} onChange={(e) => updateFp(f.id, { userDataDir: e.target.value })} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

