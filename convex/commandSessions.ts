import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const acquireSession = mutation({
  args: {
    commandId: v.string(),
    userId: v.string(),
    serverId: v.string(),
  },
  handler: async (ctx, { commandId, userId, serverId }) => {
    // Try to find an existing session
    const existingSession = await ctx.db
      .query('commandSessions')
      .filter((q) => q.eq(q.field('commandId'), commandId))
      .first();

    if (existingSession) {
      // Check if session is expired (30 minutes)
      const sessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds
      const now = Date.now();
      if (now - existingSession.lastActive > sessionTimeout) {
        // Session expired, release it
        await ctx.db.delete(existingSession._id);
      } else if (existingSession.userId !== userId) {
        // Session is active and belongs to another user
        return {
          success: false,
          error: 'Command is being edited by another user',
          currentEditor: existingSession.userId,
          lastActive: existingSession.lastActive,
        };
      } else {
        // Update last active time for existing session
        await ctx.db.patch(existingSession._id, { lastActive: now });
        return { success: true };
      }
    }

    // Create new session
    await ctx.db.insert('commandSessions', {
      commandId,
      userId,
      serverId,
      lastActive: Date.now(),
    });

    return { success: true };
  },
});

export const getLastSessionEvent = query({
  args: {
    commandId: v.string(),
  },
  handler: async (ctx, { commandId }) => {
    return await ctx.db
      .query('sessionEvents')
      .withIndex('by_command_id', q => q.eq('commandId', commandId))
      .filter(q => q.eq(q.field('state'), 'open'))
      .order('desc')
      .first();
  },
});

export const releaseSession = mutation({
  args: {
    commandId: v.string(),
    userId: v.string(),
    isForceRelease: v.optional(v.boolean()),
    adminId: v.optional(v.string()),
  },
  handler: async (ctx, { commandId, userId, isForceRelease, adminId }) => {
    const session = await ctx.db
      .query('commandSessions')
      .filter((q) =>
        isForceRelease
          ? q.eq(q.field('commandId'), commandId)
          : q.and(
            q.eq(q.field('commandId'), commandId),
            q.eq(q.field('userId'), userId)
          )
      )
      .first();

    if (session) {

      if (isForceRelease && adminId) {
        // Store the force release event
        await ctx.db.insert('sessionEvents', {
          type: 'FORCE_RELEASE',
          commandId,
          userId: session.userId,
          adminId,
          timestamp: Date.now(),
          metadata: {
            reason: 'Administrator force released the session'
          },
          state: "open"
        });
      }

      await ctx.db.delete(session._id);

      return {
        success: true,
        wasForceReleased: isForceRelease,
        releasedUserId: session.userId
      };
    }

    return { success: false, error: 'No active session found' };
  },
});

export const getSession = query({
  args: {
    commandId: v.string(),
  },
  handler: async (ctx, { commandId }) => {
    const session = await ctx.db
      .query('commandSessions')
      .filter((q) => q.eq(q.field('commandId'), commandId))
      .first();

    if (!session) return null;

    // Check if session is expired
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    const now = Date.now();
    if (now - session.lastActive > sessionTimeout) {
      return null;
    }

    return session;
  },
});

export const cleanupExpiredSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    const now = Date.now();
    const expiredSessions = await ctx.db
      .query('commandSessions')
      .filter((q) => q.lt(q.field('lastActive'), now - sessionTimeout))
      .collect();

    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
    }

    return { success: true, cleanedCount: expiredSessions.length };
  },
});

export const keepSessionAlive = mutation({
  args: {
    commandId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, { commandId, userId }) => {
    const session = await ctx.db
      .query('commandSessions')
      .filter((q) =>
        q.and(
          q.eq(q.field('commandId'), commandId),
          q.eq(q.field('userId'), userId)
        )
      )
      .first();

    if (session) {
      await ctx.db.patch(session._id, { lastActive: Date.now() });
    }

    return { success: true };
  },
});

export const forceReleaseSession = mutation({
  args: {
    sessionId: v.id('commandSessions'),
  },
  handler: async (ctx, { sessionId }) => {
    await ctx.db.delete(sessionId);
    return { success: true };
  },
});

export const closeSessionEvent = mutation({
  args: {
    eventId: v.id('sessionEvents'),
  },
  handler: async (ctx, { eventId }) => {
    await ctx.db.patch(eventId, { state: 'closed' });
    return { success: true };
  },
});

export const getAllSessions = query({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db
      .query('commandSessions')
      .collect();

    // Filter out expired sessions
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    const now = Date.now();
    return sessions.filter(session => now - session.lastActive <= sessionTimeout);
  },
});
