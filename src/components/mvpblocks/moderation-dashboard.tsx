'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  Eye,
  MoreVertical,
  Shield,
  Timer,
  UserX,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ModerationLog {
  id: string;
  action: string;
  userId: string;
  username: string;
  reason: string;
  moderator: string;
  timestamp: Date;
  duration?: string;
  status: 'active' | 'completed' | 'pending';
}

interface ModerationStats {
  totalActions: number;
  activeActions: number;
  todayActions: number;
  topModerator: string;
}

export function ModerationDashboard({ logs }: { logs: ModerationLog[] }) {
  const [stats, setStats] = useState<ModerationStats>({
    totalActions: 0,
    activeActions: 0,
    todayActions: 0,
    topModerator: 'ModeratorUser',
  });

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayActions = logs.filter(log => log.timestamp >= today).length;
    const activeActions = logs.filter(log => log.status === 'active').length;

    setStats({
      totalActions: logs.length,
      activeActions,
      todayActions,
      topModerator: 'ModeratorUser',
    });
  }, [logs]);

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'ban':
        return <Ban className='w-4 h-4 text-red-500' />;
      case 'kick':
        return <UserX className='w-4 h-4 text-orange-500' />;
      case 'warn':
        return <AlertTriangle className='w-4 h-4 text-yellow-500' />;
      default:
        return <Shield className='w-4 h-4 text-discord-blurple' />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'ban':
        return 'text-red-500 bg-red-500/20 border-red-500/30';
      case 'kick':
        return 'text-orange-500 bg-orange-500/20 border-orange-500/30';
      case 'warn':
        return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'text-discord-blurple bg-discord-blurple/20 border-discord-blurple/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className='w-3 h-3 text-yellow-500' />;
      case 'completed':
        return <CheckCircle className='w-3 h-3 text-green-500' />;
      case 'pending':
        return <XCircle className='w-3 h-3 text-red-500' />;
      default:
        return <Clock className='w-3 h-3 text-gray-500' />;
    }
  };

  return (
    <div className='flex flex-col h-full bg-discord-dark rounded-xl overflow-hidden'>
      {/* Header */}
      <div className='p-4 bg-discord-darker border-b border-discord-border'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-white font-bold text-lg'>
              Moderation Dashboard
            </h3>
            <p className='text-discord-text text-sm'>
              Real-time moderation activity
            </p>
          </div>
          <Badge className='bg-green-500/20 text-green-400 border-green-500/30'>
            Live
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='p-4 grid grid-cols-2 gap-3'>
        <Card className='bg-discord-darker border-discord-border'>
          <CardContent className='p-3'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-discord-text text-xs'>Total Actions</p>
                <p className='text-white font-bold text-lg'>
                  {stats.totalActions}
                </p>
              </div>
              <Shield className='w-6 h-6 text-discord-blurple' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-discord-darker border-discord-border'>
          <CardContent className='p-3'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-discord-text text-xs'>Active</p>
                <p className='text-white font-bold text-lg'>
                  {stats.activeActions}
                </p>
              </div>
              <Clock className='w-6 h-6 text-yellow-500' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Actions */}
      <div className='flex-1 overflow-y-auto p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h4 className='text-white font-semibold'>Recent Actions</h4>
          <span className='text-discord-text text-xs'>{logs.length} total</span>
        </div>

        <div className='space-y-2'>
          <AnimatePresence>
            {logs
              .slice()
              .reverse()
              .map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className='group bg-discord-darker/50 border border-discord-border/30 rounded-lg p-3 hover:bg-discord-darker/80 transition-colors'
                >
                  <div className='flex items-start gap-3'>
                    <div
                      className={`p-1.5 rounded-md ${getActionColor(log.action)}`}
                    >
                      {getActionIcon(log.action)}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-1'>
                        <span className='text-white font-medium text-sm'>
                          {log.action}
                        </span>
                        <span className='text-discord-text text-xs'>•</span>
                        <span className='text-discord-text text-xs'>
                          {log.username}
                        </span>
                        <div className='flex items-center gap-1'>
                          {getStatusIcon(log.status)}
                          <span
                            className={`text-xs capitalize ${
                              log.status === 'active'
                                ? 'text-yellow-500'
                                : log.status === 'completed'
                                  ? 'text-green-500'
                                  : 'text-red-500'
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>
                      </div>

                      <p className='text-discord-text text-xs mb-2 truncate'>
                        {log.reason}
                      </p>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Avatar className='w-4 h-4'>
                            <AvatarFallback className='text-xs bg-discord-blurple'>
                              {log.moderator.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className='text-discord-text text-xs'>
                            {log.moderator}
                          </span>
                        </div>

                        <div className='flex items-center gap-2'>
                          {log.duration && (
                            <Badge
                              variant='outline'
                              className='text-xs px-1 py-0 border-discord-border text-discord-text'
                            >
                              {log.duration}
                            </Badge>
                          )}
                          <span className='text-discord-text text-xs'>
                            {log.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-discord-text hover:text-white'
                        >
                          <MoreVertical className='w-3 h-3' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className='bg-discord-darker border-discord-border'>
                        <DropdownMenuItem className='text-discord-text hover:text-white hover:bg-white/5'>
                          <Eye className='w-3 h-3 mr-2' />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>

          {logs.length === 0 && (
            <div className='text-center py-8'>
              <Shield className='w-12 h-12 text-discord-text mx-auto mb-3 opacity-50' />
              <p className='text-discord-text text-sm'>
                No moderation actions yet
              </p>
              <p className='text-discord-text text-xs opacity-75'>
                Actions will appear here in real-time
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
