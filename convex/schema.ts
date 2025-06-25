import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkId: v.string(),
        discordUserId: v.string(),
        username: v.string(),
        email: v.string(),
        avatarUrl: v.string(),
    })
    .index('by_clerkId', ['clerkId'])
    .index("by_discorId", ["discordUserId"]),
});