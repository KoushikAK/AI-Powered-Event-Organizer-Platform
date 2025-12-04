"use client";

import { Calendar, MapPin, Users, Trash2, X, QrCode, Eye } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function EventCard({
  event,
  onClick,
  onDelete,
  variant = "grid", // "grid" | "list" | "compact"
  action = null, // "event" | "ticket" | null
  className = "",
}) {
  // List variant (compact horizontal layout)
  if (variant === "list") {
    return (
      <Card
        className={`py-0 group cursor-pointer border-white/5 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all duration-300 ${className}`}
        onClick={onClick}
      >
        <CardContent className="p-3 flex gap-4">
          {/* Event Image */}
          <div className="w-24 h-24 rounded-lg shrink-0 overflow-hidden relative border border-white/10">
            {event.coverImage ? (
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center text-3xl"
                style={{ backgroundColor: event.themeColor }}
              >
                {getCategoryIcon(event.category)}
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="flex-1 min-w-0 py-1">
            <h3 className="font-semibold text-base mb-1 text-white group-hover:text-purple-300 transition-colors line-clamp-1">
              {event.title}
            </h3>
            <p className="text-xs text-gray-400 mb-2">
              {format(event.startDate, "EEE, dd MMM, HH:mm")}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-pink-400" />
                <span className="line-clamp-1">
                  {event.locationType === "online"
                    ? "Online Event"
                    : event.city}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-400" />
                <span>{event.registrationCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact variant (smaller grid card)
  if (variant === "compact") {
    return (
      <Card
        className={`overflow-hidden group border-white/5 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:-translate-y-1 transition-all duration-300 ${onClick ? "cursor-pointer" : ""} ${className}`}
        onClick={onClick}
      >
        <div className="relative h-40 overflow-hidden">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              width={400}
              height={160}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-4xl"
              style={{ backgroundColor: event.themeColor }}
            >
              {getCategoryIcon(event.category)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-semibold text-sm text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
              {event.title}
            </h3>
            <p className="text-xs text-gray-300">
              {format(event.startDate, "MMM dd")} • {event.city}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Grid variant (default - premium card)
  return (
    <Card
      className={`overflow-hidden group border-white/5 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 transition-all duration-300 ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            width={500}
            height={192}
            priority
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: event.themeColor }}
          >
            {getCategoryIcon(event.category)}
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="bg-black/40 backdrop-blur-md text-white border-white/10"
          >
            {event.ticketType === "free" ? "Free" : "Paid"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        <div>
          <Badge
            variant="outline"
            className="mb-2 border-white/10 text-gray-300 bg-white/5"
          >
            {getCategoryIcon(event.category)} {getCategoryLabel(event.category)}
          </Badge>
          <h3 className="font-bold text-xl line-clamp-2 text-white group-hover:text-purple-300 transition-colors">
            {event.title}
          </h3>
        </div>

        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>{format(event.startDate, "PPP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-pink-400" />
            <span className="line-clamp-1">
              {event.locationType === "online"
                ? "Online Event"
                : `${event.city}, ${event.state || event.country}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>
              {event.registrationCount} / {event.capacity} registered
            </span>
          </div>
        </div>

        {action && (
          <div className="flex gap-2 pt-2">
            {/* Primary button */}
            <Button
              variant="outlineGlow"
              size="sm"
              className="flex-1 gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
              }}
            >
              {action === "event" ? (
                <>
                  <Eye className="w-4 h-4" />
                  View
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  Show Ticket
                </>
              )}
            </Button>

            {/* Secondary button - delete / cancel */}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event._id);
                }}
              >
                {action === "event" ? (
                  <Trash2 className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
