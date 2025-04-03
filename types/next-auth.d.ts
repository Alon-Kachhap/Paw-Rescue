// types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      verified: boolean;
      role: "volunteer" | "organization" | "admin";
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    role: "volunteer" | "organization" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    role: "volunteer" | "organization" | "admin";
  }
}
