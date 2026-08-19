import { createBrowserClient } from "@supabase/ssr";

/**
 * Auth-aware Supabase client for use in client components ("use client").
 * Unlike lib/supabase/client.ts (the public-read client), this one tracks
 * the logged-in admin's session via cookies, so RLS policies that check
 * is_admin() actually see who's asking.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
