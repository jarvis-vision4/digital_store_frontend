"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { connectChatSocket } from "@/lib/socket";
import * as chatApi from "@/lib/api/chat";
import type { AdminChatUser } from "@/lib/api/chat";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

export default function AdminChatPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminChatUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadUsers = useCallback(async () => {
    try {
      const list = await chatApi.getAdminChatUsers();
      setUsers(list);
    } catch {
      // ignore
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const loadMessages = useCallback(async (userId: number) => {
    setLoadingMessages(true);
    try {
      const history = await chatApi.getAdminChatMessages(userId);
      setMessages(history);
      chatApi.markAdminChatRead(userId).catch(() => undefined);
      const socket = connectChatSocket();
      socket.emit("admin:read", { userId });
    } catch {
      // ignore
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) return;
    loadUsers();
    const socket = connectChatSocket();
    if (!socket.connected) socket.connect();

    const onMessage = (msg: ChatMessage) => {
      setMessages((prev) =>
        selectedUserId !== null && msg.userId === selectedUserId
          ? prev.some((m) => m.id === msg.id)
            ? prev
            : [...prev, msg]
          : prev,
      );
      loadUsers();
    };
    const onRead = (data: { userId: number; unread: number }) => {
      setUsers((prev) =>
        prev.map((u) => (u.userId === data.userId ? { ...u, unread: 0 } : u)),
      );
    };

    socket.on("chat:message", onMessage);
    socket.on("admin:read", onRead);
    return () => {
      socket.off("chat:message", onMessage);
      socket.off("admin:read", onRead);
    };
  }, [user, selectedUserId, loadUsers]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
    loadMessages(userId);
    setUsers((prev) => prev.map((u) => (u.userId === userId ? { ...u, unread: 0 } : u)));
  };

  const handleSend = () => {
    const content = input.trim();
    if (!content || selectedUserId === null) return;
    const socket = connectChatSocket();
    socket.emit("admin:send", { userId: selectedUserId, content }, (res: { event: string; data?: ChatMessage } | undefined) => {
      if (res?.event === "ok" && res.data) {
        setMessages((prev) =>
          prev.some((m) => m.id === res.data!.id) ? prev : [...prev, res.data!],
        );
      }
    });
    setInput("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> Live Support Chat
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr] items-start">
        <Card className="lg:h-[600px] flex flex-col overflow-hidden">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                aria-label="Search chat users"
                className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingUsers ? (
              <p className="p-6 text-center text-sm text-muted-foreground">Loading...</p>
            ) : users.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                No conversations yet
              </p>
            ) : (
              users.map((u) => (
                <button
                  key={u.userId}
                  type="button"
                  onClick={() => handleSelectUser(u.userId)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border/50",
                    selectedUserId === u.userId ? "bg-primary/10" : "hover:bg-accent",
                  )}
                >
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary-foreground">
                    {u.username.charAt(0).toUpperCase()}
                    {u.unread > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                        {u.unread > 99 ? "99+" : u.unread}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{u.username}</p>
                      {u.lastMessageAt && (
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {new Date(u.lastMessageAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {u.lastSender === "CUSTOMER" ? "Customer: " : "You: "}
                      {u.lastMessage || ""}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        <Card className="lg:h-[600px] flex flex-col overflow-hidden">
          {selectedUserId === null ? (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-12 w-12 text-primary/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                Select a conversation to start chatting
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-border bg-brand-gradient px-4 py-3 text-primary-foreground">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15 text-sm font-bold">
                  {users.find((u) => u.userId === selectedUserId)?.username
                    .charAt(0)
                    .toUpperCase() ?? "?"}
                </div>
                <p className="text-sm font-bold">
                  {users.find((u) => u.userId === selectedUserId)?.username ?? "User"}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/40">
                {loadingMessages ? (
                  <p className="text-center text-xs text-muted-foreground py-8">Loading...</p>
                ) : messages.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-10">
                    No messages yet. Say hi!
                  </p>
                ) : (
                  messages.map((m) => {
                    const isMine = m.senderRole !== "CUSTOMER";
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
                  placeholder="Type your reply..."
                  aria-label="Reply message"
                  className="flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  aria-label="Send reply"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground shadow-brand transition-colors hover:brightness-105 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
