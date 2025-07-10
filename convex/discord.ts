import { query, mutation, internalMutation } from "./_generated/server"
import { v } from "convex/values"
import { DiscordAPI } from "@/features/discord"
import { api } from "./_generated/api"

export const getServers = query({
  handler: async (ctx) => {
    return await ctx.db.query("discordServers").collect()
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
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const server of args.servers) {
      const existing = await ctx.db
        .query("discordServers")
        .withIndex("by_server_id", (q) => q.eq("serverId", server.serverId))
        .first()

      if (existing) {
        await ctx.db.patch(existing._id, {
          ...server,
          lastUpdated: Date.now(),
        })

        const latestMetric = await ctx.db
          .query("serverMetrics")
          .withIndex("by_server_timestamp", (q) => q.eq("serverId", server.serverId))
          .order("desc")
          .first()

        await ctx.db.insert("serverMetrics", {
          serverId: server.serverId,
          memberCount: server.memberCount,
          onlineCount: server.onlineCount,
          commandsUsed: latestMetric?.commandsUsed ?? 0,
          activeChannels: latestMetric?.activeChannels ?? 0,
          timestamp: Date.now(),
        })
      } else {
        await ctx.db.insert("discordServers", {
          ...server,
          botJoinedAt: Date.now(),
          lastUpdated: Date.now(),
        })

        await ctx.db.insert("serverMetrics", {
          serverId: server.serverId,
          memberCount: server.memberCount,
          onlineCount: server.onlineCount,
          commandsUsed: 0,
          activeChannels: 0,
          timestamp: Date.now(),
        })
      }
    }
  },
})

export const getUserServers = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("discordServers")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", args.userId))
      .collect()
  },
})

export const getServerMetrics = query({
  args: { serverId: v.string() },
  handler: async (ctx, args) => {
    const server = await ctx.db
      .query("discordServers")
      .withIndex("by_server_id", (q) => q.eq("serverId", args.serverId))
      .first()

    const recentMetrics = await ctx.db
      .query("serverMetrics")
      .withIndex("by_server_timestamp", (q) => q.eq("serverId", args.serverId))
      .order("desc")
      .take(24)

    const recentCommands = await ctx.db
      .query("botCommands")
      .withIndex("by_server_id", (q) => q.eq("serverId", args.serverId))
      .order("desc")
      .take(100)

    return {
      server,
      metrics: recentMetrics,
      commands: recentCommands,
    }
  },
})

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
    await ctx.db.insert("serverMetrics", {
      ...args,
      timestamp: Date.now(),
    })
  },
})

export const getServerAlerts = query({
  args: { serverId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("alerts")
      .withIndex("by_server_id", (q) => q.eq("serverId", args.serverId))
      .filter((q) => q.eq(q.field("dismissed"), false))
      .order("desc")
      .take(10)
  },
})

export const getLatestServerMetrics = query({
  args: { serverId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("serverMetrics")
      .withIndex("by_server_timestamp", (q) => q.eq("serverId", args.serverId))
      .order("desc")
      .first()
  },
})

export const dismissAlert = mutation({
  args: { alertId: v.id("alerts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.alertId, { dismissed: true })
  },
})

export const _updateServerMetrics = internalMutation({
  args: { serverId: v.string() },
  handler: async (ctx, args) => {
    const discordAPI = new DiscordAPI("")
    try {
      const guild = await discordAPI.getGuildWithBotToken(args.serverId, true)
      await ctx.runMutation(api.discord.updateServerMetrics, {
        serverId: args.serverId,
        memberCount: guild.approximate_member_count ?? 0,
        onlineCount: guild.approximate_presence_count ?? 0,
        messageCount: Math.floor(Math.random() * 100),
        commandsUsed: Math.floor(Math.random() * 50),
        activeChannels: Math.floor(Math.random() * 10),
      })
    } catch (error) {
      console.error(`Failed to update metrics for server ${args.serverId}`, error)
    }
  },
})

export const getCommands = query({
  args: { serverId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("commands")
      .withIndex("by_server_id", (q) => q.eq("serverId", args.serverId))
      .collect()
  },
})

export const getCommand = query({
  args: {
    commandId: v.id("commands"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("commands")
      .withIndex("by_id", q => q.eq("_id", args.commandId))
      .first()
  }
})

export const getCommandViaName = query({
  args: {
    name: v.string(),
    serverId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("commands")
      .withIndex("by_server_id", q => q.eq("serverId", args.serverId as string))
      .filter(q => q.eq(q.field("name"), args.name))
      .first()
  }
}
)


export const getAllCommands = query({
  handler: async (ctx) => {
    return await ctx.db.query("commands").collect()
  },
})

export const saveCommand = mutation({
  args: {
    serverId: v.string(),
    name: v.string(),
    description: v.string(),
    blocks: v.string(),
    commandId: v.optional(v.id("commands")),
  },
  handler: async (ctx, args) => {
    // If commandId is provided, update existing command
    if (args.commandId) {
      await ctx.db.patch(args.commandId, {
        name: args.name,
        description: args.description,
        blocks: args.blocks,
        lastUpdateTime: Date.now(),
      })
      return { updated: true, commandId: args.commandId }
    }

    // Otherwise, check if command with same name exists
    const existing = await ctx.db
      .query("commands")
      .withIndex("by_server_id", (q) => q.eq("serverId", args.serverId))
      .collect()
    const match = existing.find((cmd) => cmd.name === args.name)

    if (match) {
      await ctx.db.patch(match._id, {
        blocks: args.blocks,
        description: args.description,
        lastUpdateTime: Date.now(),
      })
      return { updated: true, commandId: match._id }
    } else {
      const commandId = await ctx.db.insert("commands", {
        serverId: args.serverId,
        name: args.name,
        description: args.description,
        blocks: args.blocks,
        enabled: true,
        creationTime: Date.now(),
        lastUpdateTime: Date.now(),
      })
      return { created: true, commandId }
    }
  },
})

export const deleteCommand = mutation({
  args: { commandId: v.id("commands") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.commandId)
    return { deleted: true }
  },
})

export const toggleCommandStatus = mutation({
  args: {
    commandId: v.id("commands"),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.commandId, {
      enabled: args.enabled,
      lastUpdateTime: Date.now(),
    })
    return { updated: true }
  },
})

export const dropServer = mutation({
  args: {
    serverId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("discordServers")
      .withIndex("by_server_id", (q) => q.eq("serverId", args.serverId))
      .first()

    if (!existing) {
      return { dropped: false, existing: false, error: null }
    }

    try {
      await ctx.db.delete(existing._id)
      return { dropped: true, existing: true, error: null }
    } catch (error) {
      return {
        dropped: false,
        existing: true,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  },
})

export const getAutoRoleData = query({
  args: {
    serverId: v.string(),
  },
  handler: async (ctx, args) => {
    const s = await ctx.db
      .query("serverSettings")
      .withIndex("by_server_id", (q) => q.eq("serverId", args.serverId))
      .first()

    if (!s || !s.autoRoleId) {
      return {
        error: true,
        message: "Non-existent document",
      }
    }

    return {
      autoRole: s.autoRole,
      roleId: s.autoRoleId,
    }
  },
})
