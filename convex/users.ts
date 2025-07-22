import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    discordUserId: v.string(),
    username: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
      });
      return existing._id;
    } else {
      console.log('Creating entry for ' + args.clerkId);
      return await ctx.db.insert('users', {
        ...args,
      });
    }
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .first();
  },
});


