
enum GUILD_INVITE_TYPE {
	GUILD = 0,
	GROUP_DM = 1,
	FRIEND = 2
}

enum STICKER_TYPES {
	STANDARD = 1,
	GUILD = 2
}

enum STICKER_FORMAT_TYPES {
	PNG = 1,
	APNG = 2,
	LOTTIE = 3,
	GIF = 4
}

enum USER_FLAGS {
	STAFF = 1 << 0,
	PARTNER = 1 << 1,
	HYPESQUAD = 1 << 2,
	BUG_HUNTER_LEVEL_1 = 1 << 3,
	HYPESQUAD_ONLINE_HOUSE_1 = 1 << 6,
	HYPESQUAD_ONLINE_HOUSE_2 = 1 << 7,
	HYPESQUAD_ONLINE_HOUSE_3 = 1 << 8,
	PREMIUM_EARLY_SUPPORTER = 1 << 9,
	TEAM_PSEUDO_USER = 1 << 10, // this one makes no sense to me "User is a team"
	BUG_HUNTER_LEVEL_2 = 1 << 14,
	VERIFIED_BOT = 1 << 16,
	VERIFIED_DEVELOPER = 1 << 17,
	CERTIFIED_MODERATOR = 1 << 18,
	BOT_HTTP_INTERACTIONS = 1 << 19,
	ACTIVE_DEVELOPER = 1 << 22
}

export interface DiscordEmoji {
	id: string,
	name?: string,
	roles?: DiscordRole[],
	user?: DiscordUser,
	require_colons?: boolean,
	managed?: boolean,
	animated?: boolean,
	available?: boolean
}

export interface DiscordSticker {
	id: string,
	pack_id?: string,
	name: string,
	description?: string,
	tags: string,
	type: STICKER_TYPES,
	format_type: STICKER_FORMAT_TYPES,
	available?: boolean,
	guild_id?: string,
	user?: DiscordUser,
	sort_value?: number
}

export interface DiscordCollectible {
	nameplate: {
		sku_id: string,
		asset: string,
		label: string,
		// background color of the nameplate, one of:
		// crimson, berry, sky, teal, forest, bubble_gum, violet, cobalt, clover, lemon, white
		pallete: string
	}
}

export interface DiscordUserPrimaryGuild {
	identity_guild_id?: string,
	identity_enabled?: boolean
	tag?: string // the guild tag
	badge?: string // its a hash
}

export interface DiscordGuild {
	id: string;
	name: string;
	icon?: string, // hash
	splash?: string, // hash,
	discovery_splash?: string // hash
	owner?: boolean;
	owner_id: string,
	permissions?: string;
	features: string[];
	approximate_member_count?: number;
	approximate_presence_count?: number;
}

export interface DiscordPartialGuild {
	id: string,
	name: string,
	icon?: string,
	splash?: string,
	discovery?: string,
	emojis: DiscordEmoji[],
	features: string[] // i cba to do that shit https://discord.com/developers/docs/resources/guild#guild-preview-object-guild-preview-structure
	approximate_member_count: number,
	approximate_presence_count: number,
	description?: string,
	stickers: DiscordSticker[]
}

export interface DiscordUser {
	id: string,
	username: string,
	discriminator: string, // Probably just #0
	global_name?: string,
	avatar?: string // its a hash cdn.discordapp.com/avatars/{userId}/{avatar}
	bot?: boolean
	system?: boolean // system as in official discord system user
	mfa_enabled?: boolean,
	banner?: string,
	accent_color?: number,
	locale?: string, // language option https://discord.com/developers/docs/reference#locales
	verified?: boolean // is the email verified
	email?: string, // prolly not using this as i have Clerk
	flags?: USER_FLAGS
	premium_type?: number
	public_flags?: USER_FLAGS
	avatar_decoration_data?: DiscordUserAvatarDecoration
	collectibles?: DiscordCollectible
	primary_guild?: DiscordUserPrimaryGuild
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

export interface DiscordInvite {
	type: GUILD_INVITE_TYPE,
	code: string
	guild: DiscordPartialGuild
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
