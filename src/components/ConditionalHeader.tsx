"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

const HIDDEN_PREFIXES = ["/login", "/register"];

export default function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  const hide = HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (hide) return null;
  return <Header />;
}
