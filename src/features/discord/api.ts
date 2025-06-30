import type { DiscordGuild, DiscordUser, DiscordRole } from '@/types/discord';

export class DiscordAPI {
  private accessToken: string;
  private baseURL = 'https://discord.com/api/v10';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(
        `Discord API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async getCurrentUser(): Promise<DiscordUser> {
    return this.request('/users/@me');
  }

  async getUserGuilds(with_counts = true): Promise<DiscordGuild[]> {
    return this.request(
      `/users/@me/guilds${with_counts ? '?with_counts=true' : ''}`
    );
  }

  async getBotGuilds(): Promise<DiscordGuild[]> {
    const response = await fetch(`${this.baseURL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Discord API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    return response.json();
  }

  async getGuild(guildId: string): Promise<DiscordGuild> {
    return this.request(`/guilds/${guildId}?with_counts=true`);
  }

  async getGuildChannels(guildId: string) {
    return this.request(`/guilds/${guildId}/channels`);
  }

  async getGuildMembers(guildId: string, limit = 100) {
    return this.request(`/guilds/${guildId}/members?limit=${limit}`);
  }

  async getGuildWithBotToken(guildId: string): Promise<DiscordGuild> {
    const response = await fetch(
      `${this.baseURL}/guilds/${guildId}?with_counts=true`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Discord API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    return response.json();
  }

  async getGuildRolesWithBotToken(guildId: string): Promise<DiscordRole[]> {
    const response = await fetch(
      `${this.baseURL}/guilds/${guildId}/roles`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Discord API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    return response.json();
  }
}

export async function refreshDiscordToken(refreshToken: string) {
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh Discord token');
  }

  return response.json();
}
