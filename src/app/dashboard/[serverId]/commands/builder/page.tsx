'use client';

import React from 'react';

import { isPromise } from '@/lib/utils';

import CommandFlowBuilder from './CommandFlowBuilder';

export default function CommandBuilderPage({ params }: any) {
  const unwrappedParams = isPromise(params)
    ? React.use(params)
    : params;
  const serverId = unwrappedParams?.serverId || '';
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className='bg-discord-darker min-h-screen flex items-center justify-center'>
        <span className="text-white text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className='bg-discord-darker min-h-screen'>
      <CommandFlowBuilder serverId={serverId} />
    </div>
  );
}
