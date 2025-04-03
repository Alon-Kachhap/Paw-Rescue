import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import VolunteersList from "@/components/dashboard/VolunteersList";
import AnimalsList from "@/components/dashboard/AnimalsList";
import ContentBlocksList from "@/components/dashboard/ContentBlocksList";
import OrganizationProfile from "@/components/dashboard/OrganizationProfile";
import PendingVolunteers from "@/components/dashboard/PendingVolunteers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Cat, FileText, UserPlus } from "lucide-react";
import { headers } from "next/headers";

export default async function OrganizationDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user.role !== "organization" && session.user.role !== "ORGANIZATION")) {
    redirect("/login");
  }

  // Fetch organization data with related entities
  const organization = await prisma.organization.findUnique({
    where: { email: session.user.email },
    include: {
      volunteers: true,
      contentBlocks: true,
    }
  });
  
  if (!organization) {
    redirect("/login");
  }

  // Fetch animals directly using Prisma for more reliable results
  let animals = [];
  try {
    animals = await prisma.animal.findMany({
      where: {
        createdBy: { organizationId: organization.id }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Retrieved ${animals.length} animals for organization ${organization.id}`);
  } catch (error) {
    console.error("Error fetching animals for organization:", error);
  }
  
  // Fetch pending volunteer registrations
  const pendingVolunteers = await prisma.volunteerRegistration.findMany({
    where: {
      verified: false
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Count statistics
  const stats = {
    volunteers: organization.volunteers.length,
    animals: animals.length,
    pendingApplications: pendingVolunteers.length,
    contentBlocks: organization.contentBlocks.length
  };

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader organization={organization} />
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card className="bg-background border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Volunteers</p>
                <p className="text-2xl font-bold text-foreground">{stats.volunteers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Cat className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Animals</p>
                <p className="text-2xl font-bold text-foreground">{stats.animals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <UserPlus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Applications</p>
                <p className="text-2xl font-bold text-foreground">{stats.pendingApplications}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Content Blocks</p>
                <p className="text-2xl font-bold text-foreground">{stats.contentBlocks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="animals" className="mt-6">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="profile">
            <Building className="mr-2 h-4 w-4 inline" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="volunteers">
            <Users className="mr-2 h-4 w-4 inline" />
            Volunteers
          </TabsTrigger>
          <TabsTrigger value="applications" className="relative">
            <UserPlus className="mr-2 h-4 w-4 inline" />
            Applications
            {stats.pendingApplications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {stats.pendingApplications}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="animals">
            <Cat className="mr-2 h-4 w-4 inline" />
            Animals
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="mr-2 h-4 w-4 inline" />
            Content
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <OrganizationProfile organization={organization} />
        </TabsContent>
        
        <TabsContent value="volunteers">
          <VolunteersList volunteers={organization.volunteers} organizationId={organization.id} />
        </TabsContent>
        
        <TabsContent value="applications">
          <PendingVolunteers pendingVolunteers={pendingVolunteers} organizationId={organization.id} />
        </TabsContent>
        
        <TabsContent value="animals">
          <AnimalsList animals={animals} volunteers={organization.volunteers} />
        </TabsContent>
        
        <TabsContent value="content">
          <ContentBlocksList contentBlocks={organization.contentBlocks} organizationId={organization.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}