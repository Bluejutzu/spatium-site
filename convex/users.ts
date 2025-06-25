import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { Auth } from 'convex/server';

export const syncUser = mutation({
    args: {
        clerkId: v.string(),
        discordUserId: v.string(),
        username: v.string(),
        email: v.string(),
        avatarUrl: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated")
        }
        const existing = await ctx.db
            .query('users')
            .withIndex('by_clerkId', q => q.eq('clerkId', args.clerkId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, args);
            return existing._id;
        }

        return await ctx.db.insert('users', args);
    },
});
