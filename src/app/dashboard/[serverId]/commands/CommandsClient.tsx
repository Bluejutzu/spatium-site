'use client';

import { useMutation, useQuery } from 'convex/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Clock,
  Command,
  Crown,
  Database,
  Edit3,
  GitBranch,
  Hash,
  Loader2,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  Volume2,
  Webhook,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { isPromise } from '@/lib/utils';

import { api } from '../../../../../convex/_generated/api';

// Helper function to get command icon based on blocks
const getCommandIcon = (blocks: string) => {
  try {
    const parsed = JSON.parse(blocks);
    const nodes = parsed.nodes || [];

    // Find the most common block type to determine icon
    const blockTypes = nodes
      .filter((node: any) => node.type !== 'root' && node.type !== 'error')
      .map((node: any) => node.type);

    if (blockTypes.includes('send-message')) return MessageSquare;
    if (blockTypes.includes('add-role') || blockTypes.includes('remove-role'))
      return Crown;
    if (blockTypes.includes('kick-member') || blockTypes.includes('ban-member'))
      return Shield;
    if (
      blockTypes.includes('create-channel') ||
      blockTypes.includes('delete-channel')
    )
      return Hash;
    if (
      blockTypes.includes('move-member') ||
      blockTypes.includes('mute-member')
    )
      return Volume2;
    if (blockTypes.includes('create-webhook')) return Webhook;
    if (blockTypes.includes('condition')) return GitBranch;
    if (blockTypes.includes('wait')) return Clock;
    if (blockTypes.includes('unq-variable')) return Database;

    return Settings;
  } catch {
    return Settings;
  }
};

// Helper function to get block count
const getBlockCount = (blocks: string) => {
  try {
    const parsed = JSON.parse(blocks);
    const nodes = parsed.nodes || [];
    return nodes.filter(
      (node: any) => node.type !== 'root' && node.type !== 'error'
    ).length;
  } catch {
    return 0;
  }
};

// Helper function to get category color
const getCategoryColor = (blocks: string) => {
  try {
    const parsed = JSON.parse(blocks);
    const nodes = parsed.nodes || [];
    const blockTypes = nodes
      .filter((node: any) => node.type !== 'root' && node.type !== 'error')
      .map((node: any) => node.type);

    if (blockTypes.includes('send-message')) return 'messaging';
    if (blockTypes.includes('add-role') || blockTypes.includes('remove-role'))
      return 'roles';
    if (blockTypes.includes('kick-member') || blockTypes.includes('ban-member'))
      return 'moderation';
    if (
      blockTypes.includes('create-channel') ||
      blockTypes.includes('delete-channel')
    )
      return 'channels';
    if (
      blockTypes.includes('move-member') ||
      blockTypes.includes('mute-member')
    )
      return 'voice';
    if (blockTypes.includes('create-webhook')) return 'webhooks';
    if (blockTypes.includes('condition')) return 'logic';
    if (blockTypes.includes('wait')) return 'utilities';
    if (blockTypes.includes('unq-variable')) return 'variables';

    return 'default';
  } catch {
    return 'default';
  }
};

// Category color mappings for consistent theming
const categoryColors = {
  messaging: {
    gradient: 'from-blue-500/20 via-purple-500/10 to-blue-600/20',
    border: 'border-blue-500/30',
    icon: 'from-blue-500 to-purple-600',
    glow: 'shadow-blue-500/20',
  },
  roles: {
    gradient: 'from-orange-500/20 via-red-500/10 to-orange-600/20',
    border: 'border-orange-500/30',
    icon: 'from-orange-500 to-red-600',
    glow: 'shadow-orange-500/20',
  },
  moderation: {
    gradient: 'from-red-500/20 via-pink-500/10 to-red-600/20',
    border: 'border-red-500/30',
    icon: 'from-red-500 to-pink-600',
    glow: 'shadow-red-500/20',
  },
  channels: {
    gradient: 'from-green-500/20 via-teal-500/10 to-green-600/20',
    border: 'border-green-500/30',
    icon: 'from-green-500 to-teal-600',
    glow: 'shadow-green-500/20',
  },
  voice: {
    gradient: 'from-yellow-500/20 via-orange-500/10 to-yellow-600/20',
    border: 'border-yellow-500/30',
    icon: 'from-yellow-500 to-orange-600',
    glow: 'shadow-yellow-500/20',
  },
  webhooks: {
    gradient: 'from-emerald-500/20 via-green-500/10 to-emerald-600/20',
    border: 'border-emerald-500/30',
    icon: 'from-emerald-500 to-green-600',
    glow: 'shadow-emerald-500/20',
  },
  logic: {
    gradient: 'from-indigo-500/20 via-blue-500/10 to-indigo-600/20',
    border: 'border-indigo-500/30',
    icon: 'from-indigo-500 to-blue-600',
    glow: 'shadow-indigo-500/20',
  },
  utilities: {
    gradient: 'from-gray-500/20 via-slate-500/10 to-gray-600/20',
    border: 'border-gray-500/30',
    icon: 'from-gray-500 to-slate-600',
    glow: 'shadow-gray-500/20',
  },
  variables: {
    gradient: 'from-purple-500/20 via-indigo-500/10 to-purple-600/20',
    border: 'border-purple-500/30',
    icon: 'from-purple-500 to-indigo-600',
    glow: 'shadow-purple-500/20',
  },
  default: {
    gradient: 'from-slate-500/20 via-gray-500/10 to-slate-600/20',
    border: 'border-slate-500/30',
    icon: 'from-slate-500 to-gray-600',
    glow: 'shadow-slate-500/20',
  },
};

export default function CommandsPage({ params }: any) {
  const unwrappedParams = isPromise<{ serverId: string }>(params)
    ? React.use(params)
    : params;
  const serverId = unwrappedParams?.serverId || '';

  const router = useRouter();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const commands = useQuery(api.discord.getCommands, { serverId });
  const deleteCommandMutation = useMutation(api.discord.deleteCommand);
  const toggleCommandMutation = useMutation(api.discord.toggleCommandStatus);

  useEffect(() => {
    const fetchCommands = async () => {
      if (commands !== undefined) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoading(false);
      }
    };
    fetchCommands();
  }, [commands]);

  const filteredCommands =
    commands?.filter(
      command =>
        command.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        command.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleCreateCommand = () => {
    router.push(`/dashboard/${serverId}/commands/builder`);
  };

  const handleEditCommand = (commandId: string) => {
    router.push(
      `/dashboard/${serverId}/commands/builder?commandId=${commandId}`
    );
  };

  const handleDeleteCommand = async (
    commandId: string,
    commandName: string
  ) => {
    try {
      await deleteCommandMutation({ commandId: commandId as any });
      toast.success(
        'Command Deleted',
        `Command &quot;${commandName}&quot; has been deleted successfully.`
      );
    } catch (error) {
      toast.error(
        'Delete Failed',
        'Failed to delete the command. Please try again.'
      );
    }
  };

  const handleToggleCommand = async (
    commandId: string,
    enabled: boolean,
    commandName: string
  ) => {
    try {
      await toggleCommandMutation({ commandId: commandId as any, enabled });
      toast.success(
        enabled ? 'Command Enabled' : 'Command Disabled',
        `Command &quot;${commandName}&quot; has been ${enabled ? 'enabled' : 'disabled'}.`
      );
    } catch (error) {
      toast.error(
        'Update Failed',
        'Failed to update command status. Please try again.'
      );
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading || !commands) {
    return (
      <div className='bg-discord-dark min-h-screen'>
        {/* Atmospheric Background */}
        <div className='fixed inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black' />
          <div className='absolute inset-0 bg-grid-pattern opacity-5' />
          <div className='floating-orb floating-orb-1' />
          <div className='floating-orb floating-orb-2' />
          <div className='floating-orb floating-orb-3' />
        </div>

        <div className='relative z-10 min-h-screen flex items-center justify-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='flex flex-col items-center gap-6 text-white'
          >
            <div className='relative'>
              <Loader2 className='h-12 w-12 animate-spin text-discord-blurple' />
              <div className='absolute inset-0 h-12 w-12 rounded-full bg-discord-blurple/20 animate-ping' />
            </div>
            <div className='text-center'>
              <h2 className='text-2xl font-bold mb-2'>Loading Commands</h2>
              <p className='text-discord-text'>Fetching your bot commands...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='bg-discord-dark min-h-screen'>
        {/* Atmospheric Background */}
        <div className='fixed inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black' />
          <div className='absolute inset-0 bg-grid-pattern opacity-5' />
          <div className='floating-orb floating-orb-1' />
          <div className='floating-orb floating-orb-2' />
          <div className='floating-orb floating-orb-3' />
        </div>

        <div className='relative z-10 min-h-screen'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='container mx-auto px-6 py-10'
          >
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='text-center mb-16'
            >
              <div className='flex items-center justify-center gap-4 mb-6'>
                <div className='p-4 rounded-2xl bg-gradient-to-r from-discord-blurple to-purple-600 shadow-2xl shadow-discord-blurple/25'>
                  <Command className='w-10 h-10 text-white' />
                </div>
                <h1 className='text-6xl font-black text-white tracking-tight'>
                  COMMANDS
                </h1>
              </div>
              <p className='text-xl text-discord-text max-w-3xl mx-auto leading-relaxed'>
                Manage and configure your Discord bot commands with powerful
                visual tools
              </p>
            </motion.div>

            {/* Create Command Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='flex justify-center mb-12'
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleCreateCommand}
                  className='bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-discord-blurple/30 hover:shadow-discord-blurple/40 transition-all duration-300 text-lg'
                  size='lg'
                >
                  <Plus className='w-6 h-6 mr-3' />
                  Create New Command
                  <Sparkles className='w-5 h-5 ml-3' />
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats and Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='mb-12'
            >
              {/* Search */}
              <div className='lg:col-span-2'>
                <div className='relative group'>
                  <Search className='absolute left-5 top-1/2 transform -translate-y-1/2 text-discord-text w-6 h-6 group-focus-within:text-discord-blurple transition-colors duration-200 z-50' />
                  <Input
                    placeholder='Search commands...'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className='pl-14 h-14 bg-discord-darker/60 border-discord-border text-white placeholder:text-discord-text focus:border-discord-blurple focus:ring-2 focus:ring-discord-blurple/20 backdrop-blur-sm rounded-xl text-lg transition-all duration-200'
                  />
                </div>
              </div>
            </motion.div>

            {/* Commands Grid */}
            <AnimatePresence mode='wait'>
              {filteredCommands.length === 0 ? (
                <motion.div
                  key='empty'
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className='bg-gradient-to-br from-discord-darker/90 to-discord-dark/90 border-discord-border backdrop-blur-sm shadow-2xl'>
                    <CardContent className='p-16 text-center'>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          delay: 0.2,
                        }}
                      >
                        <div className='w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-discord-blurple to-purple-600 flex items-center justify-center shadow-2xl shadow-discord-blurple/30'>
                          <Command className='w-16 h-16 text-white' />
                        </div>
                      </motion.div>
                      <h3 className='text-3xl font-bold text-white mb-4'>
                        {searchQuery ? 'No commands found' : 'No commands yet'}
                      </h3>
                      <p className='text-discord-text mb-10 text-xl leading-relaxed'>
                        {searchQuery
                          ? 'Try adjusting your search terms'
                          : 'Create your first command to get started with your Discord bot'}
                      </p>
                      {!searchQuery && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={handleCreateCommand}
                            className='bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300'
                          >
                            <Plus className='w-5 h-5 mr-3' />
                            Create Your First Command
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key='commands'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                >
                  {filteredCommands.map((command, index) => {
                    const IconComponent = getCommandIcon(command.blocks);
                    const blockCount = getBlockCount(command.blocks);
                    const isEnabled = command.enabled !== false;
                    const category = getCategoryColor(command.blocks);
                    const colors =
                      categoryColors[category as keyof typeof categoryColors];

                    return (
                      <motion.div
                        key={command._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className='group'
                      >
                        <Card
                          className={`bg-gradient-to-br ${colors.gradient} backdrop-blur-sm border-2 ${colors.border} hover:border-opacity-60 transition-all duration-300 h-full overflow-hidden relative shadow-xl hover:shadow-2xl ${colors.glow} hover:shadow-lg`}
                        >
                          {/* Enhanced gradient accent line */}
                          <div
                            className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colors.icon} opacity-90 shadow-sm`}
                          />

                          {/* Subtle inner glow effect */}
                          <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                          <CardHeader className='pb-4 pt-6 relative z-10'>
                            <div className='flex items-start justify-between'>
                              <div className='flex items-center gap-4 flex-1 min-w-0'>
                                <motion.div
                                  whileHover={{ rotate: 360, scale: 1.1 }}
                                  transition={{
                                    duration: 0.6,
                                    type: 'spring',
                                    stiffness: 200,
                                  }}
                                  className={`p-3 rounded-xl bg-gradient-to-r ${colors.icon} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                                >
                                  <IconComponent className='w-6 h-6 text-white' />
                                </motion.div>
                                <div className='min-w-0 flex-1'>
                                  <CardTitle className='text-white text-xl font-bold truncate mb-2'>
                                    /{command.name}
                                  </CardTitle>
                                  <div className='flex items-center gap-3'>
                                    <Badge
                                      variant={
                                        isEnabled ? 'default' : 'secondary'
                                      }
                                      className={`${
                                        isEnabled
                                          ? 'bg-green-600/90 text-white border-green-400/50 shadow-green-500/20'
                                          : 'bg-gray-600/90 text-gray-200 border-gray-400/50'
                                      } backdrop-blur-sm font-semibold px-3 py-1 shadow-lg`}
                                    >
                                      {isEnabled ? 'Active' : 'Disabled'}
                                    </Badge>
                                    <Badge
                                      variant='outline'
                                      className='text-discord-text border-discord-border/60 bg-discord-darker/70 backdrop-blur-sm px-3 py-1 shadow-sm'
                                    >
                                      <Zap className='w-3.5 h-3.5 mr-1.5' />
                                      {blockCount}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <motion.div
                                whileTap={{ scale: 0.9 }}
                                className='ml-2'
                              >
                                <Switch
                                  checked={isEnabled}
                                  onCheckedChange={checked =>
                                    handleToggleCommand(
                                      command._id,
                                      checked,
                                      command.name
                                    )
                                  }
                                  className='data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600 shadow-sm'
                                />
                              </motion.div>
                            </div>
                          </CardHeader>

                          <CardContent className='pt-0 pb-6 relative z-10'>
                            <p className='text-discord-text text-sm mb-6 line-clamp-2 leading-relaxed'>
                              {command.description || 'No description provided'}
                            </p>

                            <div className='space-y-2 mb-6 text-xs'>
                              <div className='flex justify-between text-discord-text/90'>
                                <span className='font-medium'>Created:</span>
                                <span className='font-semibold'>
                                  {formatDate(command.creationTime)}
                                </span>
                              </div>
                              {command.lastUpdateTime && (
                                <div className='flex justify-between text-discord-text/90'>
                                  <span className='font-medium'>Updated:</span>
                                  <span className='font-semibold'>
                                    {formatDate(command.lastUpdateTime)}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className='flex gap-3'>
                              <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className='flex-1'
                              >
                                <Button
                                  onClick={() => handleEditCommand(command._id)}
                                  variant='outline'
                                  size='sm'
                                  className='w-full bg-discord-darker/70 border-discord-border/60 text-white hover:bg-discord-blurple hover:border-discord-blurple transition-all duration-200 font-semibold py-2.5 shadow-sm hover:shadow-md'
                                >
                                  <Edit3 className='w-4 h-4 mr-2' />
                                  Edit
                                </Button>
                              </motion.div>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button
                                      variant='destructive'
                                      size='sm'
                                      className='bg-red-600/90 hover:bg-red-600 border-red-500/50 hover:border-red-500 shadow-sm hover:shadow-md transition-all duration-200 px-3'
                                    >
                                      <Trash2 className='w-4 h-4' />
                                    </Button>
                                  </motion.div>
                                </AlertDialogTrigger>
                                <AlertDialogContent className='bg-discord-darker border-discord-border shadow-2xl'>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className='text-white text-xl'>
                                      Delete Command
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className='text-discord-text text-base leading-relaxed'>
                                      Are you sure you want to delete the
                                      command "/{command.name}"? This action
                                      cannot be undone and will permanently
                                      remove the command and all its
                                      configurations.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className='gap-3'>
                                    <AlertDialogCancel className='bg-discord-dark border-discord-border text-white hover:bg-discord-darker font-semibold'>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteCommand(
                                          command._id,
                                          command.name
                                        )
                                      }
                                      className='bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-xl'
                                    >
                                      Delete Command
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
}
