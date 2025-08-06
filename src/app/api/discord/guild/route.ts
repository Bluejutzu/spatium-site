import { NextRequest, NextResponse } from 'next/server';

import { DiscordAPI } from '@/features/discord/api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get('serverId');
  if (!serverId) {
    return NextResponse.json({ error: 'Missing serverId' }, { status: 400 });
  }
  try {
    const discordApi = new DiscordAPI('');
    const guild = await discordApi.getGuildWithBotToken(serverId);
    return NextResponse.json(guild);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch guild' },
      { status: 500 }
    );
  }
}
