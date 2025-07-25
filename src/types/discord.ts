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
	bot?: boolean;
	system?: boolean;
}

export interface DiscordChannel {
	id: string;
	type: number;
	name: string;
	position: number;
	parent_id?: string;
	permission_overwrites?: DiscordPermissionOverwrite[];
	topic?: string;
	nsfw?: boolean;
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
	avatar?: string;
	banner?: string;
	roles: string[];
	joined_at: string;
	premium_since?: string;
	deaf: boolean;
	mute: boolean;
	flags: number;
	pending?: boolean;
	permissions?: string;
	communication_disabled_until?: number;
	avatar_decoration_data?: DiscordUserAvatarDecoration
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

export interface DiscordUserAvatarDecoration {
	asset: string;
	sku_id: number;
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

export interface DiscordEmbed {
	title?: string;
	description?: string;
	color?: number;
	fields?: Array<{
		name: string;
		value: string;
		inline?: boolean;
	}>;
	author?: {
		name?: string;
		url?: string;
		icon_url?: string;
	};
	footer?: {
		text?: string;
		icon_url?: string;
	};
	image?: {
		url?: string;
	};
	thumbnail?: {
		url?: string;
	};
	url?: string;
	timestamp?: string;
}

export interface DiscordMessage {
	content?: string;
	embeds?: DiscordEmbed[];
	tts?: boolean;
	ephemeral?: boolean;
	components?: any[];
	attachments?: any[];
	flags?: number;
}

export interface DiscordPresence {
	user: {
		id: string;
		username: string;
		discriminator: string;
		avatar: string | null;
	};
	status: 'online' | 'idle' | 'dnd' | 'offline';
	activities: DiscordActivity[];
	client_status: {
		desktop?: string;
		mobile?: string;
		web?: string;
	};
}

export interface DiscordActivity {
	name: string;
	type: number;
	url?: string;
	created_at: number;
	timestamps?: {
		start?: number;
		end?: number;
	};
	application_id?: string;
	details?: string;
	state?: string;
	emoji?: {
		name: string;
		id?: string;
		animated?: boolean;
	};
	party?: {
		id?: string;
		size?: [number, number];
	};
	assets?: {
		large_image?: string;
		large_text?: string;
		small_image?: string;
		small_text?: string;
	};
	secrets?: {
		join?: string;
		spectate?: string;
		match?: string;
	};
	instance?: boolean;
	flags?: number;
}
