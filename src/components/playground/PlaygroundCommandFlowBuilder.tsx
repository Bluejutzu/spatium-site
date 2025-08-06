'use client';

import 'reactflow/dist/style.css';

import { SignInButton, useUser } from '@clerk/nextjs';
import {
  ArrowLeft,
  Ban,
  Clock,
  Crown,
  Database,
  GitBranch,
  Hash,
  Link as IconLink,
  MessageSquare,
  Save,
  Settings,
  Sparkles,
  ToggleRight,
  Users,
  UserX,
  Volume2,
  Webhook,
  X,
  Zap,
} from 'lucide-react';
import { Roboto } from 'next/font/google';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
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

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BlockType } from '@/types/common';

const roboto = Roboto({
  subsets: ['latin'],
});

const ROOT_NODE_ID = 'root';
const INPUT_FONT = roboto.className;

const RootNode = ({ data, selected }: NodeProps) => {
  return (
    <div
      className={`shadow-lg rounded-lg min-w-[100px] text-white font-bold relative overflow-hidden border border-slate-700 ${
        selected
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
  return (
    <div
      className={`shadow-lg rounded-lg min-w-[100px] text-white font-bold relative overflow-hidden border border-slate-700 ${
        selected
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
      <div className='h-2 bg-orange-500' />
      <div className='p-4'>
        <div className='flex items-center justify-between relative z-10'>
          <GitBranch className='w-4 h-4' />
          <span>Condition</span>
        </div>
        <div className='text-xs mt-1 opacity-80 relative z-10'>
          {data.config?.condition || 'No condition set'}
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

const MessageNode = ({ data, selected }: NodeProps) => {
  return (
    <div
      className={`shadow-lg rounded-lg min-w-[100px] text-white font-bold relative overflow-hidden border border-slate-700 ${
        selected
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
      <div className='h-2 bg-blue-500' />
      <div className='p-4'>
        <div className='flex items-center justify-between relative z-10'>
          <MessageSquare className='w-4 h-4' />
          <span>Send Message</span>
        </div>
        <div className='text-xs mt-1 opacity-80 relative z-10'>
          {data.config?.content || 'No message content'}
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

// Create command option node factory
const createCommandOptionNode = (Icon: any, label: string) => {
  return ({ data, selected }: NodeProps) => (
    <div
      className={`shadow-lg rounded-lg min-w-[100px] text-white font-bold relative overflow-hidden border border-slate-700 ${
        selected
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
      <div className='h-2 bg-green-500' />
      <div className='p-4'>
        <div className='flex items-center justify-between relative z-10'>
          <Icon className='w-4 h-4' />
          <span>{label}</span>
        </div>
        <div className='text-xs mt-1 opacity-80 relative z-10'>
          {data.config?.name || 'Unnamed option'}
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

// Create Discord action node factory
const createDiscordNode = (Icon: any, category: string, label: string) => {
  return ({ data, selected }: NodeProps) => (
    <div
      className={`shadow-lg rounded-lg min-w-[100px] text-white font-bold relative overflow-hidden border border-slate-700 ${
        selected
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
      <div className='h-2 bg-red-500' />
      <div className='p-4'>
        <div className='flex items-center justify-between relative z-10'>
          <Icon className='w-4 h-4' />
          <span>{label}</span>
        </div>
        <div className='text-xs mt-1 opacity-80 relative z-10'>{category}</div>
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

const nodeTypes = {
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
  'fetch-channel': createDiscordNode(Hash, 'channels', 'Fetch Channel'),
  'fetch-role': createDiscordNode(Crown, 'roles', 'Fetch Role'),
  'create-invite': createDiscordNode(IconLink, 'channels', 'Create Invite'),
  'delete-invite': createDiscordNode(IconLink, 'channels', 'Delete Invite'),
  'add-reaction': createDiscordNode(Zap, 'messaging', 'Add Reaction'),
  'remove-reaction': createDiscordNode(Zap, 'messaging', 'Remove Reaction'),
  'pin-message': createDiscordNode(MessageSquare, 'messaging', 'Pin Message'),
  'unpin-message': createDiscordNode(
    MessageSquare,
    'messaging',
    'Unpin Message'
  ),
  'delete-message': createDiscordNode(
    MessageSquare,
    'messaging',
    'Delete Message'
  ),
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

// Block categories and types (simplified)

const BLOCK_TYPES: BlockType[] = [
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
];

export function PlaygroundCommandFlowBuilder() {
  const { user } = useUser();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showPalette, setShowPalette] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('options');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const toast = useToast();
  const [rfInstance, setRfInstance] = useState<ReturnType<
    typeof useReactFlow
  > | null>(null);

  const memoizedNodes = useMemo(() => {
    return nodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        isHovered: n.id === hoveredNodeId,
      },
    }));
  }, [nodes, hoveredNodeId]);

  const generateID = (s: string) => {
    return `${Date.now()}-${Math.random()}-${s}`;
  };

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
          config: getDefaultConfig(type),
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

  const getDefaultConfig = (type: string) => {
    switch (type) {
      case 'option-text':
        return { name: '', description: '', required: true, value: '' };
      case 'option-user':
        return { name: '', description: '', required: true, value: '' };
      case 'option-boolean':
        return { name: '', description: '', required: true, value: 'false' };
      case 'option-role':
        return { name: '', description: '', required: false, value: '' };
      case 'option-channel':
        return { name: '', description: '', required: false, value: '' };
      case 'send-message':
        return {
          name: 'Send Message',
          content: '',
          embeds: [],
          ephemeral: false,
          tts: false,
          channelId: '',
          components: [],
          storeIdAs: '',
        };
      case 'send-dm':
        return { userId: '', content: '', embeds: [] };
      case 'condition':
        return { condition: '', operator: 'equals', value: '' };
      case 'add-role':
        return { roleId: '', userId: 'command-user', reason: '' };
      case 'remove-role':
        return { roleId: '', userId: 'command-user', reason: '' };
      case 'kick-member':
        return { userId: '', reason: '', deleteMessageDays: 0 };
      case 'ban-member':
        return { userId: '', reason: '', deleteMessageDays: 0 };
      case 'wait':
        return { duration: 0, unit: 'milliseconds' };
      default:
        return {};
    }
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
      const filteredDeleted = deleted.filter(node => node.id !== ROOT_NODE_ID);
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

  const handleSave = () => {
    if (!user) {
      setSaveDialogOpen(true);
      return;
    }
    // In playground, just show a success message
    toast.success(
      'Command Saved!',
      'Your command has been saved successfully (actually it didnt lol).'
    );
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
          </div>
        );

      case 'send-message':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Message Content</Label>
              <Textarea
                className={'mt-1 ' + INPUT_FONT}
                value={config.content || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, { content: e.target.value })
                }
                placeholder='Enter your message here...'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.ephemeral || false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { ephemeral: checked })
                }
              />
              <Label className='text-white'>Ephemeral Message</Label>
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
              <Input
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
            <div className='flex items-center space-x-2'>
              <Switch
                checked={config.required || false}
                onCheckedChange={checked =>
                  updateNodeConfig(selectedNode.id, { required: checked })
                }
              />
              <Label className='text-white'>Required</Label>
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className='space-y-4'>
            <div>
              <Label className='text-white font-medium'>Condition</Label>
              <Textarea
                className={'mt-1 ' + INPUT_FONT}
                value={config.condition || ''}
                onChange={e =>
                  updateNodeConfig(selectedNode.id, {
                    condition: e.target.value,
                  })
                }
                placeholder='Enter your condition...'
              />
            </div>
          </div>
        );

      default:
        return (
          <div className='text-discord-text text-center py-8'>
            <Settings className='w-8 h-8 mx-auto mb-2 opacity-50' />
            <p>Configuration options for this block will appear here.</p>
          </div>
        );
    }
  };

  return (
    <div
      className='h-screen w-full relative overflow-hidden'
      style={{ backgroundColor: 'rgb(15 23 42)' }}
    >
      {/* Fixed Top Bar */}
      <div className='fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 h-16 bg-[#181A20] border-b border-[#23262F] shadow-lg'>
        {/* Left: Back button and title */}
        <div className='flex items-center gap-4'>
          <Link href='/'>
            <Button
              variant='ghost'
              size='sm'
              className='text-slate-400 hover:text-white'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Home
            </Button>
          </Link>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 flex items-center justify-center bg-discord-blurple rounded-md'>
              <Sparkles className='w-5 h-5 text-white' />
            </div>
            <span className='text-white font-bold'>
              Command Builder Playground
            </span>
          </div>
        </div>

        {/* Right: Save button */}
        <div className='flex items-center gap-4'>
          <Badge className='bg-yellow-500/20 text-yellow-400 border-yellow-500/30'>
            Playground Mode
          </Badge>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className='bg-discord-blurple text-white font-semibold hover:bg-discord-blurple/80'
          >
            {isLoading ? 'Saving...' : 'Save Command'}
            <Save className='w-4 h-4 ml-2' />
          </Button>
        </div>
      </div>
      <ReactFlowProvider>
        <div className='flex h-full pt-16'>
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

              <ScrollArea className='flex-1'>
                <div className='p-4'>
                  <Tabs
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <TabsList className='grid w-full grid-cols-2 mb-4'>
                      <TabsTrigger value='options' className='text-xs'>
                        Options
                      </TabsTrigger>
                      <TabsTrigger value='messaging' className='text-xs'>
                        Messages
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value='options' className='space-y-2'>
                      {BLOCK_TYPES.filter(
                        block => block.category === 'options'
                      ).map(block => (
                        <Card
                          key={block.type}
                          className='cursor-pointer hover:bg-discord-dark/50 transition-colors border-discord-border'
                          onClick={() => addNode(block.type)}
                        >
                          <CardContent className='p-3'>
                            <div className='flex items-center gap-3'>
                              <block.icon className='w-5 h-5 text-discord-blurple' />
                              <div>
                                <p className='text-white text-sm font-medium'>
                                  {block.label}
                                </p>
                                <p className='text-discord-text text-xs'>
                                  {block.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value='messaging' className='space-y-2'>
                      {BLOCK_TYPES.filter(
                        block => block.category === 'messaging'
                      ).map(block => (
                        <Card
                          key={block.type}
                          className='cursor-pointer hover:bg-discord-dark/50 transition-colors border-discord-border'
                          onClick={() => addNode(block.type)}
                        >
                          <CardContent className='p-3'>
                            <div className='flex items-center gap-3'>
                              <block.icon className='w-5 h-5 text-discord-blurple' />
                              <div>
                                <p className='text-white text-sm font-medium'>
                                  {block.label}
                                </p>
                                <p className='text-discord-text text-xs'>
                                  {block.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
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

          {/* Property Panel */}
          <div
            className='w-80 flex flex-col shadow-2xl'
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
              <h2 className='text-white font-bold'>Properties</h2>
            </div>

            <ScrollArea className='flex-1'>
              <div className='p-4'>
                {selectedNode ? (
                  renderNodeConfiguration()
                ) : (
                  <div className='text-discord-text text-center py-8'>
                    <Settings className='w-8 h-8 mx-auto mb-2 opacity-50' />
                    <p>Select a block to configure its properties.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </ReactFlowProvider>
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className='bg-discord-darker border-discord-border'>
          <DialogHeader>
            <DialogTitle className='text-white'>
              Sign Up to Save Your Command
            </DialogTitle>
            <DialogDescription className='text-discord-text'>
              Create a free account to save your commands and deploy them to
              your Discord servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <SignInButton mode='modal'>
              <Button className='bg-discord-blurple text-white hover:bg-discord-blurple/80'>
                Sign Up Now
                <Sparkles className='w-4 h-4 ml-2' />
              </Button>
            </SignInButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
