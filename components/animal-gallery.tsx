"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState, TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const animalImages = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  url: `/images/animals/im${i + 1}.jpg`,
  caption: [
    "Happy rescued dog finding forever home",
    "Rehabilitation center for injured animals",
    "Community feeding program for strays",
    "Medical care for injured animals",
    "Adoption day success story",
    "Wildlife rescue operation",
    "Emergency animal rescue",
    "Animal shelter volunteers",
    "Pet therapy program",
    "Animal sanctuary residents",
    "Rescued farm animals",
    "Marine life conservation",
    "Bird rehabilitation center",
    "Animal welfare education",
    "Senior pet care program"
  ][i]
}));

export function AnimalGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === animalImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? animalImages.length - 1 : prevIndex - 1
    );
  };

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div 
        className="relative aspect-[16/9] overflow-hidden rounded-xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={animalImages[currentIndex].url}
          alt={animalImages[currentIndex].caption}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority={currentIndex === 0}
          className="object-cover transition-all duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60">
          <div className="absolute inset-x-0 bottom-12 z-20">
            <p className="text-center text-white text-lg px-4">
              {animalImages[currentIndex].caption}
            </p>
          </div>
        </div>
        
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="absolute -bottom-8 inset-x-0 flex items-center justify-center gap-2">
        {animalImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-primary w-4' 
                : 'bg-primary/50 hover:bg-primary/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
