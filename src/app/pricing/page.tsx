'use client';

import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

import { DiscordFooter } from '@/components/app/footer';
import { AnimatedHeader } from '@/components/app/header';
import { Badge } from '@/components/ui/badge';

export default function PricingPage() {
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  // Fetch user's current subscription status
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      setLoading(false);
    };

    if (isLoaded) {
      fetchSubscription();
    }
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className='bg-discord-dark min-h-screen flex items-center justify-center'>
        <div className='flex items-center gap-3 text-white'>
          <Loader2 className='h-6 w-6 animate-spin text-discord-blurple' />
          <span className='text-xl'>Loading pricing...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-discord-dark'>
      {/* Atmospheric Background */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black' />
        <div className='absolute inset-0 bg-grid-pattern opacity-5' />
        <div className='floating-orb floating-orb-1' />
        <div className='floating-orb floating-orb-2' />
        <div className='floating-orb floating-orb-3' />
      </div>

      <AnimatedHeader showNavigation={false} />

      {/* Hero Section */}
      <section className='relative py-32 pt-40 min-h-screen flex items-center justify-center'>
        <div className='relative container mx-auto px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='max-w-4xl mx-auto'
          >
            <Badge className='mb-8 bg-discord-yellow/20 text-discord-yellow border-discord-yellow/30 px-4 py-2 font-bold'>
              <AlertCircle className='mr-2 h-4 w-4' />
              SERVICE UPDATE
            </Badge>

            <h1 className='text-6xl md:text-8xl font-black mb-8 text-white leading-tight tracking-tight'>
              <span className='block mb-4'>PRICING</span>
              <span className='block text-discord-yellow glow-text'>
                UNAVAILABLE
              </span>
            </h1>

            <p className='text-xl md:text-2xl text-discord-text max-w-3xl mx-auto mb-16 leading-relaxed font-medium'>
              We're currently updating our billing system to serve you better.
              <span className='text-white font-bold'>
                {' '}
                Pricing and subscriptions are temporarily disabled
              </span>{' '}
              while we make improvements.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Badge className='bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 px-6 py-3 font-bold text-lg'>
                <Star className='mr-2 h-5 w-5' />
                ALL FEATURES REMAIN FREE DURING MAINTENANCE
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className='mt-12'
            >
              <p className='text-discord-text text-lg'>
                Thank you for your patience. We&apos;ll be back soon with
                exciting new plans!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <DiscordFooter />
    </div>
  );
}
