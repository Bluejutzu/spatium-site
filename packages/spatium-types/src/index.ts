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

// Config types for each node type
export type SendMessageNodeConfig = {
	content: string;
	embeds: Embed[];
	components: CustomComponent[];
	ephemeral: boolean;
	storeIdAs: string;
};

export type EditMessageNodeConfig = {
	message_ref_block: string;
	content: string;
	embeds: Embed[];
	components: CustomComponent[];
	storeIdAs: string;
};

export type ConditionNodeConfig = {
	conditionType: string;
	roleId: string;
};

export type WaitNodeConfig = {
	duration: number;
	unit: string;
};

export type UnqVariableNodeConfig = {
	name: string;
	value: string;
};

export type AddRoleNodeConfig = {
	roleId: string;
	userId: string;
	reason: string;
};

export type RemoveRoleNodeConfig = {
	roleId: string;
	userId: string;
	reason: string;
};

export type KickMemberNodeConfig = {
	userId: string;
	reason: string;
	deleteMessageDays: number;
};

export type BanMemberNodeConfig = {
	userId: string;
	reason: string;
	deleteMessageDays: number;
};

export type TimeoutMemberNodeConfig = {
	userId: string;
	duration: number;
	reason: string;
};

export type SetNicknameNodeConfig = {
	userId: string;
	nickname: string;
	reason: string;
};

export type CreateChannelNodeConfig = {
	name: string;
	type: number;
	categoryId: string;
	topic: string;
	nsfw: boolean;
};

export type DeleteChannelNodeConfig = {
	channelId: string;
	reason: string;
};

export type ModifyChannelNodeConfig = {
	channelId: string;
	name: string;
	topic: string;
	nsfw: boolean;
};

export type SendDMNodeConfig = {
	userId: string;
	content: string;
	embeds: Embed[];
};

export type CreateWebhookNodeConfig = {
	channelId: string;
	name: string;
	avatar: string;
};

export type DeleteWebhookNodeConfig = {
	webhookId: string;
	reason: string;
};

export type MoveMemberNodeConfig = {
	userId: string;
	channelId: string;
	reason: string;
};

export type MuteMemberNodeConfig = {
	userId: string;
	mute: boolean;
	reason: string;
};

export type DeafenMemberNodeConfig = {
	userId: string;
	deafen: boolean;
	reason: string;
};

export type FetchUserNodeConfig = {
	userId: string;
	storeIdAs: string;
};

export type FetchMemberNodeConfig = {
	userId: string;
	storeIdAs: string;
};

export type FetchChannelNodeConfig = {
	channelId: string;
	storeIdAs: string;
};

export type FetchRoleNodeConfig = {
	roleId: string;
	storeIdAs: string;
};

export type CreateInviteNodeConfig = {
	channelId: string;
	maxUses: number;
	maxAge: number;
	temporary: boolean;
	unique: boolean;
};

export type DeleteInviteNodeConfig = {
	inviteCode: string;
	reason: string;
};

export type AddReactionNodeConfig = {
	messageId: string;
	emoji: string;
	channelId: string;
};

export type RemoveReactionNodeConfig = {
	messageId: string;
	emoji: string;
	userId: string;
	channelId: string;
};

export type PinMessageNodeConfig = {
	messageId: string;
	channelId: string;
};

export type UnpinMessageNodeConfig = {
	messageId: string;
	channelId: string;
};

export type DeleteMessageNodeConfig = {
	messageId: string;
	channelId: string;
	reason: string;
};

export type BulkDeleteNodeConfig = {
	channelId: string;
	count: number;
	reason: string;
};

export type CreateRoleNodeConfig = {
	name: string;
	color: number;
	permissions: string;
	hoist: boolean;
	mentionable: boolean;
};

export type DeleteRoleNodeConfig = {
	roleId: string;
	reason: string;
};

export type ModifyRoleNodeConfig = {
	roleId: string;
	name: string;
	color: number;
	permissions: string;
	hoist: boolean;
	mentionable: boolean;
};

export type AuditLogNodeConfig = {
	userId: string;
	actionType: number;
	limit: number;
	storeIdAs: string;
};

export type RandomNodeConfig = {
	min: number;
	max: number;
	storeIdAs: string;
};

export type NodeDataType =
	| 'root'
	| 'error'
	| 'condition'
	| 'send-message'
	| 'add-role'
	| 'remove-role'
	| 'kick-member'
	| 'ban-member'
	| 'timeout-member'
	| 'create-channel'
	| 'delete-channel'
	| 'modify-channel'
	| 'send-dm'
	| 'create-webhook'
	| 'delete-webhook'
	| 'move-member'
	| 'mute-member'
	| 'deafen-member'
	| 'fetch-user'
	| 'fetch-member'
	| 'fetch-channel'
	| 'fetch-role'
	| 'create-invite'
	| 'delete-invite'
	| 'add-reaction'
	| 'remove-reaction'
	| 'pin-message'
	| 'unpin-message'
	| 'delete-message'
	| 'edit-message'
	| 'bulk-delete'
	| 'set-nickname'
	| 'create-role'
	| 'delete-role'
	| 'modify-role'
	| 'audit-log'
	| 'wait'
	| 'random'
	| 'unq-variable';

export type VisualNodeConfig =
	| SendMessageNodeConfig
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

export interface VisualNode {
	id: string;
	type: string;
	position: { x: number; y: number };
	data: {
		label: string;
		type: NodeDataType;
		config: VisualNodeConfig;
	};
	draggable?: boolean;
}

export interface VisualEdge {
	id: string;
	source: string;
	target: string;
	sourceHandle?: string;
	targetHandle?: string;
	type?: string;
}

export const NODE_CONFIG_SCHEMAS = {
	'send-message': ['content', 'embeds', 'components', 'ephemeral', 'storeIdAs'] as const,
	'edit-message': ['message_ref_block', 'content', 'embeds', 'components', 'storeIdAs'] as const,
	'condition': ['conditionType', 'roleId'] as const,
	'wait': ['duration', 'unit'] as const,
	'unq-variable': ['name', 'value'] as const,
	'add-role': ['roleId', 'userId', 'reason'] as const,
	'remove-role': ['roleId', 'userId', 'reason'] as const,
	'kick-member': ['userId', 'reason', 'deleteMessageDays'] as const,
	'ban-member': ['userId', 'reason', 'deleteMessageDays'] as const,
	'timeout-member': ['userId', 'duration', 'reason'] as const,
	'set-nickname': ['userId', 'nickname', 'reason'] as const,
	'create-channel': ['name', 'type', 'categoryId', 'topic', 'nsfw'] as const,
	'delete-channel': ['channelId', 'reason'] as const,
	'modify-channel': ['channelId', 'name', 'topic', 'nsfw'] as const,
	'send-dm': ['userId', 'content', 'embeds'] as const,
	'create-webhook': ['channelId', 'name', 'avatar'] as const,
	'delete-webhook': ['webhookId', 'reason'] as const,
	'move-member': ['userId', 'channelId', 'reason'] as const,
	'mute-member': ['userId', 'mute', 'reason'] as const,
	'deafen-member': ['userId', 'deafen', 'reason'] as const,
	'fetch-user': ['userId', 'storeIdAs'] as const,
	'fetch-member': ['userId', 'storeIdAs'] as const,
	'fetch-channel': ['channelId', 'storeIdAs'] as const,
	'fetch-role': ['roleId', 'storeIdAs'] as const,
	'create-invite': ['channelId', 'maxUses', 'maxAge', 'temporary', 'unique'] as const,
	'delete-invite': ['inviteCode', 'reason'] as const,
	'add-reaction': ['messageId', 'emoji', 'channelId'] as const,
	'remove-reaction': ['messageId', 'emoji', 'userId', 'channelId'] as const,
	'pin-message': ['messageId', 'channelId'] as const,
	'unpin-message': ['messageId', 'channelId'] as const,
	'delete-message': ['messageId', 'channelId', 'reason'] as const,
	'bulk-delete': ['channelId', 'count', 'reason'] as const,
	'create-role': ['name', 'color', 'permissions', 'hoist', 'mentionable'] as const,
	'delete-role': ['roleId', 'reason'] as const,
	'modify-role': ['roleId', 'name', 'color', 'permissions', 'hoist', 'mentionable'] as const,
	'audit-log': ['userId', 'actionType', 'limit', 'storeIdAs'] as const,
	'random': ['min', 'max', 'storeIdAs'] as const,
} as const;
