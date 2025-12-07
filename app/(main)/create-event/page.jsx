/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { State, City } from "country-state-city";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import UnsplashImagePicker from "@/components/unsplash-image-picker";
import AIEventCreator from "./_components/ai-event-creator";
import UpgradeModal from "@/components/upgrade-modal";
import { CATEGORIES } from "@/lib/data";
import Image from "next/image";

// HH:MM in 24h
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string().regex(timeRegex, "Start time must be HH:MM"),
  endTime: z.string().regex(timeRegex, "End time must be HH:MM"),
  locationType: z.enum(["physical", "online"]).default("physical"),
  venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  ticketType: z.enum(["free", "paid"]).default("free"),
  ticketPrice: z.number().optional(),
  coverImage: z.string().optional(),
  themeColor: z.string().default("#1e3a8a"),
});

export default function CreateEventPage() {
  const router = useRouter();
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("limit"); // "limit" or "color"

  // Check if user has Pro plan
  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const { mutate: createEvent, isLoading } = useConvexMutation(
    api.events.createEvent
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      locationType: "physical",
      ticketType: "free",
      capacity: 50,
      themeColor: "#1e3a8a",
      category: "",
      state: "",
      city: "",
      startTime: "",
      endTime: "",
    },
  });

  const themeColor = watch("themeColor");
  const ticketType = watch("ticketType");
  const selectedState = watch("state");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const coverImage = watch("coverImage");

  const indianStates = useMemo(() => State.getStatesOfCountry("IN"), []);
  const cities = useMemo(() => {
    if (!selectedState) return [];
    const st = indianStates.find((s) => s.name === selectedState);
    if (!st) return [];
    return City.getCitiesOfState("IN", st.isoCode);
  }, [selectedState, indianStates]);

  // Color presets - show all for Pro, only default for Free
  const colorPresets = [
    "#1e3a8a", // Default color (always available)
    ...(hasPro ? ["#4c1d95", "#065f46", "#92400e", "#7f1d1d", "#831843"] : []),
  ];

  const handleColorClick = (color) => {
    // If not default color and user doesn't have Pro
    if (color !== "#1e3a8a" && !hasPro) {
      setUpgradeReason("color");
      setShowUpgradeModal(true);
      return;
    }
    setValue("themeColor", color);
  };

  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    const [hh, mm] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(hh, mm, 0, 0);
    return d;
  };

  const onSubmit = async (data) => {
    try {
      const start = combineDateTime(data.startDate, data.startTime);
      const end = combineDateTime(data.endDate, data.endTime);

      if (!start || !end) {
        toast.error("Please select both date and time for start and end.");
        return;
      }
      if (end.getTime() <= start.getTime()) {
        toast.error("End date/time must be after start date/time.");
        return;
      }

      // Check event limit for Free users
      if (!hasPro && currentUser?.freeEventsCreated >= 1) {
        setUpgradeReason("limit");
        setShowUpgradeModal(true);
        return;
      }

      // Check if trying to use custom color without Pro
      if (data.themeColor !== "#1e3a8a" && !hasPro) {
        setUpgradeReason("color");
        setShowUpgradeModal(true);
        return;
      }

      await createEvent({
        title: data.title,
        description: data.description,
        category: data.category,
        tags: [data.category],
        startDate: start.getTime(),
        endDate: end.getTime(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locationType: data.locationType,
        venue: data.venue || undefined,
        address: data.address || undefined,
        city: data.city,
        state: data.state || undefined,
        country: "India",
        capacity: data.capacity,
        ticketType: data.ticketType,
        ticketPrice: data.ticketPrice || undefined,
        coverImage: data.coverImage || undefined,
        themeColor: data.themeColor,
        //Commented out as it is not used
        // hasPro, 
      });

      toast.success("Event created successfully! 🎉");
      router.push("/my-events");
    } catch (error) {
      toast.error(error.message || "Failed to create event");
    }
  };

  const handleAIGenerate = (generatedData) => {
    setValue("title", generatedData.title);
    setValue("description", generatedData.description);
    setValue("category", generatedData.category);
    setValue("capacity", generatedData.suggestedCapacity);
    setValue("ticketType", generatedData.suggestedTicketType);
    toast.success("Event details filled! Customize as needed.");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 md:py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)`,
          }}
        />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              Create Event
            </h1>
            <p className="text-lg text-muted-foreground">
              Bring your ideas to life and connect with your community.
            </p>
            {!hasPro && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-muted-foreground mt-2">
                <span>
                  Free Plan: {currentUser?.freeEventsCreated || 0}/1 events
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-400" />
                <span
                  className="text-purple-600 cursor-pointer hover:underline"
                  onClick={() => {
                    setUpgradeReason("limit");
                    setShowUpgradeModal(true);
                  }}
                >
                  Upgrade for unlimited
                </span>
              </div>
            )}
          </div>
          <AIEventCreator onEventGenerated={handleAIGenerate} />
        </div>

        {/* Main Content Card */}
        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-10 grid md:grid-cols-[350px_1fr] gap-10 lg:gap-16">
            {/* LEFT COLUMN: Visuals & Theme */}
            <div className="space-y-8">
              {/* Cover Image */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Cover Image</Label>
                <div
                  className="group relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-500/50 dark:hover:border-purple-400/50 transition-all cursor-pointer bg-gray-50/50 dark:bg-gray-900/50"
                  onClick={() => setShowImagePicker(true)}
                >
                  {coverImage ? (
                    <>
                      <Image
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width={800}
                        height={450}
                        priority
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-medium flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> Change Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3 group-hover:text-purple-500 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6 opacity-50" />
                      </div>
                      <span className="text-sm font-medium">
                        Add Cover Image
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Theme Color */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Theme Color</Label>
                  {!hasPro && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-2 py-0.5 h-auto border-purple-200 text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
                    >
                      PRO FEATURE
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`relative aspect-square rounded-xl transition-all duration-300 flex items-center justify-center ${
                        !hasPro && color !== "#1e3a8a"
                          ? "opacity-50 cursor-not-allowed grayscale"
                          : "hover:scale-105 hover:shadow-lg"
                      }`}
                      style={{
                        backgroundColor: color,
                        boxShadow:
                          themeColor === color
                            ? `0 0 0 3px white, 0 0 0 5px ${color}`
                            : "none",
                      }}
                      onClick={() => handleColorClick(color)}
                    >
                      {themeColor === color && (
                        <Sparkles className="w-4 h-4 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}

                  {!hasPro && (
                    <button
                      type="button"
                      onClick={() => {
                        setUpgradeReason("color");
                        setShowUpgradeModal(true);
                      }}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-1 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                    >
                      <span className="text-xs font-bold text-muted-foreground group-hover:text-purple-600">
                        +
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Event Title */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Event Title</Label>
                <Input
                  {...register("title")}
                  placeholder="e.g., Summer Music Festival 2024"
                  className="h-14 text-lg px-4 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Category
                  </Label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              <span className="flex items-center gap-2">
                                {cat.icon} {cat.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-xs text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Capacity
                  </Label>
                  <Input
                    type="number"
                    {...register("capacity", { valueAsNumber: true })}
                    placeholder="Max attendees"
                    className="h-12 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                  />
                  {errors.capacity && (
                    <p className="text-xs text-red-500">
                      {errors.capacity.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Date & Time Section */}
              <div className="space-y-4 p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-purple-500" /> Date &
                  Time
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Start */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Starts
                    </Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`flex-1 justify-start text-left font-normal h-11 rounded-lg border-gray-200 dark:border-gray-700 ${!startDate && "text-muted-foreground"}`}
                          >
                            {startDate
                              ? format(startDate, "MMM d, yyyy")
                              : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => setValue("startDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="time"
                        {...register("startTime")}
                        className="w-24 h-11 rounded-lg border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    {(errors.startDate || errors.startTime) && (
                      <p className="text-xs text-red-500">Required</p>
                    )}
                  </div>

                  {/* End */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ends
                    </Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`flex-1 justify-start text-left font-normal h-11 rounded-lg border-gray-200 dark:border-gray-700 ${!endDate && "text-muted-foreground"}`}
                          >
                            {endDate
                              ? format(endDate, "MMM d, yyyy")
                              : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => setValue("endDate", date)}
                            disabled={(date) =>
                              date < (startDate || new Date())
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="time"
                        {...register("endTime")}
                        className="w-24 h-11 rounded-lg border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    {(errors.endDate || errors.endTime) && (
                      <p className="text-xs text-red-500">Required</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Location</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="state"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          setValue("city", "");
                        }}
                      >
                        <SelectTrigger className="h-11 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((s) => (
                            <SelectItem key={s.isoCode} value={s.name}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Controller
                    control={control}
                    name="city"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedState}
                      >
                        <SelectTrigger className="h-11 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
                          <SelectValue placeholder="City" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((c) => (
                            <SelectItem key={c.name} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <Input
                    {...register("venue")}
                    placeholder="Venue Link (e.g., Google Maps)"
                    type="url"
                    className="h-11 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                  />
                  <Input
                    {...register("address")}
                    placeholder="Full Address (Street, Building, etc.)"
                    className="h-11 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Description</Label>
                <Textarea
                  {...register("description")}
                  placeholder="What makes this event special?"
                  rows={5}
                  className="resize-none rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-purple-500/20"
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Ticket Type */}
              <div className="space-y-3 p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800">
                <Label className="text-base font-semibold">Ticketing</Label>
                <div className="flex flex-wrap items-center gap-4">
                  <label
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${ticketType === "free" ? "border-purple-500 bg-purple-50/50 dark:bg-purple-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}
                  >
                    <input
                      type="radio"
                      value="free"
                      {...register("ticketType")}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="font-medium">Free Entry</span>
                  </label>

                  <label
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${ticketType === "paid" ? "border-purple-500 bg-purple-50/50 dark:bg-purple-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}
                  >
                    <input
                      type="radio"
                      value="paid"
                      {...register("ticketType")}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="font-medium">Paid Ticket</span>
                  </label>

                  {ticketType === "paid" && (
                    <div className="flex-1 min-w-[120px]">
                      <Input
                        type="number"
                        placeholder="Price ₹"
                        {...register("ticketPrice", { valueAsNumber: true })}
                        className="h-12 rounded-xl border-purple-200 focus:border-purple-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating
                    Event...
                  </>
                ) : (
                  <>
                    Create Event <Sparkles className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Unsplash Picker */}
      {showImagePicker && (
        <UnsplashImagePicker
          isOpen={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onSelect={(url) => {
            setValue("coverImage", url);
            setShowImagePicker(false);
          }}
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger={upgradeReason}
      />
    </div>
  );
}
