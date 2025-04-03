export const dynamic = "force-dynamic";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { AuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    // Volunteer login provider (checking both User and VolunteerRegistration tables)
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

        // First check User table (for verified volunteers)
        const verifiedUser = await prisma.user.findUnique({
          where: { 
            email: credentials.email,
            role: "VOLUNTEER"
          },
        });

        if (verifiedUser) {
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
      },
    }),
    // Organization login provider (using the user table)
    CredentialsProvider({
      id: "organization-credentials",
      name: "Organization Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }
    
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
      },
    })
    
    
    // Admin login provider (using the user table)
    ,
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
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
  }
  ,
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
