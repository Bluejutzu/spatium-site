'use client';

import { useUser } from '@clerk/nextjs';
import { profile } from 'console';
import { useQuery } from 'convex/react';
import { Loader2, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { ForceReleaseModal } from '@/components/commands/ForceReleaseModal';
import { useCommandSession } from '@/hooks/use-command-session';
import { useToast } from '@/hooks/use-toast';
import { isPromise } from '@/lib/utils';
import { useDiscordCache } from '@/store/discordCache';

import { api } from '../../../../../../convex/_generated/api';
import CommandFlowBuilder from './CommandFlowBuilder';

export default function CommandBuilderPage({ params }: any) {
  const unwrappedParams = isPromise(params) ? React.use(params) : params;
  const serverId = unwrappedParams?.serverId || '';
  const searchParams = new URLSearchParams(window?.location?.search || '');
  const commandId = searchParams.get('commandId') || '';
  const [showTimeout, setShowTimeout] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [forceReleaseAdmin, setForceReleaseAdmin] = React.useState<
    string | null
  >(null);
  const [showForceReleaseModal, setShowForceReleaseModal] =
    React.useState(false);
  const lastNotificationRef = React.useRef<string | null>(null);
  const router = useRouter();
  const { user } = useUser();

  const { error } = useToast();

  // Only initialize session when we have all required data
  const { isEditing, currentEditor, acquire, release } = useCommandSession(
    commandId && user?.id ? commandId : '',
    user?.id || '',
    serverId
  );

  // Handle session initialization
  React.useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const initSession = async () => {
      try {
        // Only try to acquire a session if we're editing an existing command
        if (commandId) {
          const acquired = await acquire();
          if (!acquired) {
            // If we couldn't acquire the session, router.back() is called in the hook
            return;
          }
          console.log('Session acquired successfully');
        }

        if (mounted) {
          setLoading(false);
          console.log('Session mounted successfully');
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        if (mounted) {
          setLoading(false);
          setShowTimeout(true);
        }
      }
    };

    initSession();

    return () => {
      mounted = false;
    };
  }, [user?.id, commandId, acquire]);

  // Handle loading timeout separately
  React.useEffect(() => {
    if (!loading) return;

    const timeoutId = setTimeout(() => {
      setShowTimeout(true);
      console.log('Loading took too long, showing timeout message');
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [loading]);
  // Subscribe to session events
  const lastSessionEvent = useQuery(
    api.commandSessions.getLastSessionEvent,
    commandId ? { commandId } : 'skip'
  );

  React.useEffect(() => {
    const fetchAdminUser = async () => {
      if (
        lastSessionEvent?.type === 'FORCE_RELEASE' &&
        lastSessionEvent.adminId &&
        lastNotificationRef.current !== lastSessionEvent._id.toString()
      ) {
        try {
          // Fetch admin user directly from Discord API
          const response = await fetch(
            `/api/discord/user?userId=${lastSessionEvent.adminId}`
          );
          if (!response.ok) throw new Error('Failed to fetch admin user');

          const adminUser = await response.json();
          setForceReleaseAdmin(adminUser.username);
          setShowForceReleaseModal(true);

          // Mark this event as handled
          lastNotificationRef.current = lastSessionEvent._id.toString();
        } catch (err) {
          console.error('Failed to fetch admin user:', err);
          setForceReleaseAdmin('Admin');
          setShowForceReleaseModal(true);
          lastNotificationRef.current = lastSessionEvent._id.toString();
        }
      }
    };

    fetchAdminUser();
  }, [lastSessionEvent]);

  // Handle cleanup on page unload or final unmount
  React.useEffect(() => {
    const cleanup = (source: string) => {
      // Only release the session if we're in an active editing state
      if (commandId && user?.id && isEditing && !loading) {
        console.log('Cleaning up session on page unload');
        release(source);
        console.log('Session released - page closed or navigated away');
      }
    };

    // Add a beforeunload listener to ensure cleanup on page unload
    window.addEventListener('beforeunload', () => cleanup('beforeunload'));

    return () => {
      window.removeEventListener('beforeunload', () => cleanup('beforeunload'));
      // Only do final cleanup if we're actually unmounting (page navigation/close)
      if (!window.document.body.contains(document.activeElement)) {
        console.log('Final cleanup on component unmount');
        cleanup('window.document');
      }
    };
  }, [commandId, user?.id, isEditing, release, loading]);

  if (loading) {
    return (
      <div className='bg-discord-dark min-h-screen flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4 text-white'>
          <Loader2 className='h-8 w-8 animate-spin text-discord-blurple' />
          <p className='text-discord-text'>Loading builder...</p>
          {showTimeout && (
            <div className='flex flex-col items-center gap-2 mt-4'>
              <p className='text-discord-text text-sm'>
                This is taking a bit long...
              </p>
              <button
                className='px-4 py-2 rounded bg-discord-blurple text-white font-bold hover:bg-discord-blurple/80 transition'
                onClick={() =>
                  router.push(`/dashboard/${serverId}?tab=commands`)
                }
              >
                Go back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-discord-darker min-h-screen'>
      <CommandFlowBuilder serverId={serverId} />
      {showForceReleaseModal && (
        <ForceReleaseModal
          adminUsername={forceReleaseAdmin || 'Admin'}
          lastSessionEvent={lastSessionEvent}
          onClose={() => {
            setShowForceReleaseModal(false);
            router.push(`/dashboard/${serverId}?tab=commands`);
          }}
        />
      )}
    </div>
  );
}
