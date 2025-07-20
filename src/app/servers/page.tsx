'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Bot,
  Users,
  Settings,
  BarChart3,
  Plus,
  ExternalLink,
  Crown,
  Sparkles,
  ArrowDown,
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Activity,
  Shield,
  Zap,
  Globe,
  Star,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatedHeader } from '@/components/app/header';
import { DiscordFooter } from '@/components/app/footer';

const DISCORD_INVITE_URL = `https://discord.com/oauth2/authorize?client_id=1384798729055375410&permissions=8&scope=bot%20applications.commands`;

// Enhanced Server Card Component
function ServerCard({ server, index }: { server: any; index: number }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group w-full max-w-sm mx-auto"
    >
      <Link href={`/dashboard/${server.serverId}`}>
        <Card className="discord-card hover:border-discord-border-hover transition-all duration-500 cursor-pointer h-full relative overflow-hidden backdrop-blur-xl border-2 border-discord-border/50 hover:border-discord-blurple/50">
          {/* Enhanced background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-discord-blurple/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Animated border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-discord-blurple via-purple-500 to-discord-blurple opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

          <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <motion.div
                  animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-16 h-16 bg-gradient-to-br from-discord-blurple to-discord-purple rounded-2xl flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                >
                  {server.icon ? (
                    <img
                      src={`https://cdn.discordapp.com/icons/${server.serverId}/${server.icon}.png`}
                      alt={server.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                  ) : (
                    server.name.charAt(0).toUpperCase()
                  )}
                </motion.div>
                
                {/* Enhanced status indicator */}
                <motion.div 
                  className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-discord-dark flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate group-hover:text-discord-blurple transition-colors duration-300 text-xl mb-2">
                  {server.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-discord-text">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-discord-blurple" />
                    <span className="font-medium">{server.memberCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium">{server.onlineCount} online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced stats section */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-discord-dark/50 rounded-xl p-4 border border-discord-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-discord-text font-medium">Growth</span>
                </div>
                <div className="text-lg font-bold text-green-500">+12%</div>
              </div>
              <div className="bg-discord-dark/50 rounded-xl p-4 border border-discord-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-discord-text font-medium">Activity</span>
                </div>
                <div className="text-lg font-bold text-blue-500">High</div>
              </div>
            </div>

            {/* Enhanced action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="sm"
                variant="outline"
                className="discord-button-outline text-xs bg-transparent hover:bg-discord-blurple/10 border-discord-border/60 hover:border-discord-blurple/50 transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/dashboard/${server.serverId}/settings`);
                }}
              >
                <Settings className="h-3 w-3 mr-2" />
                SETTINGS
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="discord-button-outline text-xs bg-transparent hover:bg-discord-green/10 border-discord-border/60 hover:border-discord-green/50 transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/dashboard/${server.serverId}/analytics`);
                }}
              >
                <BarChart3 className="h-3 w-3 mr-2" />
                ANALYTICS
              </Button>
            </div>

            {/* Hover indicator */}
            <motion.div
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={isHovered ? { x: [0, 5, 0] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ChevronRight className="w-5 h-5 text-discord-blurple" />
            </motion.div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// Enhanced Empty State Component
function EmptyState() {
  return (
    <motion.div
      className="text-center py-20"
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
        className="relative mb-8"
      >
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-discord-blurple to-purple-600 flex items-center justify-center shadow-2xl shadow-discord-blurple/30">
          <Bot className="w-16 h-16 text-white" />
        </div>
        
        {/* Floating elements around the bot icon */}
        <motion.div
          className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg"
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Plus className="w-4 h-4 text-white" />
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
          animate={{ y: [5, -5, 5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          <Zap className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>

      <h3 className="text-4xl font-black text-white mb-6 font-minecraft">
        NO SERVERS DETECTED
      </h3>
      <p className="text-discord-text mb-10 max-w-2xl mx-auto text-xl leading-relaxed">
        Your empire awaits expansion! Add our bot to your Discord servers to begin managing 
        your communities with powerful moderation tools, analytics, and automation.
      </p>

      <div className="space-y-8">
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
              className="bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-12 py-6 rounded-2xl text-xl shadow-2xl hover:shadow-discord-blurple/30 transition-all duration-300"
            >
              <ExternalLink className="h-6 w-6 mr-3" />
              EXPAND YOUR EMPIRE
              <Sparkles className="h-6 w-6 ml-3" />
            </Button>
          </a>
        </motion.div>

        {/* Enhanced help section */}
        <div className="bg-discord-darker/50 rounded-2xl p-8 border border-discord-border/30 max-w-2xl mx-auto backdrop-blur-sm">
          <h4 className="text-white font-bold text-lg mb-4 flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-discord-green" />
            Need Help Getting Started?
          </h4>
          <div className="space-y-3 text-discord-text">
            <p className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-discord-green flex-shrink-0" />
              Ensure you have administrator permissions in your Discord server
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-discord-green flex-shrink-0" />
              Click the invite link and select your server from the dropdown
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-discord-green flex-shrink-0" />
              Grant the necessary permissions for full functionality
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServersPage() {
  const { user } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'members' | 'activity'>('name');
  
  const servers = useQuery(
    api.discord.getUserServers,
    user ? { userId: user.externalAccounts[0].providerUserId } : 'skip'
  );
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState('0%');
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollY(`${latest * 50}%`);
    });

    return () => {
      unsubscribe();
    };
  }, [scrollYProgress]);

  // Filter and sort servers
  const filteredServers = servers?.filter(server =>
    server.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'members':
        return b.memberCount - a.memberCount;
      case 'activity':
        return b.onlineCount - a.onlineCount;
      default:
        return a.name.localeCompare(b.name);
    }
  }) || [];

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

  return (
    <div className="bg-discord-dark overflow-hidden font-minecraft min-h-screen" ref={containerRef}>
      {/* Enhanced Atmospheric Background */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black' />
        <motion.div
          className='absolute inset-0 bg-grid-pattern opacity-5'
          style={{ y: scrollY }}
        />
        <div className='floating-orb floating-orb-1' />
        <div className='floating-orb floating-orb-2' />
        <div className='floating-orb floating-orb-3' />
        
        {/* Additional atmospheric elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-discord-blurple/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
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
              <Badge className='mb-8 bg-discord-green/20 text-discord-green border-discord-green/30 px-6 py-3 font-bold text-lg'>
                <Crown className='mr-2 h-5 w-5' />
                COMMAND CENTER ACTIVE
              </Badge>
              <h1 className='text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-tight tracking-tight'>
                <span className='block mb-4'>YOUR</span>
                <span className='block bg-gradient-to-r from-discord-blurple via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text'>
                  COMMUNITIES
                </span>
              </h1>
              <p className='text-xl md:text-2xl text-discord-text max-w-4xl mx-auto mb-12 leading-relaxed font-medium'>
                Monitor, manage, and optimize your Discord empire with
                <br />
                <span className='text-white font-bold'>
                  cutting-edge automation and analytics
                </span>
              </p>
            </motion.div>

            <div className='flex justify-center'>
              <Card className='discord-card border-2 border-white/10 w-full max-w-6xl backdrop-blur-xl'>
                <CardHeader className='border-b border-discord-border p-8'>
                  <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6'>
                    <div>
                      <CardTitle className='text-3xl font-bold text-white tracking-wide mb-2'>
                        ACTIVE SERVERS
                      </CardTitle>
                      <p className="text-discord-text">
                        {servers?.length || 0} server{servers?.length !== 1 ? 's' : ''} connected
                      </p>
                    </div>
                    
                    {/* Enhanced controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                      {/* Search */}
                      <div className="relative flex-1 lg:flex-initial">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-discord-text w-4 h-4" />
                        <Input
                          placeholder="Search servers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-discord-dark/50 border-discord-border text-white placeholder:text-discord-text focus:border-discord-blurple lg:w-64"
                        />
                      </div>
                      
                      {/* View mode toggle */}
                      <div className="flex rounded-lg border border-discord-border overflow-hidden">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className={`rounded-none ${viewMode === 'grid' ? 'bg-discord-blurple' : 'text-discord-text hover:text-white'}`}
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className={`rounded-none ${viewMode === 'list' ? 'bg-discord-blurple' : 'text-discord-text hover:text-white'}`}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Add bot button */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <a
                          href={DISCORD_INVITE_URL}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <Button className='bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300'>
                            <Plus className='h-4 w-4 mr-2' />
                            ADD BOT
                          </Button>
                        </a>
                      </motion.div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='p-8'>
                  {servers && servers.length > 0 ? (
                    <div className={`${
                      viewMode === 'grid' 
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                        : 'space-y-4'
                    }`}>
                      {filteredServers.map((server, index) => (
                        viewMode === 'grid' ? (
                          <ServerCard key={server._id} server={server} index={index} />
                        ) : (
                          <motion.div
                            key={server._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                          >
                            <Link href={`/dashboard/${server.serverId}`}>
                              <Card className="discord-card hover:border-discord-border-hover transition-all duration-300 cursor-pointer">
                                <CardContent className="p-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-gradient-to-br from-discord-blurple to-discord-purple rounded-lg flex items-center justify-center text-white font-bold overflow-hidden">
                                        {server.icon ? (
                                          <img
                                            src={`https://cdn.discordapp.com/icons/${server.serverId}/${server.icon}.png`}
                                            alt={server.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                          />
                                        ) : (
                                          server.name.charAt(0).toUpperCase()
                                        )}
                                      </div>
                                      <div>
                                        <h3 className="font-bold text-white text-lg">{server.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-discord-text">
                                          <span>{server.memberCount.toLocaleString()} members</span>
                                          <span>{server.onlineCount} online</span>
                                        </div>
                                      </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-discord-text group-hover:text-discord-blurple transition-colors" />
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </motion.div>
                        )
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
              <p className='text-xl md:text-2xl text-discord-text max-w-4xl mx-auto leading-relaxed'>
                Follow these simple steps to add our bot to your Discord servers and unlock the full potential 
                of your communities with advanced automation and management tools.
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
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.02 }}
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
                        <motion.div
                          className={`p-6 rounded-2xl bg-gradient-to-r from-${step.accent}/20 to-${step.accent}/10 w-fit mx-auto mb-8 border border-${step.accent}/30`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 17,
                          }}
                        >
                          <step.icon className={`h-10 w-10 text-${step.accent}`} />
                        </motion.div>

                        <h3 className='text-2xl font-bold text-white mb-6 tracking-wide group-hover:text-discord-blurple transition-colors duration-300'>
                          {step.title}
                        </h3>
                        <p className='text-discord-text leading-relaxed mb-8 text-lg'>
                          {step.description}
                        </p>

                        {/* Feature list */}
                        <div className="space-y-3">
                          {step.features.map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.2 + featureIndex * 0.1 }}
                              viewport={{ once: true }}
                              className="flex items-center gap-3 text-sm"
                            >
                              <div className={`w-2 h-2 rounded-full bg-${step.accent}`} />
                              <span className="text-discord-text group-hover:text-white transition-colors duration-300">
                                {feature}
                              </span>
                            </motion.div>
                          ))}
                        </div>
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
                  <Button className="bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-12 py-6 rounded-2xl text-xl shadow-2xl hover:shadow-discord-blurple/30 transition-all duration-300">
                    BEGIN EXPANSION
                    <Sparkles className="ml-3 h-6 w-6" />
                  </Button>
                </a>
              </motion.div>
              
              <p className="text-discord-text mt-6 text-lg">
                Join over <span className="text-discord-blurple font-bold">15,000+</span> servers already using Spatium
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      <DiscordFooter />
    </div>
  );
}