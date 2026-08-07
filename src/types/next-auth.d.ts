import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      apiToken?: string;
      id?: string;
    } & DefaultSession["user"];
  }

  interface User {
    apiToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiToken?: string;
    id?: string;
  }
}