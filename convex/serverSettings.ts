import { v } from 'convex/values';

import { query, mutation } from './_generated/server';

export const getServerSettings = query({
	args: { serverId: v.string() },
	handler: async (ctx, args) => {
		const settings = await ctx.db
			.query('serverSettings')
			.withIndex('by_server_id', q => q.eq('serverId', args.serverId))
			.first();
		return settings;
	},
});

export const updateServerSettings = mutation({
	args: {
		serverId: v.string(),
		prefix: v.string(),
		welcomeMessage: v.optional(v.string()),
		welcomeChannelId: v.optional(v.string()),
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
		try {
			// Validate server exists
			const server = await ctx.db
				.query('discordServers')
				.withIndex('by_server_id', q => q.eq('serverId', args.serverId))
				.first();

			if (!server) {
				return {
					success: false,
					error: 'Server not found',
				};
			}

			// Validate autoRole settings
			if (args.autoRole && !args.autoRoleId) {
				return {
					success: false,
					error: 'Auto role enabled but no role ID provided',
				};
			}

			const now = Date.now();
			const settingsData = {
				...args,
				updatedAt: now,
			};

			const existing = await ctx.db
				.query('serverSettings')
				.withIndex('by_server_id', q => q.eq('serverId', args.serverId))
				.first();

			if (existing) {
				await ctx.db.patch(existing._id, settingsData);
				return {
					success: true,
					status: 'updated',
					settingsId: existing._id,
				};
			}

			const newSettingsId = await ctx.db.insert('serverSettings', {
				...settingsData,
				createdAt: now,
			});

			return {
				success: true,
				status: 'created',
				settingsId: newSettingsId,
			};
		} catch (error) {
			console.error('Error updating server settings:', error);
			return {
				success: false,
				error: 'Failed to update server settings',
			};
		}
	},
});
