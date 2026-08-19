"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewScheduleForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const finalSlug = slug || slugify(name);

    const { data, error } = await supabase
      .from("schedules")
      .insert({ name, slug: finalSlug, status: "draft" })
      .select("id")
      .single();

    setSubmitting(false);

    if (error) {
      setError(
        error.code === "23505"
          ? `The URL "/schedule/${finalSlug}" is already in use — try a different name or set a custom URL.`
          : error.message
      );
      return;
    }

    router.push(`/admin/schedules/${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-dark-teal/80">Schedule name</span>
        <input
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          placeholder="e.g. Sales Newcomer – Standard"
          className="mt-1 w-full rounded-lg border border-dark-teal/15 px-3 py-2 text-dark-teal focus:border-teal outline-none"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-dark-teal/80">Public URL</span>
        <div className="mt-1 flex items-center rounded-lg border border-dark-teal/15 focus-within:border-teal overflow-hidden">
          <span className="pl-3 text-dark-teal/40 text-sm">/schedule/</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            placeholder="sales-newcomer"
            className="flex-1 px-2 py-2 text-dark-teal outline-none"
          />
        </div>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !name}
        className="rounded-full bg-lime text-dark-teal font-medium px-5 py-2.5 hover:brightness-95 transition disabled:opacity-50"
      >
        {submitting ? "Creating…" : "Create schedule"}
      </button>
    </form>
  );
}
