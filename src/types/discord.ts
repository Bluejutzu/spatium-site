export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
  approximate_member_count?: number;
  approximate_presence_count?: number;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
}

export interface DiscordChannel {
  id: string;
  type: number;
  name: string;
  position: number;
  parent_id?: string;
  permission_overwrites: DiscordPermissionOverwrite[];
}

export interface DiscordPermissionOverwrite {
  id: string;
  type: number;
  allow: string;
  deny: string;
}

export interface DiscordMember {
  user: DiscordUser;
  nick?: string;
  roles: string[];
  joined_at: string;
  premium_since?: string;
  deaf: boolean;
  mute: boolean;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
}

export interface ServerMetrics {
  serverId: string;
  memberCount: number;
  onlineCount: number;
  channelCount: number;
  roleCount: number;
  commandsUsed: number;
  messagesCount: number;
  timestamp: Date;
}

export interface ServerAlert {
  _id: string;
  serverId: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface CommandExecution {
  commandName: string;
  userId: string;
  serverId: string;
  success: boolean;
  executionTime: number;
  timestamp: Date;
  error?: string;
}
