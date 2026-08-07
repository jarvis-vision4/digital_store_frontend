"use client";

import { type ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./auth-provider";
import { OAuthSessionSync } from "./oauth-session-sync";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <OAuthSessionSync />
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}