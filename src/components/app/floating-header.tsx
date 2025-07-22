'use client';

import { UserButton } from '@clerk/nextjs';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  BarChart3,
  Bell,
  ChevronDown,
  Command,
  MessageSquare,
  Search,
  Settings,
  Users,
  Zap,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect,useState } from 'react';

import { ThemeToggle } from '@/components/theme/theme-toggle';
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


interface FloatingHeaderProps {
  showSearch?: boolean;
  title?: string;
}

const quickActions = [
  { icon: BarChart3, label: 'Analytics', shortcut: '⌘A' },
  { icon: Users, label: 'Members', shortcut: '⌘M' },
  { icon: MessageSquare, label: 'Messages', shortcut: '⌘T' },
  { icon: Settings, label: 'Settings', shortcut: '⌘S' },
];

export function FloatingHeader({
  showSearch = true,
  title,
}: FloatingHeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifications] = useState(3);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [8, 16]);

  // Get page title from pathname
  const getPageTitle = () => {
    if (title) return title;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return 'DASHBOARD';
    return segments[segments.length - 1].toUpperCase();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            document.getElementById('global-search')?.focus();
            break;
          case 'a':
            e.preventDefault();
            // Navigate to analytics
            break;
          case 'm':
            e.preventDefault();
            // Navigate to members
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.header
      className='fixed top-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-7xl'
      style={{
        backdropFilter: useTransform(headerBlur, value => `blur(${value}px)`),
      }}
    >
      <motion.div
        className='bg-discord-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden'
        style={{ opacity: headerOpacity }}
      >
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            {/* Left Section - Title & Navigation */}
            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-4'>
                <motion.h1
                  className='text-xl font-bold text-white tracking-wide'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={pathname}
                >
                  {getPageTitle()}
                </motion.h1>
              </div>

              {/* Quick Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='hidden lg:flex items-center gap-2 text-discord-text hover:text-white hover:bg-white/5'
                  >
                    <Zap className='h-4 w-4' />
                    <span>Quick Actions</span>
                    <ChevronDown className='h-3 w-3' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56 bg-discord-dark border-white/20'>
                  {quickActions.map(action => (
                    <DropdownMenuItem
                      key={action.label}
                      className='flex items-center justify-between text-discord-text hover:text-white hover:bg-white/5'
                    >
                      <div className='flex items-center gap-2'>
                        <action.icon className='h-4 w-4' />
                        <span>{action.label}</span>
                      </div>
                      <kbd className='text-xs bg-white/10 px-1.5 py-0.5 rounded'>
                        {action.shortcut}
                      </kbd>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className='bg-white/10' />
                  <DropdownMenuItem className='text-discord-text hover:text-white hover:bg-white/5'>
                    <Command className='h-4 w-4 mr-2' />
                    Command Palette
                    <kbd className='ml-auto text-xs bg-white/10 px-1.5 py-0.5 rounded'>
                      ⌘K
                    </kbd>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Center Section - Search */}
            {showSearch && (
              <motion.div
                className='hidden md:flex items-center relative'
                animate={{ width: searchFocused ? 400 : 300 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Search className='absolute left-3 h-4 w-4 text-discord-text' />
                <Input
                  id='global-search'
                  placeholder='Search servers, members, commands...'
                  className='pl-10 pr-20 bg-white/5 border-white/10 text-white placeholder:text-discord-text focus:border-discord-blurple focus:ring-discord-blurple/20'
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <div className='absolute right-3 flex items-center gap-1'>
                  <kbd className='text-xs bg-white/10 text-discord-text px-1.5 py-0.5 rounded'>
                    ⌘K
                  </kbd>
                </div>
              </motion.div>
            )}

            {/* Right Section - Actions & Profile */}
            <div className='flex items-center gap-4'>
              {/* Notifications */}
              <Button
                variant='ghost'
                size='icon'
                className='relative text-discord-text hover:text-white hover:bg-white/5'
              >
                <Bell className='h-5 w-5' />
                {notifications > 0 && (
                  <Badge className='absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center'>
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Profile */}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      'h-8 w-8 ring-2 ring-discord-blurple/20 hover:ring-discord-blurple/40 transition-all',
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <motion.div
          className='h-0.5 bg-gradient-to-r from-discord-blurple via-discord-purple to-discord-pink'
          style={{
            scaleX: useTransform(scrollY, [0, 1000], [0, 1]),
            transformOrigin: 'left',
          }}
        />
      </motion.div>
    </motion.header>
  );
}
