"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Stage = "trigger" | "form" | "chat";
type Message = { id: string; content: string; sender_type: "visitor" | "admin"; created_at: string };

export default function ChatWidget() {
  const [stage, setStage] = useState<Stage>("trigger");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminTyping, setAdminTyping] = useState(false);
  const [presenceLog, setPresenceLog] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(undefined);
  const lastTypingBroadcast = useRef(0);
  const channelKeyRef = useRef(0);
  const supabase = createClient();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, presenceLog]);

  useEffect(() => {
    if (!supabase || !conversationId) return;

    channelKeyRef.current += 1;
    const key = channelKeyRef.current;

    const channel = supabase.channel(`chat:${conversationId}:${key}`);

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        const m = payload.new as Message;
        setMessages((prev) => {
          if (prev.some((p) => p.id === m.id)) return prev;
          return [...prev, m];
        });
      },
    );

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const admins = Object.values(state)
        .flat()
        .filter((p: any) => p.role === "admin") as any[];
      setAdminOnline(admins.length > 0);
      if (admins.length > 0) {
        setAdminName(admins[0].email || "Admin");
      }
    });

    channel.on("presence", { event: "join" }, ({ newPresences }: any) => {
      const admin = newPresences.find((p: any) => p.role === "admin");
      if (admin) {
        const label = admin.email || "Admin";
        setPresenceLog((prev) => [...prev.slice(-9), `${label} joined the chat`]);
      }
    });

    channel.on("presence", { event: "leave" }, ({ leftPresences }: any) => {
      const admin = leftPresences.find((p: any) => p.role === "admin");
      if (admin) {
        const label = admin.email || "Admin";
        setPresenceLog((prev) => [...prev.slice(-9), `${label} left the chat`]);
      }
    });

    channel.on("broadcast", { event: "typing" }, ({ payload: p }: any) => {
      if (p.role === "admin") {
        setAdminTyping(p.isTyping);
      }
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ role: "visitor", name });
      }
    });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [conversationId, supabase, name]);

  useEffect(() => {
    if (!supabase) return;
    const stored = localStorage.getItem("zorox_conversation_id");
    const storedName = localStorage.getItem("zorox_visitor_name");
    if (stored && storedName) {
      setConversationId(stored);
      setName(storedName);
      setStage("chat");
      loadMessages(stored);
    }
  }, []);

  async function loadMessages(cid: string) {
    if (!supabase) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", cid)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  }

  async function startChat(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !supabase) return;
    setLoading(true);

    let conv: any;

    if (email.trim()) {
      const { data: existing } = await supabase
        .from("conversations")
        .select("*")
        .eq("visitor_email", email.trim())
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);

      if (existing && existing.length > 0) {
        conv = existing[0];
      }
    }

    if (!conv) {
      const { data: created, error } = await supabase
        .from("conversations")
        .insert({ visitor_name: name.trim(), visitor_email: email.trim() || null, status: "active" })
        .select()
        .single();

      if (error || !created) {
        console.error(error);
        setLoading(false);
        return;
      }
      conv = created;

      const { data: welcome } = await supabase
        .from("messages")
        .insert({
          conversation_id: conv.id,
          sender_type: "admin",
          content: `Hi ${name.trim()}! Thanks for reaching out. How can I help you today?`,
        })
        .select()
        .single();

      if (welcome) setMessages([welcome]);
    } else {
      await loadMessages(conv.id);
    }

    localStorage.setItem("zorox_conversation_id", conv.id);
    localStorage.setItem("zorox_visitor_name", name.trim());
    setConversationId(conv.id);
    setStage("chat");
    setLoading(false);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !conversationId || !supabase) return;
    const content = input.trim();
    setInput("");
    stopTyping();

    const { data } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_type: "visitor", content })
      .select()
      .single();

    if (data) setMessages((prev) => [...prev, data]);
  }

  function handleTyping() {
    const now = Date.now();
    if (now - lastTypingBroadcast.current > 1000) {
      lastTypingBroadcast.current = now;
      channelRef.current?.send({ type: "broadcast", event: "typing", payload: { role: "visitor", isTyping: true } });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      channelRef.current?.send({ type: "broadcast", event: "typing", payload: { role: "visitor", isTyping: false } });
    }, 2000);
  }

  function stopTyping() {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    channelRef.current?.send({ type: "broadcast", event: "typing", payload: { role: "visitor", isTyping: false } });
  }

  const openChat = useCallback(() => setStage("form"), []);

  useEffect(() => {
    (window as any).__openChat = openChat;
    return () => { delete (window as any).__openChat; };
  }, [openChat]);

  if (!supabase) return null;

  if (stage === "trigger") {
    return (
      <button
        onClick={openChat}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-zorox-accent text-white shadow-lg transition-transform hover:scale-105"
        aria-label="Open chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[360px] max-w-[calc(100vw-2rem)]">
      <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-zorox-secondary px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-white">Chat with Zorox</p>
            {stage === "chat" && (
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-zorox-primary">{name}</p>
                {adminOnline && <span className="h-1.5 w-1.5 rounded-full bg-green-400" title="Admin online" />}
              </div>
            )}
          </div>
          <button
            onClick={() => setStage("trigger")}
            className="text-sm text-white/70 hover:text-white"
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {stage === "form" && (
          <form onSubmit={startChat} className="flex flex-col gap-4 p-6">
            <p className="text-sm text-zorox-text">
              Start a conversation — I typically reply within a few hours.
            </p>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-zorox-accent"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              type="email"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-zorox-accent"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-zorox-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zorox-accent/90 disabled:opacity-50"
            >
              {loading ? "Starting..." : "Start Chat"}
            </button>
          </form>
        )}

        {stage === "chat" && (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-5" style={{ maxHeight: 320 }}>
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_type === "visitor" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.sender_type === "visitor"
                        ? "rounded-br-md bg-zorox-primary text-zorox-secondary"
                        : "rounded-bl-md bg-gray-100 text-zorox-text"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {adminTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3">
                    <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                  </div>
                </div>
              )}
              {presenceLog.length > 0 && !adminTyping && (
                <div className="space-y-1">
                  {presenceLog.slice(-2).map((log, i) => (
                    <p key={i} className="text-center text-[10px] italic text-zorox-text/40">{log}</p>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={sendMessage} className="flex gap-3 border-t border-gray-100 p-4">
              <input
                value={input}
                onChange={(e) => { setInput(e.target.value); handleTyping(); }}
                onBlur={stopTyping}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-zorox-accent"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zorox-accent text-white disabled:opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
