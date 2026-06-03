import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    search: v.optional(v.string()),
    location: v.optional(v.string()),
    priceMin: v.optional(v.number()),
    priceMax: v.optional(v.number()),
    bedroomsMin: v.optional(v.number()),
    bedroomsMax: v.optional(v.number()),
    propertyType: v.optional(v.string()),
    listingType: v.optional(v.string()),
    bathroomsMin: v.optional(v.number()),
    bathroomsMax: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let homes = await ctx.db.query("homes").order("desc").collect();

    if (args.search) {
      const q = args.search.toLowerCase();
      homes = homes.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q),
      );
    }
    if (args.location) {
      const loc = args.location.toLowerCase();
      homes = homes.filter((h) => h.location.toLowerCase().includes(loc));
    }
    if (args.propertyType) {
      homes = homes.filter(
        (h) => h.propertyType?.toLowerCase() === args.propertyType!.toLowerCase(),
      );
    }
    if (args.listingType) {
      homes = homes.filter(
        (h) => h.listingType?.toLowerCase() === args.listingType!.toLowerCase(),
      );
    }
    if (args.priceMin !== undefined) {
      homes = homes.filter((h) => h.price >= args.priceMin!);
    }
    if (args.priceMax !== undefined) {
      homes = homes.filter((h) => h.price <= args.priceMax!);
    }
    if (args.bedroomsMin !== undefined) {
      homes = homes.filter((h) => h.bedrooms >= args.bedroomsMin!);
    }
    if (args.bedroomsMax !== undefined) {
      homes = homes.filter((h) => h.bedrooms <= args.bedroomsMax!);
    }
    if (args.bathroomsMin !== undefined) {
      homes = homes.filter((h) => h.bathrooms >= args.bathroomsMin!);
    }
    if (args.bathroomsMax !== undefined) {
      homes = homes.filter((h) => h.bathrooms <= args.bathroomsMax!);
    }

    return homes;
  },
});

export const getById = query({
  args: { id: v.id("homes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    location: v.string(),
    price: v.number(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    propertyType: v.optional(v.string()),
    listingType: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("homes", {
      title: args.title,
      description: args.description,
      location: args.location,
      price: args.price,
      bedrooms: args.bedrooms,
      bathrooms: args.bathrooms,
      propertyType: args.propertyType,
      listingType: args.listingType,
      isFeatured: args.isFeatured,
      images: [],
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("homes"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    price: v.optional(v.number()),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    propertyType: v.optional(v.string()),
    listingType: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("homes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const home = await ctx.db.get(args.id);
    if (!home) throw new Error("Home not found");

    for (const storageId of home.images) {
      await ctx.storage.delete(storageId);
    }

    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const addImage = mutation({
  args: {
    homeId: v.id("homes"),
    storageId: v.id("_storage"),
    thumbId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const home = await ctx.db.get(args.homeId);
    if (!home) throw new Error("Home not found");

    const patch: Record<string, unknown> = {
      images: [...home.images, args.storageId],
    };
    if (args.thumbId) {
      patch.thumbnails = [...(home.thumbnails ?? []), args.thumbId];
    }
    await ctx.db.patch(args.homeId, patch);
  },
});

export const removeImage = mutation({
  args: {
    homeId: v.id("homes"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const home = await ctx.db.get(args.homeId);
    if (!home) throw new Error("Home not found");

    const idx = home.images.indexOf(args.storageId);
    await ctx.storage.delete(args.storageId);

    const patch: Record<string, unknown> = {
      images: home.images.filter((id) => id !== args.storageId),
    };
    if (home.thumbnails?.length) {
      const thumbId = home.thumbnails[idx];
      if (thumbId) await ctx.storage.delete(thumbId);
      patch.thumbnails = home.thumbnails.filter((_, i) => i !== idx);
    }
    await ctx.db.patch(args.homeId, patch);
  },
});

export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
