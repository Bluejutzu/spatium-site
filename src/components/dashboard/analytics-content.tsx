'use client';

import { motion, useInView } from 'framer-motion';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Clock,
  Download,
  Eye,
  Filter,
  Globe,
  MessageSquare,
  Minus,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AnalyticsContentProps {
  serverId?: string;
}

// Enhanced Animated Counter
function AnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = '',
}: {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Smooth easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOutCubic * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// Enhanced Metric Card Component
function MetricCard({ metric, index }: { metric: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const getTrendIcon = (change: string) => {
    if (change.startsWith('+'))
      return <ArrowUpRight className='w-4 h-4 text-green-500' />;
    if (change.startsWith('-'))
      return <ArrowDownRight className='w-4 h-4 text-red-500' />;
    return <Minus className='w-4 h-4 text-gray-500' />;
  };

  const getTrendColor = (change: string) => {
    if (change.startsWith('+')) return 'text-green-500';
    if (change.startsWith('-')) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className='group'
    >
      <Card className='discord-card border-2 border-discord-border/50 hover:border-discord-blurple/50 transition-all duration-500 relative overflow-hidden'>
        {/* Enhanced background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-${metric.color}/5 via-transparent to-${metric.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        <CardContent className='p-8 relative z-10'>
          <div className='flex items-center justify-between mb-6'>
            <motion.div
              className={`p-4 rounded-2xl bg-gradient-to-r from-${metric.color}/20 to-${metric.color}/10 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-${metric.color}/30`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <metric.icon className={`h-8 w-8 text-${metric.color}`} />
            </motion.div>

            <div className='text-right'>
              <div
                className={`text-3xl font-black text-${metric.color} glow-text`}
              >
                <AnimatedCounter
                  end={parseInt(metric.value.replace(/[^\d]/g, ''))}
                  suffix={metric.value.replace(/[\d,]/g, '')}
                />
              </div>
              <div className='flex items-center gap-1 mt-1'>
                {getTrendIcon(metric.change)}
                <span
                  className={`text-sm font-bold ${getTrendColor(metric.change)}`}
                >
                  {metric.change}
                </span>
              </div>
            </div>
          </div>

          <h3 className='text-sm font-bold text-white mb-2 tracking-wide uppercase group-hover:text-discord-blurple transition-colors duration-300'>
            {metric.title}
          </h3>

          <p className='text-xs text-discord-text group-hover:text-white/80 transition-colors duration-300'>
            {metric.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Enhanced Chart Component
function EngagementChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const chartData = [
    { value: 40, label: 'Mon', messages: 1200 },
    { value: 65, label: 'Tue', messages: 1950 },
    { value: 45, label: 'Wed', messages: 1350 },
    { value: 80, label: 'Thu', messages: 2400 },
    { value: 55, label: 'Fri', messages: 1650 },
    { value: 90, label: 'Sat', messages: 2700 },
    { value: 70, label: 'Sun', messages: 2100 },
    { value: 85, label: 'Mon', messages: 2550 },
    { value: 60, label: 'Tue', messages: 1800 },
    { value: 75, label: 'Wed', messages: 2250 },
    { value: 95, label: 'Thu', messages: 2850 },
    { value: 80, label: 'Fri', messages: 2400 },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8 }}
      className='h-80 bg-discord-dark/50 rounded-2xl flex items-end justify-between p-8 border border-discord-border/30 relative overflow-hidden'
    >
      {/* Background grid */}
      <div className='absolute inset-0 bg-grid-pattern opacity-5' />

      {chartData.map((item, index) => (
        <motion.div
          key={index}
          className='relative flex flex-col items-center group cursor-pointer'
          onMouseEnter={() => setHoveredBar(index)}
          onMouseLeave={() => setHoveredBar(null)}
        >
          {/* Tooltip */}
          {hoveredBar === index && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='absolute -top-16 bg-discord-darker border border-discord-border rounded-lg p-3 shadow-xl z-10'
            >
              <div className='text-white font-bold text-sm'>
                {item.messages} messages
              </div>
              <div className='text-discord-text text-xs'>{item.label}</div>
            </motion.div>
          )}

          {/* Bar */}
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: `${item.value}%` } : { height: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            className={`w-6 rounded-t-lg shadow-lg transition-all duration-300 ${
              hoveredBar === index
                ? 'bg-gradient-to-t from-discord-blurple via-purple-500 to-pink-500'
                : 'bg-gradient-to-t from-discord-blurple/80 via-purple-500/80 to-pink-500/80'
            }`}
          />

          {/* Label */}
          <div className='text-xs text-discord-text mt-2 font-medium'>
            {item.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function AnalyticsContent({ serverId }: AnalyticsContentProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const metrics = [
    {
      title: 'Total Messages',
      value: '1.2M',
      change: '+12%',
      icon: MessageSquare,
      color: 'discord-blurple',
      description: 'Messages sent this period',
    },
    {
      title: 'Active Members',
      value: '8.4K',
      change: '+8%',
      icon: Users,
      color: 'discord-green',
      description: 'Members who participated',
    },
    {
      title: 'Growth Rate',
      value: '15.2%',
      change: '+3%',
      icon: TrendingUp,
      color: 'discord-purple',
      description: 'Member growth rate',
    },
    {
      title: 'Engagement',
      value: '92%',
      change: '+5%',
      icon: BarChart3,
      color: 'discord-orange',
      description: 'Overall engagement score',
    },
  ];

  return (
    <div className='flex-1 overflow-auto bg-discord-dark'>
      {/* Enhanced Header */}
      <header className='sticky top-0 z-20 bg-discord-darker/95 backdrop-blur-xl border-b border-discord-border/50 p-8'>
        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className='mb-4 bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 px-4 py-2 font-bold'>
              <BarChart3 className='mr-2 h-4 w-4' />
              ANALYTICS SUITE
            </Badge>
            <h1 className='text-4xl font-black text-white font-minecraft tracking-wide mb-2'>
              SERVER ANALYTICS
            </h1>
            <p className='text-discord-text text-lg'>
              Deep insights into your community&apos;s engagement and growth
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto'
          >
            {/* Time Range Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='discord-button-outline h-12 px-6'
                >
                  <Calendar className='w-4 h-4 mr-2' />
                  Last {timeRange}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-48 bg-discord-darker border-discord-border shadow-2xl'>
                <DropdownMenuItem
                  onClick={() => setTimeRange('24h')}
                  className='text-discord-text hover:text-white hover:bg-white/5 p-3'
                >
                  Last 24 Hours
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTimeRange('7d')}
                  className='text-discord-text hover:text-white hover:bg-white/5 p-3'
                >
                  Last 7 Days
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTimeRange('30d')}
                  className='text-discord-text hover:text-white hover:bg-white/5 p-3'
                >
                  Last 30 Days
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTimeRange('90d')}
                  className='text-discord-text hover:text-white hover:bg-white/5 p-3'
                >
                  Last 90 Days
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className='flex gap-3'>
              <Button
                variant='outline'
                className='discord-button-outline h-12 px-6'
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className='bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'>
                  <Download className='w-4 h-4 mr-2' />
                  Export Data
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </header>

      <div className='p-8 space-y-12'>
        {/* Enhanced Metrics Grid */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='mb-8'
          >
            <Badge className='mb-4 bg-discord-green/20 text-discord-green border-discord-green/30 px-4 py-2 font-bold'>
              <Target className='mr-2 h-4 w-4' />
              KEY METRICS
            </Badge>
            <h2 className='text-3xl font-black text-white mb-2'>
              PERFORMANCE{' '}
              <span className='text-discord-green glow-text'>INDICATORS</span>
            </h2>
            <p className='text-discord-text text-lg'>
              Track your server&apos;s growth and engagement metrics
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {metrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} index={index} />
            ))}
          </div>
        </section>

        {/* Enhanced Charts Section */}
        <div className='grid lg:grid-cols-3 gap-10'>
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='lg:col-span-2'
          >
            <Card className='discord-card border-2 border-discord-border/50 hover:border-discord-border transition-all duration-300'>
              <CardHeader className='border-b border-discord-border p-6'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-2xl font-bold text-white tracking-wide flex items-center gap-3'>
                    <Activity className='w-6 h-6 text-discord-blurple' />
                    MESSAGE ACTIVITY
                  </CardTitle>
                  <div className='flex items-center gap-2'>
                    <Badge className='bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 px-3 py-1'>
                      <TrendingUp className='w-3 h-3 mr-1' />
                      +15% growth
                    </Badge>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='text-discord-text hover:text-white'
                    >
                      <Eye className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='p-6'>
                <EngagementChart />
                <div className='flex justify-between items-center mt-6 text-sm text-discord-text'>
                  <span>Daily message activity over the last 12 days</span>
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-gradient-to-r from-discord-blurple to-purple-500 rounded-full' />
                      <span>Messages</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full' />
                      <span>Peak Hours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Side Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='space-y-6'
          >
            {/* Real-time Stats */}
            <Card className='discord-card border-2 border-discord-border/50 hover:border-discord-border transition-all duration-300'>
              <CardHeader className='border-b border-discord-border p-6'>
                <CardTitle className='text-xl font-bold text-white tracking-wide flex items-center gap-3'>
                  <Zap className='w-5 h-5 text-discord-yellow' />
                  REAL-TIME
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6 space-y-6'>
                {[
                  {
                    label: 'Online Members',
                    value: '342',
                    icon: Users,
                    color: 'green',
                  },
                  {
                    label: 'Messages/Hour',
                    value: '156',
                    icon: MessageSquare,
                    color: 'blue',
                  },
                  {
                    label: 'Commands/Hour',
                    value: '23',
                    icon: Zap,
                    color: 'purple',
                  },
                  {
                    label: 'New Joins Today',
                    value: '8',
                    icon: TrendingUp,
                    color: 'orange',
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className='flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300 group'
                    whileHover={{ x: 5 }}
                  >
                    <div className='flex items-center gap-3'>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                      <span className='text-discord-text group-hover:text-white transition-colors duration-300'>
                        {stat.label}
                      </span>
                    </div>
                    <span
                      className={`font-bold text-${stat.color}-400 text-lg`}
                    >
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Top Channels */}
            <Card className='discord-card border-2 border-discord-border/50 hover:border-discord-border transition-all duration-300'>
              <CardHeader className='border-b border-discord-border p-6'>
                <CardTitle className='text-xl font-bold text-white tracking-wide flex items-center gap-3'>
                  <Globe className='w-5 h-5 text-discord-green' />
                  TOP CHANNELS
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6 space-y-4'>
                {[
                  { name: 'general', messages: 1250, percentage: 85 },
                  { name: 'gaming', messages: 890, percentage: 60 },
                  { name: 'memes', messages: 567, percentage: 38 },
                  { name: 'support', messages: 234, percentage: 16 },
                ].map((channel, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className='space-y-2'
                  >
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-white font-medium'>
                        #{channel.name}
                      </span>
                      <span className='text-discord-text'>
                        {channel.messages} msgs
                      </span>
                    </div>
                    <div className='w-full bg-discord-dark rounded-full h-2 overflow-hidden'>
                      <motion.div
                        className='h-full bg-gradient-to-r from-discord-blurple to-purple-500 rounded-full'
                        initial={{ width: 0 }}
                        whileInView={{ width: `${channel.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Insights Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='mb-8'
          >
            <Badge className='mb-4 bg-discord-purple/20 text-discord-purple border-discord-purple/30 px-4 py-2 font-bold'>
              <Eye className='mr-2 h-4 w-4' />
              INSIGHTS & TRENDS
            </Badge>
            <h2 className='text-3xl font-black text-white mb-2'>
              COMMUNITY{' '}
              <span className='text-discord-purple glow-text'>INSIGHTS</span>
            </h2>
            <p className='text-discord-text text-lg'>
              Discover patterns and opportunities for growth
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              {
                title: 'Peak Activity Hours',
                value: '7-9 PM EST',
                description:
                  'Your community is most active during evening hours',
                icon: Clock,
                color: 'discord-yellow',
                trend: '+2 hours vs last month',
              },
              {
                title: 'Most Engaged Members',
                value: '156 users',
                description: 'Core community members driving engagement',
                icon: Users,
                color: 'discord-green',
                trend: '+12% growth',
              },
              {
                title: 'Content Performance',
                value: '92% positive',
                description: 'High engagement rate on community content',
                icon: TrendingUp,
                color: 'discord-blurple',
                trend: '+5% improvement',
              },
            ].map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className='group'
              >
                <Card className='discord-card h-full border-2 border-discord-border/50 hover:border-discord-blurple/50 transition-all duration-500 overflow-hidden relative'>
                  {/* Enhanced background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${insight.color}/5 via-transparent to-${insight.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <CardContent className='p-8 relative z-10'>
                    <div className='flex items-start justify-between mb-6'>
                      <motion.div
                        className={`p-4 rounded-2xl bg-gradient-to-r from-${insight.color}/20 to-${insight.color}/10 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-${insight.color}/30`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <insight.icon
                          className={`h-8 w-8 text-${insight.color}`}
                        />
                      </motion.div>

                      <Badge
                        className={`bg-${insight.color}/20 text-${insight.color} border-${insight.color}/30 text-xs px-3 py-1`}
                      >
                        {insight.trend}
                      </Badge>
                    </div>

                    <h3 className='text-xl font-bold text-white mb-3 group-hover:text-discord-blurple transition-colors duration-300'>
                      {insight.title}
                    </h3>

                    <div
                      className={`text-3xl font-black text-${insight.color} mb-4 glow-text`}
                    >
                      {insight.value}
                    </div>

                    <p className='text-discord-text group-hover:text-white/90 transition-colors duration-300'>
                      {insight.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
