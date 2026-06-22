"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import ContentManager from "@/components/admin/ContentManager";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Toaster from "@/components/admin/Toaster";
import { toast } from "@/components/admin/toast";

type Conversation = {
  id: string;
  visitor_name: string;
  visitor_email: string | null;
  status: string;
  created_at: string;
};

type Message = {
  id: string;
  conversation_id: string;
  sender_type: "visitor" | "admin";
  content: string;
  created_at: string;
};

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const CANNED_STORAGE_KEY = "zorox_canned_replies";

export default function AdminPage() {
  const supabase = createClient();
  const [session, setSession] = useState<any>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [visitorTyping, setVisitorTyping] = useState(false);
  const [search, setSearch] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showCanned, setShowCanned] = useState(false);
  const [tab, setTab] = useState<"chats" | "services" | "experience" | "skills" | "portfolio" | "testimonials" | "blog">("chats");
  const [cannedReplies, setCannedReplies] = useState<string[]>([]);
  const channelRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(undefined);
  const lastTypingBroadcast = useRef(0);
  const unreadRef = useRef<Set<string>>(new Set());
  const channelKeyRef = useRef(0);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(CANNED_STORAGE_KEY);
    if (stored) {
      try { setCannedReplies(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  function saveCannedReplies(replies: string[]) {
    setCannedReplies(replies);
    localStorage.setItem(CANNED_STORAGE_KEY, JSON.stringify(replies));
  }

  function addCannedReply(text: string) {
    if (!text.trim()) return;
    saveCannedReplies([...cannedReplies, text.trim()]);
  }

  function removeCannedReply(index: number) {
    const next = cannedReplies.filter((_, i) => i !== index);
    saveCannedReplies(next);
  }

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s) {
        setSession(s);
        setAdminEmail(s.user?.email || "Admin");
      }
    });
  }, []);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await (authMode === "login"
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password }));
    if (error) {
      toast(error.message, "error");
    } else if (data.session) {
      setSession(data.session);
      setAdminEmail(data.session.user?.email || "Admin");
      toast("Signed in successfully", "success");
    } else {
      toast("Check your email for the confirmation link.", "info");
    }
    setLoading(false);
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setConversations([]);
    setSelected(null);
    setAdminEmail("");
  }

  useEffect(() => {
    if (!session || !supabase) return;
    loadConversations();
  }, [session]);

  async function loadConversations() {
    if (!supabase) return;
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setConversations(data);
  }

  useEffect(() => {
    if (!selected || !supabase) return;

    channelKeyRef.current += 1;
    const key = channelKeyRef.current;

    unreadRef.current.delete(selected);
    forceUpdate((n) => n + 1);

    loadMessages(selected);

    const channel = supabase.channel(`chat:${selected}:${key}`);

    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${selected}` },
      (payload) => {
        const m = payload.new as Message;
        setMessages((prev) => {
          if (prev.some((p) => p.id === m.id)) return prev;
          return [...prev, m];
        });
      },
    );

    channel.on("broadcast", { event: "typing" }, ({ payload: p }: any) => {
      if (p.role === "visitor") {
        setVisitorTyping(p.isTyping);
      }
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ role: "admin", email: adminEmail });
      }
    });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
      setVisitorTyping(false);
    };
  }, [selected]);

  useEffect(() => {
    if (!session || !supabase) return;
    const channel = supabase
      .channel("admin-conversations")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversations" }, () => {
        loadConversations();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload: any) => {
        loadConversations();
        const cid = payload.new.conversation_id as string;
        if (cid !== selected) {
          unreadRef.current.add(cid);
          forceUpdate((n) => n + 1);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session, selected]);

  async function loadMessages(cid: string) {
    if (!supabase) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", cid)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  }

  async function updateConversationStatus(cid: string, status: string) {
    if (!supabase) return;
    await supabase.from("conversations").update({ status }).eq("id", cid);
    setConversations((prev) =>
      prev.map((c) => (c.id === cid ? { ...c, status } : c)),
    );
  }

  async function deleteConversation(cid: string) {
    if (!supabase) return;
    await updateConversationStatus(cid, "deleted");
    setConfirmDeleteId(null);
    setSelected(null);
    toast("Conversation deleted", "success");
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || !selected || !supabase) return;
    const content = reply.trim();
    setReply("");
    stopTyping();
    await supabase.from("messages").insert({
      conversation_id: selected,
      sender_type: "admin",
      content,
    });
  }

  function handleTyping() {
    const now = Date.now();
    if (now - lastTypingBroadcast.current > 1000) {
      lastTypingBroadcast.current = now;
      channelRef.current?.send({ type: "broadcast", event: "typing", payload: { role: "admin", isTyping: true } });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      channelRef.current?.send({ type: "broadcast", event: "typing", payload: { role: "admin", isTyping: false } });
    }, 2000);
  }

  function stopTyping() {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    channelRef.current?.send({ type: "broadcast", event: "typing", payload: { role: "admin", isTyping: false } });
  }

  const filteredConversations = conversations.filter((c) => {
    if (c.status === "deleted" && !showDeleted) return false;
    return c.visitor_name.toLowerCase().includes(search.toLowerCase());
  });

  const selectedConv = conversations.find((c) => c.id === selected);

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zorox-bg p-4">
        <p className="text-sm text-zorox-text">Waiting for database connection...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zorox-bg p-4">
        <form onSubmit={handleAuth} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
          <h4 className="mb-2 text-center">Admin Login</h4>
          <p className="mb-6 text-center text-sm text-zorox-text">
            {authMode === "login" ? "Sign in to manage chats" : "Create an admin account"}
          </p>
          <div className="space-y-4">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-zorox-accent"
            />
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-zorox-accent"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-zorox-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-zorox-accent/90 disabled:opacity-50"
            >
              {loading ? "Please wait..." : authMode === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-zorox-text">
            {authMode === "login" ? (
              <>No account? <button type="button" onClick={() => setAuthMode("signup")} className="text-zorox-accent underline">Sign up</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => setAuthMode("login")} className="text-zorox-accent underline">Sign in</button></>
            )}
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zorox-bg">
      <div className="flex w-64 flex-col bg-zorox-secondary">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h5 className="text-sm font-bold uppercase tracking-wide text-white">Admin Panel</h5>
          <button onClick={signOut} className="text-xs text-white/50 underline hover:text-zorox-accent">Sign out</button>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {[
            { key: "chats", label: "Chats", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
            { key: "services", label: "Services", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
            { key: "experience", label: "Experience", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
            { key: "skills", label: "Skills", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
            { key: "portfolio", label: "Portfolio", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
            { key: "testimonials", label: "Testimonials", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8 0-3.5-2-6-5-6-2.5 0-4 1.5-4 4 0 2 1 3 2 3 1 0 .5-2 1-3 .5-1 1.5-1 2-1 .5 0 1 .5 1 1 0 1-1 3-2 4-1 1-2 2-2 3v2z"/><path d="M15 21c3 0 7-1 7-8 0-3.5-2-6-5-6-2.5 0-4 1.5-4 4 0 2 1 3 2 3 1 0 .5-2 1-3 .5-1 1.5-1 2-1 .5 0 1 .5 1 1 0 1-1 3-2 4-1 1-2 2-2 3v2z"/></svg> },
            { key: "blog", label: "Blog", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                tab === key
                  ? "bg-zorox-accent text-white shadow-md"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="shrink-0">{icon}</span>
              <span>{label}</span>
              {key === "chats" && conversations.filter((c) => c.status !== "deleted").length > 0 && (
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  tab === "chats" ? "bg-white/20 text-white" : "bg-zorox-accent/30 text-white"
                }`}>
                  {conversations.filter((c) => c.status !== "deleted").length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-1 flex-col">
        {tab === "chats" ? (
          !selected ? (
            <>
              <div className="flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-4">
                <h5 className="text-sm font-bold uppercase tracking-wide text-zorox-secondary">Conversations</h5>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="max-w-xs flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-zorox-accent"
                />
                <label className="flex cursor-pointer items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={showDeleted}
                    onChange={(e) => setShowDeleted(e.target.checked)}
                    className="h-3 w-3 accent-zorox-accent"
                  />
                  <span className="text-[10px] text-zorox-text/50">Show deleted</span>
                </label>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 && (
                  <p className="p-6 text-sm text-zorox-text">
                    {search ? "No matching conversations." : "No conversations yet."}
                  </p>
                )}
                {filteredConversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c.id)}
                    className="flex w-full items-center justify-between border-b border-gray-50 px-6 py-4 text-left transition-colors hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zorox-secondary">{c.visitor_name}</p>
                      <p className="mt-0.5 text-xs text-zorox-text">{c.visitor_email || "No email"}</p>
                      <p className="mt-1 text-xs text-zorox-text/60">{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.status === "resolved" && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] text-green-700">Done</span>
                      )}
                      {unreadRef.current.has(c.id) && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zorox-accent text-[10px] font-bold text-white">!</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
          <>
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-zorox-secondary">{selectedConv?.visitor_name}</p>
                <p className="text-xs text-zorox-text/60">{selectedConv?.visitor_email || "No email"}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => selected && setConfirmDeleteId(selected)}
                  className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                  title="Delete conversation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (!selected) return;
                    updateConversationStatus(selected, selectedConv?.status === "resolved" ? "active" : "resolved");
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    selectedConv?.status === "resolved"
                      ? "bg-zorox-primary/30 text-zorox-secondary hover:bg-zorox-primary/50"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {selectedConv?.status === "resolved" ? "Reopen" : "Resolve"}
                </button>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-6">
              {messages.map((m) => (
                <div key={m.id}>
                  <div className={`flex ${m.sender_type === "admin" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.sender_type === "admin"
                          ? "rounded-br-md bg-zorox-secondary text-white"
                          : "rounded-bl-md bg-white text-zorox-text shadow-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                  <p className={`mt-0.5 text-[10px] text-zorox-text/40 ${m.sender_type === "admin" ? "text-right" : "text-left"}`}>
                    {timeAgo(m.created_at)}
                  </p>
                </div>
              ))}
              {visitorTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
                    <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                  </div>
                </div>
              )}
            </div>
            {showCanned && cannedReplies.length > 0 && (
              <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-zorox-text">Saved Replies</p>
                  <button onClick={() => setShowCanned(false)} className="text-xs text-zorox-text/60 hover:text-zorox-accent">Close</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cannedReplies.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => { setReply(r); setShowCanned(false); }}
                      className="group relative max-w-[200px] truncate rounded-lg bg-white px-3 py-1.5 text-xs text-zorox-text shadow-sm transition-colors hover:bg-zorox-primary/20"
                      title={r}
                    >
                      {r.length > 30 ? r.slice(0, 30) + "…" : r}
                      <span
                        onClick={(e) => { e.stopPropagation(); removeCannedReply(i); }}
                        className="ml-1.5 text-zorox-text/30 hover:text-red-500"
                      >
                        ✕
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <form onSubmit={sendReply} className="flex gap-3 border-t border-gray-200 bg-white p-4">
              <input
                value={reply}
                onChange={(e) => { setReply(e.target.value); handleTyping(); }}
                onBlur={stopTyping}
                placeholder="Type your reply..."
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-zorox-accent"
              />
              <button
                type="button"
                onClick={() => setShowCanned(!showCanned)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm text-zorox-text transition-colors hover:bg-gray-200"
                title="Saved replies"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </button>
              <button
                type="submit"
                disabled={!reply.trim()}
                className="rounded-full bg-zorox-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zorox-accent/90 disabled:opacity-40"
              >
                Send
              </button>
            </form>
            {reply.trim() && (
              <div className="border-t border-gray-100 bg-white px-4 pb-3 pt-1">
                <button
                  type="button"
                  onClick={() => addCannedReply(reply.trim())}
                  className="text-xs text-zorox-text/50 underline hover:text-zorox-accent"
                >
                  + Save as canned reply
                </button>
              </div>
            )}
            <ConfirmModal
              open={!!confirmDeleteId}
              title="Delete conversation"
              message="Are you sure you want to delete this conversation? It will be hidden from the list."
              confirmLabel="Delete"
              onConfirm={() => confirmDeleteId && deleteConversation(confirmDeleteId)}
              onCancel={() => setConfirmDeleteId(null)}
            />
          </>
        )
      ) : (
        (() => {
          const configs: Record<string, { title: string; table: string; fields: any[]; orderBy: string }> = {
            services: { title: "Service", table: "services", fields: [{name:"title",label:"Title",type:"text",required:true},{name:"description",label:"Description",type:"textarea",required:true},{name:"icon",label:"Icon path",type:"text",placeholder:"/icon-xyz.png"},{name:"sort_order",label:"Order",type:"number"}], orderBy: "sort_order" },
            experience: { title: "Experience", table: "experience_items", fields: [{name:"period",label:"Period",type:"text",required:true,placeholder:"2014-2016"},{name:"title",label:"Title",type:"text",required:true},{name:"description",label:"Description",type:"textarea",required:true},{name:"sort_order",label:"Order",type:"number"}], orderBy: "sort_order" },
            skills: { title: "Skill", table: "skills", fields: [{name:"label",label:"Skill name",type:"text",required:true},{name:"percentage",label:"Percentage",type:"number",required:true},{name:"sort_order",label:"Order",type:"number"}], orderBy: "sort_order" },
            portfolio: { title: "Portfolio item", table: "portfolio_items", fields: [{name:"title",label:"Title",type:"text",required:true},{name:"img",label:"Image",type:"image"},{name:"description",label:"Description",type:"textarea",placeholder:"Project overview"},{name:"client",label:"Client",type:"text",placeholder:"Client name"},{name:"year",label:"Year",type:"text",placeholder:"2024"},{name:"sort_order",label:"Order",type:"number"}], orderBy: "sort_order" },
            testimonials: { title: "Testimonial", table: "testimonials", fields: [{name:"name",label:"Client name",type:"text",required:true},{name:"quote",label:"Quote",type:"textarea",required:true},{name:"img",label:"Image",type:"image"},{name:"sort_order",label:"Order",type:"number"}], orderBy: "sort_order" },
            blog: { title: "Blog post", table: "blog_posts", fields: [{name:"title",label:"Title",type:"text",required:true},{name:"excerpt",label:"Excerpt",type:"textarea",required:true},{name:"img",label:"Image",type:"image"},{name:"sort_order",label:"Order",type:"number"}], orderBy: "sort_order" },
          };
          const c = configs[tab];
          return c ? <ContentManager title={c.title} table={c.table} fields={c.fields} orderBy={c.orderBy} /> : null;
        })()
      )}
        <Toaster />
      </div>
    </div>
  );
}
