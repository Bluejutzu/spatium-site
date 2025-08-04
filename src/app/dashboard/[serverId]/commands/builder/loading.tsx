"use client "

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { isPromise } from '@/lib/utils';

export default function Loading({ params }: any) {
  const unwrappedParams = isPromise(params)
    ? React.use(params)
    : params;
  const serverId = unwrappedParams?.serverId || '';

  const FIVE_SECONDS = 5000;

  const [showTimeout, setShowTimeout] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, FIVE_SECONDS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='bg-discord-dark min-h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4 text-white'>
        <Loader2 className='h-8 w-8 animate-spin text-discord-blurple' />
        <p className='text-discord-text'>Loading builder...</p>
        {showTimeout && (
          <div className='flex flex-col items-center gap-2 mt-4'>
            <p className='text-discord-text text-sm'>This is taking a bit long...</p>
            <button
              className='px-4 py-2 rounded bg-discord-blurple text-white font-bold hover:bg-discord-blurple/80 transition'
              onClick={() => router.push(`/dashboard/${serverId}`)}
            >
              Go back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
