'use client';

import { Loader2 } from 'lucide-react';
import React from 'react';

export default function Loading() {
  return (
    <div className='min-h-screen bg-discord-darker flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <Loader2 className='h-8 w-8 animate-spin text-discord-blurple' />
        <p className='text-discord-text'>Loading admin dashboard...</p>
      </div>
    </div>
  );
}
