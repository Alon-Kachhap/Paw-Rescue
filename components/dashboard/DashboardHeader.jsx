import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Cat, Globe } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardHeader({ organization }) {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-4">
            <Building className="h-12 w-12 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">{organization.name}</h1>
              <p className="text-muted-foreground">{organization.email}</p>
            </div>
            {organization.verified ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                ✅ Verified Organization
              </Badge>
            ) : (
              <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                Pending Verification
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{organization.volunteers.length} Volunteers</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
