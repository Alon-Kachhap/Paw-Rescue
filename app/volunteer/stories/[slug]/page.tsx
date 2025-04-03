"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Calendar, User, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface VolunteerStory {
  id: string;
  title: string;
  authorName: string;
  date: string;
  image: string | null;
  excerpt: string;
  content: string;
  slug: string;
  volunteer?: {
    id: string;
    name: string;
    email?: string | null;
    image?: string | null;
    about?: string;
    publicProfile: boolean;
  } | null;
}

export default function StoryPage() {
  const { slug } = useParams();
  const [story, setStory] = useState<VolunteerStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchStory() {
      try {
        setLoading(true);
        const response = await fetch(`/api/volunteer-stories?slug=${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Story not found');
          }
          throw new Error('Failed to fetch story');
        }
        
        const data = await response.json();
        console.log('Fetched story:', data);
        
        // Set a fallback image if none exists
        if (!data.image) {
          data.image = 'https://images.unsplash.com/photo-1583336663277-620dc1996580?q=80&w=2069';
        }
        
        setStory(data);
      } catch (err) {
        console.error('Error fetching story:', err);
        setError((err as Error).message || 'Failed to load story');
      } finally {
        setLoading(false);
      }
    }
    
    if (slug) {
      fetchStory();
    }
  }, [slug]);
  
  // Format date for display
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
  // Author section (only display if volunteer profile is public)
  const displayAuthorSection = () => {
    if (!story.volunteer || !story.volunteer.publicProfile) {
      return null;
    }
    
    return (
      <div className="flex items-center space-x-4 mb-6">
        {story.volunteer.image ? (
          <Image
            src={story.volunteer.image}
            alt={story.volunteer.name}
            width={48}
            height={48}
            className="rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1583336663277-620dc1996580?q=80&w=2069";
            }}
          />
        ) : (
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        <div>
          <p className="font-semibold">{story.volunteer.name}</p>
          <Link href="/volunteer/stories" className="text-sm text-primary hover:underline">
            View All Stories
          </Link>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading story...</p>
        </div>
      </div>
    );
  }
  
  if (error || !story) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Story Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8">
            {error || "We couldn't find the story you're looking for."}
          </p>
          <Button asChild>
            <Link href="/volunteer">Back to Volunteer Page</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-6">
        <Link 
          href="/volunteer" 
          className="text-primary hover:underline inline-flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Volunteer Stories
        </Link>
      </div>
      
      <article className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
          <div className="flex items-center text-muted-foreground mb-6">
            <Calendar className="mr-2 h-5 w-5" />
            <time>{formatDate(story.date)}</time>
            <span className="mx-2">•</span>
            <User className="mr-2 h-5 w-5" />
            <span>{story.authorName}</span>
          </div>
          
          {story.image && (
            <div className="relative w-full aspect-video mb-8 rounded-xl overflow-hidden">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/fallback-image.jpg';
                }}
              />
            </div>
          )}
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="prose max-w-none prose-img:rounded-lg prose-headings:font-semibold prose-h3:text-xl dark:prose-invert">
                {story.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            {/* Only show volunteer details if they are public */}
            {story.volunteer && story.volunteer.publicProfile ? (
              <div className="bg-muted/20 rounded-lg p-6 mt-10">
                <h2 className="text-xl font-semibold mb-4">About the Volunteer</h2>
                
                {displayAuthorSection()}
                
                {story.volunteer.about && (
                  <div className="mt-4 text-muted-foreground">
                    <p>{story.volunteer.about}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="italic text-center text-muted-foreground mt-10 p-4 border-t">
                This story was shared by a volunteer at Paw Rescue.
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap items-center justify-between">
                <Link href="/volunteer/stories" className="text-primary hover:underline mb-4 md:mb-0">
                  View All Stories
                </Link>
                
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    asChild
                  >
                    <Link href="/register/volunteer-registration">
                      Become a Volunteer
                    </Link>
                  </Button>
                  
                  <Button asChild>
                    <Link href="/contact">
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {story.volunteer && (
            <aside>
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About the Volunteer</h2>
                  
                  {displayAuthorSection()}
                  
                  {story.volunteer.publicProfile && story.volunteer.about && (
                    <p className="text-muted-foreground text-sm whitespace-pre-line">
                      {story.volunteer.about}
                    </p>
                  )}
                  
                  {story.volunteer.publicProfile && (
                    <div className="mt-6 pt-4 border-t text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Inspired by {story.volunteer.name}'s story?
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/register/volunteer-registration">
                          Join as a Volunteer
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </aside>
          )}
        </div>
      </article>
    </div>
  );
} 