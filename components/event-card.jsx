/* eslint-disable react-hooks/purity */
"use client";

import Image from "next/image";
import { Calendar, MapPin, Users, QrCode, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

/**
 * Normalize Unsplash page URL -> images.unsplash.com CDN URL when possible.
 * Keeps next/image happy and prevents hostname errors.
 */
function normalizeImageUrl(url, w = 1400) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("unsplash.com") && u.pathname.startsWith("/photos/")) {
      const id = u.pathname.split("/").pop();
      return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
    }
    return url;
  } catch {
    return url;
  }
}

export default function EventCard({
  event = {},
  onClick,
  onDelete,
  action = null, // 'event' | 'ticket' | null
  variant = "grid", // 'grid' | 'list'
  className = "",
}) {
  const imageSrc = normalizeImageUrl(event.coverImage || event.image);

  const startText = event?.startDate ? format(new Date(event.startDate), "PPP • h:mm a") : "";

  // Shared gradient for premium accent
  const accentGradient = "bg-[linear-gradient(90deg,#7c3aed,#ec4899)]";

  if (variant === "list") {
    return (
      <article
        onClick={onClick}
        role="button"
        className={`group flex gap-4 items-center p-3 rounded-xl bg-white/4 backdrop-blur-sm border border-white/6 shadow-sm hover:shadow-2xl transition-transform transform hover:-translate-y-1 cursor-pointer ${className}`}
      >
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-none">
          {imageSrc ? (
            <Image src={imageSrc} alt={event.title || "event"} fill className="object-cover transition-transform group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-2xl">
              🎫
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white line-clamp-2">{event.title}</h3>
          <p className="text-xs text-slate-300 mt-1">{startText}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {event.locationType === "online" ? "Online" : event.city}
            </span>
            <Badge className="text-xs">{event.ticketType === "free" ? "Free" : "Paid"}</Badge>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-slate-300 flex items-center gap-1">
            <Users className="w-4 h-4" /> <span>{event.registrationCount || 0}</span>
          </div>

          <div className="flex gap-2">
            {action && (
              <Button
                className={`px-3 py-1 rounded-lg text-sm ${accentGradient} text-white shadow-md`}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.(event);
                }}
              >
                {action === "ticket" ? <><QrCode className="w-4 h-4 mr-2 inline" /> Ticket</> : <><Eye className="w-4 h-4 mr-2 inline" /> View</>}
              </Button>
            )}

            {onDelete && (
              <Button
                variant="outline"
                className="px-2 py-1 rounded-lg text-sm border-red-400 text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event._id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </article>
    );
  }

  // GRID / CARD variant (big premium look)
  return (
    <Card className={`relative overflow-hidden rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-all ${className}`} onClick={() => onClick?.(event)}>
      <div className="relative h-56">
        {imageSrc ? (
          <Image src={imageSrc} alt={event.title || "event"} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-5xl">🎫</div>
        )}

        {/* Glowy gradient top-left badge */}
        <div className="absolute left-6 top-6">
          <Badge className="px-3 py-1 text-sm bg-white/8 backdrop-blur-md shadow-md">{event.ticketType === "free" ? "FREE" : "PAID"}</Badge>
        </div>

        {/* People / capacity chip bottom-right */}
        <div className="absolute right-6 bottom-6">
          <div className="bg-white/6 text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-2 shadow-sm">
            <Users className="w-4 h-4" />
            <span>{event.registrationCount || 0}/{event.capacity || "—"}</span>
          </div>
        </div>

        {/* diagonal glossy sheen */}
        <div className="absolute -left-24 -top-12 w-72 h-72 opacity-10 rotate-12 blur-2xl bg-gradient-to-r from-white/30 via-white/10 to-transparent pointer-events-none" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white line-clamp-2">{event.title}</h3>
            <p className="text-sm text-slate-300 mt-2">{startText}</p>

            <div className="flex items-center gap-4 mt-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(event.startDate), "EEE, h:mm a")}</span>
              </div>

              <div className="flex items-center gap-2 max-w-xs">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{event.locationType === "online" ? "Online Event" : `${event.city}${event.state ? `, ${event.state}` : ""}`}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {action && (
              <Button
                className={`px-4 py-2 rounded-xl text-sm ${accentGradient} text-white shadow-lg`}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.(event);
                }}
              >
                {action === "ticket" ? <><QrCode className="w-4 h-4 mr-2 inline" /> Ticket</> : <><Eye className="w-4 h-4 mr-2 inline" /> View</>}
              </Button>
            )}

            {onDelete && (
              <Button
                variant="outline"
                className="px-3 py-2 rounded-lg text-sm border-red-400 text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event._id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
