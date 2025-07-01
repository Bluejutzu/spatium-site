'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardContent } from './dashboard-content';
import { FloatingSidebar } from '@/components/app/floating-sidebar';

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full bg-discord-dark'>
        <FloatingSidebar />
        <main className='flex-1'>
          <DashboardContent />
        </main>
      </div>
    </SidebarProvider>
  );
}
