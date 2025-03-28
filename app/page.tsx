import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, PawPrint, Users, Binary as Veterinary } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Connecting Hearts, Saving Lives
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join our platform to support local animal welfare organizations. Together, we can make a difference in the lives of stray animals.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/donate">Donate Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <PawPrint className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-lg font-bold mb-2">Animal Database</h3>
              <p className="text-muted-foreground">
                Track medical histories and care records for stray animals in your area.
              </p>
            </Card>
            <Card className="p-6">
              <Heart className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-lg font-bold mb-2">Crowdfunding</h3>
              <p className="text-muted-foreground">
                Support organizations through transparent and secure donations.
              </p>
            </Card>
            <Card className="p-6">
              <Users className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-lg font-bold mb-2">Volunteer Network</h3>
              <p className="text-muted-foreground">
                Connect with volunteers and coordinate rescue operations effectively.
              </p>
            </Card>
            <Card className="p-6">
              <Veterinary className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-lg font-bold mb-2">Medical Support</h3>
              <p className="text-muted-foreground">
                Access a network of veterinarians and foster homes for animal care.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to Make a Difference?
            </h2>
            <p className="mx-auto max-w-[600px]">
              Join our community of animal welfare organizations, volunteers, and supporters.
            </p>
            <Button variant="default" size="lg" asChild>
              <Link href="/register">Join Paw Rescue Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}