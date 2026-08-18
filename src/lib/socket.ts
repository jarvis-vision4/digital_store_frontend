"use client";

import { io, type Socket } from "socket.io-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
const SOCKET_URL = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return API_BASE_URL;
  }
})();

let socket: Socket | null = null;

export function getChatSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket", "polling"],
      auth: (cb) => {
        cb({ token: typeof window !== "undefined" ? localStorage.getItem("accessToken") ?? "" : "" });
      },
    });
  }
  return socket;
}

export function connectChatSocket() {
  const s = getChatSocket();
  if (!s.connected) {
    s.auth = { token: typeof window !== "undefined" ? localStorage.getItem("accessToken") ?? "" : "" };
    s.connect();
  }
  return s;
}

export function disconnectChatSocket() {
  socket?.disconnect();
}
