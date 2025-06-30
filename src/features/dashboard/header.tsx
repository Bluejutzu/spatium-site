'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  serverId: string;
}

export function DashboardHeader({ serverId }: DashboardHeaderProps) {
  return (
    <header className='border-b bg-background/80 backdrop-blur-sm px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <SidebarTrigger />
          <div>
            <h1 className='text-2xl font-semibold'>Gaming Community</h1>
            <p className='text-muted-foreground'>Server ID: {serverId}</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Badge
            variant='outline'
            className='bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
          >
            <div className='w-2 h-2 bg-green-500 rounded-full mr-2' />
            Online
          </Badge>
          <Button variant='ghost' size='icon'>
            <Bell className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='icon'>
            <Settings className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </header>
  );
}
