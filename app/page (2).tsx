"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError("Incorrect email or password.");
      return;
    }

    const next = searchParams.get("next") || "/admin";
    router.push(next);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-sand flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-card shadow-card p-8"
      >
        <div className="text-xs font-semibold tracking-[0.2em] uppercase text-teal mb-1">
          Newcomer Training
        </div>
        <h1 className="text-2xl font-medium text-dark-teal mb-6">Admin sign in</h1>

        <label className="block mb-4">
          <span className="text-sm font-medium text-dark-teal/80">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-dark-teal/15 px-3 py-2 text-dark-teal focus:border-teal outline-none"
            autoComplete="email"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium text-dark-teal/80">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-dark-teal/15 px-3 py-2 text-dark-teal focus:border-teal outline-none"
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-dark-teal text-white font-medium py-2.5 hover:brightness-110 transition disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
