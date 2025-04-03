import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Cat, Globe, CheckCircle, AlertCircle } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardHeader({ organization }) {
  return (
    <Card className="bg-background border-border">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{organization.name}</h1>
              <p className="text-muted-foreground">{organization.email}</p>
            </div>
            {organization.verified ? (
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800">
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                Verified Organization
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                Pending Verification
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-muted-foreground bg-accent/50 px-3 py-1.5 rounded-full">
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
