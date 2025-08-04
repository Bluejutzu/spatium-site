'use client';

import 'reactflow/dist/style.css';

import { UserButton, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import {
  Ban,
  Clock,
  Copy,
  Crown,
  Database,
  GitBranch,
  Hash,
  ImageIcon,
  Link,
  Link2,
  MessageSquare,
  Plus,
  Save,
  Settings,
  Share,
  Shield,
  ToggleRight,
  Trash2,
  Users,
  UserX,
  Volume2,
  Webhook,
  X,
  Zap,
} from 'lucide-react';
import { Roboto } from 'next/font/google';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  type Connection,
  Controls,
  type Edge,
  Handle,
  type Node,
  type NodeProps,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type useReactFlow,
} from 'reactflow';

import { EmbedBuilder } from '@/components/app/embed-builder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BlockCategory } from '@/types/common';
import type { DiscordEmbed } from '@/types/discord';

import { api } from '../../../../../../convex/_generated/api';

export const DEFAULT_NODE_CONFIGS = {
  root: {
    type: "root",
    name: "command",
    description: "",
    ephemeral: false,
    cooldown: 0,
  },
  'send-message': {
    type: "send-message",
    content: "",
    embeds: [],
    tts: false,
    components: [],
    ephemeral: false,
    storeIdAs: "",
  },
  'option-user': {
    type: "option-user",
    name: "",
    description: "",
    required: true,
    value: "",
  },
  'edit-message': {
    type: "edit-message",
    message_ref_block: "",
    content: "",
    embeds: [],
    components: [],
    storeIdAs: "",
  },
  condition: {
    type: "condition",
    conditionType: "",
    roleId: "",
  },
  wait: {
    type: "wait",
    duration: 0,
    unit: "milliseconds",
  },
  'unq-variable': {
    type: "unq-variable",
    name: "",
    value: "",
  },
  'add-role': {
    type: "add-role",
    roleId: "",
    userId: "",
    reason: "",
  },
  'remove-role': {
    type: "remove-role",
    roleId: "",
    userId: "",
    reason: "",
  },
  'kick-member': {
    type: "kick-member",
    userId: "",
    reason: "",
    deleteMessageDays: 0,
  },
  'ban-member': {
    type: "ban-member",
    userId: "",
    reason: "",
    deleteMessageDays: 0,
  },
  'timeout-member': {
    type: "timeout-member",
    userId: "",
    duration: 0,
    reason: "",
  },
  'set-nickname': {
    type: "set-nickname",
    userId: "",
    nickname: "",
    reason: "",
  },
  'create-channel': {
    type: "create-channel",
    name: "",
    channelType: 0,
    categoryId: "",
    topic: "",
    nsfw: false,
  },
  'delete-channel': {
    type: "delete-channel",
    channelId: "",
    reason: "",
  },
  'modify-channel': {
    type: "modify-channel",
    channelId: "",
    name: "",
    topic: "",
    nsfw: false,
  },
  'send-dm': {
    type: "send-dm",
    userId: "",
    content: "",
    embeds: [],
  },
  'create-webhook': {
    type: "create-webhook",
    channelId: "",
    name: "",
    avatar: "",
  },
  'delete-webhook': {
    type: "delete-webhook",
    webhookId: "",
    reason: "",
  },
  'move-member': {
    type: "move-member",
    userId: "",
    channelId: "",
    reason: "",
  },
  'mute-member': {
    type: "mute-member",
    userId: "",
    mute: false,
    reason: "",
  },
  'deafen-member': {
    type: "deafen-member",
    userId: "",
    deafen: false,
    reason: "",
  },
  'fetch-user': {
    type: "fetch-user",
    userId: "",
    storeIdAs: "",
  },
  'fetch-member': {
    type: "fetch-member",
    userId: "",
    storeIdAs: "",
  },
  'fetch-channel': {
    type: "fetch-channel",
    channelId: "",
    storeIdAs: "",
  },
  'fetch-role': {
    type: "fetch-role",
    roleId: "",
    storeIdAs: "",
  },
  'create-invite': {
    type: "create-invite",
    channelId: "",
    maxUses: 0,
    maxAge: 0,
    temporary: false,
    unique: false,
  },
  'delete-invite': {
    type: "delete-invite",
    inviteCode: "",
    reason: "",
  },
  'add-reaction': {
    type: "add-reaction",
    messageId: "",
    emoji: "",
    channelId: "",
  },
  'remove-reaction': {
    type: "remove-reaction",
    messageId: "",
    emoji: "",
    userId: "",
    channelId: "",
  },
  'pin-message': {
    type: "pin-message",
    messageId: "",
    channelId: "",
  },
  'unpin-message': {
    type: "unpin-message",
    messageId: "",
    channelId: "",
  },
  'delete-message': {
    type: "delete-message",
    messageId: "",
    channelId: "",
    reason: "",
  },
  'bulk-delete': {
    type: "bulk-delete",
    channelId: "",
    count: 0,
    reason: "",
  },
  'create-role': {
    type: "create-role",
    name: "",
    color: 0,
    permissions: "",
    hoist: false,
    mentionable: false,
  },
  'delete-role': {
    type: "delete-role",
    roleId: "",
    reason: "",
  },
  'modify-role': {
    type: "modify-role",
    roleId: "",
    name: "",
    color: 0,
    permissions: "",
    hoist: false,
    mentionable: false,
  },
  'audit-log': {
    type: "audit-log",
    userId: "",
    actionType: 0,
    limit: 0,
    storeIdAs: "",
  },
  random: {
    type: "random",
    min: 0,
    max: 0,
    storeIdAs: "",
  },
};

const roboto = Roboto({
  subsets: ['latin'],
});

const ROOT_NODE_ID = 'root';
const ERROR_NODE_ID = 'error-handler';
const INPUT_FONT = roboto.className;

// Auto-layouting function
const getLayoutedNodes = (nodes: Node[], edges: Edge[]): Node[] => {
  if (nodes.length === 0) return [];

  const adj = new Map<string, string[]>();
  const reverseAdj = new Map<string, string[]>();

  nodes.forEach(node => {
    adj.set(node.id, []);
    reverseAdj.set(node.id, []);
  });

  edges.forEach(edge => {
    adj.get(edge.source)?.push(edge.target);
    reverseAdj.get(edge.target)?.push(edge.source);
  });

  const layers = new Map<string, number>();
  const queue = nodes
    .filter(n => (reverseAdj.get(n.id) || []).length === 0)
    .map(n => n.id);
  const visited = new Set(queue);

  let q = [...queue];
  let layer = 0;
  while (q.length > 0) {
    const nextQ: string[] = [];
    q.forEach(u => {
      layers.set(u, layer);
      (adj.get(u) || []).forEach(v => {
        if (!visited.has(v)) {
          visited.add(v);
          nextQ.push(v);
        }
      });
    });
    q = nextQ;
    layer++;
  }

  const layerCounts = new Map<number, number>();
  nodes.forEach(n => {
    const l = layers.get(n.id);
    if (l !== undefined) {
      layerCounts.set(l, (layerCounts.get(l) || 0) + 1);
    }
  });

  const layerOffsets = new Map<number, number>();
  const nodeWidth = 280; // Increased width
  const nodeHeight = 30;
  const horizontalGap = 100;
  const verticalGap = 150;

  return nodes.map(node => {
    const l = layers.get(node.id);
    if (l !== undefined) {
      const layerCount = layerCounts.get(l) || 1;
      const xOffset = (-(layerCount - 1) * (nodeWidth + horizontalGap)) / 2;
      const currentOffset = layerOffsets.get(l) || 0;

      const x = xOffset + currentOffset;
      const y = l * (nodeHeight + verticalGap);

      layerOffsets.set(l, currentOffset + nodeWidth + horizontalGap);

      return { ...node, position: { x, y } };
    }
    return node;
  });
};

const RootNode = ({ data, selected }: NodeProps) => {
  return (
    <div
      className={`shadow-lg rounded-lg min-w-[100px] text-white font-bold relative overflow-hidden border border-slate-700 ${selected
        ? 'outline-2 outline-discord-blurple'
        : data.isHovered
          ? 'outline-2 outline-discord-purple'
          : ''
        }`}
      style={{ backgroundColor: 'var(--color-discord-darker)' }}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='w-3 h-3 shadow-lg'
        style={{ backgroundColor: 'var(--color-discord-green)' }}
      />
      <div className='h-2 bg-yellow-500' />
      <div className='p-4'>
        <div className='flex items-center justify-between relative z-10'>
          <Settings className='w-4 h-4' />
          <span>Command Settings</span>
        </div>
        <div className='text-xs mt-1 opacity-80 relative z-10'>
          {data.config?.name || 'Unnamed Command'}
        </div>
        <Handle
          type='source'
          position={Position.Bottom}
          className='w-3 h-3 shadow-lg'
          style={{ backgroundColor: 'var(--color-discord-purple)' }}
        />
      </div>
    </div>
  );
};

const ConditionNode = ({ data, selected }: NodeProps) => {
  const color = 'var(--color-discord-blurple)';
  return (
    <div
      className={`shadow-lg rounded-lg min-w-[280px] text-white font-bold relative overflow-hidden border border-slate-700 ${selected
        ? 'outline-2 outline-discord-blurple'
        : data.isHovered
          ? 'outline-2 outline-discord-purple'
          : ''
        }`}
      style={{ backgroundColor: 'var(--color-discord-darker)' }}
    >
      <div className='h-2' style={{ backgroundColor: color }} />
      <div className='p-4'>
        <Handle
          type='target'
          position={Position.Top}
          className='w-3 h-3 shadow-lg'
          style={{ backgroundColor: color }}
        />
        <div className='text-center relative z-10'>
          <GitBranch className='w-4 h-4 mx-auto mb-1' />
          <span>Condition</span>
          <div className='text-xs mt-1 opacity-80'>
            {data.config?.condition || 'No condition set'}
          </div>
        </div>
        <Handle
          type='source'
          position={Position.Bottom}
          id='true'
          style={{ left: '25%', backgroundColor: 'var(--color-discord-green)' }}
          className='w-3 h-3 shadow-lg'
        />
        <Handle
          type='source'
          position={Position.Bottom}
          id='false'
          style={{ left: '75%', backgroundColor: 'var(--color-discord-red)' }}
          className='w-3 h-3 shadow-lg'
        />
        <div className='absolute -bottom-6 left-0 right-0 flex justify-between text-xs z-10 px-4'>
          <Badge
            className='text-white text-xs shadow-lg'
            style={{ backgroundColor: 'var(--color-discord-green)' }}
          >
            True
          </Badge>
          <Badge
            className='text-white text-xs shadow-lg'
            style={{ backgroundColor: 'var(--color-discord-red)' }}
          >
            False
          </Badge>
        </div>
      </div>
    </div>
  );
};

const MessageNode = ({ data, selected }: NodeProps) => {
  const color = 'var(--color-discord-blurple)';
  return (
    <div
      className={`shadow-lg rounded-lg min-w-[280px] text-white font-bold relative overflow-hidden border border-slate-700 ${selected
        ? 'outline-2 outline-discord-blurple'
        : data.isHovered
          ? 'outline-2 outline-discord-purple'
          : ''
        }`}
      style={{ backgroundColor: 'var(--color-discord-darker)' }}
    >
      <div className='h-2' style={{ backgroundColor: color }} />
      <div className='p-4'>
        <Handle
          type='target'
          position={Position.Top}
          className='w-3 h-3 shadow-lg'
          style={{ backgroundColor: color }}
        />
        <div className='text-center relative z-10'>
          <MessageSquare className='w-4 h-4 mx-auto mb-1' />
          <span>Send Message</span>
          <div className='text-xs mt-1 opacity-80'>
            {data.config?.content
              ? `"${data.config.content.substring(0, 20)}..."`
              : data.config?.embeds?.length
                ? `${data.config.embeds.length} embed(s)`
                : 'No content set'}
          </div>
        </div>
        <Handle
          type='source'
          position={Position.Bottom}
          className='w-3 h-3 shadow-lg'
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const createCommandOptionNode =
  (icon: React.ComponentType<any>, label: string) =>
    ({ data, selected }: NodeProps) => {
      const color = 'var(--color-discord-green)';
      const IconComponent = icon;
      return (
        <div
          className={`shadow-lg rounded-lg min-w-[200px] text-white font-bold relative overflow-hidden border border-slate-700 ${selected ? 'outline-2 outline-discord-blurple' : ''
            }`}
          style={{ backgroundColor: 'var(--color-discord-darker)' }}
        >
          <div className='h-2' style={{ backgroundColor: color }} />
          <div className='p-3'>
            <div className='text-center relative z-10'>
              <IconComponent className='w-4 h-4 mx-auto mb-1' />
              <span>{label}</span>
              <div className='text-xs mt-1 opacity-80'>
                {data.config?.name || 'Unnamed Option'}
              </div>
            </div>
            <Handle
              type='source'
              position={Position.Bottom}
              className='w-3 h-3 shadow-lg'
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      );
    };

const createDiscordNode =
  (icon: React.ComponentType<any>, defaultCategory: string, label: string) =>
    ({ data, selected }: NodeProps) => {
      const blockType = BLOCK_TYPES.find(b => b.type === data.type);
      const category = blockType?.category || defaultCategory;
      const IconComponent = icon;

      const colorMap: Record<string, string> = {
        messaging: 'var(--color-discord-blurple)',
        moderation: 'var(--color-discord-red)',
        roles: 'var(--color-discord-orange)',
        channels: 'var(--color-discord-green)',
        members: 'var(--color-discord-purple)',
        voice: 'var(--color-discord-yellow)',
        webhooks: 'var(--color-discord-green)',
        logic: 'var(--color-discord-blurple)',
        utilities: 'var(--color-discord-purple)',
      };

      const color = colorMap[category] || 'var(--color-discord-blurple)';

      return (
        <div
          className={`shadow-lg rounded-lg min-w-[280px] text-white font-bold relative overflow-hidden border border-slate-700 ${selected
            ? 'outline-2 outline-discord-blurple'
            : data.isHovered
              ? 'outline-2 outline-discord-purple'
              : ''
            }`}
          style={{ backgroundColor: 'var(--color-discord-darker)' }}
        >
          <div className='h-2' style={{ backgroundColor: color }} />
          <div className='p-4'>
            <Handle
              type='target'
              position={Position.Top}
              className='w-3 h-3 shadow-lg'
              style={{ backgroundColor: color }}
            />
            <div className='text-center relative z-10'>
              <IconComponent className='w-4 h-4 mx-auto mb-1' />
              <span>{label}</span>
              <div className='text-xs mt-1 opacity-80'>
                {data.config?.configured ? 'Configured' : 'Not configured'}
              </div>
            </div>
            <Handle
              type='source'
              position={Position.Bottom}
              className='w-3 h-3 shadow-lg'
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      );
    };

const BLOCK_TYPES = [
  // Command Options
  {
    type: 'option-user',
    label: 'User Option',
    category: 'options',
    icon: Users,
    description: 'A user command option.',
  },
  {
    type: 'option-role',
    label: 'Role Option',
    category: 'options',
    icon: Crown,
    description: 'A role command option.',
  },
  {
    type: 'option-channel',
    label: 'Channel Option',
    category: 'options',
    icon: Hash,
    description: 'A channel command option.',
  },
  {
    type: 'option-text',
    label: 'Text Option',
    category: 'options',
    icon: MessageSquare,
    description: 'A text command option.',
  },
  {
    type: 'option-boolean',
    label: 'Boolean Option',
    category: 'options',
    icon: ToggleRight,
    description: 'A boolean command option.',
  },
  // Messaging
  {
    type: 'send-message',
    label: 'Send Message',
    category: 'messaging',
    icon: MessageSquare,
    description: 'Send a message with text and embeds',
  },
  {
    type: 'send-dm',
    label: 'Send DM',
    category: 'messaging',
    icon: MessageSquare,
    description: 'Send a direct message to a user',
  },
  {
    type: 'edit-message',
    label: 'Edit Message',
    category: 'messaging',
    icon: MessageSquare,
    description: 'Edit an existing message',
  },
  {
    type: 'delete-message',
    label: 'Delete Message',
    category: 'messaging',
    icon: MessageSquare,
    description: 'Delete a message',
  },
  {
    type: 'bulk-delete',
    label: 'Bulk Delete Messages',
    category: 'messaging',
    icon: MessageSquare,
    description: 'Delete multiple messages at once',
  },
  {
    type: 'pin-message',
    label: 'Pin Message',
    category: 'messaging',
    icon: MessageSquare,
    description: 'Pin a message to the channel',
  },
  {
    type: 'unpin-message',
    label: 'Unpin Message',
    category: 'messaging',
    icon: MessageSquare,
    description: 'Unpin a message from the channel',
  },
  {
    type: 'add-reaction',
    label: 'Add Reaction',
    category: 'messaging',
    icon: Zap,
    description: 'Add a reaction to a message',
  },
  {
    type: 'remove-reaction',
    label: 'Remove Reaction',
    category: 'messaging',
    icon: Zap,
    description: 'Remove a reaction from a message',
  },
  // Moderation
  {
    type: 'kick-member',
    label: 'Kick Member',
    category: 'moderation',
    icon: UserX,
    description: 'Kick a member from the server',
  },
  {
    type: 'ban-member',
    label: 'Ban Member',
    category: 'moderation',
    icon: Ban,
    description: 'Ban a member from the server',
  },
  {
    type: 'timeout-member',
    label: 'Timeout Member',
    category: 'moderation',
    icon: Clock,
    description: 'Timeout a member',
  },
  {
    type: 'set-nickname',
    label: 'Set Nickname',
    category: 'moderation',
    icon: Users,
    description: "Change a member's nickname",
  },
  // Roles & Permissions
  {
    type: 'add-role',
    label: 'Add Role',
    category: 'roles',
    icon: Crown,
    description: 'Add a role to a member',
  },
  {
    type: 'remove-role',
    label: 'Remove Role',
    category: 'roles',
    icon: Crown,
    description: 'Remove a role from a member',
  },
  {
    type: 'create-role',
    label: 'Create Role',
    category: 'roles',
    icon: Crown,
    description: 'Create a new role',
  },
  {
    type: 'delete-role',
    label: 'Delete Role',
    category: 'roles',
    icon: Crown,
    description: 'Delete a role',
  },
  {
    type: 'modify-role',
    label: 'Modify Role',
    category: 'roles',
    icon: Crown,
    description: 'Modify role properties',
  },
  // Channels
  {
    type: 'create-channel',
    label: 'Create Channel',
    category: 'channels',
    icon: Hash,
    description: 'Create a new channel',
  },
  {
    type: 'delete-channel',
    label: 'Delete Channel',
    category: 'channels',
    icon: Hash,
    description: 'Delete a channel',
  },
  {
    type: 'modify-channel',
    label: 'Modify Channel',
    category: 'channels',
    icon: Hash,
    description: 'Modify channel properties',
  },
  {
    type: 'create-invite',
    label: 'Create Invite',
    category: 'channels',
    icon: Link,
    description: 'Create an invite link',
  },
  {
    type: 'delete-invite',
    label: 'Delete Invite',
    category: 'channels',
    icon: Link,
    description: 'Delete an invite',
  },
  // Members
  {
    type: 'fetch-user',
    label: 'Fetch User',
    category: 'members',
    icon: Users,
    description: 'Get user information',
  },
  {
    type: 'fetch-member',
    label: 'Fetch Member',
    category: 'members',
    icon: Users,
    description: 'Get member information',
  },
  // Voice
  {
    type: 'move-member',
    label: 'Move Member',
    category: 'voice',
    icon: Volume2,
    description: 'Move member to voice channel',
  },
  {
    type: 'mute-member',
    label: 'Mute Member',
    category: 'voice',
    icon: Volume2,
    description: 'Mute member in voice',
  },
  {
    type: 'deafen-member',
    label: 'Deafen Member',
    category: 'voice',
    icon: Volume2,
    description: 'Deafen member in voice',
  },
  // Webhooks
  {
    type: 'create-webhook',
    label: 'Create Webhook',
    category: 'webhooks',
    icon: Webhook,
    description: 'Create a webhook',
  },
  {
    type: 'delete-webhook',
    label: 'Delete Webhook',
    category: 'webhooks',
    icon: Webhook,
    description: 'Delete a webhook',
  },
  // Logic & Flow
  {
    type: 'condition',
    label: 'Condition',
    category: 'logic',
    icon: GitBranch,
    description: 'Conditional branching',
  },
  {
    type: 'wait',
    label: 'Wait/Delay',
    category: 'logic',
    icon: Clock,
    description: 'Add a delay',
  },
  {
    type: 'random',
    label: 'Random',
    category: 'logic',
    icon: Zap,
    description: 'Generate random values',
  },
  // Utilities
  {
    type: 'unq-variable',
    label: 'Unique Variable',
    category: 'utilities',
    icon: Database,
    description: 'Store and retrieve data',
  },
  {
    type: 'audit-log',
    label: 'Audit Log',
    category: 'utilities',
    icon: Database,
    description: 'Log actions to audit',
  },
] as const;

export type BlockTypeId = typeof BLOCK_TYPES[number]['type'];

type NodeTypeComponent = (props: NodeProps) => JSX.Element;

type NodeTypesMap = {
  root: NodeTypeComponent;
} & {
    [K in BlockTypeId]: NodeTypeComponent;
  };

const nodeTypes: NodeTypesMap = {
  root: RootNode,
  condition: ConditionNode,
  'send-message': MessageNode,
  'option-user': createCommandOptionNode(Users, 'User Option'),
  'option-role': createCommandOptionNode(Crown, 'Role Option'),
  'option-channel': createCommandOptionNode(Hash, 'Channel Option'),
  'option-text': createCommandOptionNode(MessageSquare, 'Text Option'),
  'option-boolean': createCommandOptionNode(ToggleRight, 'Boolean Option'),
  'add-role': createDiscordNode(Crown, 'roles', 'Add Role'),
  'remove-role': createDiscordNode(Crown, 'roles', 'Remove Role'),
  'kick-member': createDiscordNode(UserX, 'moderation', 'Kick Member'),
  'ban-member': createDiscordNode(Ban, 'moderation', 'Ban Member'),
  'timeout-member': createDiscordNode(Clock, 'moderation', 'Timeout Member'),
  'create-channel': createDiscordNode(Hash, 'channels', 'Create Channel'),
  'delete-channel': createDiscordNode(Hash, 'channels', 'Delete Channel'),
  'modify-channel': createDiscordNode(Hash, 'channels', 'Modify Channel'),
  'send-dm': createDiscordNode(MessageSquare, 'messaging', 'Send DM'),
  'create-webhook': createDiscordNode(Webhook, 'webhooks', 'Create Webhook'),
  'delete-webhook': createDiscordNode(Webhook, 'webhooks', 'Delete Webhook'),
  'move-member': createDiscordNode(Volume2, 'voice', 'Move Member'),
  'mute-member': createDiscordNode(Volume2, 'voice', 'Mute Member'),
  'deafen-member': createDiscordNode(Volume2, 'voice', 'Deafen Member'),
  'fetch-user': createDiscordNode(Users, 'members', 'Fetch User'),
  'fetch-member': createDiscordNode(Users, 'members', 'Fetch Member'),
  'create-invite': createDiscordNode(Link2, 'channels', 'Create Invite'),
  'delete-invite': createDiscordNode(Link2, 'channels', 'Delete Invite'),
  'add-reaction': createDiscordNode(Zap, 'messaging', 'Add Reaction'),
  'remove-reaction': createDiscordNode(Zap, 'messaging', 'Remove Reaction'),
  'pin-message': createDiscordNode(MessageSquare, 'messaging', 'Pin Message'),
  'unpin-message': createDiscordNode(MessageSquare, 'messaging', 'Unpin Message'),
  'delete-message': createDiscordNode(MessageSquare, 'messaging', 'Delete Message'),
  'edit-message': createDiscordNode(MessageSquare, 'messaging', 'Edit Message'),
  'bulk-delete': createDiscordNode(MessageSquare, 'messaging', 'Bulk Delete'),
  'set-nickname': createDiscordNode(Users, 'moderation', 'Set Nickname'),
  'create-role': createDiscordNode(Crown, 'roles', 'Create Role'),
  'delete-role': createDiscordNode(Crown, 'roles', 'Delete Role'),
  'modify-role': createDiscordNode(Crown, 'roles', 'Modify Role'),
  'audit-log': createDiscordNode(Database, 'utilities', 'Audit Log'),
  wait: createDiscordNode(Clock, 'logic', 'Wait/Delay'),
  random: createDiscordNode(Zap, 'logic', 'Random'),
  'unq-variable': createDiscordNode(Database, 'utilities', 'Variable'),
};

const initialNodes: Node[] = [
  {
    id: ROOT_NODE_ID,
    type: 'root',
    position: { x: 400, y: 100 },
    data: {
      label: 'Command Settings',
      type: 'root',
      config: { name: '', description: '', ephemeral: false, cooldown: 0 },
    },
    draggable: false,
  },
];

const initialEdges: Edge[] = [];

const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    id: 'options',
    label: 'Command Options',
    icon: Settings,
    description: 'Define command options/parameters',
  },
  {
    id: 'messaging',
    label: 'Messaging',
    icon: MessageSquare,
    description: 'Send and manage messages',
  },
  {
    id: 'moderation',
    label: 'Moderation',
    icon: Shield,
    description: 'Moderation actions',
  },
  {
    id: 'roles',
    label: 'Roles & Permissions',
    icon: Crown,
    description: 'Role management',
  },
  {
    id: 'channels',
    label: 'Channels',
    icon: Hash,
    description: 'Channel operations',
  },
  {
    id: 'members',
    label: 'Members',
    icon: Users,
    description: 'Member management',
  },
  {
    id: 'voice',
    label: 'Voice',
    icon: Volume2,
    description: 'Voice channel operations',
  },
  {
    id: 'webhooks',
    label: 'Webhooks',
    icon: Webhook,
    description: 'Webhook management',
  },
  {
    id: 'logic',
    label: 'Logic & Flow',
    icon: GitBranch,
    description: 'Control flow',
  },
  {
    id: 'utilities',
    label: 'Utilities',
    icon: Database,
    description: 'Helper functions',
  },
];
interface CommandFlowBuilderProps {
  serverId: string;
}

function CommandFlowBuilder({ serverId }: CommandFlowBuilderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const commandId = searchParams.get('commandId');

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showPalette, setShowPalette] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('options');
  const [embedBuilderOpen, setEmbedBuilderOpen] = useState(false);
  const [currentEmbedIndex, setCurrentEmbedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const toast = useToast();
  const [rfInstance, setRfInstance] = useState<ReturnType<
    typeof useReactFlow
  > | null>(null);

  // State for fetching server data
  const [roles, setRoles] = useState<import('@/types/discord').DiscordRole[]>([]);
  const [channels, setChannels] = useState<import('@/types/discord').DiscordChannel[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [channelsError, setChannelsError] = useState<string | null>(null);

  const [importValue, setImportValue] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const memoizedNodes = useMemo(() => {
    return nodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        isHovered: n.id === hoveredNodeId,
      },
    }));
  }, [nodes, hoveredNodeId]);

  // Fetch existing command if editing
  const existingCommand = useQuery(
    api.discord.getCommand,
    commandId ? { commandId: commandId as any } : 'skip'
  );
  const shareCode = existingCommand?.shareCode;
  const saveCommandMutation = useMutation(api.discord.saveCommand);

  // Load existing command data
  useEffect(() => {
    if (existingCommand && !isLoading) {
      try {
        const parsedBlocks = JSON.parse(existingCommand.blocks);
        if (parsedBlocks.nodes && parsedBlocks.edges) {
          const layoutedNodes = getLayoutedNodes(
            parsedBlocks.nodes,
            parsedBlocks.edges
          );
          setNodes(layoutedNodes);
          setEdges(parsedBlocks.edges);

          if (rfInstance) {
            // Fit view after layout
            setTimeout(() => {
              rfInstance.fitView({ duration: 400, padding: 0.1 });
            }, 100);
          }
        }
      } catch (error) {
        console.error('Failed to parse existing command blocks:', error);
        toast.error('Load Error', 'Failed to load existing command data.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingCommand, isLoading, rfInstance]);

  const generateID = (s: string) => {
    return `${Date.now()}-${Math.random()}-${s}`;
  };

  const highlightNodeById = useCallback(
    (id: string) => {
      if (!rfInstance) return;

      const node = rfInstance.getNode(id);
      if (!node) return;

      rfInstance.setViewport(
        {
          x: node.position.x - 150,
          y: node.position.y - 100,
          zoom: 1.25,
        },
        { duration: 500 }
      );

      setSelectedNode(node);
    },
    [rfInstance]
  );

  const addNode = useCallback(
    (type: string) => {
      if (!rfInstance) return;
      const blockType = BLOCK_TYPES.find(b => b.type === type);
      const id = generateID(type);

      const rootNode = rfInstance.getNode(ROOT_NODE_ID);
      const isOption = type.startsWith('option-');

      const position = {
        x: rootNode
          ? rootNode.position.x - 100 + Math.random() * 200
          : 200 + Math.random() * 600,
        y:
          rootNode && isOption
            ? rootNode.position.y - 200
            : 100 + Math.random() * 400,
      };

      const newNode: Node = {
        id,
        type,
        position,
        data: {
          label: blockType?.label || type,
          type,
          config: getDefaultConfig(type as keyof typeof DEFAULT_NODE_CONFIGS),
        },
      };
      setNodes(nds => [...nds, newNode]);

      if (isOption && rootNode) {
        const newEdge = {
          id: `e-${id}-${rootNode.id}`,
          source: id,
          target: rootNode.id,
          type: 'smoothstep',
        };
        setEdges(eds => addEdge(newEdge, eds));
      }
    },
    [rfInstance, setNodes, setEdges]
  );

  const deleteSelectedNode = useCallback(() => {
    if (
      selectedNode &&
      selectedNode.id !== ROOT_NODE_ID &&
      selectedNode.id !== ERROR_NODE_ID
    ) {
      setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
      setEdges(eds =>
        eds.filter(
          e => e.source !== selectedNode.id && e.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const getDefaultConfig = <T extends keyof typeof DEFAULT_NODE_CONFIGS>(type: T): typeof DEFAULT_NODE_CONFIGS[T] => {
    return { ...DEFAULT_NODE_CONFIGS[type] };
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const sourceNode = rfInstance?.getNode(params.source!);
      const targetNode = rfInstance?.getNode(params.target!);

      if (sourceNode && targetNode) {
        const isSourceOption = sourceNode.type?.startsWith('option-');
        if (isSourceOption && targetNode.type !== 'root') {
          toast.error(
            'Invalid Connection',
            'Command options can only connect to the Command Settings block.'
          );
          return;
        }
      }
      setEdges(eds => addEdge(params, eds));
    },
    [rfInstance, setEdges, toast]
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      const filteredDeleted = deleted.filter(
        node => node.id !== ROOT_NODE_ID && node.id !== ERROR_NODE_ID
      );
      setNodes(nds =>
        nds.filter(n => !filteredDeleted.find(d => d.id === n.id))
      );
    },
    [setNodes]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const updateNodeConfig = useCallback(
    (nodeId: string, config: any) => {
      setNodes(nds =>
        nds.map(n =>
          n.id === nodeId
            ? {
              ...n,
              data: { ...n.data, config: { ...n.data.config, ...config } },
            }
            : n
        )
      );
      if (selectedNode?.id === nodeId) {
        setSelectedNode(prev =>
          prev
            ? {
              ...prev,
              data: {
                ...prev.data,
                config: { ...prev.data.config, ...config },
              },
            }
            : null
        );
      }
    },
    [setNodes, selectedNode]
  );


  const removeEdge = useCallback(
    (edgeId: string) => {
      setEdges(eds => eds.filter(e => e.id !== edgeId));
    },
    [setEdges]
  );

  const getConnectedNodeLabel = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return 'Unknown Block';
    return (
      node.data.config?.name ||
      node.data.label ||
      `Block ${node.id.substring(0, 4)}`
    );
  };

  const handleShareClick = async () => {
    if (!commandId) {
      toast.error('No Command', 'You must save the command before sharing.');
      return;
    }
    if (!existingCommand) {
      toast.error('No Command', 'You must save the command before sharing.');
      return
    }
    if (!shareCode) {
      const newShareCode = `share_${commandId}`
      await saveCommandMutation({
        commandId: existingCommand._id,
        serverId: existingCommand.serverId,
        name: existingCommand.name,
        description: existingCommand.description || "",
        blocks: existingCommand.blocks,
        cooldown: existingCommand.cooldown || 0,
        shareCode: newShareCode,
        options: existingCommand.options
      })
        .catch((e) => console.error(e))
        .then(() => {
          toast.success('Share Code Created!', 'You can now share this command. ');
        });

      console.log(newShareCode, existingCommand)
      return;
    }
    setSharePopoverOpen(true);
  };

  const handleCopyShareCode = () => {
    if (shareCode) {
      navigator.clipboard.writeText(shareCode);
      toast.success('Copied!', 'Share code copied to clipboard.');
    }
  };

  const handleDeleteShareCode = async () => {
    setIsDeleting(true);
    try {
      if (!existingCommand) {
        toast.error("No Command found", "A command was not found to delete")
        return
      }
      await saveCommandMutation({
        commandId: existingCommand._id,
        serverId: existingCommand.serverId,
        name: existingCommand.name,
        description: existingCommand.description || "",
        blocks: existingCommand.blocks,
        cooldown: existingCommand.cooldown || 0,
        shareCode: "",
        options: existingCommand.options
      });
      toast.success('Share Code Deleted', 'This share code is no longer shareable.');
      setDeleteDialogOpen(false);
      setSharePopoverOpen(false);
    } catch (err) {
      toast.error('Delete Failed', 'Could not delete share code.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImport = async () => {
    const id = importValue.trim();
    if (!id) {
      toast.error('Invalid Link', 'Please enter a valid share link or command ID.');
      return;
    }
    setImportLoading(true);
    try {
      const res = await fetch(`/api/commands/share/${id}`);
      if (!res.ok) throw new Error('Command not found');
      const data = await res.json();
      // Save to current server
      const result = await saveCommandMutation({
        name: data.name,
        description: data.description,
        blocks: data.blocks,
        serverId,
        cooldown: data.cooldown || 0,
        options: data.options || [],
      });
      toast.success('Command Imported!', 'The command has been added to this server.');
      setImportValue('');
      // Optionally, redirect to the new command
      if (result.commandId) {
        router.push(`/dashboard/${serverId}/commands/builder?commandId=${result.commandId}`);
      }
    } catch (err) {
      toast.error('Import Failed', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setImportLoading(false);
    }
  };

  const saveCommand = useCallback(async () => {
    setIsLoading(true);

    // Find the root node for command name/description
    const rootNode = nodes.find(n => n.type === 'root');
    if (!rootNode) {
      toast.error(
        'Missing root node',
        'A root node is required for command name/description.'
      );
      setIsLoading(false);
      return;
    }

    const name = rootNode.data.config?.name;
    if (!name) {
      toast.error(
        'Missing command name',
        'A name is required for the command.'
      );
      setIsLoading(false);
      return;
    }

    const description = rootNode.data.config?.description || '';
    const blocks = JSON.stringify({ nodes, edges });
    const options = nodes.filter(n => n.type?.startsWith('option-')).map(n => ({
      type: n.data.type,
      ...n.data.config
    }))

    const commandData = {
      name,
      description,
      blocks,
      serverId,
      commandId: commandId as any || undefined,
      cooldown: rootNode.data.config?.cooldown || 0,
      options,
    };

    try {
      const result = await saveCommandMutation(commandData);
      const action = result.updated ? 'updated' : 'created';
      toast.success(
        `Command ${action === 'updated' ? 'Updated' : 'Created'} Successfully!`,
        `Your command flow has been ${action} and is ready to use.`
      );

      // If this was a new command, redirect to edit mode
      if (result.created && result.commandId) {
        router.push(
          `/dashboard/${serverId}/commands/builder?commandId=${result.commandId}`
        );
      }
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? (err as any).message
          : String(err);
      toast.error('Failed to save command', errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [nodes, edges, serverId, commandId, toast, saveCommandMutation, router]);

  // Fetch roles from Discord API
  const fetchRoles = useCallback(async () => {
    if (!serverId || !user?.id) return;

    setRolesLoading(true);
    setRolesError(null);

    try {
      const roles = await fetch(`/api/discord/guild/roles?serverId=${serverId}&userId=${user.id}`).then(res => res.json())
      setRoles(roles);
    } catch (err: any) {
      setRolesError(err.message);
      toast.error('Failed to fetch roles', err.message);
    } finally {
      setRolesLoading(false);
    }
  }, [serverId, toast, user?.id]);

  // Fetch channels from Discord API
  const fetchChannels = useCallback(async () => {
    if (!serverId || !user?.id) return;

    setChannelsLoading(true);
    setChannelsError(null);

    try {
      const channels = await fetch(`/api/discord/guild/channels?serverId=${serverId}&userId=${user.id}`).then(res => res.json())
      setChannels(channels);
    } catch (err: any) {
      setChannelsError(err.message);
      toast.error('Failed to fetch channels', err.message);
    } finally {
      setChannelsLoading(false);
    }
  }, [serverId, toast, user?.id]);

  // Auto-fetch roles and channels when needed
  useEffect(() => {
    if (selectedNode?.data.type === 'option-role' && roles.length === 0 && !rolesLoading) {
      fetchRoles();
    }
  }, [selectedNode?.data.type, roles.length, rolesLoading, fetchRoles]);

  useEffect(() => {
    if (selectedNode?.data.type === 'option-channel' && channels.length === 0 && !channelsLoading) {
      fetchChannels();
    }
  }, [selectedNode?.data.type, channels.length, channelsLoading, fetchChannels]);

  const openEmbedBuilder = (embedIndex = 0) => {
    setCurrentEmbedIndex(embedIndex);
    setEmbedBuilderOpen(true);
  };

  const saveEmbed = (embed: DiscordEmbed) => {
    if (!selectedNode) return;
    const embeds = [...(selectedNode.data.config.embeds || [])];
    embeds[currentEmbedIndex] = embed;
    updateNodeConfig(selectedNode.id, { embeds });
  };

  const addEmbed = () => {
    if (!selectedNode) return;
    const embeds = [...(selectedNode.data.config.embeds || []), {}];
    updateNodeConfig(selectedNode.id, { embeds });
    openEmbedBuilder(embeds.length - 1);
  };

  const removeEmbed = (index: number) => {
    if (!selectedNode) return;
    const embeds = [...(selectedNode.data.config.embeds || [])];
    embeds.splice(index, 1);
    updateNodeConfig(selectedNode.id, { embeds });
  };

  const renderNodeConfiguration = () => {
    if (!selectedNode) return null;

    const config = selectedNode.data.config || {};

    switch (selectedNode.data.type) {
      case 'root':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Command Name</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.name || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { name: e.target.value })
                }
                placeholder='e.g., hello'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Description</Label>
              <Textarea
                className={'mt-1 ' + INPUT_FONT}
                value={config.description || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    description: e.target.value,
                  })
                }
                placeholder='What does this command do?'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.ephemeral || false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { ephemeral: checked })
                }
              />
              <Label className='text-white'>Ephemeral Response</Label>
            </div>
            <div>
              <Label className='text-white font-medium'>
                Cooldown (seconds)
              </Label>
              <Input
                type='number'
                min={0}
                className={'mt-1 ' + INPUT_FONT}
                value={config.cooldown || 0}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    cooldown: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        );

      case 'option-text':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Option Name</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.name || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { name: e.target.value })
                }
                placeholder='e.g., message'
              />

            </div>
            <div>
              <Label className='text-white font-medium'>Description</Label>
              <Textarea
                className={'mt-1 ' + INPUT_FONT}
                value={config.description || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    description: e.target.value,
                  })
                }
                placeholder='What is this option for?'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Default Value</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.value || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { value: e.target.value })
                }
                placeholder='Default text value'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.required !== false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { required: checked })
                }
              />
              <Label className='text-white'>Required</Label>
            </div>
          </div>
        );

      case 'option-user':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Option Name</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.name || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { name: e.target.value })
                }
                placeholder='e.g., user'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Description</Label>
              <Textarea
                className={'mt-1 ' + INPUT_FONT}
                value={config.description || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    description: e.target.value,
                  })
                }
                placeholder='What is this option for?'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Default User ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.value || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { value: e.target.value })
                }
                placeholder='Default user ID (optional)'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.required !== false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { required: checked })
                }
              />
              <Label className='text-white'>Required</Label>
            </div>
          </div>
        );

      case 'option-role':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Option Name</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.name || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { name: e.target.value })
                }
                placeholder='e.g., role'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Description</Label>
              <Textarea
                className={'mt-1 ' + INPUT_FONT}
                value={config.description || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    description: e.target.value,
                  })
                }
                placeholder='What is this option for?'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Default Role</Label>
              <div className='flex gap-2'>
                <Button
                  onClick={fetchRoles}
                  size='sm'
                  variant='outline'
                  disabled={rolesLoading}
                  className='flex-shrink-0'
                >
                  {rolesLoading ? 'Loading...' : 'Load Roles'}
                </Button>
                <Select
                  value={config.value || ''}
                  onValueChange={value =>
                    updateNodeConfig(selectedNode.id, { value })
                  }
                >
                  <SelectTrigger className={'flex-1 ' + INPUT_FONT}>
                    <SelectValue placeholder='Select a default role...' />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className='flex items-center gap-2'>
                          <div
                            className='w-3 h-3 rounded-full'
                            style={{ backgroundColor: `#${role.color.toString(16).padStart(6, '0')}` }}
                          />
                          <span>{role.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.required !== false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { required: checked })
                }
              />
              <Label className='text-white'>Required</Label>
            </div>
          </div>
        );

      case 'option-channel':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Option Name</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.name || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { name: e.target.value })
                }
                placeholder='e.g., channel'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Description</Label>
              <Textarea
                className={'mt-1 ' + INPUT_FONT}
                value={config.description || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    description: e.target.value,
                  })
                }
                placeholder='What is this option for?'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Default Channel</Label>
              <div className='flex gap-2'>
                <Button
                  onClick={fetchChannels}
                  size='sm'
                  variant='outline'
                  disabled={channelsLoading}
                  className='flex-shrink-0'
                >
                  {channelsLoading ? 'Loading...' : 'Load Channels'}
                </Button>
                <Select
                  value={config.value || ''}
                  onValueChange={value =>
                    updateNodeConfig(selectedNode.id, { value })
                  }
                >
                  <SelectTrigger className={'flex-1 ' + INPUT_FONT}>
                    <SelectValue placeholder='Select a default channel...' />
                  </SelectTrigger>
                  <SelectContent>
                    {channels.map(channel => (
                      <SelectItem key={channel.id} value={channel.id}>
                        <div className='flex items-center gap-2'>
                          <span>#{channel.name}</span>
                          <span className='text-xs text-gray-400'>
                            ({channel.type === 0 ? 'Text' : channel.type === 2 ? 'Voice' : 'Other'})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.required !== false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { required: checked })
                }
              />
              <Label className='text-white'>Required</Label>
            </div>
          </div>
        );

      case 'option-boolean':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Option Name</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.name || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { name: e.target.value })
                }
                placeholder='e.g., enabled'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Description</Label>
              <Textarea
                className={'mt-1 ' + INPUT_FONT}
                value={config.description || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    description: e.target.value,
                  })
                }
                placeholder='What is this option for?'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Default Value</Label>
              <div className='flex items-center space-x-2'>
                <Switch
                  checked={config.value || "false"}
                  onCheckedChange={checked =>
                    updateNodeConfig(selectedNode.id, { value: checked ? "true" : "false" })
                  }
                />
                <Label className='text-white'>
                  {config.value ? 'True' : 'False'}
                </Label>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.required !== false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { required: checked })
                }
              />
              <Label className='text-white'>Required</Label>
            </div>
          </div>
        );

      case 'send-message':
      case 'edit-message':
        return (
          <Tabs defaultValue='content' className='space-y-1'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='content'>Content</TabsTrigger>
              <TabsTrigger value='embeds'>Embeds</TabsTrigger>
              <TabsTrigger value='settings'>Settings</TabsTrigger>
            </TabsList>

            <TabsContent value='content' className='space-y-4'>
              <div>
                {selectedNode.data.type == 'edit-message' ? (
                  <>
                    <Label className='text-white font-medium'>
                      Message Block to Edit
                    </Label>
                    <Select
                      value={config.message_ref_block || ''}
                      onValueChange={value => {
                        updateNodeConfig(selectedNode.id, {
                          message_ref_block: value,
                        });
                        highlightNodeById(value);
                      }}
                    >
                      <SelectTrigger className={'mt-1 mb-2 ' + INPUT_FONT}>
                        <SelectValue placeholder='Select a message block...' />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes
                          .filter(
                            n =>
                              n.type === 'send-message' &&
                              n.id !== selectedNode.id
                          )
                          .map(n => (
                            <SelectItem key={n.id} value={n.id}>
                              <div className='flex flex-col'>
                                <span className='font-medium text-white'>
                                  {n.data.config?.name ||
                                    n.data.label ||
                                    'Unnamed Block'}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <></>
                )}

                <Label className='text-white font-medium'>
                  Message Content
                </Label>
                <Textarea
                  className='mt-1 min-h-[100px]'
                  value={config.content || ''}
                  onChange={e =>
                    updateNodeConfig(selectedNode.id, {
                      content: e.target.value,
                    })
                  }
                  placeholder='Enter your message content here...'
                  maxLength={2000}
                />
                <div className='text-xs text-gray-400 mt-1'>
                  {(config.content || '').length}/2000 characters
                </div>
              </div>
              <div>
                <Label className='text-white font-medium'>
                  Channel (Optional)
                </Label>
                <Input
                  className={'mt-1 ' + INPUT_FONT}
                  value={config.channelId || ''}
                  onChange={e =>
                    updateNodeConfig(selectedNode.id, {
                      channelId: e.target.value,
                    })
                  }
                  placeholder='Channel ID (leave empty for current channel)'
                />
                <Label className='text-white font-medium pt-3'>
                  Save Message ID As (Optional)
                </Label>
                <Input
                  className={'mt-1 ' + INPUT_FONT}
                  value={config.storeIdAs || ''}
                  onChange={e =>
                    updateNodeConfig(selectedNode.id, {
                      storeIdAs: e.target.value,
                    })
                  }
                  placeholder='e.g., first-message'
                />
              </div>
            </TabsContent>

            <TabsContent value='embeds' className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Label className='text-white font-medium'>Embeds</Label>
                <Button
                  onClick={addEmbed}
                  size='sm'
                  disabled={(config.embeds?.length || 0) >= 10}
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Add Embed
                </Button>
              </div>
              <div className='space-y-2'>
                {config.embeds?.map((embed: any, index: number) => (
                  <Card key={index} className='p-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        Embed {index + 1}
                      </span>
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => openEmbedBuilder(index)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => removeEmbed(index)}
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                    {embed.title && (
                      <div className='text-xs text-gray-400 mt-1'>
                        Title: {embed.title}
                      </div>
                    )}
                  </Card>
                )) || (
                    <div className='text-center py-4 text-gray-400'>
                      No embeds added yet. Click "Add Embed" to get started.
                    </div>
                  )}
              </div>
            </TabsContent>

            <TabsContent value='settings' className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <Switch
                  checked={config.ephemeral || false}
                  onCheckedChange={checked =>
                    updateNodeConfig(selectedNode.id, { ephemeral: checked })
                  }
                />
                <Label className='text-white'>
                  Ephemeral (Only visible to user)
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Switch
                  checked={config.tts || false}
                  onCheckedChange={checked =>
                    updateNodeConfig(selectedNode.id, { tts: checked })
                  }
                />
                <Label className='text-white'>Text-to-Speech</Label>
              </div>
            </TabsContent>
          </Tabs>
        );

      case 'condition':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Condition Type</Label>
              <Select
                value={config.conditionType || ''}
                onValueChange={value =>
                  updateNodeConfig(selectedNode.id, { conditionType: value })
                }
              >
                <SelectTrigger className={'mt-1 ' + INPUT_FONT}>
                  <SelectValue placeholder='Select condition type...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='user-has-role'>User has role</SelectItem>
                  <SelectItem value='user-has-permission'>
                    User has permission
                  </SelectItem>
                  <SelectItem value='channel-type'>Channel type</SelectItem>
                  <SelectItem value='message-contains'>
                    Message contains
                  </SelectItem>
                  <SelectItem value='user-is-bot'>User is bot</SelectItem>
                  <SelectItem value='custom'>Custom condition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {config.conditionType === 'user-has-role' && (
              <div>
                <Label className='text-white font-medium'>Role ID</Label>
                <Input
                  className={'mt-1 ' + INPUT_FONT}
                  value={config.roleId || ''}
                  onChange={e =>
                    updateNodeConfig(selectedNode.id, {
                      roleId: e.target.value,
                    })
                  }
                  placeholder='123456789012345678'
                />
              </div>
            )}
            {config.conditionType === 'custom' && (
              <div>
                <Label className='text-white font-medium'>
                  Custom Condition
                </Label>
                <Textarea
                  className={'mt-1 ' + INPUT_FONT}
                  value={config.condition || ''}
                  onChange={e =>
                    updateNodeConfig(selectedNode.id, {
                      condition: e.target.value,
                    })
                  }
                  placeholder='Enter JavaScript condition...'
                />
              </div>
            )}
          </div>
        );

      case 'add-role':
      case 'remove-role':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Role ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.roleId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { roleId: e.target.value })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Target User</Label>
              <Select
                value={config.userId || 'command-user'}
                onValueChange={value =>
                  updateNodeConfig(selectedNode.id, { userId: value })
                }
              >
                <SelectTrigger className={'mt-1 ' + INPUT_FONT}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='command-user'>Command User</SelectItem>
                  <SelectItem value='mentioned-user'>Mentioned User</SelectItem>
                  <SelectItem value='custom-user'>Custom User ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {config.userId === 'custom-user' && (
              <div>
                <Label className='text-white font-medium'>User ID</Label>
                <Input
                  className={'mt-1 ' + INPUT_FONT}
                  value={config.customUserId || ''}
                  onChange={e =>
                    updateNodeConfig(selectedNode.id, {
                      customUserId: e.target.value,
                    })
                  }
                  placeholder='123456789012345678'
                />
              </div>
            )}
            <div>
              <Label className='text-white font-medium'>Reason</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.reason || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { reason: e.target.value })
                }
                placeholder='Optional reason for audit log'
              />
            </div>
          </div>
        );
      case 'kick-member':
      case 'ban-member':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>User ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.userId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { userId: e.target.value })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Reason</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.reason || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { reason: e.target.value })
                }
                placeholder='Optional reason for audit log'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                Delete Message Days
              </Label>
              <Input
                type='number'
                min={0}
                max={7}
                className={'mt-1 ' + INPUT_FONT}
                value={config.deleteMessageDays || 0}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    deleteMessageDays: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        );
      case 'timeout-member':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>User ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.userId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { userId: e.target.value })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                Duration (seconds)
              </Label>
              <Input
                type='number'
                min={0}
                className={'mt-1 ' + INPUT_FONT}
                value={config.duration || 0}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    duration: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Reason</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.reason || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { reason: e.target.value })
                }
                placeholder='Optional reason for audit log'
              />
            </div>
          </div>
        );
      case 'set-nickname':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>User ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.userId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { userId: e.target.value })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Nickname</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.nickname || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    nickname: e.target.value,
                  })
                }
                placeholder='New nickname'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Reason</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.reason || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { reason: e.target.value })
                }
                placeholder='Optional reason for audit log'
              />
            </div>
          </div>
        );
      case 'create-channel':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Channel Name</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.name || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { name: e.target.value })
                }
                placeholder='e.g., general'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Channel Type</Label>
              <Select
                value={config.type || 0}
                onValueChange={value =>
                  updateNodeConfig(selectedNode.id, { type: Number(value) })
                }
              >
                <SelectTrigger className={'mt-1 ' + INPUT_FONT}>
                  <SelectValue placeholder='Select channel type...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"0"}>Text</SelectItem>
                  <SelectItem value={"2"}>Voice</SelectItem>
                  <SelectItem value={"4"}>Category</SelectItem>
                  <SelectItem value={"5"}>News</SelectItem>
                  <SelectItem value={"13"}>Stage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className='text-white font-medium'>
                Category ID (Optional)
              </Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.categoryId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    categoryId: e.target.value,
                  })
                }
                placeholder='Category ID'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Topic (Optional)</Label>
              <Textarea
                className={'mt-1 ' + INPUT_FONT}
                value={config.topic || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { topic: e.target.value })
                }
                placeholder='Channel topic'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.nsfw || false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { nsfw: checked })
                }
              />
              <Label className='text-white'>NSFW</Label>
            </div>
          </div>
        );
      case 'delete-channel':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Channel ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.channelId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    channelId: e.target.value,
                  })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Reason</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.reason || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { reason: e.target.value })
                }
                placeholder='Optional reason for audit log'
              />
            </div>
          </div>
        );
      case 'modify-channel':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Channel ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.channelId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    channelId: e.target.value,
                  })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                New Name (Optional)
              </Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.name || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { name: e.target.value })
                }
                placeholder='New channel name'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                New Topic (Optional)
              </Label>
              <Textarea
                className={'mt-1 ' + INPUT_FONT}
                value={config.topic || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { topic: e.target.value })
                }
                placeholder='New channel topic'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.nsfw || false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { nsfw: checked })
                }
              />
              <Label className='text-white'>NSFW</Label>
            </div>
          </div>
        );
      case 'send-dm':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>User ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.userId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { userId: e.target.value })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Message Content</Label>
              <Textarea
                className='mt-1 min-h-[100px]'
                value={config.content || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { content: e.target.value })
                }
                placeholder='Enter your message content here...'
                maxLength={2000}
              />
              <div className='text-xs text-gray-400 mt-1'>
                {(config.content || '').length}/2000 characters
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <Label className='text-white font-medium'>Embeds</Label>
              <Button
                onClick={addEmbed}
                size='sm'
                disabled={(config.embeds?.length || 0) >= 10}
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Embed
              </Button>
            </div>
            <div className='space-y-2'>
              {config.embeds?.map((embed: any, index: number) => (
                <Card key={index} className='p-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      Embed {index + 1}
                    </span>
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => openEmbedBuilder(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => removeEmbed(index)}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                  {embed.title && (
                    <div className='text-xs text-gray-400 mt-1'>
                      Title: {embed.title}
                    </div>
                  )}
                </Card>
              )) || (
                  <div className='text-center py-4 text-gray-400'>
                    No embeds added yet. Click "Add Embed" to get started.
                  </div>
                )}
            </div>
          </div>
        );
      case 'create-webhook':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Channel ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.channelId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    channelId: e.target.value,
                  })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Webhook Name</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.name || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { name: e.target.value })
                }
                placeholder='e.g., My Webhook'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                Avatar URL (Optional)
              </Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.avatar || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { avatar: e.target.value })
                }
                placeholder='https://example.com/avatar.png'
              />
            </div>
          </div>
        );
      case 'delete-webhook':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Webhook ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.webhookId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    webhookId: e.target.value,
                  })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Reason</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.reason || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { reason: e.target.value })
                }
                placeholder='Optional reason for audit log'
              />
            </div>
          </div>
        );
      case 'move-member':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>User ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.userId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { userId: e.target.value })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Channel ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.channelId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    channelId: e.target.value,
                  })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Reason</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.reason || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { reason: e.target.value })
                }
                placeholder='Optional reason for audit log'
              />
            </div>
          </div>
        );
      case 'mute-member':
      case 'deafen-member':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>User ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.userId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { userId: e.target.value })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.mute || config.deafen || false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, {
                    mute:
                      selectedNode.data.type === 'mute-member'
                        ? checked
                        : undefined,
                    deafen:
                      selectedNode.data.type === 'deafen-member'
                        ? checked
                        : undefined,
                  })
                }
              />
              <Label className='text-white'>
                {selectedNode.data.type === 'mute-member' ? 'Mute' : 'Deafen'}
              </Label>
            </div>
            <div>
              <Label className='text-white font-medium'>Reason</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.reason || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { reason: e.target.value })
                }
                placeholder='Optional reason for audit log'
              />
            </div>
          </div>
        );
      case 'fetch-user':
      case 'fetch-member':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>User ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.userId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { userId: e.target.value })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Store Result As</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.storeIdAs || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    storeIdAs: e.target.value,
                  })
                }
                placeholder='e.g., fetched-user'
              />
            </div>
          </div>
        );
      case 'fetch-channel':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Channel ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.channelId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    channelId: e.target.value,
                  })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Store Result As</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.storeIdAs || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    storeIdAs: e.target.value,
                  })
                }
                placeholder='e.g., fetched-channel'
              />
            </div>
          </div>
        );
      case 'fetch-role':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Role ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.roleId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { roleId: e.target.value })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Store Result As</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.storeIdAs || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    storeIdAs: e.target.value,
                  })
                }
                placeholder='e.g., fetched-role'
              />
            </div>
          </div>
        );
      case 'create-invite':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Channel ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.channelId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    channelId: e.target.value,
                  })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                Max Uses (0 for unlimited)
              </Label>
              <Input
                type='number'
                min={0}
                className={'mt-1 ' + INPUT_FONT}
                value={config.maxUses || 0}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    maxUses: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                Max Age (seconds, 0 for never)
              </Label>
              <Input
                type='number'
                min={0}
                className={'mt-1 ' + INPUT_FONT}
                value={config.maxAge || 0}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    maxAge: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.temporary || false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { temporary: checked })
                }
              />
              <Label className='text-white'>Temporary Membership</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.unique || false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { unique: checked })
                }
              />
              <Label className='text-white'>Unique Invite</Label>
            </div>
          </div>
        );
      case 'delete-invite':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Invite Code</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.inviteCode || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    inviteCode: e.target.value,
                  })
                }
                placeholder='e.g., abcdef'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Reason</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.reason || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { reason: e.target.value })
                }
                placeholder='Optional reason for audit log'
              />
            </div>
          </div>
        );
      case 'add-reaction':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Message ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.messageId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    messageId: e.target.value,
                  })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Emoji</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.emoji || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { emoji: e.target.value })
                }
                placeholder='e.g., 👍 or :custom_emoji:'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                Channel ID (Optional)
              </Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.channelId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    channelId: e.target.value,
                  })
                }
                placeholder='Channel ID (leave empty for current channel)'
              />
            </div>
          </div>
        );
      case 'remove-reaction':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Message ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.messageId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    messageId: e.target.value,
                  })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Emoji (Optional)</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.emoji || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { emoji: e.target.value })
                }
                placeholder='e.g., 👍 or :custom_emoji: (leave empty to remove all)'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                User ID (Optional)
              </Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.userId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { userId: e.target.value })
                }
                placeholder='User ID (leave empty for bot user)'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                Channel ID (Optional)
              </Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.channelId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    channelId: e.target.value,
                  })
                }
                placeholder='Channel ID (leave empty for current channel)'
              />
            </div>
          </div>
        );
      case 'pin-message':
      case 'unpin-message':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Message ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.messageId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    messageId: e.target.value,
                  })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                Channel ID (Optional)
              </Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.channelId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    channelId: e.target.value,
                  })
                }
                placeholder='Channel ID (leave empty for current channel)'
              />
            </div>
          </div>
        );
      case 'delete-message':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Message ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.messageId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    messageId: e.target.value,
                  })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                Channel ID (Optional)
              </Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.channelId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    channelId: e.target.value,
                  })
                }
                placeholder='Channel ID (leave empty for current channel)'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Reason</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.reason || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { reason: e.target.value })
                }
                placeholder='Optional reason for audit log'
              />
            </div>
          </div>
        );
      case 'bulk-delete':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Channel ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.channelId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    channelId: e.target.value,
                  })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                Number of Messages (2-100)
              </Label>
              <Input
                type='number'
                min={2}
                max={100}
                className={'mt-1 ' + INPUT_FONT}
                value={config.count || 0}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    count: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Reason</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.reason || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { reason: e.target.value })
                }
                placeholder='Optional reason for audit log'
              />
            </div>
          </div>
        );
      case 'create-role':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Role Name</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.name || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { name: e.target.value })
                }
                placeholder='e.g., New Role'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                Color (Hex or Integer)
              </Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.color || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { color: e.target.value })
                }
                placeholder='e.g., #FF0000 or 16711680'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                Permissions (Bitfield)
              </Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.permissions || '0'}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    permissions: e.target.value,
                  })
                }
                placeholder='e.g., 8 (Administrator)'
              />
              <p className='text-xs text-gray-400 mt-1'>
                Use a Discord permission bitfield.
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.hoist || false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { hoist: checked })
                }
              />
              <Label className='text-white'>
                Display role members separately
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.mentionable || false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { mentionable: checked })
                }
              />
              <Label className='text-white'>
                Allow anyone to @mention this role
              </Label>
            </div>
          </div>
        );
      case 'delete-role':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Role ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.roleId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { roleId: e.target.value })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Reason</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.reason || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { reason: e.target.value })
                }
                placeholder='Optional reason for audit log'
              />
            </div>
          </div>
        );
      case 'modify-role':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Role ID</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.roleId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { roleId: e.target.value })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                New Name (Optional)
              </Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.name || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { name: e.target.value })
                }
                placeholder='New role name'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                New Color (Hex or Integer, Optional)
              </Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.color || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { color: e.target.value })
                }
                placeholder='e.g., #FF0000 or 16711680'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>
                New Permissions (Bitfield, Optional)
              </Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.permissions || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    permissions: e.target.value,
                  })
                }
                placeholder='e.g., 8 (Administrator)'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.hoist || false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { hoist: checked })
                }
              />
              <Label className='text-white'>
                Display role members separately
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.mentionable || false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { mentionable: checked })
                }
              />
              <Label className='text-white'>
                Allow anyone to @mention this role
              </Label>
            </div>
          </div>
        );
      case 'audit-log':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>User ID (Optional)</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.userId || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { userId: e.target.value })
                }
                placeholder='123456789012345678'
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Action Type (Optional)</Label>
              <Input
                type='number'
                min={0}
                className={'mt-1 ' + INPUT_FONT}
                value={config.actionType || 0}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { actionType: Number(e.target.value) })
                }
                placeholder='e.g., 1 (Guild Update)'
              />
              <p className='text-xs text-gray-400 mt-1'>
                Use a Discord audit log action type.
              </p>
            </div>
            <div>
              <Label className='text-white font-medium'>Limit (1-100)</Label>
              <Input
                type='number'
                min={1}
                max={100}
                className={'mt-1 ' + INPUT_FONT}
                value={config.limit || 0}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { limit: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Store Result As</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.storeIdAs || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { storeIdAs: e.target.value })
                }
                placeholder='e.g., audit-logs'
              />
              <p className='text-xs text-gray-400 mt-1'>
                Use {'{variable-name}'} in other blocks to access this stored audit log data.
              </p>
            </div>
          </div>
        );
      case 'random':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Minimum Value</Label>
              <Input
                type='number'
                className={'mt-1 ' + INPUT_FONT}
                value={config.min || 0}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { min: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Maximum Value</Label>
              <Input
                type='number'
                className={'mt-1 ' + INPUT_FONT}
                value={config.max || 0}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { max: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label className='text-white font-medium'>Store Result As</Label>
              <Input
                className={'mt-1 ' + INPUT_FONT}
                value={config.storeIdAs || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { storeIdAs: e.target.value })
                }
                placeholder='e.g., random-number'
              />
              <p className='text-xs text-gray-400 mt-1'>
                Use {'{variable-name}'} in other blocks to access this stored random number.
              </p>
            </div>
          </div>
        );
      case 'unq-variable':
        return (
          <div className='space-y-1'>
            <div>
              <Label className='text-white font-medium'>Variable Name</Label>
              <Input
                type='text'
                className={'mt-1 ' + INPUT_FONT}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    name: e.target.value,
                  })
                }
                value={config.name || ''}
                placeholder='Name of the unique variable'
              />
              <Label className='text-white font-medium pt-3'>
                Variable Value
              </Label>
              <Input
                type='text'
                className={'mt-1 ' + INPUT_FONT}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    value: e.target.value,
                  })
                }
                value={config.value || ''}
                placeholder='Value of the unique variable'
              />
            </div>
            <p className='text-xs text-gray-400 mt-1'>
              You can use use that variable with {'{variable-name}'} in other
              blocks.
            </p>
          </div>
        );
      case 'wait':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Time (ms)</Label>
              <Input
                type='number'
                min='0'
                max='10000'
                className={'mt-1 ' + INPUT_FONT}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    duration: Number.parseInt(e.target.value) || 0,
                  })
                }
                value={config.duration || ''}
                placeholder='Yield time of the thread (max 10s)'
              />
            </div>
          </div>
        );
      default:
        return (
          <div className='text-center py-8 text-gray-400'>
            <Settings className='w-12 h-12 mx-auto mb-4 opacity-50' />
            <p>Configuration for {selectedNode.data.label} coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div
      className='h-screen w-full relative overflow-hidden'
      style={{ backgroundColor: 'rgb(15 23 42)' }}
    >
      <div className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 h-16 bg-[#181A20] border-b border-[#23262F] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#23262F] rounded-md">
            <Settings className="w-6 h-6 text-white" />
          </div>

          <div className="mt-1 flex gap-2">
            <Input
              value={importValue}
              onChange={e => setImportValue(e.target.value)}
              placeholder="Paste share link or command ID..."
              className="w-64 bg-[#23262F] text-white border border-[#353945] h-8 text-sm px-2"
              disabled={importLoading}
            />
            <Button
              size="sm"
              className="bg-discord-blurple text-white font-semibold hover:bg-discord-blurple/80 h-8 px-4"
              onClick={handleImport}
              disabled={importLoading || !importValue.trim()}
            >
              {importLoading ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="text-slate-400 font-medium flex items-center gap-1">
            <a className="hover:underline cursor-pointer" href={`/dashboard/${serverId}`} >Dashboard</a>
            <span className="mx-1">/</span>
            <span className="text-white font-semibold">Command Builder</span>
          </div>
          {/* Import Field */}

        </div>
        <div className="flex items-center gap-3">
          <div className="flex space-x-2 mr-2">
            <Button
              onClick={saveCommand}
              size='sm'
              className='discord-button-primary'
              disabled={isLoading}
            >
              <Save className='w-4 h-4 mr-2' />
              {isLoading
                ? 'Saving...'
                : commandId
                  ? 'Update Command'
                  : 'Save Command'}
            </Button>
            <UserButton />
          </div>
          <Popover open={sharePopoverOpen} onOpenChange={setSharePopoverOpen}>
            <PopoverTrigger asChild>
              <Button size="sm" className="bg-white text-black font-semibold hover:bg-gray-200" onClick={handleShareClick} style={{ borderRadius: 'var(--radius)', background: 'var(--color-popover)', color: 'var(--color-popover-foreground)', border: '1px solid var(--color-border)' }}>
                Share <Share className="w-4 h-4 ml-1" />
              </Button>
            </PopoverTrigger>
            {shareCode && (
              <PopoverContent style={{ background: 'var(--color-discord-darker)', color: 'var(--color-popover-foreground)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', minWidth: 320 }}>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1">
                    <span className='text-sm font-medium text-gray-400'>Last Updated</span>
                    <span className='text-sm text-gray-300'>
                      {existingCommand?.lastUpdateTime
                        ? new Date(existingCommand.lastUpdateTime).toLocaleString()
                        : new Date().toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <span className='text-sm font-medium text-gray-400'>Share Code</span>
                    <div className="flex items-center justify-between p-2 rounded bg-[var(--color-discord-dark)]">
                      <span className="font-mono text-sm truncate text-[var(--color-primary)]">{shareCode}</span>
                      <Button variant="ghost" size="icon" onClick={handleCopyShareCode} className="text-[var(--color-discord-blurple)] hover:text-[var(--color-discord-blurple)] hover:bg-[var(--color-discord-darker)]">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="w-full bg-[var(--color-discord-red)] hover:bg-[var(--color-discord-red)/90] mt-2"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Share Code
                  </Button>
                </div>
              </PopoverContent>
            )}
          </Popover>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent style={{ background: 'var(--color-discord-darker)', color: 'var(--color-card-foreground)', borderRadius: 'var(--radius)' }}>
              <DialogHeader>
                <DialogTitle>Delete Share Code?</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this share code? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} style={{ borderRadius: 'var(--radius-sm)' }}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteShareCode} disabled={isDeleting} style={{ background: 'var(--color-discord-red)', borderRadius: 'var(--radius-sm)' }}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ReactFlowProvider>
        <div className='flex h-full'>
          {showPalette && (
            <div
              className='w-80 flex flex-col shadow-2xl'
              style={{
                backgroundColor: 'rgb(30 41 59)',
                borderRightColor: 'rgb(51 65 85)',
                borderRightWidth: '1px',
              }}
            >
              <div
                className='p-4'
                style={{
                  borderBottomColor: 'rgb(51 65 85)',
                  borderBottomWidth: '1px',
                }}
              >
                <div className='flex items-center justify-between'>
                  <h2 className='text-white font-bold'>Block Palette</h2>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowPalette(false)}
                    className='text-slate-400 hover:text-white'
                  >
                    <X className='w-4 h-4' />
                  </Button>
                </div>
              </div>

              <div className='flex-1 overflow-hidden'>
                <Tabs
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  className='h-full flex flex-col'
                >
                  <div className='p-4'>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger
                        style={{
                          backgroundColor: 'rgb(51 65 85)',
                          borderColor: 'rgb(71 85 105)',
                          color: 'white',
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOCK_CATEGORIES.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className='flex items-center gap-2'>
                              <category.icon className='w-4 h-4' />
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <ScrollArea className='flex-1 px-4'>
                    {BLOCK_CATEGORIES.map(category => (
                      <TabsContent
                        key={category.id}
                        value={category.id}
                        className='space-y-2 mt-0'
                      >
                        <div className='mb-3'>
                          <h3 className='text-white font-medium flex items-center gap-2'>
                            <category.icon className='w-4 h-4' />
                            {category.label}
                          </h3>
                          <p className='text-slate-400 text-xs'>
                            {category.description}
                          </p>
                        </div>
                        {BLOCK_TYPES.filter(
                          block => block.category === category.id
                        ).map(block => (
                          <Button
                            key={block.type}
                            className='w-full justify-start h-auto p-3 transition-all duration-200 hover:shadow-lg bg-transparent'
                            style={{
                              backgroundColor: 'rgb(51 65 85)',
                              borderColor: 'rgb(71 85 105)',
                              color: 'white',
                            }}
                            variant='outline'
                            onClick={() => addNode(block.type)}
                          >
                            <div className='flex items-start gap-3'>
                              <block.icon className='w-4 h-4 mt-0.5 flex-shrink-0' />
                              <div className='text-left'>
                                <div className='font-medium text-white text-sm'>
                                  {block.label}
                                </div>
                                <div className='text-slate-400 text-xs'>
                                  {block.description}
                                </div>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </TabsContent>
                    ))}
                  </ScrollArea>
                </Tabs>
              </div>
            </div>
          )}

          <div className='flex-1 relative'>
            <ReactFlow
              nodes={memoizedNodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodesDelete={onNodesDelete}
              onNodeClick={onNodeClick}
              onInit={instance => {
                setRfInstance(instance);
              }}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              style={{ backgroundColor: 'rgb(15 23 42)' }}
              defaultEdgeOptions={{
                style: {
                  stroke: 'var(--color-discord-blurple)',
                  strokeWidth: 2,
                },
                type: 'smoothstep',
              }}
              minZoom={0.1}
              maxZoom={2}
            >
              <Background
                color='#475569'
                gap={20}
                size={3}
                className='opacity-30'
              />
              <Controls
                style={{
                  backgroundColor: 'rgb(30 41 59)',
                  borderColor: 'rgb(51 65 85)',
                }}
              />
            </ReactFlow>
          </div>

          {/* Enhanced Property Panel */}
          {selectedNode && (
            <div
              className='w-96 flex flex-col shadow-2xl'
              style={{
                backgroundColor: 'rgb(30 41 59)',
                borderLeftColor: 'rgb(51 65 85)',
                borderLeftWidth: '1px',
              }}
            >
              <div
                className='p-4'
                style={{
                  borderBottomColor: 'rgb(51 65 85)',
                  borderBottomWidth: '1px',
                }}
              >
                <div className='flex items-center justify-between'>
                  <h2 className='text-white font-bold text-lg'>
                    Configure Block
                  </h2>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setSelectedNode(null)}
                    className='text-slate-400 hover:text-white'
                  >
                    <X className='w-4 h-4' />
                  </Button>
                </div>
              </div>

              <ScrollArea className='flex-1 p-4'>
                <Card
                  className='shadow-lg'
                  style={{
                    backgroundColor: 'rgb(51 65 85)',
                    borderColor: 'rgb(71 85 105)',
                  }}
                >
                  <CardHeader>
                    <CardTitle className='text-white flex items-center gap-2'>
                      {selectedNode.data.type === 'send-message' && (
                        <MessageSquare className='w-5 h-5' />
                      )}
                      {selectedNode.data.type === 'condition' && (
                        <GitBranch className='w-5 h-5' />
                      )}
                      {selectedNode.data.type === 'add-role' && (
                        <Crown className='w-5 h-5' />
                      )}
                      {selectedNode.data.type === 'remove-role' && (
                        <Crown className='w-5 h-5' />
                      )}
                      {selectedNode.data.type === 'root' && (
                        <Settings className='w-5 h-5' />
                      )}
                      {selectedNode.data.type === 'error' && (
                        <X className='w-5 h-5' />
                      )}
                      {selectedNode.data.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{renderNodeConfiguration()}</CardContent>
                </Card>

                {/*    */}
                <Card
                  className='mt-4 shadow-lg'
                  style={{
                    backgroundColor: 'rgb(51 65 85)',
                    borderColor: 'rgb(71 85 105)',
                  }}
                >
                  <CardHeader>
                    <CardTitle className='text-white text-sm'>
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full transition-all duration-200 bg-transparent'
                      style={{
                        backgroundColor: 'rgb(71 85 105)',
                        borderColor: 'rgb(100 116 139)',
                        color: 'white',
                      }}
                      onClick={() => {
                        const duplicatedNode = {
                          ...selectedNode,
                          id: generateID(selectedNode.type as string),
                          position: {
                            x: selectedNode.position.x + 50,
                            y: selectedNode.position.y + 50,
                          },
                        };
                        setNodes(nds => [...nds, duplicatedNode]);
                      }}
                    >
                      Duplicate Block
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full transition-all duration-200 bg-transparent'
                      style={{
                        backgroundColor: 'rgb(153 27 27)',
                        borderColor: 'rgb(220 38 38)',
                        color: 'white',
                      }}
                      onClick={() => {
                        deleteSelectedNode();
                      }}
                    >
                      Delete Block
                    </Button>
                    {selectedNode.data.type === 'send-message' && (
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full transition-all duration-200 bg-transparent'
                        style={{
                          backgroundColor: 'rgb(71 85 105)',
                          borderColor: 'rgb(100 116 139)',
                          color: 'white',
                        }}
                        onClick={() => openEmbedBuilder()}
                      >
                        <ImageIcon className='w-4 h-4 mr-2' />
                        Open Embed Builder
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card
                  className='mt-4 shadow-lg'
                  style={{
                    backgroundColor: 'rgb(51 65 85)',
                    borderColor: 'rgb(71 85 105)',
                  }}
                >
                  <CardHeader>
                    <CardTitle className='text-white text-sm'>
                      Connections
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div>
                      <h4 className='text-xs font-bold uppercase text-slate-400 mb-2'>
                        Incoming
                      </h4>
                      {edges.filter(e => e.target === selectedNode.id)
                        .length === 0 ? (
                        <p className='text-slate-400 text-xs'>
                          No incoming connections.
                        </p>
                      ) : (
                        <div className='space-y-2'>
                          {edges
                            .filter(e => e.target === selectedNode.id)
                            .map(edge => (
                              <div
                                key={edge.id}
                                className='flex items-center justify-between bg-slate-800/50 p-2 rounded-md transition-all duration-200 hover:bg-slate-700/50'
                                onMouseEnter={() =>
                                  setHoveredNodeId(edge.source)
                                }
                                onMouseLeave={() => setHoveredNodeId(null)}
                              >
                                <span className='text-sm text-white truncate'>
                                  From: {getConnectedNodeLabel(edge.source)}
                                </span>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => removeEdge(edge.id)}
                                  className='p-1 h-auto'
                                >
                                  <X className='w-3 h-3 text-slate-400 hover:text-white' />
                                </Button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className='text-xs font-bold uppercase text-slate-400 mb-2'>
                        Outgoing
                      </h4>
                      {edges.filter(e => e.source === selectedNode.id)
                        .length === 0 ? (
                        <p className='text-slate-400 text-xs'>
                          No outgoing connections.
                        </p>
                      ) : (
                        <div className='space-y-2'>
                          {edges
                            .filter(e => e.source === selectedNode.id)
                            .map(edge => (
                              <div
                                key={edge.id}
                                className='flex items-center justify-between bg-slate-800/50 p-2 rounded-md transition-all duration-200 hover:bg-slate-700/50'
                                onMouseEnter={() =>
                                  setHoveredNodeId(edge.target)
                                }
                                onMouseLeave={() => setHoveredNodeId(null)}
                              >
                                <span className='text-sm text-white truncate'>
                                  To: {getConnectedNodeLabel(edge.target)}
                                </span>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => removeEdge(edge.id)}
                                  className='p-1 h-auto'
                                >
                                  <X className='w-3 h-3 text-slate-400 hover:text-white' />
                                </Button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className='mt-4 shadow-lg'
                  style={{
                    backgroundColor: 'rgb(51 65 85)',
                    borderColor: 'rgb(71 85 105)',
                    gap: '1px',
                  }}
                >
                  <CardHeader>
                    <CardTitle className='text-white text-sm '>
                      Block Name
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      className={INPUT_FONT}
                      value={selectedNode.data.config.name || ''}
                      onChange={e =>
                        updateNodeConfig(selectedNode.id, {
                          name: e.target.value,
                        })
                      }
                      placeholder={`e.g., Welcome Message`}
                    />
                    <p className='text-xs text-slate-400 mt-1'>
                      Optional label to easily reference this block.
                    </p>
                  </CardContent>
                </Card>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Embed Builder Modal */}
        <EmbedBuilder
          open={embedBuilderOpen}
          onClose={() => setEmbedBuilderOpen(false)}
          onSave={saveEmbed}
          initialEmbed={selectedNode?.data.config.embeds?.[currentEmbedIndex]}
        />
      </ReactFlowProvider>
    </div>
  );
}

export default CommandFlowBuilder;
