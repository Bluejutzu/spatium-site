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
