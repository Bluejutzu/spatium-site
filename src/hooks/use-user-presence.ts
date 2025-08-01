import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

import type { DiscordPresence } from '@/types/discord';

export function useUserPresence(serverId: string): ReturnType<typeof IUseUserPresence>;
export function useUserPresence(serverId: string, userId: string): ReturnType<typeof IUseUserPresence>;

export function useUserPresence(serverId: string, userId?: string) {
	return IUseUserPresence(serverId, userId);
}

function IUseUserPresence(serverId: string, userId?: string) {
	const { user: clerkUser } = useUser();

	const [presence, setPresence] = useState<DiscordPresence | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [userNotFound, setUserNotFound] = useState(false);

	useEffect(() => {
		const fetchPresence = async () => {
			let userIdToUse = userId;

			// Use Clerk user if no userId is passed
			if (!userIdToUse && clerkUser) {
				userIdToUse = clerkUser.externalAccounts[0]?.providerUserId;
			}

			if (!userIdToUse || !serverId) {
				setPresence(null);
				return;
			}

			// Don't fetch if user was previously not found (to avoid repeated 404s)
			if (userNotFound) {
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				let userData: DiscordPresence['user'];

				if (userId) {
					// Fetch user via API route
					const userRes = await fetch(`http://localhost:3000/api/discord/user?userId=${userId}`);
					if (!userRes.ok) {
						if (userRes.status === 404) {
							setUserNotFound(true);
							setPresence(null);
							return;
						}
						throw new Error('Failed to fetch user data');
					}
					const json = await userRes.json();

					userData = {
						id: json.id,
						username: json.username,
						discriminator: json.discriminator ?? '0',
						avatar: json.avatar ?? null,
					};
				} else {
					// Use Clerk user
					userData = {
						id: userIdToUse!,
						username: clerkUser?.username || '',
						discriminator: '0',
						avatar: clerkUser?.imageUrl || null,
					};
				}

				// Fetch presence
				const presenceRes = await fetch(
					`http://localhost:4000/v1/presence?serverId=${serverId}&userId=${userIdToUse}`
				);

				if (!presenceRes.ok) {
					if (presenceRes.status === 404) {
						// User no longer exists in server, stop polling
						setUserNotFound(true);
						setPresence(null);
						return;
					}
					throw new Error('Failed to fetch presence data');
				}

				const presenceJson = await presenceRes.json();

				if (presenceJson.status) {
					const discordPresence: DiscordPresence = {
						user: userData,
						status: presenceJson.status,
						activities: presenceJson.activities || [],
						client_status: presenceJson.clientStatus || {},
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

		// Only set up polling if user exists in server
		if (!userNotFound) {
			const interval = setInterval(fetchPresence, 30000);
			return () => clearInterval(interval);
		}
	}, [serverId, userId, clerkUser, userNotFound]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'online': return 'bg-discord-green';
			case 'idle': return 'bg-discord-yellow';
			case 'dnd': return 'bg-discord-red';
			default: return 'bg-discord-text/50';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'online': return 'Online';
			case 'idle': return 'Idle';
			case 'dnd': return 'Do Not Disturb';
			case 'offline': return 'Offline';
			default: return 'Unknown';
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
		userNotFound,
	};
}
