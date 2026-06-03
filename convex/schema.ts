import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  homes: defineTable({
    title: v.string(),
    description: v.string(),
    location: v.string(),
    price: v.number(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    propertyType: v.optional(v.string()),
    listingType: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
    images: v.array(v.id("_storage")),
    thumbnails: v.optional(v.array(v.id("_storage"))),
  }).index("by_location", ["location"]),
});
