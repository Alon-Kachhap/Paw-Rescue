export const dynamic = "force-dynamic";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { AuthOptions } from "next-auth";

// Use a singleton pattern for Prisma client
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  providers: [
    // Volunteer login provider
    CredentialsProvider({
      id: "credentials", 
      name: "Volunteer Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          // First check User table (for verified volunteers)
          const verifiedUser = await prisma.user.findUnique({
            where: { 
              email: credentials.email,
            },
          });

          if (verifiedUser && verifiedUser.role === "VOLUNTEER") {
            // User exists in User table
            const isValid = await bcrypt.compare(credentials.password, verifiedUser.password);
            if (!isValid) throw new Error("Invalid password");
            
            return {
              id: verifiedUser.id,
              email: verifiedUser.email,
              name: `${verifiedUser.firstName} ${verifiedUser.lastName}`,
              verified: true,
              role: "volunteer",
            };
          }

          // If not found in User table, check VolunteerRegistration table
          const pendingUser = await prisma.volunteerRegistration.findUnique({
            where: { email: credentials.email },
          });
          
          if (!pendingUser) throw new Error("User not found");
          
          const isValid = await bcrypt.compare(credentials.password, pendingUser.password);
          if (!isValid) throw new Error("Invalid password");
          
          return {
            id: pendingUser.id,
            email: pendingUser.email,
            name: `${pendingUser.firstName} ${pendingUser.lastName}`,
            verified: pendingUser.verified,
            role: "volunteer",
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
    
    // Organization login provider
    CredentialsProvider({
      id: "organization-credentials",
      name: "Organization Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          const org = await prisma.organization.findUnique({
            where: { email: credentials.email },
          });
      
          if (!org) {
            return null;
          }
      
          const isValid = await bcrypt.compare(credentials.password, org.password);
          if (!isValid) {
            return null;
          }
      
          return {
            id: org.id,
            email: org.email,
            name: org.name,
            verified: org.verified,
            role: "organization",
          };
        } catch (error) {
          console.error("Organization auth error:", error);
          return null;
        }
      },
    }),
    
    // Admin login provider
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          // Check for admin users in User table with ADMIN role
          const admin = await prisma.user.findFirst({
            where: { 
              email: credentials.email,
              role: "ADMIN"
            },
          });
          
          if (!admin) {
            return null;
          }
          
          const isValid = await bcrypt.compare(credentials.password, admin.password);
          if (!isValid) {
            return null;
          }
          
          return {
            id: admin.id,
            email: admin.email,
            name: `${admin.firstName} ${admin.lastName}`,
            verified: true,
            role: "admin",
          };
        } catch (error) {
          console.error("Admin auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.verified = user.verified;
        token.role = user.role; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.verified = token.verified as boolean;
        session.user.role = token.role as "organization" | "volunteer" | "admin";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
