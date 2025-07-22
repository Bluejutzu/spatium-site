import { auth } from '@clerk/nextjs/server';
import { ConvexClient } from 'convex/browser';
import { NextRequest, NextResponse } from 'next/server';
import { Commands } from 'spatium-types';

import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';


async function getCommandById(shareCode: string): Promise<Commands | null> {
	try {
		const convexClient = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
		const command = await convexClient.query(api.discord.getCommandViaShare, { shareCode: shareCode as Id<"commands"> });
		if (!command) return null;
		return command as unknown as Commands;
	} catch (err) {
		console.error("Error fetching command:", err);
		return null;
	}
}


export async function GET(req: NextRequest) {
	await auth.protect();

	// Extract commandId from the URL
	const commandId = req.nextUrl.pathname.split('/').pop();

	if (!commandId) {
		return NextResponse.json({ error: 'Command ID is required' }, { status: 400 });
	}

	const command = await getCommandById(commandId);
	if (!command) {
		return NextResponse.json({ error: 'Command not found' }, { status: 404 });
	}
	return NextResponse.json({
		name: command.name,
		description: command.description,
		blocks: command.blocks,
		cooldown: command.cooldown || 0,
		options: command.options || [],
	});
}
