import { ConvexHttpClient } from 'convex/browser';
import { NextRequest } from 'next/server';

import { api } from '../../../../../convex/_generated/api';

export const runtime = 'edge';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const discordId = searchParams.get('discordId');

  if (!discordId) {
    return new Response(JSON.stringify({ error: 'Discord ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { user, success, error } = await convex.query(
      api.users.getUserByDiscordId,
      {
        discordUserId: discordId,
      }
    );

    if (!success) {
      return new Response(JSON.stringify({ error }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        username: user.username,
        email: user.email || '',
        clerkId: user.clerkId,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user information' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
