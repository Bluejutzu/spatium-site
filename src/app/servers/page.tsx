'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  BarChart3,
  Bot,
  Loader2,
  Plus,
  Settings,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { DiscordFooter } from '@/components/app/footer';
import { AnimatedHeader } from '@/components/app/header';
import { StaticNoise } from '@/components/ui/AnimatedNoise';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/hooks/use-toast';

import { api } from '../../../convex/_generated/api';

const DISCORD_INVITE_URL = `https://discord.com/oauth2/authorize?client_id=1384798729055375410&permissions=8&scope=bot%20applications.commands`;

export default function ServerPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const toast = useToast();
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTimeout, setShowTimeout] = useState(false);
  const servers = useQuery(
    api.discord.getUserServers,
    user ? { userId: user.externalAccounts[0]?.providerUserId } : 'skip'
  );

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setLoading(false);
      setHasError(false);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (!isLoaded || !user) return;

    if (servers === undefined) {
      setLoading(true);
      setHasError(false);
      return;
    }

    if (servers === null) {
      setHasError(true);
      setLoading(false);
      toast.error('Failed to fetch servers', 'There was a problem fetching your servers. Please try again later.');
      return;
    }

    setLoading(false);
    setHasError(false);
  }, [servers, user, isLoaded, toast]);

  const FIVE_SECONDS = 5000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, FIVE_SECONDS);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className='bg-discord-dark min-h-screen flex items-center justify-center'>
        <div className='flex items-center gap-3 text-white'>
          <Loader2 className='h-6 w-6 animate-spin text-discord-blurple' />
          <span className='text-xl'>Loading your servers...</span>
          {showTimeout && (
            <div className='flex flex-col items-center gap-2 mt-4'>
              <p className='text-discord-text text-sm'>This is taking a bit long...</p>
              <button
                className='px-4 py-2 rounded bg-discord-blurple text-white font-bold hover:bg-discord-blurple/80 transition'
                onClick={() => router.push(`/servers`)}
              >
                Go back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-discord-dark'>
        <div className='text-center'>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <Bot className='h-20 w-20 mx-auto mb-6 text-discord-blurple' />
          </motion.div>
          <h2 className='text-3xl font-semibold mb-4 text-white font-minecraft'>
            AUTHENTICATION REQUIRED
          </h2>
          <p className='text-discord-text text-lg'>
            Please sign in to view your servers
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='bg-discord-dark min-h-screen flex items-center justify-center'>
        <div className='flex items-center gap-3 text-white'>
          <Loader2 className='h-6 w-6 animate-spin text-discord-blurple' />
          <span className='text-xl'>Loading your servers...</span>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className='bg-discord-dark min-h-screen flex items-center justify-center'>
        <div className='flex flex-col items-center gap-3 text-white'>
          <Bot className='h-20 w-20 mb-4 text-discord-blurple' />
          <span className='text-2xl font-bold'>Failed to load servers</span>
          <span className='text-discord-text'>There was a problem fetching your servers. Please try again later.</span>
          <Button onClick={() => window.location.reload()} className='mt-4'>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-discord-dark overflow-hidden min-h-screen">
      {/* Enhanced Atmospheric Background */}
      <div className='fixed inset-0 z-0'>
        <StaticNoise
          opacity={.05}
        />
        <div className='absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black' />
        <div className='floating-orb floating-orb-1' />
        <div className='floating-orb floating-orb-2' />
        <div className='floating-orb floating-orb-3' />
      </div>

      <AnimatedHeader />

      {/* Main Content Container */}
      <div className='relative z-10 min-h-screen'>
        {/* Enhanced Hero Section */}
        <section className='min-h-screen flex items-center justify-center py-20 pt-32'>
          <div className='w-full max-w-7xl mx-auto px-6'>


            <div className='flex justify-center'>
              <Card className='discord-card border-2 border-white/10 w-full max-w-6xl backdrop-blur-xl'>
                <CardHeader className='border-b border-discord-border p-8'>
                  <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                    <CardTitle className='text-2xl font-bold text-white tracking-wide'>
                      ACTIVE SERVERS
                    </CardTitle>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <a
                        href={DISCORD_INVITE_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <Button className='discord-button-primary'>
                          <Plus className='h-4 w-4 mr-2' />
                          ADD BOT TO SERVER
                        </Button>
                      </a>
                    </motion.div>
                  </div>
                </CardHeader>

                <CardContent>
                  {servers && servers.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center'>
                      {servers.map((server) => (
                        <div key={server._id} className='w-full max-w-sm'>
                          <Card
                            className='discord-card hover:border-discord-border-hover transition-all duration-300 cursor-pointer group h-full'
                            onClick={() => router.push(`/dashboard/${server.serverId}`)}
                            tabIndex={0}
                            role="button"
                            style={{ outline: 'none' }}
                          >
                            <CardContent>
                              <div className='flex items-center gap-4 mb-1'>
                                <div className='relative'>
                                  <div className='w-12 h-12 bg-gradient-to-br from-discord-blurple to-discord-purple rounded-lg flex items-center justify-center text-white font-bold text-lg overflow-hidden'>
                                    {server.icon ? (
                                      <Image
                                        src={`https://cdn.discordapp.com/icons/${server.serverId}/${server.icon}.png`}
                                        alt={server.name}
                                        width={48}
                                        height={48}
                                        className='w-12 h-12 rounded-lg object-cover'
                                      />
                                    ) : (
                                      server.name.charAt(0).toUpperCase()
                                    )}
                                  </div>
                                  <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-discord-dark animate-pulse' />
                                </div>

                                <div className='flex-1 min-w-0'>
                                  <h3 className='font-bold text-white truncate group-hover:text-discord-blurple transition-colors'>
                                    {server.name}
                                  </h3>
                                  <div className='flex items-center gap-4 mt-1 text-sm text-discord-text'>
                                    <span className='flex items-center gap-1'>
                                      <Users className='h-3 w-3' />
                                      {server.memberCount.toLocaleString()}
                                    </span>
                                    <span className='flex items-center gap-1'>
                                      <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                                      {server.onlineCount} online
                                    </span>
                                  </div>

                                  <span className='flex items-center gap-1 text-xs text-discord-text/80'>
                                    Last Sync: {new Date(server.lastUpdated).toDateString()}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


      </div>

      <DiscordFooter />
    </div>
  );
}
