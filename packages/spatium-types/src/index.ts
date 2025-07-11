import { ButtonStyle, Embed } from 'discord.js';
import { Doc } from './schema';

export * from './schema';

export type User = Doc<'users'>;
export type DiscordServer = Doc<'discordServers'>;
export type ServerMetric = Doc<'serverMetrics'>;
export type BotCommand = Doc<'botCommands'>;
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
  | UnqVariableNodeConfig;

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
