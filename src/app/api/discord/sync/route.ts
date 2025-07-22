import { auth, clerkClient } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { type NextRequest, NextResponse } from 'next/server';

import { DiscordAPI } from '@/features/discord';

import { api } from '../../../../../convex/_generated/api';


const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
	try {
		const { userId } = await request.json();
		const { userId: authenticatedUserId } = await auth();

		if (!authenticatedUserId || !userId || authenticatedUserId !== userId) {
			return NextResponse.json(
				{ error: 'Unauthorized - Invalid or mismatched user ID' },
				{ status: 401 }
			);
		}

		const client = await clerkClient();

		const OauthData = await client.users.getUserOauthAccessToken(
			userId,
			'discord'
		);
		const discordToken = OauthData.data[0].token;

		if (!OauthData.data?.length || !OauthData.data[0]?.token) {
			return NextResponse.json(
				{ error: 'No valid Discord token found. Please re-authenticate.' },
				{ status: 401 }
			);
		}

		const discordApi = new DiscordAPI(discordToken);

		const [botGuilds, userGuilds, discordUser] = await Promise.all([
			discordApi.getBotGuilds(),
			discordApi.getUserGuilds(),
			discordApi.getCurrentUser(),
		]);

		if (!discordUser) {
			console.error('Could not fetch user');
			return NextResponse.json(
				{ error: 'Could not fetch Discord user data' },
				{ status: 500 }
			);
		}

		const botGuildIds = new Set(botGuilds.map(g => g.id));
		const mutualGuilds = userGuilds.filter(guild => botGuildIds.has(guild.id));
		const ownedGuilds = mutualGuilds.filter(guild => guild.owner === true);

		const serverData = ownedGuilds.map(guild => ({
			serverId: guild.id,
			name: guild.name,
			icon: guild.icon,
			ownerId: discordUser.id,
			memberCount: guild.approximate_member_count,
			onlineCount: guild.approximate_presence_count,
			permissions: guild.permissions
				? parseInt(guild.permissions)
					.toString(2)
					.split('')
					.reverse()
					.map((v, i) => (v === '1' ? `BIT_${i}` : null))
					.filter(Boolean)
				: [],
			features: guild.features,
		}));

		await convex.mutation(api.discord.syncDiscordServers, {
			servers: serverData.map(server => ({
				...server,
				icon: server.icon ?? undefined,
				// ownerId is already set to userId above
				permissions: (server.permissions ?? []).filter(
					(p): p is string => typeof p === 'string'
				),

				features: (server.features ?? []).filter(
					(f: string): f is string => typeof f === 'string'
				),
				memberCount: Number(server.memberCount) || 0,
				onlineCount: Number(server.onlineCount) || 0,
				serverId: String(server.serverId),
				name: String(server.name),
			})),
		});

		return NextResponse.json({
			success: true,
			message: 'Discord servers synced successfully',
			serversCount: serverData.length,
		});
	} catch (error) {
		return NextResponse.json(
			{
				error: error,
				message:
					'An error occurred while syncing your Discord servers. Please try again.',
			},
			{ status: 500 }
		);
	}
}
