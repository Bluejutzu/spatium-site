'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { useEffect } from 'react';
import { api } from '../../../convex/_generated/api';

export function SyncClerkToConvex() {
  const { user, isLoaded } = useUser();
  const syncUser = useMutation(api.users.syncUser);
  // Fetch the current user from Convex by Clerk ID
  const dbUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : 'skip'
  );

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
          user.externalAccounts[0]?.provider
      );
    }

    // Prepare the user data to sync
    const userData = {
      clerkId: user.id,
      discordUserId: discordAccount.providerUserId,
      username: discordAccount.username || user.username || '',
      email:
        discordAccount.emailAddress ||
        user.primaryEmailAddress?.emailAddress ||
        '',
      avatarUrl: discordAccount.imageUrl || user.imageUrl,
    };

    // Only sync if dbUser is undefined (no entry) or if any field is different
    const shouldSync =
      !dbUser ||
      dbUser.discordUserId !== userData.discordUserId ||
      dbUser.username !== userData.username ||
      dbUser.email !== userData.email ||
      dbUser.avatarUrl !== userData.avatarUrl;

    console.log(`[SHOULDSYNC] ${shouldSync}`);

    if (shouldSync) {
      syncUser(userData);
      syncDiscordData(user.id);
    }
  }, [isLoaded, user, dbUser, syncUser]);

  const syncDiscordData = async (userId: string) => {
    console.log(`[SYNCDISCORDATA:userId] ${userId}`);
    try {
      const response = await fetch('/api/discord/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        console.log('Failed to sync Discord data:', response.statusText);
      } else {
        const result = await response.json();
        console.log('Discord sync successful:', result);
      }
    } catch (error) {
      console.log('Failed to sync Discord data:', error);
    }
  };

  return null;
}
