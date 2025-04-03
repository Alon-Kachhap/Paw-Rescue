"use client";
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { redirectToLogin } from "@/lib/utils/auth";
import { CalendarIcon, UserIcon, HeartIcon, BookOpenIcon, ChevronRightIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

interface VolunteerStory {
  id: string;
  title: string;
  authorName: string;
  date: string;
  image: string | null;
  excerpt: string;
  slug: string;
  featured: boolean;
  volunteer?: {
    name: string;
    image?: string | null;
    publicProfile: boolean;
  };
}

export default function VolunteerPage() {
  const [showContent, setShowContent] = useState(false);
  const [stories, setStories] = useState<VolunteerStory[]>([]);
  const [loading, setLoading] = useState(true);
  const storiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowContent(true);

    // Fetch volunteer stories
    async function fetchStories() {
      try {
        setLoading(true);
        const response = await fetch('/api/volunteer-stories?limit=6');
        if (!response.ok) throw new Error('Failed to fetch stories');
        
        const data = await response.json();
        console.log('Fetched stories:', data);
        setStories(data);
      } catch (error) {
        console.error('Error fetching volunteer stories:', error);
        // If fetch fails, provide fallback stories
        setStories([
          {
            id: 'fallback-1',
            title: 'My Journey with Street Dogs in Mumbai',
            authorName: 'Alex Thompson',
            date: '2024-01-15T00:00:00.000Z',
            image: 'https://images.unsplash.com/photo-1583336663277-620dc1996580?q=80&w=2069',
            excerpt: 'Volunteering with Paw Rescue changed my perspective on animal welfare and taught me valuable lessons about compassion.',
            slug: 'street-dogs-mumbai',
            featured: true,
          },
          {
            id: 'fallback-2',
            title: 'From Corporate Life to Animal Rescue',
            authorName: 'Sarah Johnson',
            date: '2023-12-10T00:00:00.000Z',
            image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1886',
            excerpt: 'I left my corporate job to pursue my passion for animal welfare, and it was the best decision I ever made.',
            slug: 'corporate-to-rescue',
            featured: false,
          },
          {
            id: 'fallback-3',
            title: 'A Family\'s Experience Fostering Kittens',
            authorName: 'The Martinez Family',
            date: '2023-11-05T00:00:00.000Z',
            image: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?q=80&w=2011',
            excerpt: 'Our family decided to foster kittens together, and it became an incredible learning experience for our children.',
            slug: 'fostering-kittens',
            featured: false,
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStories();

    // Set up intersection observer for animation
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
        rootMargin: '0px'
      }
    );

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const storyCards = document.querySelectorAll('.story-card');
      if (storyCards.length > 0) {
        storyCards.forEach((card) => observer.observe(card));
      }
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // Format the date display
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />
        <video 
          autoPlay 
          muted 
          loop
          className="absolute w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069"
        >
          <source src="https://player.vimeo.com/external/516128945.sd.mp4?s=db61d9be66a28094ef6d97e17ac8a275b8fbe068&profile_id=164" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white px-4">
          <div className="absolute top-4 right-4 md:top-8 md:right-8">
            <Button
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur"
              onClick={() => redirectToLogin("volunteer")}
            >
              Volunteer Login
            </Button>
          </div>
          
          <div className="max-w-4xl text-center">
            <Badge className="mb-4 bg-primary/80 hover:bg-primary">Make a Difference</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Become a Volunteer</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join our mission to rescue, rehabilitate and rehome animals in need. Your time can save lives.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Link href="/register/volunteer-registration">Register Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <a href="#volunteer-info">Learn More</a>
              </Button>
            </div>
          </div>
          
          <a 
            href="#volunteer-info"
            className="absolute bottom-8 p-4 rounded-full bg-primary/80 hover:bg-primary transition-colors bounce animate-bounce"
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

      {/* Stats Section */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Animals Helped</div>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">Active Volunteers</div>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Locations</div>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <div className="text-4xl font-bold text-primary mb-2">12+</div>
              <div className="text-muted-foreground">Years of Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Information Section */}
      <section id="volunteer-info" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl">
              <Image 
                src="/images/volunteer-hero.jpg" 
                alt="Volunteer with animals" 
                fill 
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1444212477490-ca407925329e?q=80&w=2428";
                }}
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">How You Can Help</h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg">
                  We are always seeking volunteers interested in working with animals, volunteer veterinarians, 
                  vet nurses, or vet students to work with our vets and animal care staff.
                </p>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-primary/10 p-2 rounded-full h-min w-min">
                      <HeartIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Animal Care</h3>
                      <p>Help with feeding, grooming, exercising, and socializing animals</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-primary/10 p-2 rounded-full h-min w-min">
                      <BookOpenIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Education & Outreach</h3>
                      <p>Participate in community education programs about animal welfare</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-primary/10 p-2 rounded-full h-min w-min">
                      <UserIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Administrative Support</h3>
                      <p>Assist with paperwork, phone calls, and organizing events</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex gap-4 flex-wrap">
                  <Button asChild size="lg" className="bg-primary">
                    <Link href="/register/volunteer-registration">
                      Register as Volunteer
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => redirectToLogin("volunteer")}
                    size="lg"
                  >
                    Volunteer Login
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Stories Section with Fade-in Effect */}
      <section id="stories" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4" ref={storiesRef}>
          <div className="text-center mb-12">
            <Badge className="mb-2">Inspirational</Badge>
            <h2 className="text-3xl font-bold mb-4">Volunteer Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Read about the experiences of our volunteers and how they've made a difference in the lives of animals
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="animate-pulse h-[400px]">
                  <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                    <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                      <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stories.slice(0, 3).map((story, index) => (
                <Card
                  key={story.id}
                  className="story-card overflow-hidden transition-all duration-700 hover:shadow-lg border"
                  style={{
                    transitionDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="h-52 relative">
                    {story.image ? (
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          // Fallback image on error
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1601758177266-bc599de87707?q=80&w=2070';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800">
                        <svg className="w-16 h-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {story.featured && (
                      <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatDate(story.date)}</span>
                      {story.volunteer?.publicProfile && (
                        <>
                          <span className="mx-1">•</span>
                          <UserIcon className="h-4 w-4" />
                          <span>{story.volunteer.name}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-semibold text-xl mb-3 line-clamp-2">{story.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{story.excerpt}</p>
                    <div className="pt-2">
                      <Button asChild variant="outline" className="w-full justify-between">
                        <Link href={`/volunteer/stories/${story.slug}`}>
                          Read Full Story
                          <ChevronRightIcon className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/volunteer/stories">View All Stories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How much time do I need to commit?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We welcome volunteers for any amount of time. Some volunteers commit to regular weekly schedules, 
                while others participate in special events or projects. We're flexible and appreciate any time you can give.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Do I need any special qualifications?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Most volunteer positions don't require specific qualifications, just a love for animals and a willingness to help.
                For specialized roles like veterinary assistance, relevant experience or qualifications may be needed.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Can I volunteer if I'm under 18?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Yes! We have youth volunteer programs for those under 18, though some positions may require adult supervision.
                It's a great way for young animal lovers to get involved and make a difference.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Will I receive training?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Yes, all volunteers receive appropriate training for their roles. We ensure you have the knowledge and
                skills needed to work effectively and safely with our animals and in our facilities.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our team of dedicated volunteers and help us create a better world for animals in need.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/register/volunteer-registration">
                Register Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .story-card {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .story-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        /* Make sure cards are visible by default on mobile */
        @media (max-width: 768px) {
          .story-card {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};