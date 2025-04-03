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

  try {
    // Fetch all animals in the database that are associated with this organization
    const animals = await prisma.animal.findMany({
      where: {
        OR: [
          // Animals with no organization association
          { createdBy: { organizationId: null } },
          // Animals from this organization
          { createdBy: { organizationId: organization.id } }
        ]
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            organizationId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Retrieved ${animals.length} animals for organization and unaffiliated animals`);
    
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

    // Convert animals to plain JS objects to avoid serialization issues
    const serializedAnimals = JSON.parse(JSON.stringify(animals));

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
            <AnimalsList animals={serializedAnimals} volunteers={organization.volunteers} />
          </TabsContent>
          
          <TabsContent value="content">
            <ContentBlocksList contentBlocks={organization.contentBlocks} organizationId={organization.id} />
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("Error in organization dashboard:", error);
    
    // Fallback UI in case of error
    return (
      <div className="container mx-auto p-4">
        <DashboardHeader organization={organization} />
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                There was an error loading the dashboard
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Please try refreshing the page. If the problem persists, contact support.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}