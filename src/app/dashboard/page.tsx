"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [state, setState] = useState<{ subscription: "FREE" | "PRO" | "ANON"; used: number; limit: number | null } | null>(null);
  useEffect(() => {
    fetch("/api/usage").then((r) => r.json()).then(setState).catch(() => setState(null));
  }, []);
  const sub = state?.subscription ?? "ANON";
  const used = state?.used ?? 0;
  const limit = state?.limit;

  const [docs, setDocs] = useState<Array<{ id: string; filename: string; createdAt: string }>>([]);
  const [analytics, setAnalytics] = useState<Array<{ name: string; count: number }>>([]);
  useEffect(() => {
    fetch("/api/documents").then((r) => r.json()).then((d) => setDocs(d || [])).catch(() => setDocs([]));
    fetch("/api/analytics").then((r) => r.json()).then((d) => setAnalytics(d || [])).catch(() => setAnalytics([]));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-foreground/15 p-5">
          <div className="text-sm text-foreground/60">Usage</div>
          <div className="text-xl font-medium">{sub === "PRO" ? `Pro: ${used}` : `${used} / ${limit ?? 0}`}</div>
        </div>
        <div className="rounded-lg border border-foreground/15 p-5">
          <div className="text-sm text-foreground/60">Subscription</div>
          <div className="text-xl font-medium">{sub}</div>
        </div>
        <div className="rounded-lg border border-foreground/15 p-5 col-span-3">
          <div className="text-sm text-foreground/60 mb-2">Documents</div>
          <div className="grid gap-2">
            {docs.length === 0 && <div className="text-sm text-foreground/60">No documents yet.</div>}
            {docs.map((d) => (
              <div key={d.id} className="flex items-center justify-between border border-foreground/10 rounded-md px-3 py-2">
                <div className="text-sm">{d.filename}</div>
                <div className="flex items-center gap-2">
                  <a href={`/api/documents/${d.id}`} className="rounded-md border px-2 py-1 text-sm">Download</a>
                  <button
                    className="rounded-md border px-2 py-1 text-sm"
                    onClick={async () => {
                      await fetch(`/api/documents/${d.id}`, { method: "DELETE" });
                      setDocs((prev) => prev.filter((x) => x.id !== d.id));
                    }}
                  >Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-foreground/15 p-5 col-span-3">
          <div className="text-sm text-foreground/60 mb-2">Analytics (aggregate)</div>
          <div className="grid gap-2">
            {analytics.length === 0 && <div className="text-sm text-foreground/60">No events yet.</div>}
            {analytics.map((a) => (
              <div key={a.name} className="flex items-center justify-between border border-foreground/10 rounded-md px-3 py-2 text-sm">
                <div>{a.name}</div>
                <div className="font-medium">{a.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-foreground/15 p-5 col-span-3">
          <div className="text-sm text-foreground/60 mb-2">Data control</div>
          <div className="flex items-center gap-2">
            <a href="/api/dsar/export" className="rounded-md border px-3 py-2 text-sm">Export account</a>
            <form action="/api/dsar/delete" method="post" onSubmit={(e) => { if (!confirm('Delete your account and all documents?')) e.preventDefault(); }}>
              <button className="rounded-md border px-3 py-2 text-sm text-red-600">Delete account</button>
            </form>
          </div>
          <div className="text-xs text-foreground/60 mt-2">See also: <a className="underline" href="/privacy">Privacy Policy</a> • <a className="underline" href="/terms">Terms</a></div>
        </div>
      </div>
    </div>
  );
}


