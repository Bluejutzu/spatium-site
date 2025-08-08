'use client';

import { useMutation } from 'convex/react';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';

interface ForceReleaseModalProps {
  adminUsername: string;
  lastSessionEvent?: Doc<'sessionEvents'> | null;
  onClose?: () => void;
}

export function ForceReleaseModal({
  adminUsername,
  lastSessionEvent,
  onClose,
}: ForceReleaseModalProps) {
  const closeEvent = useMutation(api.commandSessions.closeSessionEvent);

  useEffect(() => {
    // Auto-close after 5 seconds
    const timeout = setTimeout(async () => {
      if (lastSessionEvent?._id) {
        await closeEvent({ eventId: lastSessionEvent._id });
      }
      // Always call onClose, regardless of whether we had a session event
      onClose?.();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [onClose, lastSessionEvent, closeEvent]);
  return (
    <div className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center'>
      <div className='bg-discord-dark rounded-lg p-8 max-w-xl w-full mx-4 relative border border-red-500/20'>
        <div className='flex flex-col items-center gap-6 text-center'>
          <div className='h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center'>
            <AlertTriangle className='h-8 w-8 text-red-500' />
          </div>

          <div className='space-y-4'>
            <h2 className='text-2xl font-bold text-white'>
              Session Terminated
            </h2>
            <p className='text-discord-text'>
              An administrator (
              <span className='text-discord-blurple'>{adminUsername}</span>) has
              forcefully released your editing session.
            </p>
            <button
              onClick={onClose}
              className='mt-4 px-4 py-2 bg-discord-blurple hover:bg-discord-blurple/80 text-white rounded-md transition-colors'
            >
              Close
            </button>
          </div>

          <p className='text-sm text-discord-text'>
            The modal will close in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
