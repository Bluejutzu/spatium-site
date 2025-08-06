import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	commandSessions: defineTable({
		commandId: v.string(),
		userId: v.string(),
		serverId: v.string(),
		lastActive: v.number(),
	})
		.index('by_command_id', ['commandId'])
		.index('by_user_id', ['userId'])
		.index('by_server_id', ['serverId']),

	users: defineTable({
		clerkId: v.string(),
		discordUserId: v.string(),
		username: v.string(),
		email: v.string(),
		avatarUrl: v.optional(v.string()),
		banned: v.optional(v.boolean()),
		banReason: v.optional(v.string()),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index('by_clerk_id', ['clerkId'])
		.index('by_discord_id', ['discordUserId']),

	discordServers: defineTable({
		serverId: v.string(),
		name: v.string(),
		icon: v.optional(v.string()),
		ownerId: v.string(),
		memberCount: v.number(),
		onlineCount: v.number(),
		botJoinedAt: v.number(),
		permissions: v.optional(v.array(v.string())),
		features: v.array(v.string()),
		lastUpdated: v.number(),
		banned: v.optional(v.boolean()),
		banReason: v.optional(v.string()),
		bannedAt: v.optional(v.number()),
	})
		.index('by_server_id', ['serverId'])
		.index('by_owner_id', ['ownerId']),

	serverMetrics: defineTable({
		serverId: v.string(),
		timestamp: v.number(),
		memberCount: v.number(),
		onlineCount: v.number(),
		commandsUsed: v.number(),
	})
		.index('by_server_timestamp', ['serverId', 'timestamp'])
		.index('by_server_id', ['serverId']),
	serverSettings: defineTable({
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
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index('by_server_id', ['serverId']),

	alerts: defineTable({
		serverId: v.string(),
		type: v.union(v.literal('info'), v.literal('warning'), v.literal('error')),
		title: v.string(),
		message: v.string(),
		timestamp: v.number(),
		dismissed: v.boolean(),
		userId: v.optional(v.string()),
	})
		.index('by_server_id', ['serverId'])
		.index('by_timestamp', ['timestamp']),

	botCommands: defineTable({
		serverId: v.string(),
		commandName: v.string(),
		userId: v.string(),
		channelId: v.string(),
		timestamp: v.number(),
		success: v.boolean(),
		executionTime: v.number(),
	})
		.index('by_server_id', ['serverId'])
		.index('by_timestamp', ['timestamp']),

	commands: defineTable({
		serverId: v.string(),
		name: v.string(),
		description: v.optional(v.string()),
		blocks: v.string(),
		options: v.optional(v.array(v.object({
			type: v.string(),
			name: v.string(),
			description: v.string(),
			required: v.boolean(),
			value: v.optional(v.string()),
		}))),
		cooldown: v.optional(v.number()),
		enabled: v.optional(v.boolean()),
		creationTime: v.optional(v.number()),
		lastUpdateTime: v.optional(v.number()),
		shareCode: v.optional(v.string()),
	}).index('by_server_id', ['serverId']).index("by_share_code", ['shareCode']),

	moderationActions: defineTable({
		auditId: v.string(), // Discord audit log ID
		serverId: v.string(),
		action: v.string(), // ban, kick, mute, timeout, warn, unban, etc.
		userId: v.string(), // Discord user ID
		reason: v.string(),
		moderator: v.string(), // Discord moderator ID
		time: v.number(), // timestamp in milliseconds
		duration: v.optional(v.number()), // expiration timestamp in milliseconds
		state: v.optional(v.string()), // open, closed, etc.
		proof: v.optional(v.string()),
		closedAt: v.optional(v.number()), // timestamp in milliseconds
		closedBy: v.string(),
		notificationMessage: v.optional(v.string()),
		logMessage: v.optional(v.string()),
		deleteMessageHistory: v.optional(v.boolean()),
		raw: v.optional(v.any()),
	})
		.index('by_server_id', ['serverId'])
		.index('by_user_id', ['userId'])
		.index('by_moderator', ['moderator'])
		.index('by_audit_id', ['auditId']),
});
