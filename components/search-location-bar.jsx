/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Loader2, X } from "lucide-react";
import { State, City } from "country-state-city";
import { format } from "date-fns";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { createLocationSlug } from "@/lib/location-utils";
import { getCategoryIcon } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function SearchLocationBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  const { data: currentUser, isLoading } = useConvexQuery(
    api.users.getCurrentUser
  );
  const { mutate: updateLocation } = useConvexMutation(
    api.users.completeOnboarding
  );

  const { data: searchResults, isLoading: searchLoading } = useConvexQuery(
    api.search.searchEvents,
    searchQuery.trim().length >= 2 ? { query: searchQuery, limit: 5 } : "skip"
  );

  const indianStates = useMemo(() => State.getStatesOfCountry("IN"), []);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (currentUser?.location) {
      setSelectedState(currentUser.location.state || "");
      setSelectedCity(currentUser.location.city || "");
    }
  }, [currentUser, isLoading]);

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const cities = useMemo(() => {
    if (!selectedState) return [];
    const state = indianStates.find((s) => s.name === selectedState);
    if (!state) return [];
    return City.getCitiesOfState("IN", state.isoCode);
  }, [selectedState, indianStates]);

  const debouncedSetQuery = useRef(
    debounce((value) => setSearchQuery(value), 300)
  ).current;

  const handleSearchInput = (e) => {
    const value = e.target.value;
    debouncedSetQuery(value);
    setShowSearchResults(value.length >= 2);
  };

  const handleEventClick = (slug) => {
    setShowSearchResults(false);
    setSearchQuery("");
    router.push(`/events/${slug}`);
  };

  const handleLocationSelect = async (city, state) => {
    try {
      if (currentUser?.interests && currentUser?.location) {
        await updateLocation({
          location: { city, state, country: "India" },
          interests: currentUser.interests,
        });
      }
      const slug = createLocationSlug(city, state);
      router.push(`/explore/${slug}`);
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      ref={searchRef}
      initial={false}
      animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
      className={cn(
        "relative flex items-center w-full max-w-2xl mx-auto",
        "bg-background/80 backdrop-blur-xl border border-white/20 shadow-lg",
        "rounded-full p-1 transition-all duration-300",
        isFocused
          ? "ring-2 ring-purple-500/20 border-purple-500/30"
          : "hover:border-white/40"
      )}
    >
      {/* Search Input Section */}
      <div className="flex-1 flex items-center pl-4 pr-2">
        <Search
          className={cn(
            "w-4 h-4 mr-3 transition-colors",
            isFocused ? "text-purple-500" : "text-muted-foreground"
          )}
        />
        <Input
          placeholder="Search events, artists, venues..."
          onChange={handleSearchInput}
          onFocus={() => {
            setIsFocused(true);
            if (searchQuery.length >= 2) setShowSearchResults(true);
          }}
          className="border-none shadow-none focus-visible:ring-0 bg-transparent h-10 px-0 placeholder:text-muted-foreground/70"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setShowSearchResults(false);
            }}
            className="p-1 hover:bg-muted rounded-full"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-6 w-[1px] bg-border mx-2" />

      {/* Location Section */}
      <div className="flex items-center gap-1 pr-1">
        <div className="relative group">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-hover:text-purple-500 transition-colors" />
          <Select
            value={selectedState}
            onValueChange={(value) => {
              setSelectedState(value);
              setSelectedCity("");
            }}
          >
            <SelectTrigger className="w-[130px] border-none shadow-none focus:ring-0 bg-transparent pl-9 h-10 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {indianStates.map((state) => (
                <SelectItem key={state.isoCode} value={state.name}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select
          value={selectedCity}
          onValueChange={(value) => {
            setSelectedCity(value);
            if (value && selectedState) {
              handleLocationSelect(value, selectedState);
            }
          }}
          disabled={!selectedState}
        >
          <SelectTrigger className="w-[130px] border-none shadow-none focus:ring-0 bg-transparent h-10 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {cities.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showSearchResults && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {searchLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 flex items-center justify-between">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                    Events Found
                  </p>
                  <Badge variant="outline" className="text-[10px] h-5">
                    {searchResults.length}
                  </Badge>
                </div>
                {searchResults.map((event, index) => (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={event._id}
                    onClick={() => handleEventClick(event.slug)}
                    className="w-full px-4 py-3 hover:bg-purple-500/5 text-left transition-colors group border-b border-border/40 last:border-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                        {getCategoryIcon(event.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 truncate group-hover:text-purple-500 transition-colors">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-full">
                            <Calendar className="w-3 h-3" />
                            {format(event.startDate, "MMM dd")}
                          </span>
                          <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-full">
                            <MapPin className="w-3 h-3" />
                            {event.city}
                          </span>
                        </div>
                      </div>
                      {event.ticketType === "free" ? (
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
                        >
                          Free
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          Paid
                        </Badge>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">
                  No events found matching "{searchQuery}"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
