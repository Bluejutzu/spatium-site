'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
  Check,
  Star,
  Info,
  X,
  ArrowRight,
  Crown,
  Sparkles,
  Shield,
  Zap,
  Globe,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedHeader } from '@/components/app/header';
import { DiscordFooter } from '@/components/app/footer';

interface FeatureTooltipProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
}

function FeatureTooltip({
  title,
  description,
  isOpen,
  onClose,
}: FeatureTooltipProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className='absolute inset-0 bg-black/80 backdrop-blur-md'
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Card className='relative z-10 max-w-lg w-full discord-card border-2 border-discord-blurple/50'>
          <CardContent className='p-8'>
            <div className='flex items-start justify-between mb-6'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-discord-blurple/20 flex items-center justify-center'>
                  <Sparkles className='h-5 w-5 text-discord-blurple' />
                </div>
                <h3 className='text-xl font-bold text-white font-minecraft'>
                  {title}
                </h3>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={onClose}
                className='h-8 w-8 hover:bg-white/10 text-discord-text hover:text-white'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
            <p className='text-discord-text leading-relaxed'>{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

const pricingPlans = [
  {
    name: 'STARTER',
    subtitle: 'For small communities',
    price: '$0',
    period: 'FOREVER',
    description:
      'Everything you need to get started with your Discord community',
    cta: 'START BUILDING',
    ctaVariant: 'outline' as const,
    popular: false,
    accent: 'discord-green',
    icon: Shield,
    features: [
      { name: 'Up to 3 servers', included: true },
      { name: 'Basic analytics', included: true },
      { name: '5 custom commands', included: true },
      { name: 'Community support', included: true },
      { name: 'Basic moderation', included: true },
      { name: '30-day data retention', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'Priority support', included: false },
      { name: 'Custom integrations', included: false },
    ],
  },
  {
    name: 'PROFESSIONAL',
    subtitle: 'For growing communities',
    price: '$29',
    period: 'PER MONTH',
    description:
      'Advanced features and priority support for serious community builders',
    cta: 'UPGRADE NOW',
    ctaVariant: 'default' as const,
    popular: true,
    accent: 'discord-blurple',
    icon: Crown,
    features: [
      { name: 'Up to 25 servers', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Unlimited commands', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced moderation', included: true },
      { name: '1-year data retention', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'API access', included: true },
      { name: 'White-label branding', included: false },
    ],
  },
  {
    name: 'ENTERPRISE',
    subtitle: 'For large organizations',
    price: 'CUSTOM',
    period: 'CONTACT US',
    description:
      'Enterprise-grade features with dedicated support and custom solutions',
    cta: 'CONTACT SALES',
    ctaVariant: 'outline' as const,
    popular: false,
    accent: 'discord-yellow',
    icon: Globe,
    features: [
      { name: 'Unlimited servers', included: true },
      { name: 'Enterprise analytics', included: true },
      { name: 'Unlimited everything', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Enterprise moderation', included: true },
      { name: 'Unlimited retention', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'White-label solution', included: true },
      { name: 'Account manager', included: true },
    ],
  },
];

const featureExplanations = {
  'Advanced analytics': {
    title: 'Advanced Analytics',
    description:
      "Get comprehensive insights into your community's engagement patterns, growth metrics, member activity heatmaps, and bot performance analytics with real-time monitoring.",
  },
  'Custom integrations': {
    title: 'Custom Integrations',
    description:
      'Connect Spatium with external services, APIs, and tools. Build custom workflows and automate complex processes across your tech stack.',
  },
  'White-label solution': {
    title: 'White-label Solution',
    description:
      'Completely customize the dashboard with your branding, colors, logo, and custom domain. Remove all references to our platform for a seamless brand experience.',
  },
};

export default function PricingPage() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleFeatureClick = (featureName: string) => {
    if (featureExplanations[featureName as keyof typeof featureExplanations]) {
      setActiveTooltip(featureName);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveTooltip(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className='bg-discord-dark font-minecraft'>
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
      <section className='relative py-32 pt-40'>
        <div className='relative container mx-auto px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className='mb-8 bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 px-4 py-2 font-bold'>
              <Star className='mr-2 h-4 w-4' />
              TRUSTED BY 50,000+ COMMUNITIES
            </Badge>

            <h1 className='text-6xl md:text-8xl font-black mb-8 text-white leading-tight tracking-tight'>
              <span className='block mb-4'>PRICING THAT</span>
              <span className='block text-discord-blurple glow-text'>
                SCALES WITH YOU
              </span>
            </h1>

            <p className='text-xl md:text-2xl text-discord-text max-w-4xl mx-auto mb-16 leading-relaxed font-medium'>
              Start free and grow with confidence. Your first{' '}
              <span className='text-white font-bold'>
                10,000 active members
              </span>{' '}
              and{' '}
              <span className='text-white font-bold'>100 active servers</span>{' '}
              are completely free.
            </p>

            <Badge className='bg-discord-green/20 text-discord-green border-discord-green/30 px-4 py-2 font-bold'>
              <Zap className='mr-2 h-4 w-4' />
              ALL FEATURES FREE IN DEVELOPMENT MODE
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className='relative py-20 pb-32'>
        <div className='container mx-auto px-6'>
          <div className='grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card
                  className={`relative overflow-hidden h-full ${
                    plan.popular
                      ? 'discord-card border-2 border-discord-blurple/50 shadow-glow-blurple scale-105'
                      : 'discord-card hover:border-discord-border-hover'
                  }`}
                >
                  {plan.popular && (
                    <div className='absolute top-0 left-0 right-0 bg-discord-blurple text-white text-center py-3 text-sm font-bold tracking-wide'>
                      <Crown className='inline h-4 w-4 mr-2' />
                      MOST POPULAR
                    </div>
                  )}

                  <CardContent
                    className={`p-8 h-full flex flex-col ${plan.popular ? 'pt-20' : 'pt-8'}`}
                  >
                    {/* Plan Header */}
                    <div className='mb-8'>
                      <div className='flex items-center gap-3 mb-4'>
                        <motion.div
                          className={`p-3 rounded-xl bg-${plan.accent}/20`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 17,
                          }}
                        >
                          <plan.icon
                            className={`h-6 w-6 text-${plan.accent}`}
                          />
                        </motion.div>
                        <div>
                          <h3 className='text-2xl font-bold text-white tracking-wide'>
                            {plan.name}
                          </h3>
                          <p className='text-discord-text font-medium'>
                            {plan.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className='mb-6'>
                        <div className='flex items-baseline gap-2 mb-2'>
                          <span className='text-5xl font-black text-white'>
                            {plan.price}
                          </span>
                          <span className='text-discord-text font-medium tracking-wide'>
                            {plan.period}
                          </span>
                        </div>
                      </div>

                      <p className='text-discord-text mb-8 leading-relaxed'>
                        {plan.description}
                      </p>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Button
                          className={`w-full py-4 text-base font-bold tracking-wide transition-all duration-300 ${
                            plan.ctaVariant === 'default'
                              ? 'discord-button-primary'
                              : 'discord-button-outline'
                          }`}
                          size='lg'
                        >
                          {plan.cta}
                          <ArrowRight className='ml-2 h-5 w-5' />
                        </Button>
                      </motion.div>
                    </div>

                    {/* Features List */}
                    <div className='space-y-4 flex-grow'>
                      <h4 className='font-bold text-white mb-6 text-lg tracking-wide'>
                        WHAT'S INCLUDED:
                      </h4>
                      {plan.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                            featureExplanations[
                              feature.name as keyof typeof featureExplanations
                            ]
                              ? 'cursor-pointer hover:bg-white/5'
                              : ''
                          }`}
                          onClick={() => handleFeatureClick(feature.name)}
                          whileHover={{ x: 2 }}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: featureIndex * 0.05,
                          }}
                          viewport={{ once: true }}
                        >
                          {feature.included ? (
                            <div className='p-1 rounded-full bg-discord-green'>
                              <Check className='h-4 w-4 text-white' />
                            </div>
                          ) : (
                            <div className='p-1 rounded-full bg-discord-text/20'>
                              <X className='h-4 w-4 text-discord-text/40' />
                            </div>
                          )}
                          <span
                            className={`font-medium ${feature.included ? 'text-white' : 'text-discord-text/40'}`}
                          >
                            {feature.name}
                          </span>
                          {featureExplanations[
                            feature.name as keyof typeof featureExplanations
                          ] && (
                            <Info className='h-4 w-4 text-discord-text/40 ml-auto hover:text-white transition-colors' />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <DiscordFooter />

      {/* Feature Tooltip */}
      {activeTooltip &&
        featureExplanations[
          activeTooltip as keyof typeof featureExplanations
        ] && (
          <FeatureTooltip
            title={
              featureExplanations[
                activeTooltip as keyof typeof featureExplanations
              ].title
            }
            description={
              featureExplanations[
                activeTooltip as keyof typeof featureExplanations
              ].description
            }
            isOpen={!!activeTooltip}
            onClose={() => setActiveTooltip(null)}
          />
        )}
    </div>
  );
}
