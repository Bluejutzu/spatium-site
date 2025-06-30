'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../app/sidebar';
import { DashboardContent } from './dashboard-content';

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full bg-discord-dark'>
        <AppSidebar />
        <main className='flex-1'>
          <DashboardContent />
        </main>
      </div>
    </SidebarProvider>
  );
}
