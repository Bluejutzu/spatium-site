import { v } from 'convex/values';

import { DiscordAPI } from '@/features/discord';

import { api } from './_generated/api';
import { query, mutation, internalMutation } from './_generated/server';

export const getServers = query({
	handler: async ctx => {
		return await ctx.db.query('discordServers').collect();
	},
});

export const getServer = query({
	args: {
		serverId: v.string()
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("discordServers")
			.withIndex("by_server_id", q => q.eq('serverId', args.serverId))
			.first()
	},
})

export const getServerSettings = query({
	args: {
		serverId: v.string()
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("serverSettings")
			.withIndex("by_server_id", q => q.eq('serverId', args.serverId))
			.first()
	},
})

export const syncDiscordServers = mutation({
	args: {
		servers: v.array(
			v.object({
				serverId: v.string(),
				name: v.string(),
				icon: v.optional(v.string()),
				ownerId: v.string(),
				memberCount: v.number(),
				onlineCount: v.number(),
				permissions: v.optional(v.array(v.string())),
				features: v.array(v.string()),
			})
		),
	},
	handler: async (ctx, args) => {
		for (const server of args.servers) {
			const existing = await ctx.db
				.query('discordServers')
				.withIndex('by_server_id', q => q.eq('serverId', server.serverId))
				.first();

			if (existing) {
				await ctx.db.patch(existing._id, {
					...server,
					lastUpdated: Date.now(),
				});

				const latestMetric = await ctx.db
					.query('serverMetrics')
					.withIndex('by_server_timestamp', q =>
						q.eq('serverId', server.serverId)
					)
					.order('desc')
					.first();

				await ctx.db.insert('serverMetrics', {
					serverId: server.serverId,
					memberCount: server.memberCount,
					onlineCount: server.onlineCount,
					commandsUsed: latestMetric?.commandsUsed ?? 0,
					activeChannels: latestMetric?.activeChannels ?? 0,
					timestamp: Date.now(),
				});
			} else {
				await ctx.db.insert('discordServers', {
					...server,
					botJoinedAt: Date.now(),
					lastUpdated: Date.now(),
				});

				await ctx.db.insert('serverMetrics', {
					serverId: server.serverId,
					memberCount: server.memberCount,
					onlineCount: server.onlineCount,
					commandsUsed: 0,
					activeChannels: 0,
					timestamp: Date.now(),
				});
			}
		}
	},
});

export const getUserServers = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('discordServers')
			.withIndex('by_owner_id', q => q.eq('ownerId', args.userId))
			.collect();
	},
});

export const getServerMetrics = query({
	args: { serverId: v.string() },
	handler: async (ctx, args) => {
		const server = await ctx.db
			.query('discordServers')
			.withIndex('by_server_id', q => q.eq('serverId', args.serverId))
			.first();

		const recentMetrics = await ctx.db
			.query('serverMetrics')
			.withIndex('by_server_timestamp', q => q.eq('serverId', args.serverId))
			.order('desc')
			.take(24);

		const recentCommands = await ctx.db
			.query('botCommands')
			.withIndex('by_server_id', q => q.eq('serverId', args.serverId))
			.order('desc')
			.take(100);

		return {
			server,
			metrics: recentMetrics,
			commands: recentCommands,
		};
	},
});

export const updateServerMetrics = mutation({
	args: {
		serverId: v.string(),
		memberCount: v.number(),
		onlineCount: v.number(),
		messageCount: v.number(),
		commandsUsed: v.number(),
		activeChannels: v.number(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('serverMetrics', {
			...args,
			timestamp: Date.now(),
		});
	},
});

export const getServerAlerts = query({
	args: { serverId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('alerts')
			.withIndex('by_server_id', q => q.eq('serverId', args.serverId))
			.filter(q => q.eq(q.field('dismissed'), false))
			.order('desc')
			.take(10);
	},
});

export const getLatestServerMetrics = query({
	args: { serverId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('serverMetrics')
			.withIndex('by_server_timestamp', q => q.eq('serverId', args.serverId))
			.order('desc')
			.first();
	},
});

export const dismissAlert = mutation({
	args: { alertId: v.id('alerts') },
	handler: async (ctx, args) => {
		await ctx.db.patch(args.alertId, { dismissed: true });
	},
});

export const _updateServerMetrics = internalMutation({
	args: { serverId: v.string() },
	handler: async (ctx, args) => {
		const discordAPI = new DiscordAPI('');
		try {
			const guild = await discordAPI.getGuildWithBotToken(args.serverId, true);
			await ctx.runMutation(api.discord.updateServerMetrics, {
				serverId: args.serverId,
				memberCount: guild.approximate_member_count ?? 0,
				onlineCount: guild.approximate_presence_count ?? 0,
				messageCount: Math.floor(Math.random() * 100),
				commandsUsed: Math.floor(Math.random() * 50),
				activeChannels: Math.floor(Math.random() * 10),
			});
		} catch (error) {
			console.error(
				`Failed to update metrics for server ${args.serverId}`,
				error
			);
		}
	},
});

export const getCommands = query({
	args: { serverId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('commands')
			.withIndex('by_server_id', q => q.eq('serverId', args.serverId))
			.collect();
	},
});

export const getCommand = query({
	args: {
		commandId: v.id('commands'),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query('commands')
			.withIndex('by_id', q => q.eq('_id', args.commandId))
			.first();
	},
});

export const getCommandViaShare = query({
	args: {
		shareCode: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query('commands')
			.withIndex('by_share_code', q => q.eq('shareCode', args.shareCode))
			.first();
	},
});

export const getCommandViaName = query({
	args: {
		name: v.string(),
		serverId: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query('commands')
			.withIndex('by_server_id', q => q.eq('serverId', args.serverId as string))
			.filter(q => q.eq(q.field('name'), args.name))
			.first();
	},
});

export const getAllCommands = query({
	handler: async ctx => {
		return await ctx.db.query('commands').collect();
	},
});

export const saveCommand = mutation({
	args: {
		serverId: v.string(),
		name: v.string(),
		description: v.string(),
		blocks: v.string(),
		cooldown: v.number(),
		options: v.optional(v.array(v.object({
			type: v.string(),
			name: v.string(),
			description: v.string(),
			required: v.boolean(),
			value: v.optional(v.string()),
		}))),
		commandId: v.optional(v.id('commands')),
		shareCode: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// If commandId is provided, update existing command
		if (args.commandId) {
			await ctx.db.patch(args.commandId, {
				name: args.name,
				description: args.description,
				blocks: args.blocks,
				cooldown: args.cooldown,
				options: args.options,
				lastUpdateTime: Date.now(),
				shareCode: args.shareCode, // Save or clear shareCode
			});
			return { updated: true, commandId: args.commandId };
		}

		// Otherwise, check if command with same name exists
		const existing = await ctx.db
			.query('commands')
			.withIndex('by_server_id', q => q.eq('serverId', args.serverId))
			.collect();
		const match = existing.find(cmd => cmd.name === args.name);

		if (match) {
			await ctx.db.patch(match._id, {
				blocks: args.blocks,
				description: args.description,
				lastUpdateTime: Date.now(),
				shareCode: args.shareCode, // Save or clear shareCode
			});
			return { updated: true, commandId: match._id };
		} else {
			const commandId = await ctx.db.insert('commands', {
				serverId: args.serverId,
				name: args.name,
				description: args.description,
				blocks: args.blocks,
				cooldown: args.cooldown,
				options: args.options,
				enabled: true,
				creationTime: Date.now(),
				lastUpdateTime: Date.now(),
				shareCode: args.shareCode, // Save shareCode if provided
			});
			return { created: true, commandId };
		}
	},
});

export const deleteCommand = mutation({
	args: { commandId: v.id('commands') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.commandId);
		return { deleted: true };
	},
});

export const toggleCommandStatus = mutation({
	args: {
		commandId: v.id('commands'),
		enabled: v.boolean(),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.commandId, {
			enabled: args.enabled,
			lastUpdateTime: Date.now(),
		});
		return { updated: true };
	},
});

export const dropServer = mutation({
	args: {
		serverId: v.string(),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('discordServers')
			.withIndex('by_server_id', q => q.eq('serverId', args.serverId))
			.first();

		if (!existing) {
			return { dropped: false, existing: false, error: null };
		}

		try {
			await ctx.db.delete(existing._id);
			return { dropped: true, existing: true, error: null };
		} catch (error) {
			return {
				dropped: false,
				existing: true,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	},
});

export const getAutoRoleData = query({
	args: {
		serverId: v.string(),
	},
	handler: async (ctx, args) => {
		const s = await ctx.db
			.query('serverSettings')
			.withIndex('by_server_id', q => q.eq('serverId', args.serverId))
			.first();

		if (!s || !s.autoRoleId) {
			return {
				error: true,
				message: 'Non-existent document',
			};
		}

		return {
			autoRole: s.autoRole,
			roleId: s.autoRoleId,
		};
	},
});

export const updateModerationActionReason = mutation({
	args: {
		auditId: v.string(), // Discord audit log ID
		serverId: v.string(),
		reason: v.string(),
	},
	handler: async (ctx, args) => {
		const action = await ctx.db
			.query('moderationActions')
			.withIndex('by_audit_id', q => q.eq('auditId', args.auditId))
			.first();
		if (!action) throw new Error('Moderation action not found');
		await ctx.db.patch(action._id, { reason: args.reason });
		return { updated: true };
	},
});

export const upsertModerationAction = mutation({
	args: {
		auditId: v.string(), // Discord audit log ID
		serverId: v.string(),
		action: v.string(), // ban, kick, mute, timeout, warn, unban, etc.
		userId: v.string(), // Discord user ID
		reason: v.string(),
		moderator: v.string(), // Discord moderator ID
		time: v.string(),
		duration: v.optional(v.string()),
		state: v.optional(v.string()), // open, closed, etc.
		proof: v.optional(v.string()),
		closedAt: v.optional(v.string()),
		closedBy: v.optional(v.string()),
		notificationMessage: v.optional(v.string()),
		logMessage: v.optional(v.string()),
		deleteMessageHistory: v.optional(v.boolean()),
		raw: v.optional(v.any()),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('moderationActions')
			.withIndex('by_audit_id', q => q.eq('auditId', args.auditId))
			.first();
		if (existing) {
			await ctx.db.patch(existing._id, { ...args });
			return { updated: true };
		} else {
			await ctx.db.insert('moderationActions', { ...args });
			return { created: true };
		}
	},
});

export const getModerationActions = query({
	args: { serverId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('moderationActions')
			.withIndex('by_server_id', q => q.eq('serverId', args.serverId))
			.order('desc')
			.collect();
	},
});

export const updateModerationActionState = mutation({
	args: {
		serverId: v.string(),
		userId: v.string(),
		action: v.string(),
		state: v.string(),
	},
	handler: async (ctx, args) => {
		const latest = await ctx.db
			.query('moderationActions')
			.withIndex('by_server_id', q => q.eq('serverId', args.serverId))
			.filter(q => q.eq(q.field('userId'), args.userId))
			.filter(q => q.eq(q.field('action'), args.action))
			.order('desc')
			.first();

		if (latest && latest.state !== args.state) {
			await ctx.db.patch(latest._id, { state: args.state });
			return { updated: true, id: latest._id };
		}
		return { updated: false };
	},
});
