// lib/getCurrentUser.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Reusable function to get current user from session
export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user;
};
