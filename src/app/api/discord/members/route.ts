import { NextRequest, NextResponse } from 'next/server';
import { DiscordAPI } from '@/features/discord/api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get('serverId');
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const after = searchParams.get('after') || undefined;
  const search = searchParams.get('search') || undefined;

  if (!serverId) {
    return NextResponse.json({ error: 'Missing serverId' }, { status: 400 });
  }

  try {
    const discordApi = new DiscordAPI(process.env.DISCORD_BOT_TOKEN!);
    const members = await discordApi.getGuildMembersWithBotToken(serverId, limit, after);
    let filtered = members;
    if (search) {
      const s = search.toLowerCase();
      filtered = members.filter(m =>
        m.user?.username?.toLowerCase().includes(s) ||
        m.nick?.toLowerCase().includes(s)
      );
    }
    return NextResponse.json({ members: filtered, total: null });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}
