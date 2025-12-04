import { query } from "./_generated/server";
import { v } from "convex/values";

// Get featured events (high registration count or recent)
export const getFeaturedEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .order("desc")
      .collect();

    // Sort by registration count for featured
    const featured = events
      .sort((a, b) => b.registrationCount - a.registrationCount)
      .slice(0, args.limit ?? 3);

    return featured;
  },
});

// Get events by location (city/state)
export const getEventsByLocation = query({
  args: {
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    let events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    // Filter by city or state
    if (args.city) {
      events = events.filter(
        (e) => e.city.toLowerCase() === args.city.toLowerCase()
      );
    } else if (args.state) {
      events = events.filter(
        (e) => e.state?.toLowerCase() === args.state.toLowerCase()
      );
    }

    return events.slice(0, args.limit ?? 4);
  },
});

// Get popular events (high registration count)
export const getPopularEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    // Sort by registration count
    const popular = events
      .sort((a, b) => b.registrationCount - a.registrationCount)
      .slice(0, args.limit ?? 6);

    return popular;
  },
});

// Get events by category with pagination
export const getEventsByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    return events.slice(0, args.limit ?? 12);
  },
});

// Get event counts by category
export const getCategoryCounts = query({
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    // Count events by category
    const counts = {};
    events.forEach((event) => {
      counts[event.category] = (counts[event.category] || 0) + 1;
    });

    return counts;
  },
});

// General search/filter query
export const getEvents = query({
  args: {
    category: v.optional(v.string()),
    when: v.optional(v.string()), // "today", "this-weekend", "next-7-days", "online"
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    // Filter by Category
    if (args.category) {
      events = events.filter((e) => e.category === args.category);
    }

    // Filter by Time / Type
    if (args.when) {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime();

      switch (args.when) {
        case "today":
          events = events.filter(
            (e) => e.startDate >= startOfDay && e.startDate <= endOfDay
          );
          break;
        case "this-weekend":
          // Calculate this coming weekend (Saturday & Sunday)
          const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
          const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
          const saturdayStart = new Date(today);
          saturdayStart.setDate(today.getDate() + daysUntilSaturday);
          saturdayStart.setHours(0, 0, 0, 0);

          const sundayEnd = new Date(saturdayStart);
          sundayEnd.setDate(saturdayStart.getDate() + 1);
          sundayEnd.setHours(23, 59, 59, 999);

          events = events.filter(
            (e) =>
              e.startDate >= saturdayStart.getTime() &&
              e.startDate <= sundayEnd.getTime()
          );
          break;
        case "next-7-days":
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          events = events.filter(
            (e) => e.startDate >= now && e.startDate <= nextWeek.getTime()
          );
          break;
        case "online":
          events = events.filter((e) => e.locationType === "online");
          break;
      }
    }

    return events.slice(0, args.limit ?? 20);
  },
});
