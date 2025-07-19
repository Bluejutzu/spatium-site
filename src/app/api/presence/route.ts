import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PresenceCache } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get('serverId');
    const targetUserId = searchParams.get('userId');

    if (!serverId) {
      return NextResponse.json({ error: 'Server ID is required' }, { status: 400 });
    }

    if (targetUserId) {
      // Get specific user's presence
      const presence = await PresenceCache.getPresence(targetUserId, serverId);
      return NextResponse.json({ presence });
    } else {
      // Get all presences for the server
      const presences = await PresenceCache.getServerPresences(serverId);
      return NextResponse.json({ presences });
    }
  } catch (error) {
    console.error('Error fetching presence:', error);
    return NextResponse.json(
      { error: 'Failed to fetch presence data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { serverId, status, activities, clientStatus } = body;

    if (!serverId || !status) {
      return NextResponse.json(
        { error: 'Server ID and status are required' },
        { status: 400 }
      );
    }

    await PresenceCache.setPresence(userId, serverId, {
      status,
      activities: activities || [],
      clientStatus,
      lastUpdated: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting presence:', error);
    return NextResponse.json(
      { error: 'Failed to set presence data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get('serverId');

    if (!serverId) {
      return NextResponse.json({ error: 'Server ID is required' }, { status: 400 });
    }

    await PresenceCache.deletePresence(userId, serverId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting presence:', error);
    return NextResponse.json(
      { error: 'Failed to delete presence data' },
      { status: 500 }
    );
  }
}
