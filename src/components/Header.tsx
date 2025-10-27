"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[color:var(--color-accent)] rounded-lg flex items-center justify-center text-white font-bold text-lg">
          N
        </div>
        <span className="text-xl font-semibold">NovaQuill</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link className="hover:underline" href="/pricing">Pricing</Link>
        <Link className="hover:underline" href="/dashboard">Dashboard</Link>
      </nav>
    </header>
  );
}


