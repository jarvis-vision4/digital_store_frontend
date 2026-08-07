import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
const APP_URL = process.env.NEXTAUTH_URL || process.env.AUTH_URL || "http://localhost:3001";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        try {
          const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          const data = await res.json();
          if (!res.ok || !data.accessToken) return null;
          return {
            id: String(data.user?.id ?? ""),
            email: credentials.email as string,
            name: data.user?.username,
            apiToken: data.accessToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign-in (Google or Credentials)
      if (user && user.apiToken) {
        // Credentials sign-in: reuse the emitted token
        token.apiToken = user.apiToken;
        token.id = user.id;
        if (user.name) token.name = user.name;
        return token;
      }

      if (account?.provider === "google" && profile?.email) {
        // Google sign-in: create/upsert the user in the backend users table,
        // and exchange the OAuth identity for an app JWT.
        const name =
          (profile as { name?: string }).name?.trim() ||
          (profile.email as string).split("@")[0];
        const username = (profile.email as string).split("@")[0];
        try {
          const res = await fetch(`${API_URL}/auth/oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile.email,
              username,
              displayName: name,
            }),
          });
          const data = await res.json();
          if (res.ok && data.accessToken) {
            token.apiToken = data.accessToken;
            token.id = String(data.user?.id ?? "");
            token.name = data.user?.username ?? name;
            return token;
          }
        } catch {
          // fall through; OAuth still recorded but backend link failed
        }
        return token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.apiToken && session.user) {
        session.user.apiToken = token.apiToken as string;
      }
      session.user.id = (token.id as string) || session.user.id;
      return session;
    },
  },
});