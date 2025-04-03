import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import VolunteersList from "@/components/dashboard/VolunteersList";
import AnimalsList from "@/components/dashboard/AnimalsList";
import ContentBlocksList from "@/components/dashboard/ContentBlocksList";
import OrganizationProfile from "@/components/dashboard/OrganizationProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function OrganizationDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "organization") {
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
  

  // Fetch animals created by the organization's volunteers
  const animals = await prisma.animal.findMany({
    where: {
      createdBy: {
        organizationId: organization?.id // using the organization's id from the query
      }
    },
    include: {
      createdBy: true
    }
  });
  
;

  if (!organization) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader organization={organization} />
      
      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="animals">Animals</TabsTrigger>
          <TabsTrigger value="content">Website Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <OrganizationProfile organization={organization} />
        </TabsContent>
        
        <TabsContent value="volunteers">
          <VolunteersList volunteers={organization.volunteers} organizationId={organization.id} />
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