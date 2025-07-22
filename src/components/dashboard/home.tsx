'use client';
import { UserButton } from '@clerk/nextjs';
import {
  Activity,
  BarChart3,
  Bot,
  Plus,
  Server,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardHome() {
  // Mock data - replace with actual Convex queries
  const servers = [
    {
      id: '1',
      name: 'Gaming Community',
      members: 1247,
      online: 342,
      icon: '🎮',
    },
    { id: '2', name: 'Tech Hub', members: 892, online: 156, icon: '💻' },
    { id: '3', name: 'Art Studio', members: 634, online: 89, icon: '🎨' },
  ];

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary rounded-lg'>
                  <Bot className='h-6 w-6 text-primary-foreground' />
                </div>
                <div>
                  <h1 className='text-xl font-semibold'>SPATIUM Dashboard</h1>
                  <p className='text-sm text-muted-foreground'>
                    Manage your servers
                  </p>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <ThemeToggle />
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        {/* Overview Stats */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Servers
                  </p>
                  <p className='text-3xl font-bold'>{servers.length}</p>
                  <p className='text-sm text-green-600 flex items-center gap-1 mt-1'>
                    <TrendingUp className='h-3 w-3' />
                    +2 this month
                  </p>
                </div>
                <div className='p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl'>
                  <Server className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Members
                  </p>
                  <p className='text-3xl font-bold'>
                    {servers
                      .reduce((acc, server) => acc + server.members, 0)
                      .toLocaleString()}
                  </p>
                  <p className='text-sm text-green-600 flex items-center gap-1 mt-1'>
                    <TrendingUp className='h-3 w-3' />
                    +12% this month
                  </p>
                </div>
                <div className='p-3 bg-green-100 dark:bg-green-900/20 rounded-xl'>
                  <Users className='h-6 w-6 text-green-600 dark:text-green-400' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Online Now
                  </p>
                  <p className='text-3xl font-bold'>
                    {servers.reduce((acc, server) => acc + server.online, 0)}
                  </p>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Across all servers
                  </p>
                </div>
                <div className='p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl'>
                  <Activity className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Bot Status
                  </p>
                  <div className='flex items-center gap-2 mt-2'>
                    <Badge
                      variant='outline'
                      className='bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                    >
                      <div className='w-2 h-2 bg-green-500 rounded-full mr-2' />
                      Online
                    </Badge>
                  </div>
                </div>
                <div className='p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl'>
                  <Bot className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Server List */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Your Servers</CardTitle>
            <Button size='sm'>
              <Plus className='h-4 w-4 mr-2' />
              Add Server
            </Button>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {servers.map(server => (
                <Link key={server.id} href={`/dashboard/${server.id}`}>
                  <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-4'>
                        <div className='text-3xl'>{server.icon}</div>
                        <div className='flex-1'>
                          <h3 className='font-semibold'>{server.name}</h3>
                          <div className='flex items-center gap-4 mt-2 text-sm text-muted-foreground'>
                            <span>
                              {server.members.toLocaleString()} members
                            </span>
                            <span className='flex items-center gap-1'>
                              <div className='w-2 h-2 bg-green-500 rounded-full' />
                              {server.online} online
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='flex gap-2 mt-4'>
                        <Button size='sm' variant='outline' className='flex-1'>
                          <Settings className='h-3 w-3 mr-1' />
                          Settings
                        </Button>
                        <Button size='sm' variant='outline' className='flex-1'>
                          <BarChart3 className='h-3 w-3 mr-1' />
                          Analytics
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
