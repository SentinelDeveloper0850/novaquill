"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [zar, setZar] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/rates").then((r) => r.json()).then((d) => setZar(d?.EUR_ZAR ?? null)).catch(() => setZar(null));
  }, []);
  const monthlyZar = zar ? (9 * zar).toFixed(2) : null;
  const annualZar = zar ? (90 * zar).toFixed(2) : null;
  
  const handleSubscribe = (plan: 'monthly' | 'annual') => {
    // Redirect to subscription endpoint
    window.location.href = `/api/subscribe/${plan}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">Pricing</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-foreground/15 p-6">
          <div className="text-xl font-medium">Free</div>
          <ul className="mt-3 text-sm text-foreground/80 list-disc list-inside">
            <li>3 documents/month</li>
            <li>Optional account for cloud storage</li>
            <li>No branding or watermarks</li>
          </ul>
          <div className="mt-6">
            <Link href="/upload" className="inline-flex items-center rounded-md px-5 py-3 border border-foreground/20 hover:bg-foreground/5 transition">Try Free</Link>
          </div>
        </div>
        <div className="rounded-lg border border-foreground/15 p-6">
          <div className="text-xl font-medium">Pro</div>
          <div className="text-3xl font-semibold mt-1">€9<span className="text-base font-normal">/mo</span></div>
          <div className="text-sm text-foreground/60">or €90/year</div>
          {zar && (
            <div className="text-xs text-foreground/60 mt-1">Approx. ZAR {monthlyZar} /mo • ZAR {annualZar} /yr</div>
          )}
          <ul className="mt-3 text-sm text-foreground/80 list-disc list-inside">
            <li>Unlimited cloud storage</li>
            <li>Unlimited signing</li>
            <li>Priority support</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <button 
              onClick={() => handleSubscribe('monthly')}
              className="inline-flex items-center rounded-md px-5 py-3 bg-[color:var(--color-accent)] text-white hover:opacity-90 transition"
            >
              Go Pro Monthly
            </button>
            <button 
              onClick={() => handleSubscribe('annual')}
              className="inline-flex items-center rounded-md px-5 py-3 border border-foreground/20 hover:bg-foreground/5 transition"
            >
              Go Pro Annual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


