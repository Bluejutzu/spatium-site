'use client';

import { UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Bot,
  Home,
  BarChart3,
  Settings,
  Users,
  MessageSquare,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navigationItems = [
  {
    title: 'Overview',
    url: '',
    icon: Home,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Members',
    url: '/members',
    icon: Users,
  },
  {
    title: 'Commands',
    url: '/commands',
    icon: MessageSquare,
  },
  {
    title: 'Moderation',
    url: '/moderation',
    icon: Shield,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

interface DashboardSidebarProps {
  serverId: string;
}

export function DashboardSidebar({ serverId }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar className='border-r border-discord-border bg-discord-dark/90 backdrop-blur-xl'>
      <SidebarHeader className='border-b border-discord-border p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <motion.div
              className='p-3 bg-discord-blurple rounded-xl shadow-glow-blurple'
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Bot className='h-6 w-6 text-white' />
            </motion.div>
            <div>
              <h2 className='font-bold text-white tracking-wide font-minecraft'>
                SERVER CONTROL
              </h2>
              <p className='text-sm text-discord-text'>ID: {serverId}</p>
            </div>
          </div>
        </div>
        <Link
          href='/servers'
          className='flex items-center gap-2 text-sm text-discord-text hover:text-white mt-4 transition-colors font-minecraft'
        >
          <ArrowLeft className='h-4 w-4' />
          BACK TO SERVERS
        </Link>
      </SidebarHeader>

      <SidebarContent className='p-6'>
        <SidebarGroup>
          <SidebarGroupLabel className='text-xs font-bold text-discord-text uppercase tracking-wider mb-4 font-minecraft'>
            NAVIGATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item, index) => {
                const href = `/dashboard/${serverId}${item.url}`;
                const isActive = pathname === href;

                return (
                  <SidebarMenuItem key={item.title}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`w-full justify-start gap-3 px-4 py-3 text-discord-text hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-minecraft ${
                          isActive
                            ? 'bg-discord-blurple/20 text-discord-blurple border-r-2 border-discord-blurple'
                            : ''
                        }`}
                      >
                        <Link href={href}>
                          <item.icon className='h-5 w-5' />
                          <span className='font-bold tracking-wide'>
                            {item.title.toUpperCase()}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </motion.div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='border-t border-discord-border p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-10 w-10',
                },
              }}
            />
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-bold text-white truncate font-minecraft'>
                COMMANDER
              </p>
              <p className='text-xs text-discord-text'>Manage account</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
