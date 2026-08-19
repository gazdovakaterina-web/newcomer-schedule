import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

/**
 * Server-side Supabase client for public (anon) reads. Safe to use the anon
 * key here — RLS policies (see supabase/schema.sql) restrict reads to
 * published schedules only, so there's nothing this client can see that a
 * newcomer with the public link shouldn't already see.
 *
 * This does NOT handle auth/session — the admin side (Phase 3) will use a
 * separate client from @supabase/ssr that's aware of the logged-in user.
 */
export function getSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example)."
    );
  }

  if (!cachedClient) {
    cachedClient = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }

  return cachedClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
