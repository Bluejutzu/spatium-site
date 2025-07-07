import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getServerSettings = query({
  args: { serverId: v.string() },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query('serverSettings')
      .withIndex('by_server', q => q.eq('serverId', args.serverId))
      .first();
    return settings;
  },
});

export const updateServerSettings = mutation({
  args: {
    serverId: v.string(),
    prefix: v.string(),
    welcomeMessage: v.optional(v.string()),
    autoRole: v.boolean(),
    autoRoleId: v.optional(v.string()),
    moderationEnabled: v.boolean(),
    spamFilter: v.boolean(),
    linkFilter: v.boolean(),
    logChannelId: v.optional(v.string()),
    joinNotifications: v.boolean(),
    leaveNotifications: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('serverSettings')
      .withIndex('by_server', q => q.eq('serverId', args.serverId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args });
      return { updated: true };
    } else {
      await ctx.db.insert('serverSettings', { ...args });
      return { created: true };
    }
  },
});
