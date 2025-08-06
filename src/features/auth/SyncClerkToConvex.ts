'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { useEffect } from 'react';
import { User } from 'spatium-types';

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
    const syncUserData = async () => {
      // Skip if we're loading or no user
      if (!isLoaded || !user) {
        return;
      }

      const discordAccount = user.externalAccounts.find(
        acc => acc.provider.toString() === 'discord'
      );

      if (!discordAccount) {
        console.log('No discord account found');
        return;
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

      // If we have existing user data, check if anything needs updating
      if (dbUser?.success && dbUser.user) {
        const needsUpdate =
          dbUser.user.discordUserId !== userData.discordUserId ||
          dbUser.user.username !== userData.username ||
          dbUser.user.email !== userData.email ||
          dbUser.user.avatarUrl !== userData.avatarUrl;

        if (!needsUpdate) {
          console.log('User data is up to date');
          return;
        }
      }

      try {
        console.log('Syncing user data...');
        if (dbUser?.user) {
          debugChangedFields(dbUser.user, userData);
        }
        await syncUser(userData);
        // Sync Discord data
        try {
          const response = await fetch('/api/discord/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id }),
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
      } catch (error) {
        console.error('Failed to sync user:', error);
      }
    };

    syncUserData();
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

function debugChangedFields(
  dbUser: User,
  userData: {
    clerkId: string;
    discordUserId: string;
    username: string;
    email: string;
    avatarUrl: string;
  }
) {
  const changedFields: Record<string, { old: any; new: any }> = {};
  if (!dbUser || dbUser.discordUserId !== userData.discordUserId) {
    changedFields.discordUserId = {
      old: dbUser?.discordUserId,
      new: userData.discordUserId,
    };
  }
  if (!dbUser || dbUser.username !== userData.username) {
    changedFields.username = {
      old: dbUser?.username,
      new: userData.username,
    };
  }
  if (!dbUser || dbUser.email !== userData.email) {
    changedFields.email = { old: dbUser?.email, new: userData.email };
  }
  if (!dbUser || dbUser.avatarUrl !== userData.avatarUrl) {
    changedFields.avatarUrl = {
      old: dbUser?.avatarUrl,
      new: userData.avatarUrl,
    };
  }
  console.log('Changed fields:', changedFields);
}
