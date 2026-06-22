"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "./ImageUpload";
import ConfirmModal from "./ConfirmModal";
import { toast } from "./toast";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "image";
  required?: boolean;
  placeholder?: string;
};

type Props = {
  title: string;
  table: string;
  fields: FieldConfig[];
  orderBy: string;
};

function itemTitle(item: any, fields: FieldConfig[]): string {
  for (const f of fields) {
    if (f.type === "number") continue;
    const val = item[f.name];
    if (val && typeof val === "string" && val.trim()) return val.trim();
  }
  return "Untitled";
}

function itemSubtitle(item: any, fields: FieldConfig[]): string {
  let found = false;
  for (const f of fields) {
    if (!found) { found = true; continue; }
    const val = item[f.name];
    if (val && typeof val === "string" && val.trim()) return val.trim();
    if (typeof val === "number") return String(val);
  }
  return "";
}

export default function ContentManager({ title, table, fields, orderBy }: Props) {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<string | null>(null);

  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from(table).select("*").order(orderBy);
    if (data) setItems(data);
    setLoading(false);
  }

  function resetForm() {
    setEditing(null);
    const initial: Record<string, any> = {};
    fields.forEach((f) => { initial[f.name] = f.type === "number" ? 0 : ""; });
    setForm(initial);
  }

  function startEdit(item: any) {
    setEditing(item);
    const values: Record<string, any> = {};
    fields.forEach((f) => { values[f.name] = item[f.name] ?? ""; });
    setForm(values);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);

    const payload: Record<string, any> = {};
    fields.forEach((f) => {
      const val = form[f.name];
      payload[f.name] = f.type === "number" ? Number(val) : (typeof val === "string" ? val.trim() : val);
    });

    if (editing) {
      await supabase.from(table).update(payload).eq("id", editing.id);
    } else {
      await supabase.from(table).insert(payload);
    }

    resetForm();
    await loadItems();
    setSaving(false);
  }

  async function remove(id: string) {
    if (!supabase) return;
    setConfirm(null);
    await supabase.from(table).delete().eq("id", id);
    await loadItems();
    toast("Item deleted successfully", "success");
  }

  function handleFieldChange(name: string, value: any) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h5 className="text-sm">{editing ? `Edit ${title}` : `Add ${title}`}</h5>
      </div>
      <form onSubmit={save} className="space-y-3 border-b border-gray-100 bg-white px-6 py-4">
        <div className="flex flex-wrap gap-3">
          {fields.map((f) => (
            f.type === "textarea" ? (
              <textarea
                key={f.name}
                required={f.required}
                value={form[f.name] ?? ""}
                onChange={(e) => handleFieldChange(f.name, e.target.value)}
                placeholder={f.placeholder || f.label}
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-zorox-accent"
              />
            ) : f.type === "image" ? (
              <div key={f.name} className="w-full">
                <label className="mb-1 block text-xs text-zorox-text/60">{f.label}</label>
                <ImageUpload
                  value={form[f.name] ?? ""}
                  onChange={(url) => handleFieldChange(f.name, url)}
                />
              </div>
            ) : (
              <input
                key={f.name}
                required={f.required}
                type={f.type === "number" ? "number" : "text"}
                value={form[f.name] ?? ""}
                onChange={(e) => handleFieldChange(f.name, f.type === "number" ? Number(e.target.value) : e.target.value)}
                placeholder={f.placeholder || f.label}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-zorox-accent"
              />
            )
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-zorox-accent px-5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zorox-accent/90 disabled:opacity-40"
          >
            {saving ? "Saving..." : editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button type="button" onClick={resetForm} className="rounded-full bg-gray-100 px-5 py-1.5 text-xs font-semibold text-zorox-text transition-colors hover:bg-gray-200">
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="p-6 text-sm text-zorox-text">Loading...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-zorox-text">No items yet.</p>
        ) : (
          <div className="space-y-1 p-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
                {fields.find((f) => f.type === "image") && item[fields.find((f) => f.type === "image")!.name] && (
                  <img
                    src={item[fields.find((f) => f.type === "image")!.name]}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zorox-secondary truncate">
                    {itemTitle(item, fields)}
                  </p>
                  {itemSubtitle(item, fields) && (
                    <p className="truncate text-xs text-zorox-text/60">{itemSubtitle(item, fields)}</p>
                  )}
                </div>
                <button onClick={() => startEdit(item)} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-zorox-text transition-colors hover:bg-gray-200">
                  Edit
                </button>
                <button onClick={() => setConfirm(item.id)} className="rounded-full bg-red-50 px-3 py-1 text-xs text-red-600 transition-colors hover:bg-red-100">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmModal
        open={!!confirm}
        title="Delete item"
        message="Are you sure you want to delete this item? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => confirm && remove(confirm)}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
