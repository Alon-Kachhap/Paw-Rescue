// app/organization/test/page.tsx
import { requireRole } from "@/lib/auth-guards";

export default async function OrganizationTestPage() {
  const user = await requireRole(["organization"]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">🔒 Authenticated Org Route</h1>
      <p>Welcome, {user.name}!</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
