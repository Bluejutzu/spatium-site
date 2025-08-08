'use client';

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Code,
  Globe,
  Settings,
  Shield,
  Sparkles,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import Hero1 from '../mvpblocks/hero-1';
import { StaticNoise } from '../ui/AnimatedNoise';
import RotatingText from '../ui/RotatingText';
import { VelocityScroll } from '../ui/scrollbasedvelocity';
import { Footer } from './footer';
import { AnimatedHeader } from './header';

// Enhanced Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Community Manager',
      server: 'TechHub Discord',
      content:
        'Spatium transformed how we manage our 50k+ member community. The visual command builder is incredible!',
      avatar: 'AC',
    },
    {
      name: 'Sarah Johnson',
      role: 'Server Owner',
      server: 'Gaming Central',
      content:
        "The moderation tools are top-notch. We've seen a 90% reduction in spam since implementing Spatium.",
      avatar: 'SJ',
    },
    {
      name: 'Mike Rodriguez',
      role: 'Bot Developer',
      server: 'Dev Community',
      content:
        'As a developer, I appreciate the clean API and extensive customization options. Highly recommended!',
      avatar: 'MR',
    },
  ];

  return (
    <section className='relative py-20'>
      <div className='container mx-auto px-6'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <Badge className='bg-discord-yellow/20 text-discord-yellow border-discord-yellow/30 mb-4 px-4 py-2'>
            <Star className='mr-2 h-4 w-4' />
            Community Love
          </Badge>
          <h2 className='text-4xl md:text-5xl font-black text-white mb-4'>
            What Our 100% real Users Say
          </h2>
        </motion.div>

        <div className='grid md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className='bg-gradient-to-br from-discord-darker/90 to-discord-dark/90 border-discord-border backdrop-blur-sm h-full'>
                <CardContent className='p-8'>
                  <div className='flex items-center gap-4 mb-6'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-r from-discord-blurple to-purple-600 flex items-center justify-center text-white font-bold'>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className='font-bold text-white'>
                        {testimonial.name}
                      </h4>
                      <p className='text-sm text-discord-text'>
                        {testimonial.role}
                      </p>
                      <p className='text-xs text-discord-blurple'>
                        {testimonial.server}
                      </p>
                    </div>
                  </div>
                  <p className='text-discord-text leading-relaxed italic'>
                    "{testimonial.content}"
                  </p>
                  <div className='flex text-discord-yellow mt-4'>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className='w-4 h-4 fill-current' />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectFeatures() {
  const features = [
    {
      title: 'Command Builder',
      description: 'Create and manage commands visually',
      icon: Code,
      highlights: [
        'Real-time command session management',
        'Multi-user collaboration',
        'Command templates and sharing',
        'Visual flow builder',
      ],
    },
    {
      title: 'Server Management',
      description: 'Complete control over your Discord server',
      icon: Settings,
      highlights: [
        'Welcome message customization',
        'Role management system',
        'Server analytics dashboard',
        'Auto-moderation tools',
      ],
    },
    {
      title: 'Admin Dashboard',
      description: 'Powerful tools for bot administrators',
      icon: Shield,
      highlights: [
        'Server ban management',
        'Active session monitoring',
        'User activity tracking',
        'System-wide analytics',
      ],
    },
  ];

  return (
    <section className='relative py-24 overflow-hidden'>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center mb-20'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
              Built for Discord Communities
            </h2>
            <p className='text-discord-text text-lg max-w-2xl mx-auto'>
              A complete suite of tools designed to enhance your Discord server
              management experience
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className='relative group'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-discord-blurple/20 to-discord-darker rounded-xl transition-all duration-300 group-hover:scale-105' />

              <div className='relative p-8 bg-discord-dark/80 backdrop-blur-sm rounded-xl border border-discord-border hover:border-discord-blurple transition-all duration-300'>
                <div className='mb-6'>
                  <feature.icon className='w-12 h-12 text-discord-blurple' />
                </div>

                <h3 className='text-2xl font-bold text-white mb-4'>
                  {feature.title}
                </h3>

                <p className='text-discord-text mb-6'>{feature.description}</p>

                <ul className='space-y-3'>
                  {feature.highlights.map((highlight, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.2 + i * 0.1,
                      }}
                      viewport={{ once: true }}
                      className='flex items-center gap-2 text-sm text-discord-text'
                    >
                      <div className='w-1.5 h-1.5 rounded-full bg-discord-blurple' />
                      {highlight}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div
      className='bg-discord-dark overflow-hidden min-h-screen'
      ref={containerRef}
    >
      {/* Enhanced Atmospheric Background */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black' />
        <motion.div
          className='absolute inset-0 bg-grid-pattern opacity-5'
          style={{ y }}
        />
        <div className='floating-orb floating-orb-1' />
        <div className='floating-orb floating-orb-2' />
        <div className='floating-orb floating-orb-3' />
        {/* Additional atmospheric elements */}
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-discord-blurple/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
      </div>
      <AnimatedHeader />
      <Hero1 />
      <ProjectFeatures />
      <TestimonialsSection />
      {/* Enhanced Velocity Scroll */}
      <div className='py-20'>
        <VelocityScroll
          default_velocity={3}
          text='SPATIUM • DISCORD • AUTOMATION • COMMUNITY • '
          className='text-8xl md:text-9xl font-black opacity-10'
        />
      </div>

      <section className='relative py-32 min-h-screen flex items-center justify-center bg-discord-darker'>
        <StaticNoise opacity={0.05} />
        <div className='container mx-auto px-6 text-center relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='text-6xl md:text-9xl font-black text-white mb-10 leading-tight text-center'>
              <span className='block'>READY TO</span>
              <span
                className='w-full flex justify-center items-center'
                style={{ minWidth: '12ch' }}
              >
                <RotatingText
                  texts={[
                    'TRANSFORM',
                    'ENCHANT',
                    'MODERNIZE',
                    'BUILD',
                    'CREATE',
                    'ENGAGE',
                    'AMAZE',
                    'WOW',
                    'EXCITE',
                    'SPATIUM',
                    'DO SOMETHING',
                    'Im running out of ideas',
                    'Just kidding',
                    'Why are you still reading this?',
                    'Oh my god just leave',
                    'Just kidding, stay',
                    'So you gonna click the button or what?',
                    'I mean, you can just scroll down',
                    'Its not that hard',
                    'You can do it',
                    'I believe in you',
                    'You got this',
                    'You are amazing',
                    'You are awesome',
                    'You are the best',
                    'You are a legend',
                    'I give up',
                    'TRANSFORM',
                    'ENCHANT',
                    'MODERNIZE',
                    'Got you there didnt I?',
                    'You can still scroll',
                    'You are still here?',
                    'You are persistent',
                    'Ok Im not writing anymore',
                    'You can just click the button',
                    'Did you hear from our sponsor NordVPN?',
                    'Just kidding, we dont have sponsors',
                    'And never will :(',
                    'We are not that famous',
                    'But we do have a button',
                    'So click it already',
                    'If you see the next text',
                    'Screenshot it and send it to us',
                    'We will give you a cookie',
                    'Or a hug',
                    'Or a high five',
                    'Or a virtual pat on the back',
                    'Ready?',
                    '3',
                    '2',
                    '1',
                    'CLICK THE BUTTON!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
                    'No way you didnt',
                    'Youre getting banned',
                    ';)',
                    'Just kidding, we love you',
                    'Dont think we can do that',
                    'We are not that mean',
                    'We are just having fun',
                    'We as in I',
                    'Its just me writing this',
                    '@bluejutzu',
                    'I hope you are enjoying this',
                    'I mean, you are still reading this',
                    'So I guess you are',
                    'I hope you are having a great day',
                    'Btw there are no Docs',
                    'The button is just a placeholder',
                    'But you can still click it',
                    'But nothing will happen',
                    'So click the button',
                    'Lets build something amazing :)',
                  ]}
                  mainClassName='bg-gradient-to-r from-discord-blurple via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text'
                  staggerFrom={'center'}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '120%' }}
                  splitBy='characters'
                  staggerDuration={0.025}
                  splitLevelClassName='overflow-hidden pb-0.5 sm:pb-1 md:pb-1'
                  transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                  rotationInterval={2000}
                />
              </span>
              <span className='block'>YOUR SERVER?</span>
            </h2>
            <p className='text-xl text-wrap md:text-2xl text-discord-text mb-16 max-w-3xl mx-auto leading-relaxed'>
              Start building amazing Discord experiences today with Spatium's
              powerful visual tools, advanced analytics, and comprehensive
              moderation features.
            </p>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-8 mb-16'>
              <SignedOut>
                <SignInButton mode='modal'>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Button className='bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-12 py-6 rounded-2xl text-xl shadow-2xl hover:shadow-discord-blurple/30 transition-all duration-300'>
                      START BUILDING NOW
                      <Sparkles className='ml-3 h-6 w-6' />
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
                    <Button className='bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-12 py-6 rounded-2xl text-xl shadow-2xl hover:shadow-discord-blurple/30 transition-all duration-300'>
                      GO TO DASHBOARD
                      <ArrowRight className='ml-3 h-6 w-6' />
                    </Button>
                  </motion.div>
                </Link>
              </SignedIn>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Button
                  variant='outline'
                  className='discord-button-outline text-xl px-12 py-6 rounded-2xl border-2'
                >
                  VIEW DOCUMENTATION
                  <Globe className='ml-3 h-6 w-6' />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
