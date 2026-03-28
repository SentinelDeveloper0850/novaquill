"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@/lib/track";
import AuthShell from "@/components/auth/AuthShell";
import { AuthOAuthButtons, AuthOAuthDivider } from "@/components/auth/AuthOAuth";
import { AuthLegalFooter } from "@/components/auth/AuthLegalFooter";
import { authFieldIconClass, authInputClass, authLabelClass } from "@/components/auth/field-classes";
import { MdArrowForward, MdLock, MdMail, MdPerson } from "react-icons/md";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "Registration failed");
      return;
    }
    track("signup_register");
    router.push("/login");
  }

  return (
    <AuthShell
      title="Create Account"
      subtitle="Join the elite network of digital professionals."
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
          <div className="group">
            <label className={authLabelClass} htmlFor="register-name">
              Full Name (Optional)
            </label>
            <div className="relative">
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={authInputClass}
              />
              <MdPerson className={authFieldIconClass} aria-hidden />
            </div>
          </div>
          <div className="group">
            <label className={authLabelClass} htmlFor="register-email">
              Email Address
            </label>
            <div className="relative">
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={authInputClass}
                required
              />
              <MdMail className={authFieldIconClass} aria-hidden />
            </div>
          </div>
          <div className="group">
            <label className={authLabelClass} htmlFor="register-password">
              Security Password
            </label>
            <div className="relative">
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={authInputClass}
                required
              />
              <MdLock className={authFieldIconClass} aria-hidden />
            </div>
          </div>
        </div>

        {error && (
          <div className="text-sm text-nq-error" role="alert">
            {error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className="nq-signature-gradient nq-primary-glow w-full h-14 rounded-xl font-nq-headline font-bold text-nq-on-primary-container flex items-center justify-center gap-2 transform active:scale-95 transition-all duration-200 shadow-lg"
          >
            Register Account
            <MdArrowForward className="w-6 h-6 shrink-0" aria-hidden />
          </button>
        </div>
      </form>

      <AuthOAuthDivider label="Or Secure Sign Up" />
      <AuthOAuthButtons />

      <p className="text-center text-sm text-nq-on-surface-variant">
        Already using NovaQuill?
        <Link
          className="text-nq-primary font-semibold hover:underline decoration-nq-primary/30 underline-offset-4 ml-1"
          href="/login"
        >
          Sign In
        </Link>
      </p>

      <AuthLegalFooter variant="register" />
    </AuthShell>
  );
}
