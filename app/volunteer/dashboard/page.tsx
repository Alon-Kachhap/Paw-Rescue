import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton"; // Import the client component

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Welcome, {session.user.name}</h1>
      <p>Your email: {session.user.email}</p>
      <p>Status: {session.user.verified ? "✅ Verified" : "Your application is under verification"}</p>
      <div className="mt-4">
        <LogoutButton />
      </div>
    </div>
  );
}
