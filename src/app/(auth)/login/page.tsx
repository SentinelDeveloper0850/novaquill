"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { track } from "@/lib/track";
import AuthShell from "@/components/auth/AuthShell";
import { AuthOAuthButtons, AuthOAuthDivider } from "@/components/auth/AuthOAuth";
import { AuthLegalFooter } from "@/components/auth/AuthLegalFooter";
import { authFieldIconClass, authInputClass, authLabelClass } from "@/components/auth/field-classes";
import { MdArrowForward, MdLock, MdMail } from "react-icons/md";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", { redirect: false, email, password });
    if (res?.error) {
      setError("Invalid credentials");
      return;
    }
    track("signup_login");
    router.push(next || "/dashboard");
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your workspace and pick up where you left off."
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
          <div className="group">
            <label className={authLabelClass} htmlFor="login-email">
              Email Address
            </label>
            <div className="relative">
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={authInputClass}
                required
              />
              <MdMail className={authFieldIconClass} aria-hidden />
            </div>
          </div>
          <div className="group">
            <label className={authLabelClass} htmlFor="login-password">
              Security Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                name="password"
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
            Sign In
            <MdArrowForward className="w-6 h-6 shrink-0" aria-hidden />
          </button>
        </div>
      </form>

      <AuthOAuthDivider label="Or continue with" />
      <AuthOAuthButtons />

      <p className="text-center text-sm text-nq-on-surface-variant">
        New to NovaQuill?
        <Link
          className="text-nq-primary font-semibold hover:underline decoration-nq-primary/30 underline-offset-4 ml-1"
          href="/register"
        >
          Create an account
        </Link>
      </p>

      <AuthLegalFooter variant="login" />
    </AuthShell>
  );
}

function LoginFallback() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your workspace and pick up where you left off.">
      <div className="animate-pulse space-y-4">
        <div className="h-14 bg-nq-surface-container-highest rounded-xl" />
        <div className="h-14 bg-nq-surface-container-highest rounded-xl" />
        <div className="h-14 bg-nq-surface-container-highest rounded-xl opacity-80" />
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
