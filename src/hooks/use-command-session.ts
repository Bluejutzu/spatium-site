import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import { api } from '../../convex/_generated/api';

export function useCommandSession(
  commandId: string,
  userId: string,
  serverId: string
) {
  const router = useRouter();
  const acquireSession = useMutation(api.commandSessions.acquireSession);
  const releaseSession = useMutation(api.commandSessions.releaseSession);
  const keepAlive = useMutation(api.commandSessions.keepSessionAlive);
  const session = useQuery(api.commandSessions.getSession, { commandId });

  const acquire = useCallback(async () => {
    try {
      const result = await acquireSession({ commandId, userId, serverId });
      if (!result.success) {
        console.error('Failed to acquire session:', result.error);
        toast.error('This command is being edited by another user');
        router.back();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to acquire session:', error);
      toast.error('Failed to acquire editing session');
      return false;
    }
  }, [acquireSession, commandId, userId, serverId, router]);

  const release = useCallback(
    async (source: string) => {
      console.log(`Releasing session from ${source}`);
      try {
        await releaseSession({ commandId, userId });
      } catch (error) {
        console.error('Failed to release session:', error);
      }
    },
    [releaseSession, commandId, userId]
  );

  // Handle keep-alive
  useEffect(() => {
    if (!commandId || !userId || !session) return;

    let isActive = true;

    // Start keep-alive interval
    const interval = setInterval(
      async () => {
        if (isActive && session) {
          await keepAlive({ commandId, userId });
        }
      },
      5 * 60 * 1000
    );

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [commandId, userId, keepAlive, session]);

  // Handle cleanup on navigation/tab close
  useEffect(() => {
    if (!commandId || !userId) return;

    // Handle window unload event
    const handleUnload = () => {
      release('Releasing from page unload');
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      // Only release if the window is actually closing
      // or we're navigating away (no active window)
      if (!document.hasFocus()) {
        release('Releasing from page navigation');
      }
    };
  }, [commandId, userId, release]);

  return {
    isEditing: session?.userId === userId,
    currentEditor: session?.userId,
    acquire,
    release,
  };
}
