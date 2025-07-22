'use client';

import { motion } from 'framer-motion';
import { 
  Activity,
  BarChart3, 
  Bell, 
  Crown,
  ExternalLink,
  Globe,
  MessageSquare, 
  Search, 
  Settings, 
  Shield,
  Users, 
  Zap,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardHeaderProps {
  serverId: string;
  serverName?: string;
  onlineCount?: number;
  memberCount?: number;
}

export function DashboardHeader({ 
  serverId, 
  serverName = "Gaming Community",
  onlineCount = 0,
  memberCount = 0 
}: DashboardHeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifications] = useState(3);

  const quickActions = [
    { icon: BarChart3, label: 'Analytics', shortcut: '⌘A', color: 'text-blue-500' },
    { icon: Users, label: 'Members', shortcut: '⌘M', color: 'text-green-500' },
    { icon: MessageSquare, label: 'Commands', shortcut: '⌘C', color: 'text-purple-500' },
    { icon: Shield, label: 'Moderation', shortcut: '⌘S', color: 'text-red-500' },
  ];

  return (
    <motion.header 
      className='border-b bg-discord-darker/95 backdrop-blur-xl px-8 py-6 shadow-lg border-discord-border/50'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className='flex items-center justify-between'>
        {/* Left Section */}
        <div className='flex items-center gap-6'>
          <SidebarTrigger className="hover:bg-white/10 transition-colors duration-300" />
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            {/* Server Icon */}
            <div className="w-12 h-12 bg-gradient-to-r from-discord-blurple to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              🎮
            </div>
            
            <div>
              <h1 className='text-2xl font-bold text-white tracking-wide'>{serverName}</h1>
              <div className="flex items-center gap-4 text-sm text-discord-text">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  ID: {serverId}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {memberCount.toLocaleString()} members
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {onlineCount} online
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center Section - Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:flex items-center relative"
        >
          <motion.div
            animate={{ width: searchFocused ? 400 : 320 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative"
          >
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-discord-text' />
            <Input
              placeholder='Search commands, members, settings...'
              className='pl-12 pr-16 bg-discord-dark/50 border-discord-border text-white placeholder:text-discord-text focus:border-discord-blurple focus:ring-2 focus:ring-discord-blurple/20 h-12 rounded-xl transition-all duration-300'
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1'>
              <kbd className='text-xs bg-white/10 text-discord-text px-2 py-1 rounded border border-white/20'>
                ⌘K
              </kbd>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='flex items-center gap-4'
        >
          {/* Quick Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='hidden xl:flex items-center gap-2 text-discord-text hover:text-white hover:bg-white/10 transition-all duration-300 px-4 py-2 rounded-lg'
              >
                <Zap className='h-4 w-4' />
                <span>Quick Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-64 bg-discord-darker border-discord-border shadow-2xl'>
              {quickActions.map((action, index) => (
                <DropdownMenuItem
                  key={action.label}
                  className='flex items-center justify-between text-discord-text hover:text-white hover:bg-white/5 p-3 transition-all duration-300'
                >
                  <div className='flex items-center gap-3'>
                    <action.icon className={`h-4 w-4 ${action.color}`} />
                    <span className="font-medium">{action.label}</span>
                  </div>
                  <kbd className='text-xs bg-white/10 px-2 py-1 rounded border border-white/20'>
                    {action.shortcut}
                  </kbd>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className='bg-white/10' />
              <DropdownMenuItem className='text-discord-text hover:text-white hover:bg-white/5 p-3 transition-all duration-300'>
                <ExternalLink className='h-4 w-4 mr-3 text-discord-blurple' />
                View Documentation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* System Status */}
          <Badge className='bg-discord-green/20 text-discord-green border-discord-green/30 px-3 py-2 font-bold'>
            <motion.div 
              className='w-2 h-2 bg-discord-green rounded-full mr-2'
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            ONLINE
          </Badge>

          {/* Notifications */}
          <Button
            variant='ghost'
            size='icon'
            className='relative text-discord-text hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg'
          >
            <Bell className='h-5 w-5' />
            {notifications > 0 && (
              <motion.div
                className='absolute -top-1 -right-1 h-5 w-5 bg-discord-red rounded-full flex items-center justify-center shadow-lg'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <span className='text-xs text-white font-bold'>{notifications}</span>
              </motion.div>
            )}
          </Button>

          {/* Settings */}
          <Button
            variant='ghost'
            size='icon'
            className='text-discord-text hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg'
          >
            <Settings className='h-5 w-5' />
          </Button>

          {/* Premium Badge */}
          <Badge className='bg-discord-yellow/20 text-discord-yellow border-discord-yellow/30 px-3 py-2 font-bold animate-pulse'>
            <Crown className='w-3 h-3 mr-1' />
            FREE
          </Badge>
        </motion.div>
      </div>

      {/* Enhanced Progress Bar */}
      <motion.div
        className='absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-discord-blurple via-purple-500 to-pink-500 shadow-lg'
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.header>
  );
}