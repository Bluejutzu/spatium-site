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
import React from 'react';

import { DiscordFooter } from '@/components/app/footer';
import { AnimatedHeader } from '@/components/app/header';
import { Badge } from '@/components/ui/badge';
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
  const [hasError, setHasError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const servers = useQuery(
    api.discord.getUserServers,
    user ? { userId: user.externalAccounts[0]?.providerUserId } : 'skip'
  );

  React.useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setLoading(false);
      setHasError(false);
    }
  }, [isLoaded, user]);

  React.useEffect(() => {
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

  if (!isLoaded) {
    return (
      <div className='bg-discord-dark font-minecraft min-h-screen flex items-center justify-center'>
        <div className='flex items-center gap-3 text-white'>
          <Loader2 className='h-6 w-6 animate-spin text-discord-blurple' />
          <span className='text-xl'>Loading your servers...</span>
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
      <div className='bg-discord-dark font-minecraft min-h-screen flex items-center justify-center'>
        <div className='flex items-center gap-3 text-white'>
          <Loader2 className='h-6 w-6 animate-spin text-discord-blurple' />
          <span className='text-xl'>Loading your servers...</span>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className='bg-discord-dark font-minecraft min-h-screen flex items-center justify-center'>
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
    <div className="bg-discord-dark overflow-hidden font-minecraft min-h-screen">
      {/* Enhanced Atmospheric Background */}
      <div className='fixed inset-0 z-0'>
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
            <motion.div
              className='text-center mb-20'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className='text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-tight tracking-tight'>
                <span className='block mb-4'>YOUR</span>
                <span className='block bg-gradient-to-r from-discord-blurple via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text'>
                  COMMUNITIES
                </span>
              </h1>
              <p className='text-xl md:text-2xl text-discord-text max-w-4xl mx-auto mb-12 leading-relaxed font-medium'>
                Monitor, manage, and optimize your Discord servers
              </p>
            </motion.div>

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

                <CardContent className='p-8'>
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
                            <CardContent className='p-6'>
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

            {/* Scroll Indicator */}
            {servers && servers.length > 0 && (
              <motion.div
                className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              >
                <ArrowDown className='h-6 w-6 text-discord-text/60' />
              </motion.div>
            )}
          </div>
        </section>

        {/* Enhanced Getting Started Section */}
        <section className='min-h-screen flex items-center justify-center py-20'>
          <div className='w-full max-w-7xl mx-auto px-6'>
            <motion.div
              className='text-center mb-20'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className='mb-8 bg-discord-yellow/20 text-discord-yellow border-discord-yellow/30 px-6 py-3 font-bold text-lg'>
                <Star className="mr-2 h-5 w-5" />
                GETTING STARTED
              </Badge>
              <h2 className='text-5xl md:text-7xl font-black text-white mb-8 leading-tight'>
                EXPAND YOUR
                <br />
                <span className='bg-gradient-to-r from-discord-yellow via-orange-500 to-red-500 bg-clip-text text-transparent glow-text'>
                  INFLUENCE
                </span>
              </h2>
              <p className='text-xl text-discord-text max-w-3xl mx-auto'>
                Follow these steps to add our bot to your Discord servers and
                unlock the full potential of your communities.
              </p>
            </motion.div>

            <div className='flex justify-center mb-20'>
              <div className='grid md:grid-cols-3 gap-10 max-w-6xl w-full'>
                {[
                  {
                    step: '01',
                    title: 'INVITE THE BOT',
                    description: 'Click the invite link and select your Discord server. Grant the necessary permissions for full functionality and advanced features.',
                    icon: Plus,
                    accent: 'discord-blurple',
                    features: ['Administrator permissions', 'Message management', 'Role management', 'Channel access'],
                  },
                  {
                    step: '02',
                    title: 'CONFIGURE SETTINGS',
                    description: 'Customize bot behavior, set up moderation rules, and configure automated workflows tailored to your community needs.',
                    icon: Settings,
                    accent: 'discord-green',
                    features: ['Welcome messages', 'Auto-moderation', 'Role automation', 'Custom commands'],
                  },
                  {
                    step: '03',
                    title: 'MONITOR & OPTIMIZE',
                    description: 'Use real-time analytics to track engagement, optimize performance, and grow your community strategically with data-driven insights.',
                    icon: BarChart3,
                    accent: 'discord-yellow',
                    features: ['Real-time analytics', 'Growth tracking', 'Engagement metrics', 'Performance reports'],
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    className="group"
                  >
                    <Card className='discord-card h-full text-center border-2 border-discord-border/50 hover:border-discord-blurple/50 transition-all duration-500 overflow-hidden relative'>
                      {/* Step number background */}
                      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-${step.accent}/20 to-${step.accent}/5 rounded-bl-3xl flex items-start justify-end p-3`}>
                        <span className={`text-2xl font-black text-${step.accent}/40`}>
                          {step.step}
                        </span>
                      </div>

                      <CardContent className='p-8 relative z-10'>
                        <div
                          className={`p-6 rounded-2xl bg-gradient-to-r from-${step.accent}/20 to-${step.accent}/10 w-fit mx-auto mb-8 border border-${step.accent}/30`}
                        >
                          <step.icon className={`h-10 w-10 text-${step.accent}`} />
                        </div>

                        <h3 className='text-2xl font-bold text-white mb-6 tracking-wide group-hover:text-discord-blurple transition-colors duration-300'>
                          {step.title}
                        </h3>
                        <p className='text-discord-text leading-relaxed mb-8 text-lg'>
                          {step.description}
                        </p>

                        {/* Feature list */}
                        <div className="space-y-3">
                          {step.features.map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-center gap-3 text-sm"
                            >
                              <div className={`w-2 h-2 rounded-full bg-${step.accent}`} />
                              <span className="text-discord-text group-hover:text-white transition-colors duration-300">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              className='text-center'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <a
                  href={DISCORD_INVITE_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button className="bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-12 py-6 rounded-2xl text-xl shadow-2xl hover:shadow-discord-blurple/30 transition-all duration-300">
                    BEGIN EXPANSION
                    <Sparkles className="ml-3 h-6 w-6" />
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      <DiscordFooter />
    </div>
  );
}
