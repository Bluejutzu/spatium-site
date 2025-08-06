'use client';

import {
  IconChartBar,
  IconDashboard,
  IconRefresh,
  IconRobot,
  IconSettings,
  IconShield,
  IconUsers,
} from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

import { NavUser } from '@/components/dashboard/sidebar/nav-user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDiscordCache } from '@/store/discordCache';

export function AppSidebar({
  user,
  servers,
  selectedServer,
  activeSection,
  onSectionChange,
}: {
  user: any;
  servers: any[];
  selectedServer: any;
  activeSection: string;
  onSectionChange: (section: string) => void;
} & React.ComponentProps<typeof Sidebar>) {
  const { clearCache, populateCache } = useDiscordCache();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshDebounce, setDebounce] = useState(false);

  const handleRefresh = async () => {
    if (refreshDebounce) return;
    if (!selectedServer || !user) return;
    setDebounce(true);
    setIsRefreshing(true);
    clearCache();
    try {
      await populateCache(selectedServer.serverId, user.id);
      toast.success('Cache refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh cache.');
    }
    setIsRefreshing(false);
    setTimeout(() => setDebounce(false), 5000);
  };

  const navigationItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: IconDashboard,
    },
    {
      id: 'members',
      title: 'Members',
      icon: IconUsers,
    },
    {
      id: 'commands',
      title: 'Commands',
      icon: IconRobot,
    },
    {
      id: 'moderation',
      title: 'Moderation',
      icon: IconShield,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: IconSettings,
    },
  ];

  const userData = user
    ? {
        name:
          user.fullName ||
          user.username ||
          user.emailAddresses?.[0]?.emailAddress ||
          'User',
        email: user.emailAddresses?.[0]?.emailAddress || '',
        avatar: user.imageUrl || '',
      }
    : {
        name: 'User',
        email: '',
        avatar: '',
      };

  // Server info for header
  const serverName = selectedServer?.name || 'Server';
  const serverId = selectedServer?.serverId || '';
  const serverIcon = selectedServer?.icon
    ? `https://cdn.discordapp.com/icons/${selectedServer.serverId}/${selectedServer.icon}.png`
    : null;

  return (
    <Sidebar collapsible='offcanvas'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  asChild
                  className='data-[slot=sidebar-menu-button]:!p-1.5 cursor-pointer'
                >
                  <div className='flex items-center gap-3 bg-discord-dark'>
                    {serverIcon ? (
                      <Image
                        src={serverIcon}
                        alt={serverName}
                        width={32}
                        height={32}
                        className='w-8 h-8 rounded-lg'
                      />
                    ) : (
                      <div className='w-8 h-8 bg-discord-blurple rounded-lg flex items-center justify-center text-white font-bold text-lg'>
                        {serverName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className='text-base font-semibold'>
                      {serverName}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-72 bg-discord-darker border-discord-border'>
                {servers?.map((server: any) => (
                  <DropdownMenuItem
                    key={server.serverId}
                    onClick={() => {
                      if (server.serverId !== serverId) {
                        window.location.href = `/dashboard/${server.serverId}`;
                      }
                    }}
                    className={`flex items-center gap-3 ${server.serverId === serverId ? 'bg-discord-blurple/10 text-white' : 'text-discord-text'}`}
                  >
                    {server.icon ? (
                      <Image
                        src={`https://cdn.discordapp.com/icons/${server.serverId}/${server.icon}.png`}
                        alt={server.name}
                        width={24}
                        height={24}
                        className='w-6 h-6 rounded'
                      />
                    ) : (
                      <div className='w-6 h-6 bg-discord-blurple rounded flex items-center justify-center text-white font-bold text-base'>
                        {server.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium truncate'>{server.name}</div>
                      <div className='text-xs text-discord-text truncate'>
                        ID: {server.serverId}
                      </div>
                    </div>
                    {server.serverId === serverId && (
                      <span className='ml-2 text-xs text-discord-green'>
                        Current
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map(item => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={activeSection === item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full justify-start gap-3 px-4 py-3 text-discord-text hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-minecraft ${
                  activeSection === item.id
                    ? 'bg-discord-blurple/20 text-discord-blurple border-r-2 border-discord-blurple'
                    : ''
                }`}
              >
                <item.icon className='h-5 w-5' />
                <span className='font-bold tracking-wide'>
                  {item.title.toUpperCase()}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  onClick={handleRefresh}
                  disabled={isRefreshing || refreshDebounce}
                  className='w-full justify-start gap-3 px-4 py-3 text-discord-text hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-minecraft'
                >
                  <IconRefresh
                    className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                  <span className='font-bold tracking-wide'>REFRESH CACHE</span>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {refreshDebounce
                    ? 'Cooldown...'
                    : 'Refresh members, roles, etc'}
                </p>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser serverId={serverId} user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
