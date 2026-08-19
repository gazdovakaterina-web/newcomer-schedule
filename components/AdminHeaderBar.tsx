"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { LogOut } from "lucide-react";

export default function AdminHeaderBar({
  title,
  backHref,
}: {
  title: string;
  backHref?: string;
}) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="text-sm text-teal hover:underline mb-1 inline-block"
          >
            ← Back
          </Link>
        )}
        <h1 className="text-2xl font-medium text-dark-teal">{title}</h1>
      </div>
      <button
        onClick={handleSignOut}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-dark-teal/70 hover:text-dark-teal transition"
      >
        <LogOut className="w-4 h-4" strokeWidth={2} />
        Sign out
      </button>
    </div>
  );
}
