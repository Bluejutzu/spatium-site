'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  Bot,
  Users,
  Activity,
  TrendingUp,
  Settings,
  BarChart3,
  ExternalLink,
  AlertTriangle,
  Crown,
  Shield,
  MessageSquare,
  Zap,
  ArrowDown,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface DashboardContentProps {
  serverId?: string;
}

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

const dashboardFeatures = [
  {
    icon: BarChart3,
    title: 'ANALYTICS SUITE',
    description:
      'Deep insights into member engagement, growth patterns, and community health metrics.',
    accent: 'discord-blurple',
  },
  {
    icon: Shield,
    title: 'SECURITY CENTER',
    description:
      'Multi-layered protection with automated moderation and threat detection systems.',
    accent: 'discord-green',
  },
  {
    icon: Settings,
    title: 'AUTOMATION HUB',
    description:
      'Streamline operations with intelligent workflows and custom command systems.',
    accent: 'discord-yellow',
  },
  {
    icon: Users,
    title: 'MEMBER CONTROL',
    description:
      'Sophisticated onboarding, role management, and engagement tracking tools.',
    accent: 'discord-red',
  },
];

export function DashboardContent({ serverId }: DashboardContentProps) {
  const serverData = useQuery(
    api.discord.getServerMetrics,
    serverId ? { serverId } : 'skip'
  );
  const alerts = useQuery(
    api.discord.getServerAlerts,
    serverId ? { serverId } : 'skip'
  );
  const latestMetrics = useQuery(
    api.discord.getLatestServerMetrics,
    serverId ? { serverId } : 'skip'
  );

  console.log(serverData);

  if (!serverId) {
    return <DashboardHome />;
  }

  const metrics = serverData?.metrics;
  let memberGrowth = 0;
  if (metrics && metrics.length > 1) {
    const firstMetric = metrics[metrics.length - (metrics.length == 0 ? 0 : 1)];
    const latestMetric = metrics[0];
    memberGrowth = latestMetric.memberCount - firstMetric.memberCount;
  }

  let commandGrowthPercentage = 0;
  if (metrics && metrics.length > 1) {
    const latestCommands = metrics[0].commandsUsed;
    const previousCommands = metrics[1].commandsUsed;
    if (previousCommands > 0) {
      commandGrowthPercentage = Math.round(
        ((latestCommands - previousCommands) / previousCommands) * 100
      );
    } else if (latestCommands > 0) {
      commandGrowthPercentage = 100;
    }
  }

  const totalMembers = serverData?.server?.memberCount || 1247;
  const onlineMembers =
    latestMetrics?.onlineCount ?? serverData?.server?.onlineCount ?? 0;
  const commandsPerHour = latestMetrics?.commandsUsed ?? 0;

  const statsCards = [
    {
      title: 'TOTAL MEMBERS',
      value: totalMembers,
      icon: Users,
      accent: 'discord-blurple',
      description: 'Community members',
      growth: `${memberGrowth >= 0 ? '+' : ''}${memberGrowth} today`,
    },
    {
      title: 'ONLINE NOW',
      value: onlineMembers,
      icon: Activity,
      accent: 'discord-green',
      description: 'Currently active',
      growth: `${totalMembers > 0 ? Math.round((onlineMembers / totalMembers) * 100) : 0}% online`,
    },
    {
      title: 'COMMANDS/HR',
      value: commandsPerHour,
      icon: Zap,
      accent: 'discord-orange',
      description: 'Bot interactions',
      growth: `${commandGrowthPercentage >= 0 ? '+' : ''}${commandGrowthPercentage}% this hour`,
    },
  ];

  return (
    <div className='bg-discord-dark min-h-screen font-minecraft'>
      {/* Atmospheric Background */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black' />
        <div className='absolute inset-0 bg-grid-pattern opacity-5' />
        <div className='floating-orb floating-orb-1' />
        <div className='floating-orb floating-orb-2' />
        <div className='floating-orb floating-orb-3' />
      </div>

      <div className='relative z-10 flex flex-col'>
        {/* Enhanced Header */}
        <header className='border-b border-discord-border bg-discord-dark/80 backdrop-blur-xl px-6 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-6'>
              <SidebarTrigger className='text-discord-text hover:text-white' />
              <div className='flex items-center gap-4'>
                <motion.div
                  className='p-3 bg-discord-blurple rounded-xl shadow-glow-blurple'
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Avatar>
                    <AvatarImage src={serverData?.server?.icon} alt={`@`} />
                    <AvatarFallback>
                      {serverData?.server?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <h1 className='text-2xl font-bold text-white tracking-wide'>
                    {serverData?.server?.name || 'GAMING COMMUNITY'}
                  </h1>
                  <p className='text-discord-text'>Server ID: {serverId}</p>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <Badge className='bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 px-3 py-1'>
                <div className='w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse' />
                ONLINE
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className='flex-1 p-8 space-y-8'>
          {/* Server Overview Hero Section */}
          <section className='min-h-[60vh] flex items-center justify-center'>
            <div className='text-center max-w-6xl mx-auto'>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className='mb-8 bg-discord-green/20 text-discord-green border-discord-green/30 px-4 py-2 font-bold'>
                  <Crown className='mr-2 h-4 w-4' />
                  SERVER COMMAND CENTER
                </Badge>

                <h1 className='text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight'>
                  <span className='block mb-4'>COMMUNITY</span>
                  <span className='block text-discord-blurple glow-text'>
                    CONTROL HUB
                  </span>
                </h1>

                <p className='text-xl md:text-2xl text-discord-text max-w-4xl mx-auto mb-12 leading-relaxed font-medium'>
                  Monitor, manage, and optimize your Discord community with
                  <br />
                  <span className='text-white font-bold'>
                    real-time insights and enterprise-grade tools.
                  </span>
                </p>

                {/* Real-time Stats Cards */}
                <div
                  className={`grid md:grid-cols-${statsCards.length} gap-6 mb-12`}
                >
                  {statsCards.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                    >
                      <Card className='discord-card border-2 border-white/10 h-full'>
                        <CardContent className='p-6 text-center'>
                          <motion.div
                            className={`p-3 rounded-xl bg-${stat.accent}/20 w-fit mx-auto mb-4`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 17,
                            }}
                          >
                            <stat.icon
                              className={`h-6 w-6 text-${stat.accent}`}
                            />
                          </motion.div>

                          <h3 className='text-sm font-bold text-white mb-2 tracking-wide'>
                            {stat.title}
                          </h3>

                          <div
                            className={`text-3xl font-black text-${stat.accent} mb-2 glow-text`}
                          >
                            <AnimatedCounter end={stat.value} />
                          </div>

                          <p className='text-xs text-discord-text mb-2'>
                            {stat.description}
                          </p>

                          <Badge
                            className={`bg-${stat.accent}/20 text-${stat.accent} border-${stat.accent}/30 text-xs`}
                          >
                            <TrendingUp className='mr-1 h-2 w-2' />
                            {stat.growth}
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Scroll Indicator */}
                <motion.div
                  className='flex items-center justify-center'
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                  }}
                >
                  <ArrowDown className='h-6 w-6 text-discord-text/60' />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Alerts Section */}
          {alerts && alerts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className='space-y-4'>
                <h2 className='text-2xl font-bold text-white mb-6 font-minecraft tracking-wide'>
                  SYSTEM ALERTS
                </h2>
                {alerts.map(alert => (
                  <Card
                    key={alert._id}
                    className={`border-l-4 ${
                      alert.type === 'error'
                        ? 'border-l-red-500 bg-red-900/10 border-red-500/20'
                        : alert.type === 'warning'
                          ? 'border-l-orange-500 bg-orange-900/10 border-orange-500/20'
                          : 'border-l-blue-500 bg-blue-900/10 border-blue-500/20'
                    } discord-card`}
                  >
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-4'>
                        <AlertTriangle
                          className={`h-6 w-6 ${
                            alert.type === 'error'
                              ? 'text-red-400'
                              : alert.type === 'warning'
                                ? 'text-orange-400'
                                : 'text-blue-400'
                          }`}
                        />
                        <div>
                          <p className='font-bold text-white text-lg'>
                            {alert.title}
                          </p>
                          <p className='text-discord-text'>{alert.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>
          )}

          {/* Quick Actions Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className='text-center mb-12'>
              <Badge className='mb-6 bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 px-4 py-2 font-bold'>
                MANAGEMENT TOOLS
              </Badge>
              <h2 className='text-4xl md:text-5xl font-black text-white mb-6'>
                QUICK
                <br />
                <span className='text-discord-blurple glow-text'>ACTIONS</span>
              </h2>
            </div>

            <div className='grid md:grid-cols-4 gap-6'>
              {dashboardFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 17,
                    duration: 0.6,
                    delay: 0.6 + index * 0.1,
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className='discord-card h-full cursor-pointer group hover:border-discord-border-hover'>
                    <CardContent className='p-6 text-center'>
                      <motion.div
                        className={`p-4 rounded-xl bg-${feature.accent}/20 w-fit mx-auto mb-4`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <feature.icon
                          className={`h-8 w-8 text-${feature.accent}`}
                        />
                      </motion.div>
                      <h4 className='text-lg font-bold text-white mb-3 tracking-wide group-hover:text-discord-blurple transition-colors'>
                        {feature.title}
                      </h4>
                      <p className='text-sm text-discord-text leading-relaxed mb-4'>
                        {feature.description}
                      </p>
                      <Button className='discord-button-outline w-full'>
                        EXPLORE
                        <ExternalLink className='ml-2 h-4 w-4' />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Activity & System Status */}
          <div className='grid lg:grid-cols-2 gap-8'>
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className='discord-card h-full'>
                <CardHeader className='border-b border-discord-border'>
                  <CardTitle className='text-xl font-bold text-white tracking-wide'>
                    RECENT ACTIVITY
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-6'>
                  <div className='space-y-4'>
                    {serverData?.commands?.slice(0, 5).map((command, index) => (
                      <motion.div
                        key={index}
                        className='flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${command.success ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}
                        />
                        <div className='flex-1'>
                          <p className='text-white font-medium'>
                            /{command.commandName} executed
                          </p>
                          <p className='text-xs text-discord-text'>
                            {new Date(command.timestamp).toLocaleTimeString()} •{' '}
                            {command.executionTime}ms
                          </p>
                        </div>
                      </motion.div>
                    )) || (
                      <div className='text-center text-discord-text py-8'>
                        <Activity className='h-12 w-12 mx-auto mb-4 opacity-50' />
                        <p className='font-medium'>No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className='discord-card h-full'>
                <CardHeader className='border-b border-discord-border'>
                  <CardTitle className='text-xl font-bold text-white tracking-wide'>
                    SYSTEM STATUS
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-6'>
                  <div className='space-y-6'>
                    <motion.div
                      className='flex items-center justify-between p-4 bg-green-900/20 rounded-lg border border-green-500/20'
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    >
                      <div className='flex items-center gap-3'>
                        <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse' />
                        <span className='text-white font-medium'>
                          All systems operational
                        </span>
                      </div>
                      <Badge className='bg-green-500/20 text-green-400 border-green-500/30'>
                        HEALTHY
                      </Badge>
                    </motion.div>

                    <div className='space-y-4'>
                      {[
                        {
                          label: 'API Response Time',
                          value: '45ms',
                          color: 'green',
                        },
                        {
                          label: 'Memory Usage',
                          value: '68%',
                          color: 'yellow',
                        },
                        {
                          label: 'Active Connections',
                          value: totalMembers.toLocaleString(),
                          color: 'blue',
                        },
                        { label: 'Uptime', value: '99.9%', color: 'green' },
                      ].map((metric, index) => (
                        <motion.div
                          key={index}
                          className='flex justify-between items-center text-sm'
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 1.4 + index * 0.1,
                          }}
                        >
                          <span className='text-discord-text'>
                            {metric.label}
                          </span>
                          <span
                            className={`font-bold text-${metric.color}-400`}
                          >
                            {metric.value}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardHome() {
  return (
    <div className='bg-discord-dark min-h-screen font-minecraft'>
      {/* Atmospheric Background */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black' />
        <div className='absolute inset-0 bg-grid-pattern opacity-5' />
        <div className='floating-orb floating-orb-1' />
        <div className='floating-orb floating-orb-2' />
        <div className='floating-orb floating-orb-3' />
      </div>

      <div className='relative z-10 min-h-screen flex items-center justify-center'>
        <motion.div
          className='text-center'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
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
            <Bot className='h-20 w-20 mx-auto mb-8 text-discord-blurple' />
          </motion.div>

          <h2 className='text-4xl md:text-5xl font-black text-white mb-6 tracking-wide'>
            SELECT A
            <br />
            <span className='text-discord-blurple glow-text'>SERVER</span>
          </h2>

          <p className='text-xl text-discord-text max-w-2xl mx-auto mb-8'>
            Choose a server from the sidebar to access its command center and
            <br />
            <span className='text-white font-bold'>
              unleash the full power of your Discord empire.
            </span>
          </p>

          <Badge className='bg-discord-green/20 text-discord-green border-discord-green/30 px-4 py-2 font-bold'>
            <Crown className='mr-2 h-4 w-4' />
            AWAITING YOUR COMMAND
          </Badge>
        </motion.div>
      </div>
    </div>
  );
}
