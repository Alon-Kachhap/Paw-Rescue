import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrganizationPendingVerification from "@/components/dashboard/OrganizationPendingVerification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VolunteerManagement from "@/components/dashboard/VolunteerManagement";
import OrganizationProfile from "@/components/dashboard/OrganizationProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Cat, UserCircle, CheckCircle, Users, Calendar, ChartBar, Settings } from "lucide-react";
import AnimalsTabContent from "@/components/dashboard/AnimalsTabContent";
import Image from "next/image";

export default async function OrganizationDashboard() {
  const session = await getServerSession(authOptions);
  console.log("Organization Session:", session?.user);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Get organization data based on user role and verification status
  let organizationData = null;
  let isVerified = false;
  let organizationAnimals = [];
  let organizationVolunteers = [];
  
  // Check if user is an organization
  if (session.user.role === "organization" || session.user.role === "ORGANIZATION") {
    // Set verified status from session
    isVerified = session.user.verified;
    
    if (isVerified) {
      // Get verified organization data from database
      organizationData = await prisma.organization.findUnique({
        where: { id: session.user.id }
      });
      
      console.log("Organization data found:", organizationData?.name);
      
      // If no data found for some reason (shouldn't happen), try the registration table
      if (!organizationData) {
        organizationData = await prisma.organizationRegistration.findUnique({
          where: { id: session.user.id }
        });
        
        // If still not found, set verified to false to show pending screen
        if (!organizationData) {
          isVerified = false;
        }
      } else {
        try {
          // Now fetch only the organization's animals
          organizationAnimals = await prisma.animal.findMany({
            where: {
              OR: [
                { createdById: session.user.id },
                { createdBy: { organizationId: session.user.id } }
              ]
            },
            include: {
              createdBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  image: true,
                  email: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          });
          
          // Add calculated name field to each animal's createdBy
          organizationAnimals = organizationAnimals.map(animal => ({
            ...animal,
            createdBy: {
              ...animal.createdBy,
              name: animal.createdBy ? 
                `${animal.createdBy.firstName || ''} ${animal.createdBy.lastName || ''}`.trim() || 'Unknown'
                : 'Unknown'
            }
          }));
          
          console.log(`Retrieved ${organizationAnimals.length} animals for organization ${session.user.id}`);
          
          // Get all volunteers affiliated with this organization
          organizationVolunteers = await prisma.user.findMany({
            where: { 
              organizationId: session.user.id,
              role: "VOLUNTEER"
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
              createdAt: true
            }
          });
          
          console.log(`Retrieved ${organizationVolunteers.length} volunteers for organization ${session.user.id}`);
        } catch (error) {
          console.error("Error fetching organization data:", error);
          organizationAnimals = [];
          organizationVolunteers = [];
        }
      }
    } else {
      // Not verified, try to get from Registration table
      organizationData = await prisma.organizationRegistration.findUnique({
        where: { id: session.user.id }
      });
    }
  }

  // If no data found, redirect to login
  if (!organizationData) {
    redirect("/login");
  }

  // If organization is not verified, show pending verification screen
  if (!isVerified) {
    return <OrganizationPendingVerification organization={organizationData} />;
  }

  // Convert Prisma objects to plain JSON to avoid serialization issues
  const animals = JSON.parse(JSON.stringify(organizationAnimals))
    // Filter out any sample data that might have been added
    .filter((animal: any) => 
      !animal.id.includes('sample') && 
      animal.id !== 'sample-1' && 
      animal.id !== 'sample-2' && 
      animal.id !== 'sample-3' &&
      !(animal.createdBy && animal.createdBy.id === 'sample')
    );
  
  const volunteers = JSON.parse(JSON.stringify(organizationVolunteers));

  // Calculate statistics
  const adoptionCount = animals.filter((animal: any) => animal.status === 'ADOPTION').length;
  const fosterCount = animals.filter((animal: any) => animal.status === 'FOSTER').length;
  const otherCount = animals.filter((animal: any) => animal.status === 'OTHER' || !animal.status).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Custom Organization Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {organizationData.image ? (
                <Image 
                  src={organizationData.image} 
                  alt={organizationData.name}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-primary"
                />
              ) : (
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold">
                  {organizationData.name?.charAt(0)?.toUpperCase() || 'O'}
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {organizationData.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  {organizationData.type} • {organizationData.registrationNumber}
                </p>
                <div className="mt-1 flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">Verified Organization</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <a 
                href={`mailto:${organizationData.email}`} 
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Contact
              </a>
              <a 
                href={organizationData.website || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20 transition-colors"
              >
                {organizationData.website ? 'Visit Website' : 'No Website'}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 mt-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Cat className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Animals</p>
                  <p className="text-2xl font-bold text-foreground">{animals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <ChartBar className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">For Adoption</p>
                  <p className="text-2xl font-bold text-foreground">{adoptionCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volunteers</p>
                  <p className="text-2xl font-bold text-foreground">{volunteers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Foster Animals</p>
                  <p className="text-2xl font-bold text-foreground">{fosterCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="animals" className="mt-6">
          <TabsList className="grid grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="animals" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded-md transition-all">
              <Cat className="mr-2 h-4 w-4 inline" />
              Animals
            </TabsTrigger>
            <TabsTrigger value="volunteers" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded-md transition-all">
              <Users className="mr-2 h-4 w-4 inline" />
              Volunteers
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded-md transition-all">
              <Settings className="mr-2 h-4 w-4 inline" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="animals" className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <AnimalsTabContent 
              animals={animals} 
              volunteers={volunteers} 
            />
          </TabsContent>
          
          <TabsContent value="volunteers" className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <VolunteerManagement 
              organization={organizationData} 
              volunteers={volunteers} 
            />
          </TabsContent>
          
          <TabsContent value="profile" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <OrganizationProfile organization={organizationData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 