'use client';

import React from 'react';

import { PlaygroundCommandFlowBuilder } from '@/components/playground/PlaygroundCommandFlowBuilder';

export default function PlaygroundPage() {
  return (
    <div className='bg-discord-darker min-h-screen'>
      <PlaygroundCommandFlowBuilder />
    </div>
  );
}
