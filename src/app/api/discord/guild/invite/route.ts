import { NextRequest, NextResponse } from 'next/server';

import { DiscordAPI } from '@/features/discord/api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get('serverId');
  const with_counts = searchParams.get('with_counts');

  if (!serverId) {
    return NextResponse.json({ error: 'Missing serverId' }, { status: 400 });
  }

  try {
    const discordApi = new DiscordAPI('');
    const invites = await discordApi.getGuildInvitesWithBotToken(
      serverId,
      with_counts ?? '5'
    );
    return NextResponse.json(invites);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch invites' },
      { status: 500 }
    );
  }
}
