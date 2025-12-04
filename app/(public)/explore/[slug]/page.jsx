"use client";

import { useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Loader2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { parseLocationSlug } from "@/lib/location-utils";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CATEGORIES } from "@/lib/data";
import Autoplay from "embla-carousel-autoplay";
import EventCard from "@/components/event-card";
import BlobCursor from "@/components/BlobCursor";
import FloatingLines from "@/components/FloatingLines";
import { useMagnetic } from "@/hooks/useMagnetic";

export default function ExploreLocationPage() {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;
  const { onMove, onLeave } = useMagnetic();

  // Parse location from slug
  const decodedSlug = decodeURIComponent(slug);
  const { city, state, isValid } = parseLocationSlug(decodedSlug);

  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  // Fetch events for this specific location
  const { data: localEvents, isLoading: loadingLocal } = useConvexQuery(
    api.explore.getEventsByLocation,
    isValid
      ? {
          city: city,
          state: state,
          limit: 12,
        }
      : "skip"
  );

  const { data: popularEvents, isLoading: loadingPopular } = useConvexQuery(
    api.explore.getPopularEvents,
    { limit: 4 }
  );

  const handleEventClick = (slug) => {
    router.push(`/events/${slug}`);
  };

  // Loading state
  const isLoading = loadingLocal || loadingPopular;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020008]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Invalid location state
  if (!isValid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-6 bg-[#020008] text-white relative overflow-hidden">
        {/* Background effects */}
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_center,_#1a103d_0%,_#020008_100%)]" />
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />

        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-4">
          <MapPin className="w-10 h-10 text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold">Location not found</h1>
        <p className="text-gray-400 max-w-md px-6">
          We couldn&apos;t find &quot;{decodedSlug}&quot;. It might not exist or
          we don&apos;t support it yet.
        </p>
        <Button
          onClick={() => router.push("/explore")}
          variant="outlineGlow"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          Back to Explore
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      {/* --- Cinematic Background Layers --- */}
      <div className="fixed inset-0 z-[-4] bg-[radial-gradient(ellipse_at_top,_#1a103d_0%,_#05010e_60%,_#020008_100%)]" />
      <div className="fixed inset-0 z-[-3] blur-3xl opacity-40 bg-[radial-gradient(circle_at_85%_25%,_rgba(124,92,255,0.2),_transparent_55%),_radial-gradient(circle_at_15%_70%,_rgba(248,130,190,0.15),_transparent_55%)]" />
      <div className="fixed inset-0 z-[-2] pointer-events-none opacity-60">
        <FloatingLines
          enabledWaves={["top"]}
          lineCount={[3]}
          lineDistance={[12]}
          animationSpeed={0.3}
          interactive={false}
          parallax={true}
          parallaxStrength={0.1}
          mixBlendMode="screen"
          linesGradient={["#6366F1", "#EC4899"]}
        />
      </div>
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />

      {/* BlobCursor */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <BlobCursor
          blobType="circle"
          fillColor="#EC4899"
          trailCount={1}
          sizes={[80]}
          innerSizes={[30]}
          opacities={[0.3]}
          filterStdDeviation={30}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-4 pt-4">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/5 -ml-4 gap-2"
            onClick={() => router.push("/explore")}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Button>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide uppercase text-purple-300 backdrop-blur-sm">
              <MapPin className="w-3 h-3" />
              <span className="font-medium">{state}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Events in{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {city}
              </span>
            </h1>
            <p className="text-lg text-gray-400/80 max-w-2xl font-light">
              Discover the best experiences happening right now in your city.
            </p>
          </div>
        </div>

        {/* Events Grid */}
        {localEvents && localEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {localEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                variant="grid"
                onClick={() => handleEventClick(event.slug)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              No events in {city} yet
            </h2>
            <p className="text-gray-400 mb-8 max-w-md">
              It looks like a quiet week. Be the changemaker and host the first
              event!
            </p>
            <Button
              asChild
              variant="premium"
              className="gap-2"
              onMouseMove={onMove}
              onMouseLeave={onLeave}
            >
              <a href="/create-event">Create Event</a>
            </Button>
          </div>
        )}

        {/* Popular Events (Fallback/Discovery) */}
        {popularEvents && popularEvents.length > 0 && (
          <div className="pt-12 border-t border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">
                  Popular Elsewhere
                </h2>
                <p className="text-gray-400">Trending events across India</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  variant="compact"
                  onClick={() => handleEventClick(event.slug)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
