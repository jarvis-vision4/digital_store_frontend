"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Headset } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { connectChatSocket, disconnectChatSocket } from "@/lib/socket";
import * as chatApi from "@/lib/api/chat";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

export function ChatWidget() {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unread, setUnread] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  openRef.current = open;

  const isCustomer = isAuthenticated && user?.role === "CUSTOMER";

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const [history, unreadRes] = await Promise.all([
        chatApi.getMyChatMessages(),
        chatApi.getMyChatUnread(),
      ]);
      setMessages(history);
      setUnread(unreadRes.unread);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isCustomer) {
      disconnectChatSocket();
      return;
    }
    const socket = connectChatSocket();
    if (!socket.connected) socket.connect();
    loadHistory();

    const onMessage = (msg: ChatMessage) => {
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
      if (msg.senderRole !== "CUSTOMER" && !openRef.current) {
        setUnread((u) => u + 1);
      }
    };
    const onUnread = (data: { unread: number }) => setUnread(data.unread);

    socket.on("chat:message", onMessage);
    socket.on("chat:unread", onUnread);
    return () => {
      socket.off("chat:message", onMessage);
      socket.off("chat:unread", onUnread);
    };
  }, [isCustomer, loadHistory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleOpen = () => {
    setOpen((prev) => {
      if (!prev) {
        setUnread(0);
        const socket = connectChatSocket();
        socket.emit("chat:read");
        chatApi.markMyChatRead().catch(() => undefined);
      }
      return !prev;
    });
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    try {
      const socket = connectChatSocket();
      socket.emit("chat:send", { content }, (res: { event: string; data?: ChatMessage } | undefined) => {
        if (res?.event === "ok" && res.data) {
          setMessages((prev) =>
            prev.some((m) => m.id === res.data!.id) ? prev : [...prev, res.data!],
          );
        }
      });
      setInput("");
    } finally {
      setSending(false);
    }
  };

  if (!isCustomer) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={open ? "Close support chat" : "Open support chat"}
        className={cn(
          "fixed right-4 bottom-20 md:bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground shadow-brand transition-transform hover:scale-105",
          open && "scale-0 opacity-0 pointer-events-none",
        )}
      >
        <MessageCircle className="h-6 w-6" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed right-4 bottom-20 md:bottom-6 z-40 flex h-[520px] max-h-[75vh] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between gap-2 border-b border-border bg-brand-gradient px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
                <Headset className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Support Chat</p>
                <p className="text-[11px] opacity-90">We usually reply within a few minutes</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 transition-colors hover:bg-primary-foreground/15"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/40">
            {loading ? (
              <p className="text-center text-xs text-muted-foreground py-8">Loading...</p>
            ) : messages.length === 0 ? (
              <div className="text-center py-10">
                <Headset className="mx-auto h-10 w-10 text-primary/50" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Hi {user?.username}! Ask us anything about your orders or products.
                </p>
              </div>
            ) : (
              messages.map((m) => {
                const isMine = m.senderRole === "CUSTOMER";
                return (
                  <div key={m.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm break-words",
                        isMine
                          ? "bg-brand-gradient text-primary-foreground rounded-br-sm"
                          : "bg-card border border-border text-foreground rounded-bl-sm",
                      )}
                    >
                      <p>{m.content}</p>
                      <p
                        className={cn(
                          "mt-1 text-[10px]",
                          isMine ? "text-primary-foreground/70" : "text-muted-foreground",
                        )}
                      >
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex items-center gap-2 border-t border-border p-3 bg-background">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              aria-label="Chat message"
              className="flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || sending}
              aria-label="Send message"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground shadow-brand transition-colors hover:brightness-105 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
