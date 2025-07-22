import { useUser } from '@clerk/nextjs';
import { useEffect,useState } from 'react';

import type { DiscordPresence } from '@/types/discord';

export function useUserPresence(serverId: string) {
  const { user } = useUser();
  const [presence, setPresence] = useState<DiscordPresence | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresence = async () => {
      if (!user || !user.externalAccounts[0]?.providerUserId || !serverId) {
        setPresence(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:4000/v1/presence?serverId=${serverId}&userId=${user.externalAccounts[0].providerUserId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch presence data');
        }
        const data = await response.json();
        if (data.status) {
          const discordPresence: DiscordPresence = {
            user: {
              id: user.externalAccounts[0].providerUserId,
              username: user.username || '',
              discriminator: '0',
              avatar: user.imageUrl || null,
            },
            status: data.status,
            activities: data.activities || [],
            client_status: data.clientStatus || {},
          };
          setPresence(discordPresence);
        } else {
          setPresence(null);
        }
      } catch (err) {
        console.error('Error fetching presence:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setPresence(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresence();
    const interval = setInterval(fetchPresence, 30000);
    return () => clearInterval(interval);
  }, [user, serverId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-discord-green';
      case 'idle':
        return 'bg-discord-yellow';
      case 'dnd':
        return 'bg-discord-red';
      case 'offline':
        return 'bg-discord-text/50';
      default:
        return 'bg-discord-text/50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'idle':
        return 'Idle';
      case 'dnd':
        return 'Do Not Disturb';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return {
    presence,
    status: presence?.status || 'offline',
    activities: presence?.activities || [],
    statusColor: getStatusColor(presence?.status || 'offline'),
    statusText: getStatusText(presence?.status || 'offline'),
    isLoading,
    error,
  };
}
