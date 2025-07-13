'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  Bot,
  Users,
  Activity,
  Settings,
  BarChart3,
  Plus,
  ExternalLink,
  Crown,
  Shield,
  TrendingUp,
  Sparkles,
  ArrowDown,
} from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DISCORD_INVITE_URL = `https://discord.com/oauth2/authorize?client_id=1384798729055375410&permissions=8&scope=bot%20applications.commands`;

const serverFeatures = [
  {
    icon: BarChart3,
    title: 'ADVANCED ANALYTICS',
    description:
      'Deep insights into member engagement, growth patterns, and community health metrics.',
    accent: 'discord-blurple',
  },
  {
    icon: Shield,
    title: 'SECURITY FORTRESS',
    description:
      'Multi-layered protection with automated moderation and threat detection systems.',
    accent: 'discord-green',
  },
  {
    icon: Settings,
    title: 'TOTAL AUTOMATION',
    description:
      'Streamline operations with intelligent workflows and custom command systems.',
    accent: 'discord-yellow',
  },
  {
    icon: Users,
    title: 'MEMBER MANAGEMENT',
    description:
      'Sophisticated onboarding, role management, and engagement tracking tools.',
    accent: 'discord-red',
  },
];

function AnimatedCounter({
  end,
  duration = 2000,
}: {
  end: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function ServersPage() {
  const { user } = useUser();
  const router = useRouter();
  const servers = useQuery(
    api.discord.getUserServers,
    user ? { userId: user.externalAccounts[0].providerUserId } : 'skip'
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-discord-dark'>
        <div className='text-center'>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <Bot className='h-16 w-16 mx-auto mb-4 text-discord-blurple' />
          </motion.div>
          <h2 className='text-2xl font-semibold mb-2 text-white font-minecraft'>
            AUTHENTICATION REQUIRED
          </h2>
          <p className='text-discord-text'>
            Please sign in to view your servers
          </p>
        </div>
      </div>
    );
  }

  const totalServers = servers?.length || 0;
  const totalMembers =
    servers?.reduce((acc, server) => acc + server.memberCount, 0) || 0;
  const totalOnline =
    servers?.reduce((acc, server) => acc + server.onlineCount, 0) || 0;

  return (
    <div
      className='bg-discord-dark overflow-hidden font-minecraft'
      ref={containerRef}
    >
      {/* Atmospheric Background */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black' />
        <motion.div
          className='absolute inset-0 bg-grid-pattern opacity-5'
          style={{ y }}
        />
        <div className='floating-orb floating-orb-1' />
        <div className='floating-orb floating-orb-2' />
        <div className='floating-orb floating-orb-3' />
      </div>

      {/* Main Content Container - Centered */}
      <div className='relative z-10 min-h-screen'>
        {/* Server Management Section */}
        <section className='min-h-screen flex items-center justify-center py-20 pt-40'>
          <div className='w-full max-w-7xl mx-auto px-6'>
            <motion.div
              className='text-center mb-16'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className='mb-8 bg-discord-green/20 text-discord-green border-discord-green/30 px-4 py-2 font-bold'>
                <Crown className='mr-2 h-4 w-4' />
                COMMAND CENTER ACTIVE
              </Badge>
              <h1 className='text-6xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tight'>
                <span className='block mb-4'>YOUR</span>
                <span className='block text-discord-blurple glow-text'>
                  COMMUNITIES
                </span>
              </h1>
              <p className='text-xl md:text-2xl text-discord-text max-w-4xl mx-auto mb-12 leading-relaxed font-medium'>
                Monitor, manage, and optimize your Discord empire with
                <br />
                <span className='text-white font-bold'>
                  maintained up-to-date moderation
                </span>
              </p>
            </motion.div>

            <div className='flex justify-center'>
              <Card className='discord-card border-2 border-white/10 w-full max-w-6xl'>
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
                      {servers.map((server, index) => (
                        <div key={server._id} className='w-full max-w-sm'>
                          <Link href={`/dashboard/${server.serverId}`}>
                            <Card className='discord-card hover:border-discord-border-hover transition-all duration-300 cursor-pointer group h-full'>
                              <CardContent className='p-6'>
                                <div className='flex items-center gap-4 mb-4'>
                                  <div className='relative'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-discord-blurple to-discord-purple rounded-lg flex items-center justify-center text-white font-bold text-lg overflow-hidden'>
                                      {server.icon ? (
                                        <img
                                          src={`https://cdn.discordapp.com/icons/${server.serverId}/${server.icon}.png`}
                                          alt={server.name}
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

                                <div className='grid grid-cols-1 gap-2 z-50'>
                                  <Button
                                    size='sm'
                                    variant='outline'
                                    className='discord-button-outline text-xs bg-transparent'
                                    onClick={() => {
                                      router.push(`/dashboard/${server.serverId}/settings`);
                                    }}
                                  >
                                    <Settings className='h-3 w-3 mr-1' />
                                    SETTINGS
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      className='text-center py-16'
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          damping: 20,
                          delay: 0.2,
                        }}
                      >
                        <Bot className='h-20 w-20 mx-auto mb-6 text-discord-blurple' />
                      </motion.div>

                      <h3 className='text-3xl font-bold text-white mb-4 font-minecraft'>
                        NO SERVERS DETECTED
                      </h3>
                      <p className='text-discord-text mb-8 max-w-2xl mx-auto text-lg'>
                        Your empire awaits expansion. Add our bot to your
                        Discord servers to begin managing your communities with
                        moderation tools and analytics.
                      </p>

                      <div className='space-y-6'>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 17,
                          }}
                        >
                          <a
                            href={DISCORD_INVITE_URL}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <Button
                              size='lg'
                              className='discord-button-primary text-lg px-8 py-4'
                            >
                              <ExternalLink className='h-5 w-5 mr-2' />
                              EXPAND YOUR EMPIRE
                            </Button>
                          </a>
                        </motion.div>

                        <div className='text-discord-text space-y-2'>
                          <p className='font-medium'>
                            Need help getting started?
                          </p>
                          <p className='text-sm'>
                            Ensure you have administrator permissions in your
                            Discord server before adding the bot.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Scroll Indicator */}
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
          </div>
        </section>

        {/* Stats Overview Section */}
        <section className='min-h-screen flex items-center justify-center py-20 bg-discord-darker/50'>
          <div className='w-full max-w-7xl mx-auto px-6'>
            <motion.div
              className='text-center mb-16'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className='mb-6 bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 px-4 py-2 font-bold'>
                EMPIRE STATISTICS
              </Badge>
              <h2 className='text-5xl md:text-6xl font-black text-white mb-6'>
                YOUR
                <br />
                <span className='text-discord-blurple glow-text'>DOMINION</span>
              </h2>
              <p className='text-xl text-discord-text max-w-3xl mx-auto'>
                Real-time insights into your Discord empire's reach, engagement,
                and growth across all managed communities.
              </p>
            </motion.div>

            {/* Enhanced Stats Grid - Centered */}
            <div className='flex justify-center mb-16'>
              <div className='grid md:grid-cols-3 gap-8 max-w-5xl w-full'>
                {[
                  {
                    title: 'TOTAL SERVERS',
                    value: totalServers,
                    icon: Bot,
                    accent: 'discord-blurple',
                    description: 'Communities under your command',
                    growth: '+2 this month',
                  },
                  {
                    title: 'TOTAL MEMBERS',
                    value: totalMembers,
                    icon: Users,
                    accent: 'discord-green',
                    description: 'Active community members',
                    growth: '+12% growth rate',
                  },
                  {
                    title: 'ONLINE NOW',
                    value: totalOnline,
                    icon: Activity,
                    accent: 'discord-orange',
                    description: 'Currently active members',
                    growth: `${Math.round((totalOnline / Math.max(totalMembers, 1)) * 100)}% engagement`,
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <Card className='discord-card border-2 border-white/10 h-full'>
                      <CardContent className='p-8 text-center'>
                        <motion.div
                          className={`p-4 rounded-xl bg-${stat.accent}/20 w-fit mx-auto mb-6`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 17,
                          }}
                        >
                          <stat.icon
                            className={`h-8 w-8 text-${stat.accent}`}
                          />
                        </motion.div>

                        <h3 className='text-lg font-bold text-white mb-2 tracking-wide'>
                          {stat.title}
                        </h3>

                        <div
                          className={`text-5xl font-black text-${stat.accent} mb-4 glow-text`}
                        >
                          <AnimatedCounter end={stat.value} />
                        </div>

                        <p className='text-discord-text mb-3'>
                          {stat.description}
                        </p>

                        <Badge
                          className={`bg-${stat.accent}/20 text-${stat.accent} border-${stat.accent}/30`}
                        >
                          <TrendingUp className='mr-1 h-3 w-3' />
                          {stat.growth}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions - Centered */}
            <div className='flex justify-center'>
              <motion.div
                className='grid md:grid-cols-4 gap-6 max-w-5xl w-full'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                {serverFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Card className='discord-card h-full'>
                      <CardContent className='p-6 text-center'>
                        <motion.div
                          className={`p-3 rounded-xl bg-${feature.accent}/20 w-fit mx-auto mb-4`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 17,
                          }}
                        >
                          <feature.icon
                            className={`h-6 w-6 text-${feature.accent}`}
                          />
                        </motion.div>
                        <h4 className='text-sm font-bold text-white mb-2 tracking-wide'>
                          {feature.title}
                        </h4>
                        <p className='text-xs text-discord-text leading-relaxed'>
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className='min-h-screen flex items-center justify-center py-20'>
          <div className='w-full max-w-7xl mx-auto px-6'>
            <motion.div
              className='text-center mb-16'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className='mb-6 bg-discord-yellow/20 text-discord-yellow border-discord-yellow/30 px-4 py-2 font-bold'>
                GETTING STARTED
              </Badge>
              <h2 className='text-5xl md:text-6xl font-black text-white mb-6'>
                EXPAND YOUR
                <br />
                <span className='text-discord-yellow glow-text'>INFLUENCE</span>
              </h2>
              <p className='text-xl text-discord-text max-w-3xl mx-auto'>
                Follow these steps to add our bot to your Discord servers and
                unlock the full potential of your communities.
              </p>
            </motion.div>

            <div className='flex justify-center mb-16'>
              <div className='grid md:grid-cols-3 gap-8 max-w-5xl w-full'>
                {[
                  {
                    step: '01',
                    title: 'INVITE THE BOT',
                    description:
                      'Click the invite link and select your Discord server. Grant the necessary permissions for full functionality.',
                    icon: Plus,
                    accent: 'discord-blurple',
                  },
                  {
                    step: '02',
                    title: 'CONFIGURE SETTINGS',
                    description:
                      'Customize bot behavior, set up moderation rules, and configure automated workflows for your community.',
                    icon: Settings,
                    accent: 'discord-green',
                  },
                  {
                    step: '03',
                    title: 'MONITOR & OPTIMIZE',
                    description:
                      'Use real-time analytics to track engagement, optimize performance, and grow your community strategically.',
                    icon: BarChart3,
                    accent: 'discord-yellow',
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                  >
                    <Card className='discord-card h-full text-center'>
                      <CardContent className='p-8'>
                        <div
                          className={`text-6xl font-black text-${step.accent}/20 mb-4`}
                        >
                          {step.step}
                        </div>

                        <motion.div
                          className={`p-4 rounded-xl bg-${step.accent}/20 w-fit mx-auto mb-6`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 17,
                          }}
                        >
                          <step.icon
                            className={`h-8 w-8 text-${step.accent}`}
                          />
                        </motion.div>

                        <h3 className='text-xl font-bold text-white mb-4 tracking-wide'>
                          {step.title}
                        </h3>
                        <p className='text-discord-text leading-relaxed'>
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
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
                  <Button className='discord-button-primary text-xl px-12 py-6'>
                    BEGIN EXPANSION
                    <Sparkles className='ml-2 h-6 w-6' />
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
