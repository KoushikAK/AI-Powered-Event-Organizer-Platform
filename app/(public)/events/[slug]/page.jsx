/* eslint-disable react-hooks/purity */
"use client";

import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Share2,
  Ticket,
  ExternalLink,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Heart,
  Sparkles,
  Activity,
  Globe2,
} from "lucide-react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import RegisterModal from "./_components/register-modal";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: event, isLoading } = useConvexQuery(api.events.getEventBySlug, {
    slug: params.slug,
  });

  const { data: registration } = useConvexQuery(
    api.registrations.checkRegistration,
    event?._id ? { eventId: event._id } : "skip"
  );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description.slice(0, 100) + "...",
          url: url,
        });
      } catch {
        // ignore
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleRegister = () => {
    if (!user) {
      toast.error("Please sign in to register");
      return;
    }
    setShowRegisterModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-purple-600/40 via-sky-500/40 to-fuchsia-500/40 blur-2xl opacity-70 animate-pulse" />
          <Loader2 className="relative w-10 h-10 animate-spin text-purple-400" />
        </div>
      </div>
    );
  }

  if (!event) {
    notFound();
  }

  const isEventFull = event.registrationCount >= event.capacity;
  const isEventPast = event.endDate < Date.now();
  const isOrganizer = user?.id === event.organizerId;
  const spotsLeft = Math.max(event.capacity - event.registrationCount, 0);

  const now = Date.now();
  let eventStatus = "upcoming";
  if (event.startDate <= now && event.endDate >= now) {
    eventStatus = "live";
  } else if (event.endDate < now) {
    eventStatus = "past";
  }

  const statusConfig = {
    live: {
      label: "Live now",
      classes:
        "bg-emerald-500/15 text-emerald-300 border-emerald-400/40 shadow-[0_0_40px_rgba(16,185,129,0.45)]",
      dot: "bg-emerald-400",
    },
    upcoming: {
      label: "Upcoming",
      classes:
        "bg-purple-500/15 text-purple-200 border-purple-400/40 shadow-[0_0_40px_rgba(168,85,247,0.4)]",
      dot: "bg-purple-400",
    },
    past: {
      label: "Past event",
      classes:
        "bg-gray-700/40 text-gray-300 border-gray-500/40 shadow-[0_0_30px_rgba(107,114,128,0.4)]",
      dot: "bg-gray-300",
    },
  }[eventStatus];

  return (
    <div className="relative min-h-screen bg-[#03030A] text-white overflow-x-hidden selection:bg-purple-500/30">
      {/* Deep Space Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Soft radial glows */}
        <div
          className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-purple-600/25 blur-[100px] mix-blend-screen"
          style={{
            backgroundColor: event.themeColor
              ? `${event.themeColor}35`
              : undefined,
          }}
        />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-sky-500/25 blur-[110px] mix-blend-screen" />

        {/* Futuristic grid overlay */}
        <div className="absolute inset-0 opacity-[0.25]">
          <div className="w-full h-full bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.28),_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(15,23,42,0.9))]" />
        </div>

        {/* Subtle scanline texture */}
        <div className="absolute inset-0 opacity-30 mix-blend-soft-light bg-[linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[length:100%_32px]" />
      </div>

      {/* Navigation Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-black/70 backdrop-blur-2xl border-b border-white/10"
            : "bg-gradient-to-b from-black/70 via-black/30 to-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-white/10 text-white border border-white/10/0 hover:border-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-[0.15em] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span className="text-gray-200">EventOS</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/10 text-white border border-white/10/0 hover:border-white/20 transition-all"
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-full hover:bg-white/10 text-white border border-white/10/0 hover:border-white/20 transition-all"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full min-h-[640px] h-[85vh] flex items-end pb-16 lg:pb-24">
        {/* Hero Background Image */}
        {event.coverImage && (
          <div className="absolute inset-0 -z-10">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover scale-[1.03]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03030A] via-[#03030A]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#03030A] via-transparent to-black/65" />
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)] gap-10 items-end">
            {/* Left: Title & Meta */}
            <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="outline"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md border-white/30 text-xs md:text-sm font-medium rounded-full px-4 py-1.5 uppercase tracking-[0.16em] text-gray-100"
                >
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
                  <span>Curated Experience</span>
                </Badge>

                <Badge
                  variant="outline"
                  className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold border ${statusConfig.classes}`}
                >
                  <span
                    className={`inline-flex h-2 w-2 rounded-full ${statusConfig.dot} animate-pulse`}
                  />
                  {statusConfig.label}
                </Badge>

                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs md:text-sm bg-black/40 border-white/20 backdrop-blur-md"
                >
                  {getCategoryIcon(event.category)}
                  <span>{getCategoryLabel(event.category)}</span>
                </Badge>
              </div>

              <h1 className="text-[2.6rem] sm:text-[3rem] md:text-[3.6rem] lg:text-[4.1rem] xl:text-[4.6rem] font-semibold tracking-tight leading-[1.08]">
                <span className="bg-gradient-to-br from-white via-white to-purple-200 bg-clip-text text-transparent">
                  {event.title}
                </span>
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base text-gray-200">
                <div className="flex items-center gap-2.5 bg-black/40 px-4 py-2.5 rounded-full border border-white/10 backdrop-blur-md">
                  <div className="p-1.5 rounded-full bg-purple-500/20">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                      Date
                    </span>
                    <span className="font-medium">
                      {format(event.startDate, "EEEE, MMMM dd")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-black/40 px-4 py-2.5 rounded-full border border-white/10 backdrop-blur-md">
                  <div className="p-1.5 rounded-full bg-sky-500/20">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-sky-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                      Time
                    </span>
                    <span className="font-medium">
                      {format(event.startDate, "h:mm a")} –{" "}
                      {format(event.endDate, "h:mm a")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-black/40 px-4 py-2.5 rounded-full border border-white/10 backdrop-blur-md">
                  <div className="p-1.5 rounded-full bg-pink-500/20">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-pink-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                      City
                    </span>
                    <span className="font-medium">
                      {event.city} {event.country ? `· ${event.country}` : null}
                    </span>
                  </div>
                </div>
              </div>

              {/* Micro stats strip */}
              <div className="flex flex-wrap gap-4 text-xs md:text-sm text-gray-300 pt-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Users className="w-3.5 h-3.5 text-purple-200" />
                  <span>
                    {event.registrationCount} joined · {spotsLeft} spots left
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Activity className="w-3.5 h-3.5 text-emerald-200" />
                  <span>
                    {event.ticketType === "free"
                      ? "Free access"
                      : "Premium access"}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Globe2 className="w-3.5 h-3.5 text-sky-200" />
                  <span>Curated by {event.organizerName}</span>
                </div>
              </div>
            </div>

            {/* Right: Floating Booking Capsule (only on large screens) */}
            {/* Commented out because this is another pricing section */}
            {/* <div className="hidden lg:flex justify-end">
              <div className="relative">
                <div className="absolute -inset-[2px] bg-gradient-to-br from-purple-500 via-sky-400 to-fuchsia-500 opacity-60 blur-xl" />
                <div className="relative w-[360px] rounded-3xl bg-black/70 border border-white/10 backdrop-blur-2xl p-6 shadow-2xl shadow-black/70">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Access pass
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200">
                      <Sparkles className="w-3 h-3" />
                      Ultra premium
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-semibold tracking-tight">
                        {event.ticketType === "free"
                          ? "Free"
                          : `₹${event.ticketPrice}`}
                      </span>
                      {event.ticketType === "paid" && (
                        <span className="text-xs text-gray-400">/ person</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Secure your spot in a next-gen live experience.
                    </p>
                  </div>

                  <div className="space-y-4 mb-5">
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <span className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-purple-300" />
                        Capacity
                      </span>
                      <span className="font-medium">
                        {event.registrationCount} / {event.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 via-sky-400 to-emerald-400"
                        style={{
                          width: `${Math.min(
                            (event.registrationCount / event.capacity) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-purple-600 via-sky-500 to-fuchsia-500 hover:from-purple-500 hover:via-sky-400 hover:to-fuchsia-500 text-white rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={
                      registration
                        ? () => router.push("/my-tickets")
                        : handleRegister
                    }
                    disabled={isEventPast || isEventFull}
                  >
                    {registration ? (
                      <>
                        <Ticket className="w-4 h-4 mr-2" />
                        View Ticket
                      </>
                    ) : isEventPast ? (
                      "Event Ended"
                    ) : isEventFull ? (
                      "Event Full"
                    ) : (
                      <>
                        <Ticket className="w-4 h-4 mr-2" />
                        Reserve your seat
                      </>
                    )}
                  </Button>

                  <p className="text-[10px] text-center text-gray-500 mt-3">
                    {event.ticketType === "paid"
                      ? "Payment will be collected at the venue."
                      : "No payment required for this event."}
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 pb-20 -mt-4 lg:-mt-8">
        <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-10 lg:gap-14">
          {/* Left column */}
          <div className="space-y-10">
            {/* About */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                    About this experience
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    A closer look at what you&apos;ll be part of.
                  </p>
                </div>
              </div>

              <div className="relative rounded-3xl border border-white/10 bg-black/50 backdrop-blur-xl p-6 md:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
                <div className="absolute -top-px inset-x-10 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />
                <div className="prose prose-invert prose-lg max-w-none text-gray-200 leading-relaxed">
                  <p className="whitespace-pre-wrap text-sm md:text-base">
                    {event.description}
                  </p>
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-sky-500/15 border border-sky-400/50 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-sky-200" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                    Venue & location
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Arrival details and how to get there.
                  </p>
                </div>
              </div>

              <div className="relative rounded-3xl border border-white/12 bg-black/55 backdrop-blur-xl p-6 md:p-7 hover:border-sky-400/60 transition-colors duration-300">
                <div className="flex items-start gap-5">
                  <div className="p-4 rounded-2xl bg-sky-500/15 border border-sky-300/40 flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-sky-200" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-semibold text-white">
                      {event.venue || "Venue details"}
                    </h3>
                    <p className="text-sm md:text-base text-gray-300">
                      {event.address}, {event.city}
                      {event.state ? `, ${event.state}` : ""}{" "}
                      {event.country ? `· ${event.country}` : ""}
                    </p>
                    {event.venue && (
                      <Button
                        variant="link"
                        className="text-sky-300 p-0 h-auto hover:text-sky-200 mt-2 text-sm font-medium"
                        asChild
                      >
                        <a
                          href={event.venue}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          View on map
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Organizer */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-pink-500/20 border border-pink-400/60 flex items-center justify-center">
                  <Users className="w-4 h-4 text-pink-100" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                    Hosted by
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    The team crafting this moment.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/12 bg-black/55 backdrop-blur-xl p-6 md:p-7 flex items-center gap-6 hover:border-pink-400/60 transition-colors duration-300">
                <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 border-white/15">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-sky-500 text-xl md:text-2xl font-bold text-white">
                    {event.organizerName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-lg md:text-xl font-semibold">
                    {event.organizerName}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-400">
                    Event organizer · Core curator
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-purple-300 hover:text-purple-200 text-sm font-medium"
                  >
                    View profile
                  </Button>
                </div>
              </div>
            </section>
          </div>

          {/* Right column: main booking card for all screens */}
          <aside className="lg:sticky lg:top-28 h-fit space-y-6">
            <div className="relative">
              <div className="absolute -inset-[1px] rounded-[1.9rem] bg-gradient-to-br from-purple-500/70 via-sky-400/70 to-fuchsia-500/70 opacity-80 blur-xl" />
              <div className="relative rounded-[1.8rem] bg-black/80 border border-white/10 backdrop-blur-2xl p-7 md:p-8 shadow-[0_30px_120px_rgba(0,0,0,0.9)]">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400 mb-2">
                      Total price
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-semibold tracking-tight">
                        {event.ticketType === "free"
                          ? "Free"
                          : `₹${event.ticketPrice}`}
                      </span>
                      {event.ticketType === "paid" && (
                        <span className="text-xs md:text-sm text-gray-400">
                          / person
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-2">
                      Transparent pricing. No hidden fees.
                    </p>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs md:text-sm text-gray-300">
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-300" />
                        Attendees
                      </span>
                      <span className="font-medium text-white">
                        {event.registrationCount} / {event.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 via-sky-400 to-emerald-400"
                        style={{
                          width: `${Math.min(
                            (event.registrationCount / event.capacity) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    {spotsLeft > 0 && !isEventPast && !isEventFull && (
                      <p className="text-[11px] text-emerald-300/90 flex items-center gap-2">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Only {spotsLeft} spots left for this session.
                      </p>
                    )}
                  </div>

                  <div className="pt-4">
                    {registration ? (
                      <div className="w-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium mb-4">
                        <CheckCircle className="w-4 h-4" />
                        You&apos;re registered for this event
                      </div>
                    ) : null}

                    {registration ? (
                      <Button
                        className="w-full h-14 text-sm md:text-base font-semibold bg-white text-black hover:bg-gray-100 rounded-xl transition-all duration-300"
                        onClick={() => router.push("/my-tickets")}
                      >
                        <Ticket className="w-5 h-5 mr-2" />
                        View ticket
                      </Button>
                    ) : isEventPast ? (
                      <Button
                        className="w-full h-14 text-sm md:text-base font-semibold bg-gray-800 text-gray-400 cursor-not-allowed rounded-xl"
                        disabled
                      >
                        Event ended
                      </Button>
                    ) : isEventFull ? (
                      <Button
                        className="w-full h-14 text-sm md:text-base font-semibold bg-gray-800 text-gray-400 cursor-not-allowed rounded-xl"
                        disabled
                      >
                        Event full
                      </Button>
                    ) : isOrganizer ? (
                      <Button
                        className="w-full h-14 text-sm md:text-base font-semibold bg-white text-black hover:bg-gray-100 rounded-xl transition-all duration-300"
                        onClick={() =>
                          router.push(`/events/${event.slug}/manage`)
                        }
                      >
                        Manage event
                      </Button>
                    ) : (
                      <Button
                        className="w-full h-14 text-sm md:text-base font-semibold bg-gradient-to-r from-purple-600 via-sky-500 to-fuchsia-500 hover:from-purple-500 hover:via-sky-400 hover:to-fuchsia-500 text-white shadow-xl shadow-purple-500/35 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        onClick={handleRegister}
                      >
                        Register now
                      </Button>
                    )}

                    <p className="text-center text-[11px] text-gray-500 mt-4">
                      {event.ticketType === "paid"
                        ? "Payment will be collected at the venue."
                        : "No payment required for this event."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showRegisterModal && (
        <RegisterModal
          event={event}
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
}
