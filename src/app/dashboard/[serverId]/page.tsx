'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import React from 'react';

import { CommandsContent } from '@/app/dashboard/[serverId]/commands/page';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { MembersContent } from '@/components/dashboard/members-content';
import { ModerationContent } from '@/components/dashboard/moderation-content';
import SettingsContent from '@/components/dashboard/settings-content';
import { AppSidebar } from '@/components/dashboard/sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

import { api } from '../../../../convex/_generated/api';

export type DashboardSection =
  | 'dashboard'
  | 'moderation'
  | 'members'
  | 'bot-management'
  | 'server-management'
  | 'features'
  | 'integrations'
  | 'commands'
  | 'permissions'
  | 'status'
  | 'auto-mod'
  | 'warnings'
  | 'bans-kicks'
  | 'audit-log'
  | 'roles'
  | 'channels'
  | 'invites'
  | 'welcome'
  | 'reaction-roles'
  | 'auto-voice'
  | 'leveling'
  | 'webhooks'
  | 'api'
  | 'external'
  | 'settings'
  | 'premium'
  | 'servers';

export default function DashboardPage() {
  const params = useParams<{ serverId: string }>();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] =
    useState<DashboardSection>('dashboard');
  const { user } = useUser();
  // On mount, check for ?tab=moderation
  React.useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveSection(tab as DashboardSection);
    }
    // eslint-disable-next-line
  }, []);
  const servers = useQuery(
    api.discord.getUserServers,
    user ? { userId: user.externalAccounts[0]?.providerUserId } : 'skip'
  );
  const selectedServer = servers?.find(s => s.serverId === params.serverId);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent serverId={params.serverId} />;
      case 'moderation':
        return <ModerationContent serverId={params.serverId} />;
      case 'members':
        return <MembersContent serverId={params.serverId} />;
      case 'commands':
        return <CommandsContent serverId={params.serverId} />;
      case 'settings':
        return <SettingsContent serverId={params.serverId} />;
      default:
        return <DashboardContent serverId={params.serverId} />;
    }
  };

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

      <SidebarProvider>
        <div className='relative z-10 flex min-h-screen w-full'>
          <AppSidebar
            user={user}
            servers={servers ?? []}
            selectedServer={selectedServer}
            activeSection={activeSection}
            onSectionChange={(section: string) =>
              setActiveSection(section as DashboardSection)
            }
          />
          <main className='flex-1 overflow-hidden'>{renderContent()}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
