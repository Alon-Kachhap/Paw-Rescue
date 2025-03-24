"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";

// Mock data - replace with actual API call
const organizations = [
    {
        id: 1,
        name: "Paws & Care India",
        description: "Dedicated to rescuing and rehabilitating stray animals",
        location: "Bandra West, Mumbai, MH",
        phone: "+91 98765 43210",
        email: "contact@pawsandcare.org",
        image: "https://placehold.co/600x400",
    },
    {
        id: 2,
        name: "Happy Tails Rescue",
        description: "Focused on finding forever homes for abandoned pets",
        location: "Indiranagar, Bangalore, KA",
        phone: "+91 89432 12345",
        email: "info@happytails.org",
        image: "https://placehold.co/600x400",
    },
    {
        id: 3,
        name: "Animal Haven Delhi",
        description: "Emergency rescue and medical care for injured strays",
        location: "Hauz Khas, New Delhi, DL",
        phone: "+91 99876 54321",
        email: "help@animalhaven.org",
        image: "https://placehold.co/600x400",
    },
    {
        id: 4,
        name: "Furry Friends Network",
        description: "Building a community of pet lovers and rescuers",
        location: "Salt Lake City, Kolkata, WB",
        phone: "+91 87654 32109",
        email: "contact@furryfriendsnet.org",
        image: "https://placehold.co/600x400",
    },
    {
        id: 5,
        name: "Second Chance Shelter",
        description: "Giving animals a second chance at a happy life",
        location: "Jubilee Hills, Hyderabad, TS",
        phone: "+91 76543 21098",
        email: "info@secondchance.org",
        image: "https://placehold.co/600x400",
    },
    {
        id: 6,
        name: "Guardian Angels Rescue",
        description: "24/7 emergency animal rescue services",
        location: "Aundh, Pune, MH",
        phone: "+91 95432 10987",
        email: "rescue@guardianangels.org",
        image: "https://placehold.co/600x400",
    }
];

export default function OrganizationsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredOrganizations = organizations.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Animal Welfare Organizations</h1>

            {/* Search Bar */}
            <div className="flex gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search organizations..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button>Filter</Button>
            </div>

            {/* Organizations Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredOrganizations.map((org) => (
                    <Card key={org.id} className="overflow-hidden">
                        <img
                            src={org.image}
                            alt={org.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">{org.name}</h3>
                            <p className="text-muted-foreground mb-4">{org.description}</p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{org.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{org.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{org.email}</span>
                                </div>
                            </div>
                            <Button className="w-full mt-4">View Details</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}