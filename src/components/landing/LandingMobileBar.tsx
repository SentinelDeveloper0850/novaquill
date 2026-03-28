"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MdDashboard, MdHome, MdSettings } from "react-icons/md";

export default function LandingMobileBar() {
  const pathname = usePathname();

  const item = (href: string, label: string, icon: ReactNode, active: boolean) => (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center rounded-xl px-4 py-1 active:scale-90 duration-150 ${
        active
          ? "bg-gradient-to-br from-cyan-400 to-cyan-600 text-nq-background"
          : "text-nq-on-surface/60 hover:text-nq-primary transition-all"
      }`}
    >
      {icon}
      <span className="font-nq-body font-medium text-[10px] uppercase tracking-wider">{label}</span>
    </Link>
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-nq-background/80 backdrop-blur-xl border-t border-nq-on-surface/15 flex justify-around items-center pt-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] rounded-t-2xl">
      {item("/", "Home", <MdHome className="w-6 h-6" aria-hidden />, pathname === "/")}
      {item(
        "/dashboard",
        "Dashboard",
        <MdDashboard className="w-6 h-6" aria-hidden />,
        pathname === "/dashboard",
      )}
      {item(
        "/pricing",
        "Settings",
        <MdSettings className="w-6 h-6" aria-hidden />,
        pathname === "/pricing",
      )}
    </nav>
  );
}
