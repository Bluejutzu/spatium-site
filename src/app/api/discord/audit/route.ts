import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { DiscordAPI } from '@/features/discord';

// Discord audit log action types for moderation
const MODERATION_ACTION_TYPES = [
	22, // MEMBER_BAN_ADD
	23, // MEMBER_BAN_REMOVE
	20, // MEMBER_KICK
	24, // MEMBER_UPDATE (timeout)
	// Add more as needed
];

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const { userId: authenticatedUserId } = await auth();
	const serverId = searchParams.get('serverId');
	const userId = searchParams.get('userId');

	console.log(userId, authenticatedUserId)

	if (!authenticatedUserId || !userId || authenticatedUserId !== userId) {
		return NextResponse.json(
			{ error: 'Unauthorized - Invalid or mismatched user ID' },
			{ status: 401 }
		);
	}

	if (!serverId) {
		return NextResponse.json({ error: 'Missing serverId' }, { status: 400 });
	}

	try {
		const discordApi = new DiscordAPI('');
		const auditLogs = await discordApi.getGuildAuditLogsWithBotToken(serverId, { limit: 50 });
		// Filter for moderation actions
		const filtered = auditLogs.audit_log_entries.filter((entry: any) => MODERATION_ACTION_TYPES.includes(entry.action_type));
		return NextResponse.json(filtered);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: 'Failed to fetch audit logs' },
			{ status: 500 }
		);
	}
}
