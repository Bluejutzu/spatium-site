import { ButtonStyle, Embed } from 'discord.js';

import { Doc } from './convex-schema';

export * from './convex-schema';

export type User = Doc<'users'>;
export type DiscordServer = Doc<'discordServers'>;
export type ServerMetric = Doc<'serverMetrics'>;
export type ServerSettings = Doc<'serverSettings'>;
export type Alert = Doc<'alerts'>;
export type Commands = Doc<'commands'>;

export type CommandType = {
	serverId: string;
	name: string;
	description?: string;
	blocks: string;
	enabled?: boolean;
	creationTime?: number;
	lastUpdateTime?: number;
};

// --- Node/Edge Types for Visual Command System ---
// Custom component types for Discord.js visual system
export type Command = {
	serverId: string;
	name: string;
	description?: string;
	blocks: string;
	enabled?: boolean;
	creationTime?: number;
	lastUpdateTime?: number;
};

export interface VisualNode {
	id: string;
	type: string;
	position: { x: number; y: number };
	data: {
		label: string;
		type: BlockTypeId;
		config: NodeConfig;
	};
	draggable?: boolean;
}

export interface VisualEdge {
	id: string;
	source: string;
	target: string
	sourceHandle?: string;
	targetHandle?: string;
	type?: string;
}

export type CustomButtonComponent = {
	type: 'button';
	custom_id: string;
	label: string;
	style?: ButtonStyle;
	emoji?: string;
	disabled?: boolean;
};

export type CustomSelectOption = {
	label: string;
	value: string;
	description?: string;
	emoji?: string;
};

export type CustomSelectComponent = {
	type: 'select';
	custom_id: string;
	placeholder?: string;
	options: CustomSelectOption[];
	minValues?: number;
	maxValues?: number;
	disabled?: boolean;
};

export type CustomComponent = CustomButtonComponent | CustomSelectComponent;

export type OptionNodeConfig = {
	name: string,
	description: string,
	required: boolean,
	value?: string
} | {
	name: string,
	description: string,
	required: boolean,
	value?: "false" | "true" | string
}

export type RootNodeConfig = { type: 'root', name: string; description: string; ephemeral: boolean; cooldown: number }
export interface SendMessageNodeConfig {
	type: 'send-message';
	content: string;
	embeds: Embed[];
	tts: boolean;
	components: CustomComponent[];
	ephemeral: boolean;
	storeIdAs: string;
}
export interface OptionUserNodeConfig {
	type: 'option-user';
	name: string;
	description: string;
	required: boolean;
	value?: string;
}
export interface EditMessageNodeConfig {
	type: 'edit-message';
	message_ref_block: string;
	content: string;
	embeds: Embed[];
	components: CustomComponent[];
	storeIdAs: string;
}
export interface ConditionNodeConfig {
	type: 'condition';
	conditionType: string;
	roleId: string;
}
export interface WaitNodeConfig {
	type: 'wait';
	duration: number;
	unit: string;
}
export interface UnqVariableNodeConfig {
	type: 'unq-variable';
	name: string;
	value: string;
}
export interface AddRoleNodeConfig {
	type: 'add-role';
	roleId: string;
	userId: string;
	reason: string;
}
export interface RemoveRoleNodeConfig {
	type: 'remove-role';
	roleId: string;
	userId: string;
	reason: string;
}
export interface KickMemberNodeConfig {
	type: 'kick-member';
	userId: string;
	reason: string;
	deleteMessageDays: number;
}
export interface BanMemberNodeConfig {
	type: 'ban-member';
	userId: string;
	reason: string;
	deleteMessageDays: number;
}
export interface TimeoutMemberNodeConfig {
	type: 'timeout-member';
	userId: string;
	duration: number;
	reason: string;
}
export interface SetNicknameNodeConfig {
	type: 'set-nickname';
	userId: string;
	nickname: string;
	reason: string;
}
export interface CreateChannelNodeConfig {
	type: 'create-channel';
	name: string;
	channelType: number;
	categoryId: string;
	topic: string;
	nsfw: boolean;
}
export interface DeleteChannelNodeConfig {
	type: 'delete-channel';
	channelId: string;
	reason: string;
}
export interface ModifyChannelNodeConfig {
	type: 'modify-channel';
	channelId: string;
	name: string;
	topic: string;
	nsfw: boolean;
}
export interface SendDMNodeConfig {
	type: 'send-dm';
	userId: string;
	content: string;
	embeds: Embed[];
}
export interface CreateWebhookNodeConfig {
	type: 'create-webhook';
	channelId: string;
	name: string;
	avatar: string;
}
export interface DeleteWebhookNodeConfig {
	type: 'delete-webhook';
	webhookId: string;
	reason: string;
}
export interface MoveMemberNodeConfig {
	type: 'move-member';
	userId: string;
	channelId: string;
	reason: string;
}
export interface MuteMemberNodeConfig {
	type: 'mute-member';
	userId: string;
	mute: boolean;
	reason: string;
}
export interface DeafenMemberNodeConfig {
	type: 'deafen-member';
	userId: string;
	deafen: boolean;
	reason: string;
}
export interface FetchUserNodeConfig {
	type: 'fetch-user';
	userId: string;
	storeIdAs: string;
}
export interface FetchMemberNodeConfig {
	type: 'fetch-member';
	userId: string;
	storeIdAs: string;
}
export interface FetchChannelNodeConfig {
	type: 'fetch-channel';
	channelId: string;
	storeIdAs: string;
}
export interface FetchRoleNodeConfig {
	type: 'fetch-role';
	roleId: string;
	storeIdAs: string;
}
export interface CreateInviteNodeConfig {
	type: 'create-invite';
	channelId: string;
	maxUses: number;
	maxAge: number;
	temporary: boolean;
	unique: boolean;
}
export interface DeleteInviteNodeConfig {
	type: 'delete-invite';
	inviteCode: string;
	reason: string;
}
export interface AddReactionNodeConfig {
	type: 'add-reaction';
	messageId: string;
	emoji: string;
	channelId: string;
}
export interface RemoveReactionNodeConfig {
	type: 'remove-reaction';
	messageId: string;
	emoji: string;
	userId: string;
	channelId: string;
}
export interface PinMessageNodeConfig {
	type: 'pin-message';
	messageId: string;
	channelId: string;
}
export interface UnpinMessageNodeConfig {
	type: 'unpin-message';
	messageId: string;
	channelId: string;
}
export interface DeleteMessageNodeConfig {
	type: 'delete-message';
	messageId: string;
	channelId: string;
	reason: string;
}
export interface BulkDeleteNodeConfig {
	type: 'bulk-delete';
	channelId: string;
	count: number;
	reason: string;
}
export interface CreateRoleNodeConfig {
	type: 'create-role';
	name: string;
	color: number;
	permissions: string;
	hoist: boolean;
	mentionable: boolean;
}
export interface DeleteRoleNodeConfig {
	type: 'delete-role';
	roleId: string;
	reason: string;
}
export interface ModifyRoleNodeConfig {
	type: 'modify-role';
	roleId: string;
	name: string;
	color: number;
	permissions: string;
	hoist: boolean;
	mentionable: boolean;
}
export interface AuditLogNodeConfig {
	type: 'audit-log';
	userId: string;
	actionType: number;
	limit: number;
	storeIdAs: string;
}
export interface RandomNodeConfig {
	type: 'random';
	min: number;
	max: number;
	storeIdAs: string;
}

export type NodeConfig =
	| RootNodeConfig
	| SendMessageNodeConfig
	| OptionUserNodeConfig
	| EditMessageNodeConfig
	| ConditionNodeConfig
	| WaitNodeConfig
	| UnqVariableNodeConfig
	| AddRoleNodeConfig
	| RemoveRoleNodeConfig
	| KickMemberNodeConfig
	| BanMemberNodeConfig
	| TimeoutMemberNodeConfig
	| SetNicknameNodeConfig
	| CreateChannelNodeConfig
	| DeleteChannelNodeConfig
	| ModifyChannelNodeConfig
	| SendDMNodeConfig
	| CreateWebhookNodeConfig
	| DeleteWebhookNodeConfig
	| MoveMemberNodeConfig
	| MuteMemberNodeConfig
	| DeafenMemberNodeConfig
	| FetchUserNodeConfig
	| FetchMemberNodeConfig
	| FetchChannelNodeConfig
	| FetchRoleNodeConfig
	| CreateInviteNodeConfig
	| DeleteInviteNodeConfig
	| AddReactionNodeConfig
	| RemoveReactionNodeConfig
	| PinMessageNodeConfig
	| UnpinMessageNodeConfig
	| DeleteMessageNodeConfig
	| BulkDeleteNodeConfig
	| CreateRoleNodeConfig
	| DeleteRoleNodeConfig
	| ModifyRoleNodeConfig
	| AuditLogNodeConfig
	| RandomNodeConfig;

export type NodeConfigMap = {
	'option-user': OptionUserNodeConfig;
	'send-message': SendMessageNodeConfig;
	'send-dm': SendDMNodeConfig;
	'edit-message': EditMessageNodeConfig;
	'delete-message': DeleteMessageNodeConfig;
	'bulk-delete': BulkDeleteNodeConfig;
	'pin-message': PinMessageNodeConfig;
	'unpin-message': UnpinMessageNodeConfig;
	'add-reaction': AddReactionNodeConfig;
	'remove-reaction': RemoveReactionNodeConfig;
	'kick-member': KickMemberNodeConfig;
	'ban-member': BanMemberNodeConfig;
	'timeout-member': TimeoutMemberNodeConfig;
	'set-nickname': SetNicknameNodeConfig;
	'add-role': AddRoleNodeConfig;
	'remove-role': RemoveRoleNodeConfig;
	'create-role': CreateRoleNodeConfig;
	'delete-role': DeleteRoleNodeConfig;
	'modify-role': ModifyRoleNodeConfig;
	'create-channel': CreateChannelNodeConfig;
	'delete-channel': DeleteChannelNodeConfig;
	'modify-channel': ModifyChannelNodeConfig;
	'create-invite': CreateInviteNodeConfig;
	'delete-invite': DeleteInviteNodeConfig;
	'fetch-user': FetchUserNodeConfig;
	'fetch-member': FetchMemberNodeConfig;
	'move-member': MoveMemberNodeConfig;
	'mute-member': MuteMemberNodeConfig;
	'deafen-member': DeafenMemberNodeConfig;
	'create-webhook': CreateWebhookNodeConfig;
	'delete-webhook': DeleteWebhookNodeConfig;
	'condition': ConditionNodeConfig;
	'wait': WaitNodeConfig;
	'random': RandomNodeConfig;
	'unq-variable': UnqVariableNodeConfig;
	'audit-log': AuditLogNodeConfig;
}

/**
 * @deprecated Use NodeConfig and DEFAULT_NODE_CONFIGS instead.
 */
export type BlockTypeConfigMap = never;

export type BLOCK_TYPES = [
	'option-user' |
	'option-role' |
	'option-channel' |
	'option-text' |
	'option-boolean' |
	'send-message' |
	'send-dm' |
	'edit-message' |
	'delete-message' |
	'bulk-delete' |
	'pin-message' |
	'unpin-message' |
	'add-reaction' |
	'remove-reaction' |
	'kick-member' |
	'ban-member' |
	'timeout-member' |
	'set-nickname' |
	'add-role' |
	'remove-role' |
	'create-role' |
	'delete-role' |
	'modify-role' |
	'create-channel' |
	'delete-channel' |
	'modify-channel' |
	'create-invite' |
	'delete-invite' |
	'fetch-user' |
	'fetch-member' |
	'move-member' |
	'mute-member' |
	'deafen-member' |
	'create-webhook' |
	'delete-webhook' |
	'condition' |
	'wait' |
	'random' |
	'unq-variable' |
	'audit-log'
]

export type BlockTypeId = BLOCK_TYPES[number]

