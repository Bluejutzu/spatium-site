import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { DiscordAPI } from '@/features/discord';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get('serverId');

  if (!serverId) {
    return NextResponse.json({ error: 'Missing serverId' }, { status: 400 });
  }

  try {
    const discordApi = new DiscordAPI('');
    const roles = await discordApi.getGuildRolesWithBotToken(serverId);
    return NextResponse.json(roles);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}
