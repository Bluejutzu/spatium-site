'use client'

import { ReactNode, useEffect } from 'react'
import { ConvexReactClient, useMutation } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth, useUser } from '@clerk/nextjs'
import { api } from '../../convex/_generated/api'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
    const { user, isLoaded } = useUser();
    const syncUser = useMutation(api.users.syncUser);

    useEffect(() => {
        if (!isLoaded || !user) return;

        const discordAccount = user.externalAccounts.find(
            acc => acc.provider.toString() === 'oauth_discord'
        );

        if (!discordAccount) return;

        syncUser({
            clerkId: user.id,
            discordUserId: discordAccount.providerUserId,
            username: discordAccount.username || user.username || '',
            email: discordAccount.emailAddress || user.primaryEmailAddress?.emailAddress || '',
            avatarUrl: discordAccount.imageUrl || user.imageUrl,
        });
    }, [isLoaded, user]);

    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
        </ConvexProviderWithClerk>
    )
}