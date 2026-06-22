"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "./toast";

type Props = {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
};

export default function ImageUpload({ value, onChange, bucket = "portfolio-images" }: Props) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setUploading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Upload error:", error);
      toast("Upload failed: " + error.message, "error");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(urlData.publicUrl);
    toast("Image uploaded successfully", "success");
    setUploading(false);
  }

  function handleUrlSubmit() {
    const url = urlInput.trim();
    if (!url) return;
    onChange(url);
    setUrlInput("");
    toast("Image link added", "success");
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="h-24 w-full rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-xs text-red-600 shadow hover:bg-white"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-zorox-text transition-colors hover:bg-gray-50 disabled:opacity-40"
        >
          {uploading ? "Uploading..." : "Upload from computer"}
        </button>
        <span className="text-xs text-zorox-text/40">or</span>
        <div className="flex flex-1 gap-1.5">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            placeholder="Paste image URL..."
            className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-zorox-accent"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-zorox-text transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
