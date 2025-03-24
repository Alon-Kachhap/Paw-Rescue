import { Card } from "@/components/ui/card";
import { Heart, Users, PawPrint, Trophy } from "lucide-react";
import { AnimalGallery } from "@/components/animal-gallery";

export default function AboutUsPage() {
  const stats = [
    { icon: <PawPrint className="h-6 w-6" />, value: "5000+", label: "Animals Rescued" },
    { icon: <Users className="h-6 w-6" />, value: "1000+", label: "Active Volunteers" },
    { icon: <Heart className="h-6 w-6" />, value: "50+", label: "Partner Organizations" },
    { icon: <Trophy className="h-6 w-6" />, value: "10+", label: "Years of Service" },
  ];

  const team = [
    {
      name: "Dr. Priya Sharma",
      role: "Founder & Director",
      image: "/team/founder.jpg", // Add team member images to public/team directory
    },
    {
      name: "Rahul Kumar",
      role: "Operations Head",
      image: "/team/operations.jpg",
    },
    {
      name: "Anita Patel",
      role: "Veterinary Director",
      image: "/team/vet.jpg",
    },
  ];

  return (
    <div className="container px-4 py-8">
      {/* Mission Section */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Mission</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Paw Rescue is dedicated to creating a world where every stray animal finds a loving home. 
          Through our network of volunteers, organizations, and supporters, we work tirelessly 
          to rescue, rehabilitate, and rehome abandoned animals across India.
        </p>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="flex justify-center text-primary mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
        <AnimalGallery />
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-[4/3] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-xl mb-2">Compassion</h3>
            <p className="text-muted-foreground">
              We believe every animal deserves love, care, and respect, regardless of their condition or background.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-xl mb-2">Collaboration</h3>
            <p className="text-muted-foreground">
              Working together with communities, organizations, and individuals to create lasting positive change.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-xl mb-2">Commitment</h3>
            <p className="text-muted-foreground">
              Dedicated to providing the best possible care and finding permanent loving homes for rescued animals.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
