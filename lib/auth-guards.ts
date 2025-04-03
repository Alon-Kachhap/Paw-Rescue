import { getCurrentUser } from "./getCurrentUser";

// Ensure user is logged in
export const requireAuth = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
};

// Ensure user has one of the allowed roles
export const requireRole = async (allowedRoles: ("admin" | "organization" | "volunteer")[]) => {
  const user = await getCurrentUser();
  if (!user || !allowedRoles.includes(user.role as any)) {
    throw new Error("Access Denied");
  }
  return user;
};

// Ensure user is admin or owner of the resource
export const requireSelfOrAdmin = async (resourceOwnerId: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const isAdmin = user.role === "admin";
  const isOwner = user.id === resourceOwnerId;

  if (!isAdmin && !isOwner) {
    throw new Error("Access Denied");
  }

  return user;
};
