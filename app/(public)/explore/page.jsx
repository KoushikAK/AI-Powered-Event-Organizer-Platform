"use client";

import React, { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Loader2,
  Sparkles,
  Filter,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { createLocationSlug } from "@/lib/location-utils";
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
import { CATEGORIES, getCategoryLabel } from "@/lib/data";
import Autoplay from "embla-carousel-autoplay";
import EventCard from "@/components/event-card";

const sectionVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerParent = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const ExploreContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  // Get filters from URL
  const categoryFilter = searchParams.get("category");
  const timeFilter = searchParams.get("when");

  // Fetch current user for location
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  // Fetch filtered events (only if filters are active)
  const { data: filteredEvents, isLoading: loadingFiltered } = useConvexQuery(
    api.explore.getEvents,
    categoryFilter || timeFilter
      ? {
          category: categoryFilter || undefined,
          when: timeFilter || undefined,
          limit: 20,
        }
      : "skip"
  );

  // Fetch standard sections (only if NO filters are active)
  const showStandardSections = !categoryFilter && !timeFilter;

  const { data: featuredEvents, isLoading: loadingFeatured } = useConvexQuery(
    api.explore.getFeaturedEvents,
    showStandardSections ? { limit: 3 } : "skip"
  );

  const { data: localEvents, isLoading: loadingLocal } = useConvexQuery(
    api.explore.getEventsByLocation,
    showStandardSections
      ? {
          city: currentUser?.location?.city || "Gurugram",
          state: currentUser?.location?.state || "Haryana",
          limit: 4,
        }
      : "skip"
  );

  const { data: popularEvents, isLoading: loadingPopular } = useConvexQuery(
    api.explore.getPopularEvents,
    showStandardSections ? { limit: 6 } : "skip"
  );

  const { data: categoryCounts } = useConvexQuery(
    api.explore.getCategoryCounts
  );

  const handleEventClick = (slug) => {
    router.push(`/events/${slug}`);
  };

  const handleCategoryClick = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === categoryFilter) {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`/explore?${params.toString()}`);
  };

  const handleViewLocalEvents = () => {
    const city = currentUser?.location?.city || "Gurugram";
    const state = currentUser?.location?.state || "Haryana";
    const slug = createLocationSlug(city, state);
    router.push(`/explore/${slug}`);
  };

  const handleTimeFilterClick = (id) => {
    const params = new URLSearchParams(searchParams);
    if (id === timeFilter) {
      params.delete("when");
    } else {
      params.set("when", id);
    }
    router.push(`/explore?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/explore");
  };

  // Format categories with counts
  const categoriesWithCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: categoryCounts?.[cat.id] || 0,
  }));

  // Loading state
  const isLoading =
    (showStandardSections &&
      (loadingFeatured || loadingLocal || loadingPopular)) ||
    (!showStandardSections && loadingFiltered);

  const timeFilters = [
    { id: "today", label: "Today" },
    { id: "this-weekend", label: "This Weekend" },
    { id: "next-7-days", label: "Next 7 Days" },
    { id: "online", label: "Online" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 backdrop-blur-xl">
          <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Curating events for you
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerParent}
      className="space-y-16"
    >
      {/* Hero Title */}
      <motion.div
        variants={sectionVariant}
        className="pb-4 text-center space-y-6"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 backdrop-blur-xl shadow-lg shadow-purple-500/20">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Live events · Updated in real-time
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white via-purple-200 to-purple-500 bg-clip-text text-transparent">
            Discover Events That Match Your Vibe
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore curated experiences, discover what&apos;s happening near
            you, and find events that feel tailor-made for your world.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center text-xs md:text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10">
            <Sparkles className="w-3 h-3 text-purple-300" />
            <span>Featured & trending handpicked for you</span>
          </div>
          {currentUser?.location?.city && (
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10">
              <MapPin className="w-3 h-3" />
              <span>
                Tuning to <strong>{currentUser.location.city}</strong>
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Floating Filter Bar */}
      <motion.div
        variants={sectionVariant}
        className="sticky top-2 z-20 -mx-2 md:mx-0"
      >
        <div className="rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl px-3 py-2 md:px-4 md:py-3 shadow-[0_0_40px_rgba(15,23,42,0.9)] flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/40">
              <Filter className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <p className="font-medium text-foreground">Refine your explore</p>
              <p className="text-[11px] md:text-xs text-muted-foreground">
                Choose when you&apos;re free or jump into a scene.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {timeFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleTimeFilterClick(filter.id)}
                className={`text-xs md:text-sm rounded-full border px-3 py-1.5 transition-all ${
                  timeFilter === filter.id
                    ? "bg-purple-500 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                    : "border-white/15 bg-white/5 text-foreground/90 hover:border-purple-400/70 hover:bg-purple-500/10"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex flex-wrap gap-2 text-xs">
            {categoriesWithCounts.slice(0, 4).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 border transition-all ${
                  categoryFilter === category.id
                    ? "bg-sky-500 text-white border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                    : "bg-white/5 border-white/10 hover:border-sky-400/70 hover:bg-sky-500/10"
                }`}
              >
                <span className="text-base">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
            {(categoryFilter || timeFilter) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* --- FILTERED RESULTS VIEW --- */}
      {(categoryFilter || timeFilter) && (
        <motion.section variants={sectionVariant} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {filteredEvents?.length || 0} Results Found
              </h2>
              <p className="text-muted-foreground">
                Showing events for
                {categoryFilter && (
                  <span className="text-sky-400 font-medium">
                    {" "}
                    {getCategoryLabel(categoryFilter)}
                  </span>
                )}
                {categoryFilter && timeFilter && " and "}
                {timeFilter && (
                  <span className="text-purple-400 font-medium">
                    {" "}
                    {timeFilters.find((f) => f.id === timeFilter)?.label}
                  </span>
                )}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-white"
            >
              Clear Filters
            </Button>
          </div>

          {filteredEvents && filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{
                    y: -4,
                    boxShadow:
                      "0 0 40px rgba(168,85,247,0.25), 0 18px 40px rgba(15,23,42,0.9)",
                  }}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-purple-400/60 transition-all duration-300"
                >
                  <EventCard
                    event={event}
                    variant="grid"
                    onClick={() => handleEventClick(event.slug)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No matches found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or check back later.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                View All Events
              </Button>
            </div>
          )}
        </motion.section>
      )}

      {/* --- STANDARD VIEW (No Filters) --- */}
      {showStandardSections && (
        <>
          {/* Featured Carousel */}
          {featuredEvents && featuredEvents.length > 0 && (
            <motion.div variants={sectionVariant} className="mb-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="text-left">
                  <p className="text-xs uppercase tracking-[0.2em] text-purple-300/70 mb-1">
                    Spotlight
                  </p>
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    Featured Experiences
                  </h2>
                </div>
              </div>

              <div className="relative">
                {/* Glow ring */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                  <div className="mx-auto h-40 w-3/4 bg-purple-500/20 blur-3xl opacity-70" />
                </div>

                <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-purple-900/40 via-slate-950/80 to-black/90 p-[1px] shadow-[0_0_80px_rgba(168,85,247,0.45)]">
                  <div className="rounded-[1.4rem] bg-black/60 backdrop-blur-2xl p-2 md:p-4">
                    <Carousel
                      plugins={[plugin.current]}
                      className="w-full"
                      onMouseEnter={plugin.current.stop}
                      onMouseLeave={plugin.current.reset}
                    >
                      <CarouselContent>
                        {featuredEvents.map((event) => (
                          <CarouselItem key={event._id}>
                            <motion.div
                              whileHover={{ y: -4 }}
                              className="group relative h-[380px] md:h-[420px] lg:h-[460px] overflow-hidden rounded-2xl cursor-pointer border border-white/10 bg-black/40"
                              onClick={() => handleEventClick(event.slug)}
                            >
                              {event.coverImage ? (
                                <Image
                                  src={event.coverImage}
                                  alt={event.title}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                  priority
                                />
                              ) : (
                                <div
                                  className="absolute inset-0"
                                  style={{ backgroundColor: event.themeColor }}
                                />
                              )}

                              {/* Overlays */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(216,180,254,0.25),_transparent_60%)]" />

                              {/* Content */}
                              <div className="relative h-full flex flex-col justify-end p-6 md:p-10 gap-4">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <Badge
                                    className="w-fit bg-white/10 text-white border-white/20 backdrop-blur-md"
                                    variant="secondary"
                                  >
                                    {event.city}, {event.state || event.country}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="border-white/30 bg-black/40 text-xs text-white/80"
                                  >
                                    Featured
                                  </Badge>
                                </div>

                                <div className="space-y-2 max-w-2xl">
                                  <h2 className="text-2xl md:text-4xl font-semibold text-white">
                                    {event.title}
                                  </h2>
                                  <p className="text-sm md:text-base text-white/85 line-clamp-3">
                                    {event.description}
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-white/85 text-xs md:text-sm mt-2">
                                  <div className="inline-flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {format(event.startDate, "PPP")}
                                    </span>
                                  </div>
                                  <div className="inline-flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.city}</span>
                                  </div>
                                  <div className="inline-flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>
                                      {event.registrationCount} registered
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-4 border-white/40 bg-black/60 hover:bg-white/10" />
                      <CarouselNext className="right-4 border-white/40 bg-black/60 hover:bg-white/10" />
                    </Carousel>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Local Events */}
          {localEvents && localEvents.length > 0 && (
            <motion.section
              variants={sectionVariant}
              className="mb-4 space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70 mb-1">
                    Near You
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    Events Around{" "}
                    {currentUser?.location?.city || "your current location"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Curated happenings in{" "}
                    {currentUser?.location?.city || "your area"} to explore this
                    week.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="gap-2 border-white/30 bg-white/5 hover:bg-white/10"
                  onClick={handleViewLocalEvents}
                >
                  View all nearby
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {localEvents.map((event) => (
                  <motion.div
                    key={event._id}
                    whileHover={{
                      y: -4,
                      boxShadow:
                        "0 0 40px rgba(168,85,247,0.25), 0 18px 40px rgba(15,23,42,0.9)",
                    }}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-purple-400/60 transition-all duration-300"
                  >
                    <EventCard
                      event={event}
                      variant="compact"
                      onClick={() => handleEventClick(event.slug)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Browse by Category */}
          <motion.section variants={sectionVariant} className="mb-4 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sky-300/70 mb-1">
                  Discover by interest
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  Browse by Category
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tap into the scenes you care about — from tech and music to
                  culture and community.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {categoriesWithCounts.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 0 40px rgba(129,140,248,0.4)",
                  }}
                >
                  <Card
                    className="group cursor-pointer border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-purple-500/70 transition-all duration-300"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <CardContent className="px-3 sm:p-5 flex items-center gap-3">
                      <div className="text-3xl sm:text-4xl drop-shadow-[0_0_12px_rgba(168,85,247,0.55)]">
                        {category.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 group-hover:text-purple-300 transition-colors">
                          {category.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.count} event
                          {category.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Popular Events Across Country */}
          {popularEvents && popularEvents.length > 0 && (
            <motion.section
              variants={sectionVariant}
              className="mb-4 space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300/70 mb-1">
                    Nationwide buzz
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    Popular Across India
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    See what&apos;s trending across cities right now.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularEvents.map((event) => (
                  <motion.div
                    key={event._id}
                    whileHover={{
                      y: -4,
                      boxShadow: "0 0 40px rgba(236,72,153,0.3)",
                    }}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-fuchsia-400/70 transition-all duration-300"
                  >
                    <EventCard
                      event={event}
                      variant="list"
                      onClick={() => handleEventClick(event.slug)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Empty State */}
          {!loadingFeatured &&
            !loadingLocal &&
            !loadingPopular &&
            (!featuredEvents || featuredEvents.length === 0) &&
            (!localEvents || localEvents.length === 0) &&
            (!popularEvents || popularEvents.length === 0) && (
              <motion.div variants={sectionVariant}>
                <Card className="p-12 text-center bg-white/[0.03] border-dashed border-white/20">
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-white">
                      No events yet — you can start the story
                    </h2>
                    <p className="text-muted-foreground">
                      Be the first to create an event in your area and set the
                      vibe for everyone else.
                    </p>
                    <Button asChild className="gap-2">
                      <a href="/create-event">Create Event</a>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
        </>
      )}
    </motion.div>
  );
};

export default function ExplorePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Loading...
          </span>
        </div>
      }
    >
      <ExploreContent />
    </React.Suspense>
  );
}
