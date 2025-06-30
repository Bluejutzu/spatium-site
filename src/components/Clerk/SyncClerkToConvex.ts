'use client';

import { useClerk, useSignIn, useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useEffect } from 'react';
import { api } from '../../../convex/_generated/api';

export default function SyncClerkToConvex() {
  const { user, isLoaded } = useUser();
  const { signOut, session } = useClerk();
  const { signIn } = useSignIn();
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (!isLoaded || !user) {
      return console.log('No user or loading state is false ', isLoaded);
    }

    const discordAccount = user.externalAccounts.find(
      acc => acc.provider.toString() === 'discord'
    );

    if (!discordAccount) {
      return console.log(
        'No discord account found on the user ' +
          user.externalAccounts[0].provider
      );
    }

    syncUser({
      clerkId: user.id,
      discordUserId: discordAccount.providerUserId,
      username: discordAccount.username || user.username || '',
      email:
        discordAccount.emailAddress ||
        user.primaryEmailAddress?.emailAddress ||
        '',
      avatarUrl: discordAccount.imageUrl || user.imageUrl,
    });

    syncDiscordData(user.id);
  }, [isLoaded, user, syncUser]);

  const syncDiscordData = async (userId: string) => {
    try {
      const response = await fetch('/api/discord/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.status === 401 || 400) {
        // if (session?.id) {
        //     await signOut({ sessionId: session.id });
        // } else {
        //     await signOut();
        //     await signIn?.authenticateWithRedirect({
        //         strategy: "oauth_discord",
        //         redirectUrl: "/",
        //         redirectUrlComplete: "/"
        //     });
        // }
        // return
      } else if (!response.ok) {
        console.error('Failed to sync Discord data:', response.statusText);
      } else {
        const result = await response.json();
        console.log('Discord sync successful:', result);
      }
    } catch (error) {
      console.error('Failed to sync Discord data:', error);
    }
  };

  return null;
}
