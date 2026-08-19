import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Auth-aware Supabase client for use in server components, layouts, and
 * route handlers. Reads/writes the session via Next.js's cookie store, so
 * it sees the same logged-in admin the browser client and middleware do.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render, where cookies can't be
            // set. Safe to ignore as long as middleware.ts is also
            // refreshing the session on every request (it is).
          }
        },
      },
    }
  );
}
