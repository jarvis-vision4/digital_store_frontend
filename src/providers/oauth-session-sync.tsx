"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/hooks/use-auth";
import * as authApi from "@/lib/api/auth";

/**
 * Bridges an Auth.js (NextAuth) OAuth session into the existing app auth flow.
 * When a session carries an apiToken (obtained from the backend /auth/oauth
 * upsert), we persist it to localStorage + auth context so the rest of the app
 * (axios `accessToken`, useAuth()) works identically for Google users.
 */
export function OAuthSessionSync() {
  const { data: session, status } = useSession();
  const { setUser } = useAuth();

  useEffect(() => {
    if (status !== "authenticated") return;
    const apiToken = session?.user?.apiToken;
    if (!apiToken) return;

    if (typeof window !== "undefined" && localStorage.getItem("accessToken") !== apiToken) {
      localStorage.setItem("accessToken", apiToken);
    }

    let alive = true;
    authApi
      .getProfile()
      .then((profile) => {
        if (alive) {
          localStorage.setItem("user", JSON.stringify(profile));
          setUser(profile);
        }
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [session, status, setUser]);

  return null;
}