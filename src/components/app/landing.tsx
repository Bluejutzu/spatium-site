'use client';

import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  Shield,
  BarChart3,
  Settings,
  Users,
  MessageSquare,
  Zap,
  ArrowRight,
  Play,
  Star,
  ChevronDown,
  Globe,
  Sparkles,
  TrendingUp,
  Activity,
  Bot,
  Lock,
  CheckCircle,
  ArrowDown,
  Cpu,
  Database,
  Network,
  Eye,
  Gauge,
} from 'lucide-react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatedHeader } from './header';
import { DiscordFooter } from './footer';

const fullScreenFeatures = [
  {
    id: 'analytics',
    title: 'REAL-TIME ANALYTICS',
    subtitle: 'Monitor every metric that matters',
    description:
      "Get comprehensive insights into your community's engagement patterns, growth metrics, member activity heatmaps, and bot performance analytics with real-time monitoring.",
    icon: BarChart3,
    accent: 'discord-blurple',
    features: [
      'Live member activity tracking',
      'Advanced engagement metrics',
      'Custom dashboard creation',
      'Automated report generation',
      'Performance benchmarking',
      'Predictive analytics',
    ],
    stats: [
      { label: 'Data Points', value: '50M+', icon: Database },
      { label: 'Update Frequency', value: 'Real-time', icon: Activity },
      { label: 'Retention', value: '5 Years', icon: Gauge },
    ],
    mockupType: 'analytics',
  },
  {
    id: 'security',
    title: 'FORTRESS SECURITY',
    subtitle: 'Multi-layered protection systems',
    description:
      'Enterprise-grade security with advanced threat detection, automated moderation, and comprehensive audit trails. Your community, secured and contained with military-grade precision.',
    icon: Shield,
    accent: 'discord-green',
    features: [
      'Advanced threat detection',
      'Automated content moderation',
      'Role-based access control',
      'Comprehensive audit logs',
      'Two-factor authentication',
      'End-to-end encryption',
    ],
    stats: [
      { label: 'Threats Blocked', value: '99.9%', icon: Shield },
      { label: 'Response Time', value: '<1s', icon: Zap },
      { label: 'Uptime', value: '99.99%', icon: Activity },
    ],
    mockupType: 'security',
  },
  {
    id: 'automation',
    title: 'TOTAL CONTROL',
    subtitle: 'Configure everything with precision',
    description:
      'From simple tweaks to complex automation workflows. Build custom commands, automate member onboarding, and create sophisticated rule systems that scale with your community.',
    icon: Settings,
    accent: 'discord-yellow',
    features: [
      'Visual workflow builder',
      'Custom command creation',
      'Automated role assignment',
      'Smart notification system',
      'Integration marketplace',
      'Advanced scheduling',
    ],
    stats: [
      { label: 'Automations', value: 'Unlimited', icon: Bot },
      { label: 'Integrations', value: '500+', icon: Network },
      { label: 'Custom Commands', value: 'No Limit', icon: Cpu },
    ],
    mockupType: 'automation',
  },
  {
    id: 'management',
    title: 'MEMBER MANAGEMENT',
    subtitle: 'Automate onboarding and engagement',
    description:
      'Streamline member onboarding, automate role assignments, and create engaging experiences that keep your community active and growing. Scale without limits.',
    icon: Users,
    accent: 'discord-red',
    features: [
      'Automated onboarding flows',
      'Smart role management',
      'Member engagement tracking',
      'Welcome message automation',
      'Activity-based rewards',
      'Community growth analytics',
    ],
    stats: [
      { label: 'Members Managed', value: '10M+', icon: Users },
      { label: 'Automation Rules', value: 'Unlimited', icon: Settings },
      { label: 'Engagement Rate', value: '+45%', icon: TrendingUp },
    ],
    mockupType: 'management',
  },
  {
    id: 'commands',
    title: 'SMART COMMANDS',
    subtitle: 'AI-powered command system',
    description:
      'Create, deploy, and manage intelligent commands with our AI-powered system. From simple responses to complex workflows, build commands that understand context and deliver results.',
    icon: MessageSquare,
    accent: 'discord-purple',
    features: [
      'AI-powered responses',
      'Context-aware commands',
      'Visual command builder',
      'Natural language processing',
      'Multi-step workflows',
      'Performance optimization',
    ],
    stats: [
      { label: 'Commands Created', value: '1M+', icon: MessageSquare },
      { label: 'Response Time', value: '50ms', icon: Zap },
      { label: 'Success Rate', value: '99.8%', icon: CheckCircle },
    ],
    mockupType: 'commands',
  },
  {
    id: 'performance',
    title: 'LIGHTNING FAST',
    subtitle: 'Global infrastructure built for speed',
    description:
      '99.9% uptime guarantee with global infrastructure designed for maximum performance. Your community deserves enterprise-grade reliability and lightning-fast response times.',
    icon: Zap,
    accent: 'discord-orange',
    features: [
      'Global CDN network',
      'Auto-scaling infrastructure',
      'Real-time monitoring',
      'Predictive maintenance',
      'Load balancing',
      'Edge computing',
    ],
    stats: [
      { label: 'Uptime', value: '99.9%', icon: Activity },
      { label: 'Response Time', value: '45ms', icon: Zap },
      { label: 'Global Servers', value: '50+', icon: Globe },
    ],
    mockupType: 'performance',
  },
];

function FeatureMockup({ type, accent }: { type: string; accent: string }) {
  const [animatedValues, setAnimatedValues] = useState({
    growth: 0,
    active: 0,
    chartData: [0, 0, 0, 0, 0, 0, 0],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        growth: 23,
        active: 1247,
        chartData: [40, 65, 45, 80, 55, 90, 70],
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (type === 'analytics') {
    return (
      <div className='relative bg-discord-dark/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8 overflow-hidden'>
        {/* Browser Chrome */}
        <div className='flex items-center gap-2 mb-6'>
          <div className='w-3 h-3 rounded-full bg-red-500' />
          <div className='w-3 h-3 rounded-full bg-yellow-500' />
          <div className='w-3 h-3 rounded-full bg-green-500' />
          <div className='ml-4 text-sm text-discord-text'>
            REAL-TIME ANALYTICS
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className='space-y-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <div className='flex items-center gap-2 mb-2'>
                <TrendingUp className='h-4 w-4 text-green-500' />
                <span className='text-sm text-discord-text'>Growth</span>
              </div>
              <motion.div
                className='text-2xl font-bold text-white'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                +{animatedValues.growth}%
              </motion.div>
            </div>
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <div className='flex items-center gap-2 mb-2'>
                <Activity className='h-4 w-4 text-blue-500' />
                <span className='text-sm text-discord-text'>Active</span>
              </div>
              <motion.div
                className='text-2xl font-bold text-white'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                {animatedValues.active.toLocaleString()}
              </motion.div>
            </div>
          </div>

          {/* Chart */}
          <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
            <div className='h-32 flex items-end justify-between gap-2'>
              {animatedValues.chartData.map((height, i) => (
                <motion.div
                  key={i}
                  className={`bg-${accent} rounded-t flex-1`}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* Live Activity */}
          <div className='space-y-2'>
            {['New member joined', 'Command executed', 'Message sent'].map(
              (activity, i) => (
                <motion.div
                  key={i}
                  className='flex items-center gap-3 p-2 bg-white/5 rounded border border-white/10'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 + i * 0.2 }}
                >
                  <div
                    className={`w-2 h-2 rounded-full bg-${accent} animate-pulse`}
                  />
                  <span className='text-sm text-discord-text'>{activity}</span>
                  <span className='text-xs text-discord-text/60 ml-auto'>
                    now
                  </span>
                </motion.div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'security') {
    return (
      <div className='relative bg-discord-dark/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8 overflow-hidden'>
        <div className='flex items-center gap-2 mb-6'>
          <div className='w-3 h-3 rounded-full bg-red-500' />
          <div className='w-3 h-3 rounded-full bg-yellow-500' />
          <div className='w-3 h-3 rounded-full bg-green-500' />
          <div className='ml-4 text-sm text-discord-text'>
            SECURITY DASHBOARD
          </div>
        </div>

        <div className='space-y-4'>
          <motion.div
            className='flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className='flex items-center gap-3'>
              <Lock className='h-5 w-5 text-green-500' />
              <span className='text-white font-medium'>Security Status</span>
            </div>
            <Badge className='bg-green-500/20 text-green-400 border-green-500/30'>
              SECURE
            </Badge>
          </motion.div>

          <div className='grid grid-cols-2 gap-4'>
            {[
              { label: 'Threats Blocked', value: '1,247', color: 'red' },
              { label: 'Active Shields', value: '12', color: 'blue' },
              { label: 'Scan Results', value: 'Clean', color: 'green' },
              { label: 'Last Update', value: '2m ago', color: 'yellow' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className='p-3 bg-white/5 rounded border border-white/10'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              >
                <div className='text-sm text-discord-text'>{item.label}</div>
                <div className={`text-lg font-bold text-${item.color}-400`}>
                  {item.value}
                </div>
              </motion.div>
            ))}
          </div>

          <div className='space-y-2'>
            {[
              'Threat Detection',
              'Access Control',
              'Audit Logs',
              'Encryption',
            ].map((item, i) => (
              <motion.div
                key={i}
                className='flex items-center justify-between p-3 bg-white/5 rounded border border-white/10'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
              >
                <span className='text-discord-text'>{item}</span>
                <CheckCircle className='h-4 w-4 text-green-500' />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default automation mockup for other types
  return (
    <div className='relative bg-discord-dark/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8 overflow-hidden'>
      <div className='flex items-center gap-2 mb-6'>
        <div className='w-3 h-3 rounded-full bg-red-500' />
        <div className='w-3 h-3 rounded-full bg-yellow-500' />
        <div className='w-3 h-3 rounded-full bg-green-500' />
        <div className='ml-4 text-sm text-discord-text'>
          {type.toUpperCase()} CONTROL
        </div>
      </div>

      <div className='space-y-4'>
        <motion.div
          className='flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Bot className='h-5 w-5 text-discord-blurple' />
          <span className='text-white'>Auto-Bot System</span>
          <Badge className='bg-green-500/20 text-green-400 border-green-500/30 ml-auto'>
            ACTIVE
          </Badge>
        </motion.div>

        <div className='grid grid-cols-2 gap-2'>
          {['Auto-Role', 'Moderation', 'Notifications', 'Backups'].map(
            (item, i) => (
              <motion.div
                key={i}
                className='p-3 bg-white/5 rounded text-center border border-white/10'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              >
                <div className='text-sm text-discord-text'>{item}</div>
                <div className='text-xs text-green-400'>Enabled</div>
              </motion.div>
            )
          )}
        </div>

        <div className='space-y-2'>
          {Array.from({ length: 4 }, (_, i) => (
            <motion.div
              key={i}
              className='flex items-center gap-3 p-2 bg-white/5 rounded border border-white/10'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
            >
              <div
                className={`w-2 h-2 rounded-full bg-${accent} animate-pulse`}
              />
              <span className='text-sm text-discord-text'>
                Workflow {i + 1} executed
              </span>
              <span className='text-xs text-discord-text/60 ml-auto'>
                active
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const _opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants | undefined = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

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

      <AnimatedHeader />

      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center justify-center pt-20'>
        <motion.div
          className='relative z-20 container mx-auto px-6 text-center'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          <motion.div variants={itemVariants}>
            <Badge className='mb-8 bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 px-4 py-2 font-bold'>
              <Star className='mr-2 h-4 w-4' />
              TRUSTED BY 50,000+ COMMUNITIES
            </Badge>
          </motion.div>

          <motion.h1
            className='text-6xl md:text-8xl font-black mb-8 text-white leading-tight tracking-tight'
            variants={itemVariants}
          >
            <span className='block mb-4'>MANAGE YOUR</span>
            <span className='block text-discord-blurple glow-text'>
              DISCORD EMPIRE
            </span>
          </motion.h1>

          <motion.p
            className='text-xl md:text-2xl text-discord-text max-w-4xl mx-auto mb-12 leading-relaxed font-medium'
            variants={itemVariants}
          >
            The most powerful Discord bot management platform. Built for
            communities that demand excellence.
            <br />
            <span className='text-white font-bold'>Fein Fein fein</span>
          </motion.p>

          <motion.div
            className='flex flex-col sm:flex-row items-center justify-center gap-6 mb-16'
            variants={itemVariants}
          >
            <SignedOut>
              <SignInButton mode='modal'>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Button className='discord-button-primary text-lg px-8 py-4'>
                    START BUILDING
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </motion.div>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href='/servers'>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Button className='discord-button-primary text-lg px-8 py-4'>
                    GO TO DASHBOARD
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </motion.div>
              </Link>
            </SignedIn>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Button className='discord-button-outline text-lg px-8 py-4'>
                <Play className='mr-2 h-5 w-5' />
                WATCH DEMO
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className='flex items-center justify-center'
            variants={itemVariants}
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          >
            <ChevronDown className='h-8 w-8 text-discord-text' />
          </motion.div>
        </motion.div>
      </section>

      {/* Full-Screen Feature Sections */}
      {fullScreenFeatures.map((feature, index) => (
        <section
          key={feature.id}
          className='relative min-h-screen flex items-center justify-center py-20'
          style={{
            background:
              index % 2 === 0
                ? 'rgba(30, 31, 34, 0.8)'
                : 'rgba(17, 18, 20, 0.9)',
          }}
        >
          <div className='container mx-auto px-6'>
            <div className='grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]'>
              {/* Content Side */}
              <motion.div
                className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* Header */}
                <div className='space-y-6'>
                  <motion.div
                    className='text-center lg:text-left'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Badge className='mb-6 bg-discord-green/20 text-discord-green border-discord-green/30 px-4 py-2 font-bold'>
                      ENTERPRISE FEATURES
                    </Badge>
                  </motion.div>

                  <motion.div
                    className={`inline-flex items-center gap-4 p-4 rounded-2xl bg-${feature.accent}/10 border border-${feature.accent}/20`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <feature.icon
                      className={`h-8 w-8 text-${feature.accent}`}
                    />
                    <Badge
                      className={`bg-${feature.accent}/20 text-${feature.accent} border-${feature.accent}/30 font-bold`}
                    >
                      {feature.subtitle}
                    </Badge>
                  </motion.div>

                  <h2 className='text-5xl md:text-6xl font-black text-white tracking-tight leading-tight'>
                    {feature.title}
                  </h2>

                  <p className='text-xl text-discord-text leading-relaxed max-w-2xl'>
                    {feature.description}
                  </p>
                </div>

                {/* Feature List */}
                <div className='grid md:grid-cols-2 gap-4'>
                  {feature.features.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      className='flex items-center gap-3 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10'
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: itemIndex * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{
                        x: 5,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <CheckCircle
                        className={`h-5 w-5 text-${feature.accent} flex-shrink-0`}
                      />
                      <span className='text-white font-medium'>{item}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Stats */}
                <div className='grid grid-cols-3 gap-6'>
                  {feature.stats.map((stat, statIndex) => (
                    <motion.div
                      key={statIndex}
                      className='text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10'
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 17,
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <stat.icon
                        className={`h-6 w-6 text-${feature.accent} mx-auto mb-2`}
                      />
                      <div
                        className={`text-2xl font-black text-${feature.accent} mb-1`}
                      >
                        {stat.value}
                      </div>
                      <div className='text-sm text-discord-text font-medium'>
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Button className='discord-button-primary text-lg px-8 py-4 w-full lg:w-auto'>
                    EXPLORE {feature.title}
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Visual Side */}
              <motion.div
                className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className='relative'>
                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-${feature.accent}/20 rounded-3xl blur-3xl scale-110`}
                  />

                  {/* Mockup Container */}
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <FeatureMockup
                      type={feature.mockupType}
                      accent={feature.accent}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            {index < fullScreenFeatures.length - 1 && (
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
      ))}

      {/* Stats Section */}
      <section className='relative py-32 min-h-screen flex items-center justify-center bg-discord-darker'>
        <div className='container mx-auto px-6'>
          <motion.div
            className='text-center mb-16'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className='mb-6 bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 px-4 py-2 font-bold'>
              TRUSTED WORLDWIDE
            </Badge>
            <h2 className='text-5xl md:text-6xl font-black text-white mb-6'>
              POWERING
              <br />
              <span className='text-discord-blurple glow-text'>
                COMMUNITIES
              </span>
            </h2>
          </motion.div>

          <div className='grid md:grid-cols-4 gap-8'>
            {[
              { number: '50K+', label: 'ACTIVE COMMUNITIES', icon: Users },
              { number: '99.9%', label: 'UPTIME GUARANTEE', icon: Activity },
              { number: '10M+', label: 'MEMBERS MANAGED', icon: Globe },
              { number: '24/7', label: 'SUPPORT AVAILABLE', icon: Eye },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className='text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10'
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <stat.icon className='h-8 w-8 text-discord-blurple mx-auto mb-4' />
                <motion.div
                  className='text-5xl font-black text-discord-blurple mb-2 glow-text'
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {stat.number}
                </motion.div>
                <div className='text-discord-text font-bold tracking-wide'>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='relative py-32 min-h-screen flex items-center justify-center bg-discord-darker'>
        <div className='container mx-auto px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='text-5xl md:text-6xl font-black text-white mb-8'>
              READY TO
              <br />
              <span className='text-discord-blurple glow-text'>
                TAKE CONTROL?
              </span>
            </h2>
            <p className='text-xl text-discord-text mb-12 max-w-2xl mx-auto'>
              Join the elite communities that trust us with their Discord
              empire.
            </p>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-6'>
              <SignedOut>
                <SignInButton mode='modal'>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Button className='discord-button-primary text-xl px-12 py-6'>
                      START YOUR EMPIRE
                      <Sparkles className='ml-2 h-6 w-6' />
                    </Button>
                  </motion.div>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href='/servers'>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Button className='discord-button-primary text-xl px-12 py-6'>
                      ENTER DASHBOARD
                      <ArrowRight className='ml-2 h-6 w-6' />
                    </Button>
                  </motion.div>
                </Link>
              </SignedIn>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Button className='discord-button-outline text-xl px-12 py-6'>
                  <Globe className='mr-2 h-6 w-6' />
                  CONTACT SALES
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <DiscordFooter />
    </div>
  );
}
