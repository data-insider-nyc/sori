"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
      setLoading(false);
      if (error || !data) {
        console.error(error);
        router.replace("/auth/login");
        return;
      }
      setTitle(data.title || "");
      setContent(data.content || "");
    })();
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const { error } = await supabase.from("posts").update({ title: title || null, content }).eq("id", id);
    setSaving(false);
    if (error) {
      console.error(error);
      setError("Failed to save");
      return;
    }
    router.push(`/community/${id}`);
  }

  if (loading) return <div className="p-8">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-xl font-bold mb-4">Edit post</h1>
      <form onSubmit={handleSave} className="space-y-4 bg-white p-6 rounded-xl border border-gray-100">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="input-field"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something…"
          rows={6}
          className="input-field"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="btn-coral">
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/community/${id}`)}
            className="btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
