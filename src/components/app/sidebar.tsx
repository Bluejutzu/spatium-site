'use client';

import { UserButton } from '@clerk/nextjs';
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
  HelpCircle,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Overview',
    url: '#',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Analytics',
    url: '#',
    icon: BarChart3,
  },
  {
    title: 'Servers',
    url: '#',
    icon: Users,
  },
  {
    title: 'Commands',
    url: '#',
    icon: MessageSquare,
  },
  {
    title: 'Moderation',
    url: '#',
    icon: Shield,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
  {
    title: 'Support',
    url: '#',
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className='border-r border-slate-200'>
      <SidebarHeader className='border-b border-slate-200 p-4'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-indigo-600 rounded-lg'>
            <Bot className='h-5 w-5 text-white' />
          </div>
          <div>
            <h2 className='font-semibold text-slate-900'>Bot Dashboard</h2>
            <p className='text-sm text-slate-500'>Manage your bot</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className='p-4'>
        <SidebarGroup>
          <SidebarGroupLabel className='text-xs font-medium text-slate-500 uppercase tracking-wider mb-2'>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className='w-full justify-start gap-3 px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-700 data-[active=true]:border-r-2 data-[active=true]:border-indigo-600'
                  >
                    <a href={item.url}>
                      <item.icon className='h-4 w-4' />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='border-t border-slate-200 p-4'>
        <div className='flex items-center gap-3'>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8',
              },
            }}
          />
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-slate-900 truncate'>
              Dashboard User
            </p>
            <p className='text-xs text-slate-500'>Manage account</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
