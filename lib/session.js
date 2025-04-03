import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get user data from server session for API routes
export async function getUserFromServerSession() {
  const session = await getServerSession(authOptions);
  
  // Debug session
  console.log("Raw session in getUserFromServerSession:", 
    session ? 
    { user: session.user ? { id: session.user.id, email: session.user.email, role: session.user.role } : 'no user' } 
    : 'no session'
  );
  
  if (!session || !session.user) {
    return null;
  }
  
  // Extract user ID - try different possible locations
  const userId = session.user.id || session.user.userId || session.user.sub || null;
  
  // Normalize role to uppercase to handle different casing
  const role = session.user.role ? 
    session.user.role.toUpperCase() : 
    null;
  
  // Build a complete user object
  const user = {
    id: userId, // Include both id and userId for compatibility
    userId: userId,
    email: session.user.email,
    role: role,
    verified: session.user.verified || false,
    name: session.user.name,
    image: session.user.image
  };
  
  console.log("Normalized user from session:", { id: user.id, role: user.role });
  
  return user;
} 