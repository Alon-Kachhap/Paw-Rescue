"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Grid } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

// You'll need to replace these with actual image paths from your public/photos directory
const images = [
    "/photos/animal1.jpg",
    "/photos/animal2.jpg",
    "/photos/animal3.jpg",
    // Add more image paths as needed
];

export default function AnimalsPage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showGallery, setShowGallery] = useState(false);

    // Auto-advance slideshow
    useEffect(() => {
        if (!showGallery) {
            const timer = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 5000); // Change slide every 5 seconds

            return () => clearInterval(timer);
        }
    }, [showGallery]);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const previousImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="container px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Animal Gallery</h1>
                <Button
                    variant="outline"
                    onClick={() => setShowGallery(!showGallery)}
                >
                    {showGallery ? "View Slideshow" : "View Gallery"} 
                    <Grid className="ml-2 h-4 w-4" />
                </Button>
            </div>

            {!showGallery ? (
                // Slideshow View
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                    <Image
                        src={images[currentImageIndex]}
                        alt={`Animal ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 flex items-center justify-between p-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={previousImage}
                            className="rounded-full bg-background/80 backdrop-blur-sm"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={nextImage}
                            className="rounded-full bg-background/80 backdrop-blur-sm"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <div className="flex gap-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`h-2 w-2 rounded-full ${
                                        index === currentImageIndex
                                            ? "bg-primary"
                                            : "bg-primary/50"
                                    }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                // Gallery Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <Card key={index} className="overflow-hidden">
                            <div className="relative aspect-[4/3]">
                                <Image
                                    src={image}
                                    alt={`Animal ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform hover:scale-105"
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
