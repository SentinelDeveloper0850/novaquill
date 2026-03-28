"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MdEditNote, MdMenu, MdPayments } from "react-icons/md";

const linkBase =
  "text-nq-on-surface/70 hover:bg-nq-surface-container-highest transition-colors px-3 py-1 rounded-lg text-sm font-nq-headline";
const linkActive = "text-nq-primary font-bold font-nq-headline text-sm tracking-wide";

export default function LandingNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-nq-background shadow-[0_12px_32px_rgba(250,253,252,0.06)] h-16 flex justify-between items-center px-6">
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <MdEditNote className="w-7 h-7 text-nq-primary shrink-0" aria-hidden />
        <span className="font-nq-headline font-extrabold tracking-tight text-nq-on-surface text-xl">
          NovaQuill
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link href="/" className={pathname === "/" ? linkActive : linkBase}>
          Home
        </Link>
        <Link href="/dashboard" className={pathname === "/dashboard" ? linkActive : linkBase}>
          Dashboard
        </Link>
        <Link href="/pricing" className={pathname === "/pricing" ? linkActive : linkBase}>
          Settings
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/pricing"
          className="text-nq-primary active:scale-95 duration-200 p-1 rounded-lg hover:bg-nq-surface-container-high transition-colors"
          aria-label="Plans and billing"
        >
          <MdPayments className="w-6 h-6" aria-hidden />
        </Link>
        <button
          type="button"
          className="md:hidden text-nq-on-surface p-1 rounded-lg hover:bg-nq-surface-container-high transition-colors"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <MdMenu className="w-6 h-6" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 border-b border-nq-outline-variant/15 bg-nq-background/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-2 shadow-lg">
          <Link
            href="/"
            className={pathname === "/" ? linkActive : linkBase}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={pathname === "/dashboard" ? linkActive : linkBase}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className={pathname === "/pricing" ? linkActive : linkBase}
            onClick={() => setMenuOpen(false)}
          >
            Settings
          </Link>
        </div>
      )}
    </nav>
  );
}
