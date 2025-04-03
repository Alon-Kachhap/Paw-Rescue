"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

export default function StoriesPage() {
  const [stories, setStories] = useState<VolunteerStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<VolunteerStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    async function fetchStories() {
      try {
        setLoading(true);
        const response = await fetch('/api/volunteer-stories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }
        
        const data = await response.json();
        console.log('Fetched stories:', data);
        setStories(data);
        setFilteredStories(data);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError((err as Error).message || 'Failed to load stories');
        
        // Set a smaller set of fallback stories if API fails, with valid image URLs
        const fallbackStories = [
          {
            id: 'fallback-1',
            title: 'Our Journey with Paw Rescue',
            authorName: 'Marc and Elisa',
            date: '2024-02-15T00:00:00.000Z',
            image: 'https://images.unsplash.com/photo-1583336663277-620dc1996580?q=80&w=2069',
            excerpt: 'We spent a wonderful month working with the amazing dogs and dedicated volunteers...',
            slug: 'marc-and-elisa',
            featured: true,
          },
          {
            id: 'fallback-2',
            title: 'How Volunteering Changed My Life',
            authorName: 'Sarah Johnson',
            date: '2024-01-10T00:00:00.000Z',
            image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1886',
            excerpt: 'The experience of helping these animals has changed my perspective on life...',
            slug: 'sarah-johnson',
            featured: false,
          },
          {
            id: 'fallback-3',
            title: 'Learning Animal Care',
            authorName: 'David Chen',
            date: '2023-12-05T00:00:00.000Z',
            image: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?q=80&w=2011',
            excerpt: 'Working with the medical team taught me so much about animal care...',
            slug: 'david-chen',
            featured: false,
          }
        ];
        setStories(fallbackStories);
        setFilteredStories(fallbackStories);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStories();
  }, []);
  
  // Filter stories based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStories(stories);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = stories.filter(story => 
      story.title.toLowerCase().includes(term) || 
      story.authorName.toLowerCase().includes(term) || 
      story.excerpt.toLowerCase().includes(term)
    );
    
    setFilteredStories(filtered);
  }, [searchTerm, stories]);
  
  // Format date for display
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-6">
        <Link href="/volunteer" className="text-primary hover:underline inline-flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Volunteer Page
        </Link>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Volunteer Stories</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Read inspirational stories from our volunteers and discover the impact they've made
            in animal welfare and community service.
          </p>
          
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </header>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg">Loading stories...</p>
          </div>
        ) : error && filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">{error}</p>
            <Button asChild className="mt-4">
              <Link href="/volunteer">Back to Volunteer Page</Link>
            </Button>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-lg">No stories found matching your search.</p>
            <Button variant="link" onClick={() => setSearchTerm('')}>
              Clear search
            </Button>
          </div>
        ) : (
          <>
            {/* Featured stories */}
            {filteredStories.some(story => story.featured) && searchTerm === '' && (
              <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6">Featured Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredStories
                    .filter(story => story.featured)
                    .slice(0, 2)
                    .map(story => (
                      <div key={story.id} className="bg-card rounded-lg overflow-hidden shadow-lg border">
                        <div className="relative aspect-video">
                          {story.image ? (
                            <Image
                              src={story.image}
                              alt={story.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              onError={(e) => {
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
                        </div>
                        <div className="p-6">
                          <h3 className="font-semibold text-xl mb-2">{story.title}</h3>
                          <p className="text-muted-foreground mb-4">{story.excerpt}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{formatDate(story.date)}</span>
                            <Button asChild>
                              <Link href={`/volunteer/stories/${story.slug}`}>
                                Read Story
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}
            
            {/* All stories */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">{searchTerm ? 'Search Results' : 'All Stories'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories
                  .filter(story => searchTerm !== '' || !story.featured)
                  .map(story => (
                    <div key={story.id} className="bg-card rounded-lg overflow-hidden shadow border h-full flex flex-col">
                      <div className="relative h-48">
                        {story.image ? (
                          <Image
                            src={story.image}
                            alt={story.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1601758177266-bc599de87707?q=80&w=2070';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800">
                            <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-semibold text-lg mb-2">{story.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 flex-1">{story.excerpt}</p>
                        <div className="flex justify-between items-center mt-auto">
                          <span className="text-xs text-muted-foreground">{formatDate(story.date)}</span>
                          <Link
                            href={`/volunteer/stories/${story.slug}`}
                            className="text-primary hover:underline text-sm font-medium"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </>
        )}
        
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Inspired by these stories? Join our volunteer team and make a difference!
          </p>
          <Button asChild size="lg">
            <Link href="/register/volunteer-registration">
              Become a Volunteer
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 