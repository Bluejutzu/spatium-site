import { type ReactNode } from 'react';

export interface BaseComponent {
	children?: ReactNode;
	className?: string;
}

export interface DashboardProps {
	serverId?: string;
}

export interface AnimatedCounterProps {
	end: number;
	duration?: number;
}

export interface StatCard {
	title: string;
	value: number;
	icon: React.ComponentType<{ className?: string }>;
	accent: string;
	description: string;
	growth: string;
}

export interface FeatureCard {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
	accent: string;
}

export interface NavigationItem {
	href: string;
	label: string;
	icon?: React.ComponentType<{ className?: string }>;
}

export interface ThemeColors {
	'discord-blurple': string;
	'discord-green': string;
	'discord-yellow': string;
	'discord-red': string;
	'discord-orange': string;
	'discord-purple': string;
	'discord-dark': string;
	'discord-darker': string;
	'discord-text': string;
	'discord-border': string;
}

export interface BlockCategory {
	id: string;
	label: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
}

export type BlockTypeCategory =
	| 'options'
	| 'messaging'
	| 'logic'
	| 'utilities'
	| 'moderation'
	| 'roles'
	| 'utility'
	| 'channels'
	| 'voice'
	| 'webhooks'
	| 'members';

export interface BlockType {
	type: string;
	label: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	category: BlockTypeCategory;
}

export declare const DEFAULT_NODE_CONFIGS: {
	readonly root: {
		readonly type: "root";
		readonly name: "command";
		readonly description: "";
		readonly ephemeral: false;
		readonly cooldown: 0;
	};
	readonly 'send-message': {
		readonly type: "send-message";
		readonly content: "";
		readonly embeds: readonly [];
		readonly tts: false;
		readonly components: readonly [];
		readonly ephemeral: false;
		readonly storeIdAs: "";
	};
	readonly 'option-user': {
		readonly type: "option-user";
		readonly name: "";
		readonly description: "";
		readonly required: true;
		readonly value: "";
	};
	readonly 'edit-message': {
		readonly type: "edit-message";
		readonly message_ref_block: "";
		readonly content: "";
		readonly embeds: readonly [];
		readonly components: readonly [];
		readonly storeIdAs: "";
	};
	readonly condition: {
		readonly type: "condition";
		readonly conditionType: "";
		readonly roleId: "";
	};
	readonly wait: {
		readonly type: "wait";
		readonly duration: 0;
		readonly unit: "milliseconds";
	};
	readonly 'unq-variable': {
		readonly type: "unq-variable";
		readonly name: "";
		readonly value: "";
	};
	readonly 'add-role': {
		readonly type: "add-role";
		readonly roleId: "";
		readonly userId: "";
		readonly reason: "";
	};
	readonly 'remove-role': {
		readonly type: "remove-role";
		readonly roleId: "";
		readonly userId: "";
		readonly reason: "";
	};
	readonly 'kick-member': {
		readonly type: "kick-member";
		readonly userId: "";
		readonly reason: "";
		readonly deleteMessageDays: 0;
	};
	readonly 'ban-member': {
		readonly type: "ban-member";
		readonly userId: "";
		readonly reason: "";
		readonly deleteMessageDays: 0;
	};
	readonly 'timeout-member': {
		readonly type: "timeout-member";
		readonly userId: "";
		readonly duration: 0;
		readonly reason: "";
	};
	readonly 'set-nickname': {
		readonly type: "set-nickname";
		readonly userId: "";
		readonly nickname: "";
		readonly reason: "";
	};
	readonly 'create-channel': {
		readonly type: "create-channel";
		readonly name: "";
		readonly channelType: 0;
		readonly categoryId: "";
		readonly topic: "";
		readonly nsfw: false;
	};
	readonly 'delete-channel': {
		readonly type: "delete-channel";
		readonly channelId: "";
		readonly reason: "";
	};
	readonly 'modify-channel': {
		readonly type: "modify-channel";
		readonly channelId: "";
		readonly name: "";
		readonly topic: "";
		readonly nsfw: false;
	};
	readonly 'send-dm': {
		readonly type: "send-dm";
		readonly userId: "";
		readonly content: "";
		readonly embeds: readonly [];
	};
	readonly 'create-webhook': {
		readonly type: "create-webhook";
		readonly channelId: "";
		readonly name: "";
		readonly avatar: "";
	};
	readonly 'delete-webhook': {
		readonly type: "delete-webhook";
		readonly webhookId: "";
		readonly reason: "";
	};
	readonly 'move-member': {
		readonly type: "move-member";
		readonly userId: "";
		readonly channelId: "";
		readonly reason: "";
	};
	readonly 'mute-member': {
		readonly type: "mute-member";
		readonly userId: "";
		readonly mute: false;
		readonly reason: "";
	};
	readonly 'deafen-member': {
		readonly type: "deafen-member";
		readonly userId: "";
		readonly deafen: false;
		readonly reason: "";
	};
	readonly 'fetch-user': {
		readonly type: "fetch-user";
		readonly userId: "";
		readonly storeIdAs: "";
	};
	readonly 'fetch-member': {
		readonly type: "fetch-member";
		readonly userId: "";
		readonly storeIdAs: "";
	};
	readonly 'fetch-channel': {
		readonly type: "fetch-channel";
		readonly channelId: "";
		readonly storeIdAs: "";
	};
	readonly 'fetch-role': {
		readonly type: "fetch-role";
		readonly roleId: "";
		readonly storeIdAs: "";
	};
	readonly 'create-invite': {
		readonly type: "create-invite";
		readonly channelId: "";
		readonly maxUses: 0;
		readonly maxAge: 0;
		readonly temporary: false;
		readonly unique: false;
	};
	readonly 'delete-invite': {
		readonly type: "delete-invite";
		readonly inviteCode: "";
		readonly reason: "";
	};
	readonly 'add-reaction': {
		readonly type: "add-reaction";
		readonly messageId: "";
		readonly emoji: "";
		readonly channelId: "";
	};
	readonly 'remove-reaction': {
		readonly type: "remove-reaction";
		readonly messageId: "";
		readonly emoji: "";
		readonly userId: "";
		readonly channelId: "";
	};
	readonly 'pin-message': {
		readonly type: "pin-message";
		readonly messageId: "";
		readonly channelId: "";
	};
	readonly 'unpin-message': {
		readonly type: "unpin-message";
		readonly messageId: "";
		readonly channelId: "";
	};
	readonly 'delete-message': {
		readonly type: "delete-message";
		readonly messageId: "";
		readonly channelId: "";
		readonly reason: "";
	};
	readonly 'bulk-delete': {
		readonly type: "bulk-delete";
		readonly channelId: "";
		readonly count: 0;
		readonly reason: "";
	};
	readonly 'create-role': {
		readonly type: "create-role";
		readonly name: "";
		readonly color: 0;
		readonly permissions: "";
		readonly hoist: false;
		readonly mentionable: false;
	};
	readonly 'delete-role': {
		readonly type: "delete-role";
		readonly roleId: "";
		readonly reason: "";
	};
	readonly 'modify-role': {
		readonly type: "modify-role";
		readonly roleId: "";
		readonly name: "";
		readonly color: 0;
		readonly permissions: "";
		readonly hoist: false;
		readonly mentionable: false;
	};
	readonly 'audit-log': {
		readonly type: "audit-log";
		readonly userId: "";
		readonly actionType: 0;
		readonly limit: 0;
		readonly storeIdAs: "";
	};
	readonly random: {
		readonly type: "random";
		readonly min: 0;
		readonly max: 0;
		readonly storeIdAs: "";
	};
};
