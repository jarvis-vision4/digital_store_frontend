"use client";

import { type ReactNode, useEffect, useState, useCallback } from "react";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { AuthContext, type AuthContextType } from "@/hooks/use-auth";
import * as authApi from "@/lib/api/auth";
import type { User, LoginDto, RegisterDto } from "@/types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const redirect = useCallback((path: string) => {
    window.location.href = path;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (dto: LoginDto) => {
    const res = await authApi.login({ email: dto.email, password: dto.password });
    localStorage.setItem("accessToken", res.accessToken);
    const profile = await authApi.getProfile();
    localStorage.setItem("user", JSON.stringify(profile));
    setUser(profile);
    redirect(profile.role === "ADMIN" ? "/admin" : "/");
  }, [redirect]);

  const register = useCallback(async (dto: RegisterDto) => {
    const res = await authApi.register(dto);
    localStorage.setItem("accessToken", res.accessToken);
    const profile = await authApi.getProfile();
    localStorage.setItem("user", JSON.stringify(profile));
    setUser(profile);
    redirect("/");
  }, [redirect]);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    nextAuthSignOut({ callbackUrl: "/login" }).catch(() => {
      redirect("/login");
    });
  }, [redirect]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN" || user?.role === "MODERATOR",
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
