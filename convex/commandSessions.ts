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
        console.log('Session expired, creating new session');
      } else if (existingSession.userId !== userId) {
        // Session is active and belongs to another user
        console.log('Session is active and belongs to another user');
        return {
          success: false,
          error: 'Command is being edited by another user',
          currentEditor: existingSession.userId,
          lastActive: existingSession.lastActive,
        };
      } else {
        console.log('Session is active and belongs to the same user');
        // Update last active time for existing session
        await ctx.db.patch(existingSession._id, { lastActive: now });
        return { success: true };
      }
    }

    // Create new session
    console.log('Creating new session');
    await ctx.db.insert('commandSessions', {
      commandId,
      userId,
      serverId,
      lastActive: Date.now(),
    });

    return { success: true };
  },
});

export const releaseSession = mutation({
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
      console.log('Releasing session:', session._id, session.userId);
      await ctx.db.delete(session._id);
    } else {
      console.warn('No session found to release for commandId:', commandId, 'userId:', userId);
    }

    return { success: true };
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
