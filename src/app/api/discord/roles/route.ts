import { NextRequest, NextResponse } from "next/server";
import { DiscordAPI } from "@/features/discord";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const userId = searchParams.get("userId");
    const { userId: clerkUserId } = await auth();
    const client = await clerkClient();

    if (!clerkUserId || clerkUserId !== userId) {
        return NextResponse.json({ error: 'Unauthorized - No User ID or unequal' }, { status: 401 });
    }

    const OauthData = await client.users.getUserOauthAccessToken(
        userId,
        'discord'
    );
    const discordToken = OauthData.data[0].token;

    if (!OauthData.data?.length || !OauthData.data[0]?.token) {
        return NextResponse.json(
            { error: 'No valid Discord token found. Please re-authenticate.' },
            { status: 401 }
        );
    }

    if (!serverId) {
        return NextResponse.json({ error: "Missing serverId" }, { status: 400 });
    }

    try {
        const discordApi = new DiscordAPI(discordToken)
        const roles = await discordApi.getGuildRolesWithBotToken(serverId)
        return NextResponse.json(roles);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
    }
}
