import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Upstash Redis environment variables');
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export interface PresenceData {
  userId: string;
  serverId: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Array<{
    name: string;
    type: number;
    details?: string;
    state?: string;
    created_at: number;
  }>;
  clientStatus?: {
    desktop?: string;
    mobile?: string;
    web?: string;
  };
  lastUpdated: number;
}

export class PresenceCache {
  private static readonly TTL = 3600; // 1 hour in seconds

  static async setPresence(userId: string, serverId: string, presence: Omit<PresenceData, 'userId' | 'serverId'>) {
    const key = `presence:${userId}:${serverId}`;
    const data: PresenceData = {
      userId,
      serverId,
      ...presence,
    };

    // Use set with expiration instead of setex
    await redis.set(key, JSON.stringify(data), { ex: this.TTL });
  }

  static async getPresence(userId: string, serverId: string): Promise<PresenceData | null> {
    const key = `presence:${userId}:${serverId}`;
    const data = await redis.get<string>(key);

    if (!data) return null;

    try {
      return JSON.parse(data) as PresenceData;
    } catch {
      return null;
    }
  }

  static async deletePresence(userId: string, serverId: string) {
    const key = `presence:${userId}:${serverId}`;
    await redis.del(key);
  }

  static async getServerPresences(serverId: string): Promise<PresenceData[]> {
    const pattern = `presence:*:${serverId}`;
    const keys = await redis.keys(pattern);

    if (keys.length === 0) return [];

    const presences = await redis.mget<string[]>(keys);
    return presences
      .filter(Boolean)
      .map(data => {
        try {
          return JSON.parse(data!) as PresenceData;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as PresenceData[];
  }

  static async cleanupExpired() {
    // Redis automatically handles expiration, but we can clean up manually if needed
    const pattern = 'presence:*';
    const keys = await redis.keys(pattern);

    if (keys.length > 0) {
      // Check which keys are expired (TTL <= 0)
      const ttlResults = await Promise.all(
        keys.map(async (key) => {
          const ttl = await redis.ttl(key);
          return { key, ttl };
        })
      );

      const expiredKeys = ttlResults
        .filter(({ ttl }) => ttl <= 0)
        .map(({ key }) => key);

      if (expiredKeys.length > 0) {
        await redis.del(...expiredKeys);
      }
    }
  }
}
