import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <UserCircle className="w-12 h-12 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Welcome, {session.user.name}</h1>
              <p className="text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Status:</span>
              {session.user.verified ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  ✅ Verified Volunteer
                </Badge>
              ) : (
                <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                  Pending Verification
                </Badge>
              )}
            </div>
            
            <div className="border-t pt-4">
              <LogoutButton />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
