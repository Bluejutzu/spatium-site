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
    try {
      const existing = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
        .first();

      const userData = {
        ...args,
        updatedAt: Date.now(),
      };

      if (existing) {
        await ctx.db.patch(existing._id, userData);
        return { success: true, userId: existing._id };
      }

      const newUserId = await ctx.db.insert('users', {
        ...userData,
        createdAt: Date.now(),
      });

      return { success: true, userId: newUserId };
    } catch (error) {
      console.error('Error syncing user:', error);
      return { success: false, error: 'Failed to sync user' };
    }
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
        .first();

      return user ? { success: true, user } : { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Error fetching user:', error);
      return { success: false, error: 'Failed to fetch user' };
    }
  },
});

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query('users')
        .withIndex('by_discord_id', q => q.eq('discordUserId', args.userId))
        .first();
      return user ? { success: true, user } : { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Error fetching user:', error);
      return { success: false, error: 'Failed to fetch user' };
    }
  },
});
