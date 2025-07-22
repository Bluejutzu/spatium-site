import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { DiscordAPI } from '@/features/discord';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const { userId: authenticatedUserId } = await auth();
	const serverId = searchParams.get('serverId');
	const userId = searchParams.get('userId');
	const client = await clerkClient();

	if (!serverId) {
		return NextResponse.json({ error: 'Missing serverId' }, { status: 400 });
	}

	if (!authenticatedUserId || !userId || authenticatedUserId !== userId) {
		return NextResponse.json(
			{ error: 'Unauthorized - Invalid or mismatched user ID' },
			{ status: 401 }
		);
	}

	const OauthData = await client.users.getUserOauthAccessToken(
		authenticatedUserId,
		'discord'
	);

	if (!OauthData.data?.length || !OauthData.data[0]?.token) {
		return NextResponse.json(
			{ error: 'No valid Discord token found. Please re-authenticate.' },
			{ status: 500 }
		);
	}

	try {
		const accessToken = OauthData.data[0].token;
		const discordApi = new DiscordAPI(accessToken);
		const channels = await discordApi.getGuildChannelsWithBotToken(serverId);
		return NextResponse.json(channels);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: 'Failed to fetch channels' },
			{ status: 500 }
		);
	}
}
