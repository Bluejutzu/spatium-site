import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    discordUserId: v.string(),
    username: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_discord_id", ["discordUserId"]),

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
  })
    .index("by_server_id", ["serverId"])
    .index("by_owner_id", ["ownerId"]),

  serverMetrics: defineTable({
    serverId: v.string(),
    timestamp: v.number(),
    memberCount: v.number(),
    onlineCount: v.number(),
    commandsUsed: v.number(),
    activeChannels: v.number(),
  }).index("by_server_timestamp", ["serverId", "timestamp"]).index("by_server_id", ["serverId"]),

  botCommands: defineTable({
    serverId: v.string(),
    commandName: v.string(),
    userId: v.string(),
    channelId: v.string(),
    timestamp: v.number(),
    success: v.boolean(),
    executionTime: v.number(),
  })
    .index("by_server_id", ["serverId"])
    .index("by_timestamp", ["timestamp"]),

  serverSettings: defineTable({
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
  }).index("by_server_id", ["serverId"]),

  alerts: defineTable({
    serverId: v.string(),
    type: v.union(v.literal("info"), v.literal("warning"), v.literal("error")),
    title: v.string(),
    message: v.string(),
    timestamp: v.number(),
    dismissed: v.boolean(),
    userId: v.optional(v.string()),
  })
    .index("by_server_id", ["serverId"])
    .index("by_timestamp", ["timestamp"]),

  commands: defineTable({
    serverId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    blocks: v.string(),
    enabled: v.optional(v.boolean()), 
    creationTime: v.optional(v.number()),
    lastUpdateTime: v.optional(v.number()),
  }).index("by_server_id", ["serverId"]),
})
