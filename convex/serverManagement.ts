import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const banServer = mutation({
  args: {
    serverId: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, { serverId, reason }) => {
    const server = await ctx.db
      .query('discordServers')
      .filter((q) => q.eq(q.field('serverId'), serverId))
      .first();

    if (!server) {
      throw new Error('Server not found');
    }

    await ctx.db.patch(server._id, {
      banned: true,
      banReason: reason,
      bannedAt: Date.now(),
    });

    return { success: true };
  },
});

export const unbanServer = mutation({
  args: {
    serverId: v.string(),
  },
  handler: async (ctx, { serverId }) => {
    const server = await ctx.db
      .query('discordServers')
      .filter((q) => q.eq(q.field('serverId'), serverId))
      .first();

    if (!server) {
      throw new Error('Server not found');
    }

    await ctx.db.patch(server._id, {
      banned: false,
      banReason: undefined,
      bannedAt: undefined,
    });

    return { success: true };
  },
});
