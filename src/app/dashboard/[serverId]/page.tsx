'use client';

import { DashboardContent } from '@/features/dashboard';
import { use } from 'react';

interface DashboardPageProps {
  params: Promise<{ serverId: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { serverId } = use(params);
  return <DashboardContent serverId={serverId} />;
}
