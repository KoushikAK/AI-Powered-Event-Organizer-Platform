"use client";

import { useRouter } from "next/navigation";
import {
  Plus,
  Loader2,
  Search,
  Calendar,
  Sparkles,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EventCard from "@/components/event-card";
import { Input } from "@/components/ui/input";

export default function MyEventsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events, isLoading } = useConvexQuery(api.events.getMyEvents);
  const { mutate: deleteEvent } = useConvexMutation(api.events.deleteEvent);

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone and will permanently delete the event and all associated registrations."
    );

    if (!confirmed) return;

    try {
      await deleteEvent({ eventId });
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete event");
    }
  };

  const handleEventClick = (eventId) => {
    router.push(`/my-events/${eventId}`);
  };

  const filteredEvents = events?.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/95">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 px-4 relative overflow-hidden bg-black text-white selection:bg-purple-500/30">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-3000" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-5000" />
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-pink-900/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 pt-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent flex items-center gap-3"
            >
              My Events
              <Sparkles className="w-8 h-8 text-purple-400" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg"
            >
              Manage your created events and track attendees
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              asChild
              className="bg-white text-black hover:bg-gray-200 rounded-full px-6 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105"
            >
              <Link href="/create-event">
                <Plus className="w-5 h-5 mr-2" />
                Create New Event
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Search & Stats Bar - Only show if there are events */}
        {events?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-8 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search events by title or city..."
                className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-500 hover:border-white/20 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400 px-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>{events.length} Total Events</span>
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-400" />
                <span>Active</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Event Grid */}
        <AnimatePresence mode="wait">
          {events?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-20 text-center bg-white/5 border-white/10 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="relative z-10 max-w-md mx-auto space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500">
                    <Calendar className="w-10 h-10 text-white/80" />
                  </div>

                  <h2 className="text-3xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                    No events yet
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Start your journey by organizing your first event. It only
                    takes a few minutes.
                  </p>

                  <div className="pt-4">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-0 shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 transition-all duration-300 hover:scale-105"
                    >
                      <Link href="/create-event">
                        <Plus className="w-5 h-5 mr-2" />
                        Create Your First Event
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredEvents?.map((event) => (
                  <motion.div
                    key={event._id}
                    variants={itemVariants}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <EventCard
                      event={event}
                      action="event"
                      onClick={() => handleEventClick(event._id)}
                      onDelete={handleDelete}
                      variant="grid"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredEvents?.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20 text-gray-500"
                >
                  No events found matching "{searchQuery}"
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
