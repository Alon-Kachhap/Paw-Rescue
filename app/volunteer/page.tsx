"use client";
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface VolunteerStory {
  name: string;
  date: string;
  image: string;
  excerpt: string;
  link: string;
}

const volunteerStories: VolunteerStory[] = [
  {
    name: "Marc and Elisa",
    date: "February 2024",
    image: "/volunteers/volunteer-1.jpg",
    excerpt: "We spent a wonderful month working with the amazing dogs and dedicated volunteers...",
    link: "/volunteer/stories/marc-and-elisa"
  },
  {
    name: "Sarah Johnson",
    date: "January 2024",
    image: "/volunteers/volunteer-2.jpg",
    excerpt: "The experience of helping these animals has changed my perspective on life...",
    link: "/volunteer/stories/sarah-johnson"
  },
  {
    name: "David Chen",
    date: "December 2023",
    image: "/volunteers/volunteer-3.jpg",
    excerpt: "Working with the medical team taught me so much about animal care...",
    link: "/volunteer/stories/david-chen"
  },
  // Add more stories here...
  {
    name: "Emma and Tom",
    date: "November 2023",
    image: "/volunteers/volunteer-4.jpg",
    excerpt: "Our weekends at the shelter became the highlight of our month...",
    link: "/volunteer/stories/emma-and-tom"
  },
  {
    name: "Michael Rodriguez",
    date: "October 2023",
    image: "/volunteers/volunteer-5.jpg",
    excerpt: "The dedication of the staff inspired me to pursue veterinary medicine...",
    link: "/volunteer/stories/michael-rodriguez"
  },
  // Continue with more stories...
];

const VolunteerPage = () => {
  const [showContent, setShowContent] = useState(false);
  const storiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowContent(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('story-visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="parallax-bg relative h-screen">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/volunteer-hero.jpg')",
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
          <h1 
            className={`text-6xl font-bold mb-8 ${
              showContent ? 'fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.3s' }}
          >
            Volunteer
          </h1>
          
          <a 
            href="#volunteer-info"
            className="mt-16 p-4 rounded-full bg-primary/80 hover:bg-primary transition-colors bounce"
            aria-label="Scroll to volunteer information"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* Volunteer Information Section */}
      <section id="volunteer-info" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-semibold text-foreground mb-8">Volunteer Information</h2>
          <div className="space-y-6 text-muted-foreground">
            <p>
              We are always seeking general volunteers interested in working with animals, volunteer veterinarians, 
              vet nurses, or vet students to work with our vets and animal care staff to sterilize and provide 
              treatment for animals, mainly street dogs.
            </p>
            <p>
              Many street dogs, mostly abandoned, suffer from starvation, infected open wounds, mange, and other 
              diseases. The organizational goals are to humanely create a healthy, stable dog population and to 
              eliminate rabies through widespread sterilization programs, medical treatment, vaccinations, and 
              humane education. The organization's impact goes far beyond the animals it treats.
            </p>
            <p>
              As a volunteer at PawRescue, you will have opportunities to learn different approaches to veterinary 
              medicine and help treat illnesses and injuries. You will also be able to ride on our animal ambulance 
              with staff who catch and release street dogs and respond to emergency rescue calls.
            </p>
            <div className="mt-8 p-6 bg-card rounded-lg border">
              <p className="mb-4">
                We welcome volunteers for any amount of time, and no particular experience is necessary. 
                If you are interested in volunteering, please write to us at{' '}
                <a href="mailto:info@pawrescue.org" className="text-primary hover:underline">
                  info@pawrescue.org
                </a>{' '}
                or register using the button below.
              </p>
              <Link 
                href="/volunteer/register"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition"
              >
                Register as Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Stories Section with Fade-in Effect */}
      <section id="stories" className="bg-muted/50 py-16">
        <div className="container mx-auto px-4" ref={storiesRef}>
          <h2 className="text-2xl font-bold text-center mb-12">Volunteer Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {volunteerStories.map((story, index) => (
              <div
                key={index}
                className="story-card bg-card rounded-lg overflow-hidden shadow-lg border"
                style={{
                  transitionDelay: `${(index % 3) * 0.1}s`
                }}
              >
                <div className="h-48 relative">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">{story.name}</h3>
                  <p className="text-muted-foreground mb-4">{story.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{story.date}</span>
                    <Link
                      href={story.link}
                      className="text-primary hover:underline"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VolunteerPage;