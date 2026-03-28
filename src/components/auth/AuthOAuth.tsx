"use client";

import { signIn } from "next-auth/react";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

type AuthOAuthDividerProps = {
  label: string;
};

export function AuthOAuthDivider({ label }: AuthOAuthDividerProps) {
  return (
    <div className="relative flex items-center py-4">
      <div className="grow border-t border-nq-outline-variant/30" />
      <span className="shrink mx-4 text-xs font-nq-label text-nq-outline uppercase tracking-widest">
        {label}
      </span>
      <div className="grow border-t border-nq-outline-variant/30" />
    </div>
  );
}

export function AuthOAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        className="group flex items-center justify-center gap-3 h-12 rounded-xl bg-nq-surface-container-low border border-nq-outline-variant/15 hover:bg-nq-surface-container-high transition-colors"
        onClick={() => signIn("google")}
      >
        <FcGoogle className="w-4 h-4 shrink-0 opacity-90" aria-hidden />
        <span className="text-sm font-medium">Google</span>
      </button>
      <button
        type="button"
        className="flex items-center justify-center gap-3 h-12 rounded-xl bg-nq-surface-container-low border border-nq-outline-variant/15 hover:bg-nq-surface-container-high transition-colors"
        onClick={() => signIn("apple")}
      >
        <FaApple className="w-4 h-4 shrink-0 opacity-90" aria-hidden />
        <span className="text-sm font-medium">Apple</span>
      </button>
    </div>
  );
}
