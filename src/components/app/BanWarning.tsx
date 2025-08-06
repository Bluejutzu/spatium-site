'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface BanWarningProps {
  serverName: string;
  banReason: string;
  banDate: string;
}

export function BanWarning({
  serverName,
  banReason,
  banDate,
}: BanWarningProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  if (!isOpen) {
    router.back();
    return null;
  }

  return (
    <div className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center'>
      <div className='bg-discord-dark rounded-lg p-8 max-w-2xl w-full mx-4 relative border border-red-500/20'>
        <button
          onClick={() => setIsOpen(false)}
          className='absolute top-4 right-4 text-discord-text hover:text-white transition'
        >
          <X className='h-6 w-6' />
        </button>

        <div className='flex flex-col items-center gap-6 text-center'>
          <div className='h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center'>
            <X className='h-12 w-12 text-red-500' />
          </div>

          <h2 className='text-2xl font-bold text-white'>Server Banned</h2>

          <div className='space-y-4 text-discord-text'>
            <p className='text-lg'>
              <span className='text-white font-semibold'>{serverName}</span> was
              banned for:
            </p>
            <p className='text-red-400 text-lg font-medium px-4 py-2 bg-red-500/10 rounded'>
              {banReason}
            </p>
            <p className='text-sm'>
              Banned on {new Date(banDate).toLocaleDateString()}
            </p>
          </div>

          <div className='space-y-2'>
            <p className='text-sm text-discord-text'>
              If you believe this was a mistake, please contact support to
              appeal this ban.
            </p>
            <a
              href='mailto:support@spatium.com'
              className='text-discord-blurple hover:underline text-sm'
            >
              support@spatium.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
