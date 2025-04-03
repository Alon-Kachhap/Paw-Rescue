import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VolunteerDashboardHeader from "@/components/dashboard/VolunteerDashboardHeader";
import VolunteerPendingVerification from "@/components/dashboard/VolunteerPendingVerification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VolunteerTasks from "@/components/dashboard/VolunteerTasks";
import VolunteerProfile from "@/components/dashboard/VolunteerProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Cat, UserCircle, CheckCircle, ListTodo } from "lucide-react";
import { headers } from "next/headers";
import AnimalsTabContent from "@/components/dashboard/AnimalsTabContent";

// Helper function to make absolute URL
function getBaseUrl() {
  // In production, use the NEXTAUTH_URL, which is the deployment URL
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // When running locally, use localhost
  return `http://localhost:3000`;
}

export default async function VolunteerDashboard() {
  const session = await getServerSession(authOptions);
  console.log("Session user:", session?.user);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Get volunteer data based on user role and verification status
  let volunteerData = null;
  let isVerified = false;
  let organizationData = null;
  let volunteerAnimals = [];
  
  // Check if user is a volunteer
  if (session.user.role === "volunteer" || session.user.role === "VOLUNTEER") {
    // Set verified status from session
    isVerified = session.user.verified;
    
    if (isVerified) {
      // If verified, try to get from User table
      volunteerData = await prisma.user.findUnique({
        where: { id: session.user.id }
      });
      
      console.log("Volunteer data:", volunteerData);
      
      // If for some reason the user isn't found in User table (shouldn't happen),
      // try the VolunteerRegistration table as a fallback
      if (!volunteerData) {
        volunteerData = await prisma.volunteerRegistration.findUnique({
          where: { id: session.user.id }
        });
        
        // If still not found, set verified to false to show pending screen
        if (!volunteerData) {
          isVerified = false;
        }
      } else {
        // Get organization data if the volunteer belongs to an organization
        if (volunteerData.organizationId) {
          organizationData = await prisma.organization.findUnique({
            where: { id: volunteerData.organizationId }
          });
          console.log("Organization data:", organizationData?.id);
        }
        
        try {
          // IMPORTANT: Try to fetch ALL animals first to check what's in the database
          const allAnimals = await prisma.animal.findMany({
            include: {
              createdBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  image: true,
                  organizationId: true
                }
              }
            }
          });
          
          console.log("ALL animals in database:", allAnimals.length);
          if (allAnimals.length > 0) {
            console.log("Sample animal:", JSON.stringify(allAnimals[0], null, 2));
          }
          
          console.log("Fetching volunteer animals directly from the API");
          // Use direct fetch for more reliability
          const baseUrl = getBaseUrl();
          const apiUrl = `${baseUrl}/api/animals`;
          
          // Get current session from headers
          const resp = await fetch(apiUrl, {
            headers: {
              Cookie: headers().get('cookie') || '',
            },
            cache: 'no-store'
          });
          
          if (!resp.ok) {
            throw new Error(`Failed to fetch from API: ${resp.status}`);
          }
          
          const apiAnimals = await resp.json();
          
          console.log(`API returned ${Array.isArray(apiAnimals) ? apiAnimals.length : 'non-array'} animals`);
          
          if (Array.isArray(apiAnimals) && apiAnimals.length > 0) {
            volunteerAnimals = apiAnimals;
          } else {
            // Now fetch animals for this specific volunteer
            volunteerAnimals = await prisma.animal.findMany({
              where: {
                OR: [
                  { createdById: session.user.id },
                  ...(volunteerData.organizationId ? [{ createdBy: { organizationId: volunteerData.organizationId } }] : [])
                ]
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
            
            // If still no animals, create a test one
            if (volunteerAnimals.length === 0) {
              console.log("No animals found for volunteer, creating a test animal");
              try {
                const testAnimal = await prisma.animal.create({
                  data: {
                    name: "Test Dog",
                    species: "Dog",
                    breed: "Mixed Breed",
                    neutered: true,
                    vaccinated: true,
                    status: "ADOPTION",
                    createdById: session.user.id
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
                  }
                });
                volunteerAnimals = [testAnimal];
                console.log("Test animal created:", testAnimal.id);
              } catch (error) {
                console.error("Error creating test animal:", error);
              }
            }
          }
          
          console.log(`Retrieved ${volunteerAnimals.length} animals for volunteer ${session.user.id}`);
        } catch (error) {
          console.error("Error fetching animals:", error);
          volunteerAnimals = [];
        }
      }
    } else {
      // Not verified, get data from VolunteerRegistration table
      volunteerData = await prisma.volunteerRegistration.findUnique({
        where: { id: session.user.id }
      });
    }
  }

  // If no data found, redirect to login
  if (!volunteerData) {
    redirect("/login");
  }

  // If volunteer is not verified, show pending verification screen
  if (!isVerified) {
    return <VolunteerPendingVerification volunteer={volunteerData} />;
  }

  // Get all volunteers from the organization for the dropdown
  let allVolunteers = [];
  if (organizationData) {
    allVolunteers = await prisma.user.findMany({
      where: { 
        organizationId: organizationData.id,
        role: "VOLUNTEER"
      },
      select: {
        id: true,
        firstName: true,
        lastName: true
      }
    });
  } else {
    // If no organization, just include the current volunteer
    allVolunteers = [
      {
        id: volunteerData.id,
        firstName: volunteerData.firstName,
        lastName: volunteerData.lastName
      }
    ];
  }

  // Double-check volunteers data
  console.log("Volunteers for dropdown:", allVolunteers.length);

  // IMPORTANT: Create a simple array from the Prisma result
  const animals = JSON.parse(JSON.stringify(volunteerAnimals));
  
  return (
    <div className="container mx-auto p-4">
      <VolunteerDashboardHeader 
        volunteer={volunteerData} 
        organization={organizationData} 
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-background border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Cat className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Animals Under Care</p>
                <p className="text-2xl font-bold text-foreground">{animals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold text-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <ListTodo className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks</p>
                <p className="text-2xl font-bold text-foreground">
                  {/* This would come from a tasks system when implemented */}
                  0
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="animals" className="mt-6">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="profile">
            <UserCircle className="mr-2 h-4 w-4 inline" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="animals">
            <Cat className="mr-2 h-4 w-4 inline" />
            Animals
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <ListTodo className="mr-2 h-4 w-4 inline" />
            Tasks
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <VolunteerProfile volunteer={volunteerData} organization={organizationData} />
        </TabsContent>
        
        <TabsContent value="animals">
          <AnimalsTabContent 
            animals={animals} 
            volunteers={allVolunteers} 
          />
        </TabsContent>
        
        <TabsContent value="tasks">
          <VolunteerTasks volunteer={volunteerData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
