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

const footerSections = [
  {
    title: 'Product',
    links: [
      { name: 'Download', href: '/download' },
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Status', href: '/status' },
      { name: 'API Documentation', href: '/api' },
      { name: 'Integrations', href: '/integrations' },
      { name: 'Mobile App', href: '/mobile' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Brand Assets', href: '/brand' },
      { name: 'Newsroom', href: '/news' },
      { name: 'Contact Sales', href: '/contact' },
      { name: 'Partnerships', href: '/partners' },
      { name: 'Investors', href: '/investors' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Help Center', href: '/support' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Community Forum', href: '/community' },
      { name: 'Blog & Updates', href: '/blog' },
      { name: 'Developer Portal', href: '/developers' },
      { name: 'Templates', href: '/templates' },
      { name: 'Tutorials', href: '/tutorials' },
    ],
  },
  {
    title: 'Legal & Policies',
    links: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Community Guidelines', href: '/guidelines' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'DMCA Policy', href: '/dmca' },
      { name: 'Security', href: '/security' },
      { name: 'Compliance', href: '/compliance' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Contact Support', href: '/support/contact' },
      { name: 'System Status', href: '/status' },
      { name: 'Bug Reports', href: '/bugs' },
      { name: 'Feature Requests', href: '/features' },
      { name: 'Training', href: '/training' },
      { name: 'Webinars', href: '/webinars' },
      { name: 'Enterprise', href: '/enterprise' },
    ],
  },
];

const socialLinks = [
  {
    icon: Twitter,
    href: 'https://twitter.com',
    label: 'Twitter',
    color: 'hover:bg-blue-500/20',
  },
  {
    icon: Github,
    href: 'https://github.com',
    label: 'GitHub',
    color: 'hover:bg-gray-500/20',
  },
  {
    icon: MessageSquare,
    href: 'https://discord.com',
    label: 'Discord',
    color: 'hover:bg-discord-blurple/20',
  },
  {
    icon: Mail,
    href: 'mailto:contact@example.com',
    label: 'Email',
    color: 'hover:bg-green-500/20',
  },
];

const quickStats = [
  { number: '50K+', label: 'Active Communities', icon: '🏘️' },
  { number: '10M+', label: 'Members Managed', icon: '👥' },
  { number: '99.9%', label: 'Uptime Guarantee', icon: '⚡' },
  { number: '24/7', label: 'Support Available', icon: '🛟' },
];

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
        {/* Main Content Section */}
        <div className='flex-1 py-20'>
          <div className='container mx-auto px-6'>
            {/* Header Section */}
            <motion.div
              className='text-center mb-20'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className='flex items-center justify-center gap-6 mb-12'>
                <motion.div
                  className='p-6 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20'
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Bot className='h-16 w-16 text-white' />
                </motion.div>
                <div className='text-left'>
                  <h2 className='text-6xl md:text-7xl font-black text-white font-minecraft tracking-wide mb-2'>
                    SPATIUM
                  </h2>
                  <p className='text-4xl md:text-5xl font-black text-white/80 font-minecraft tracking-wide'>
                    DASHBOARD
                  </p>
                </div>
              </div>

              <p className='text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed font-medium mb-12'>
                The most powerful Discord bot management platform in the
                universe.
                <br />
                <span className='text-white font-bold'>
                  Built for communities that demand excellence.
                </span>
              </p>

              {/* Quick Stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-16'>
                {quickStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className='text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20'
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className='text-4xl mb-3'>{stat.icon}</div>
                    <div className='text-3xl md:text-4xl font-black text-white mb-2 font-minecraft'>
                      {stat.number}
                    </div>
                    <div className='text-white/80 font-bold tracking-wide text-sm md:text-base'>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Links Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20'>
              {footerSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  className='space-y-6'
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className='text-2xl font-black text-white mb-8 font-minecraft tracking-wide border-b border-white/20 pb-4'>
                    {section.title}
                  </h3>
                  <ul className='space-y-4'>
                    {section.links.map((link, linkIndex) => (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: linkIndex * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <Link
                          href={link.href}
                          className='text-white/80 hover:text-white transition-all duration-300 flex items-center gap-3 group text-lg py-2 px-3 rounded-lg hover:bg-white/10'
                        >
                          <ChevronRight className='h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1' />
                          <span className='group-hover:translate-x-1 transition-transform duration-300'>
                            {link.name}
                          </span>
                          <ExternalLink className='h-4 w-4 opacity-0 group-hover:opacity-60 transition-opacity duration-300 ml-auto' />
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Social Links Section */}
            <motion.div
              className='text-center mb-20'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className='text-3xl font-black text-white mb-8 font-minecraft tracking-wide'>
                CONNECT WITH OUR COMMUNITY
              </h3>
              <div className='flex justify-center gap-6'>
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 transition-all duration-300 ${social.color}`}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <social.icon className='h-8 w-8 text-white' />
                    <span className='sr-only'>{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
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
                ].map((link, index) => (
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
