'use client';

import {
  Bot,
  Github,
  Twitter,
  MessageSquare,
  Mail,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function DiscordFooter() {
  return (
    <footer className='bg-discord-blurple relative overflow-hidden min-h-screen flex flex-col'>
      {/* Background Effects */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-discord-blurple via-discord-blurple-hover to-discord-darker opacity-90' />
        <div className='absolute inset-0 bg-grid-pattern opacity-10' />

        {/* Floating Orbs */}
        <div className='floating-orb floating-orb-1 opacity-30' />
        <div className='floating-orb floating-orb-2 opacity-20' />
        <div className='floating-orb floating-orb-3 opacity-25' />

        {/* Additional decorative elements */}
        <div className='absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl' />
        <div className='absolute bottom-40 left-20 w-80 h-80 bg-discord-green/10 rounded-full blur-3xl' />
      </div>

      <div className='relative flex-1 flex flex-col'>
        <div className='flex-1 py-20'>
          {/* I fucking hate CSS, removing this breaks everything */}

        </div>

        {/* Large Discord Text Section */}
        <div className='relative py-20 overflow-hidden'>
          <motion.div
            className='text-center'
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <h2 className='text-[8rem] md:text-[12rem] lg:text-[16rem] xl:text-[20rem] font-black text-white/10 font-minecraft tracking-wider select-none leading-none'>
              SPATIUM
            </h2>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className='border-t border-white/20 py-12 bg-black/20 backdrop-blur-sm'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className='container mx-auto px-6'>
            <div className='flex flex-col lg:flex-row justify-between items-center gap-8'>
              <div className='text-center lg:text-left'>
                <p className='text-white/80 text-lg mb-2'>
                  2025 Spatium Dashboard. No rights reserved.
                </p>
                <p className='text-white/60 text-base'>
                  Empowering communities worldwide with cutting-edge bot
                  management technology.
                </p>
              </div>

              <div className='flex flex-wrap items-center justify-center gap-8 text-base'>
                {[
                  { name: 'Terms of Service', href: '/terms' },
                  { name: 'Privacy Policy', href: '/privacy' },
                  { name: 'Cookie Settings', href: '/cookies' },
                  { name: 'Accessibility', href: '/accessibility' },
                ].map((link, _index) => (
                  <motion.div
                    key={link.name}
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Link
                      href={link.href}
                      className='text-white/70 hover:text-white transition-colors duration-300 font-medium'
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className='mt-12 pt-8 border-t border-white/10 text-center'>
              <p className='text-white/60 text-lg leading-relaxed max-w-4xl mx-auto'>
                The Spatium Bot Dashboard was solely created out of learning
                purposes and majority of the data is just placeholders.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
