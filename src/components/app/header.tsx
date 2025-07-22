'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { motion, useMotionValueEvent,useScroll } from 'framer-motion';
import { Bot, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';

interface AnimatedHeaderProps {
  showNavigation?: boolean;
}

export function AnimatedHeader({ showNavigation = true }: AnimatedHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', latest => {
    const currentScrollY = latest;
    const isAtTop = currentScrollY < 50;

    if (isAtTop) {
      setIsScrolled(false);
      setIsVisible(true);
    } else {
      setIsScrolled(true);

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
    }

    setLastScrollY(currentScrollY);
  });

  return (
    <motion.header
      className='fixed top-0 left-0 right-0 z-50'
      initial={{ y: 0 }}
      animate={{
        y: isVisible ? 0 : -100,
        backgroundColor: isScrolled
          ? 'rgba(30, 31, 34, 0.95)'
          : 'rgba(30, 31, 34, 0)',
        backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
        borderBottom: isScrolled
          ? '1px solid rgba(43, 45, 49, 0.8)'
          : '1px solid transparent',
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className='container mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <motion.a
            href='/'
            className='flex items-center gap-4'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              className='p-3 bg-discord-blurple rounded-xl shadow-glow-blurple'
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Bot className='h-6 w-6 text-white' />
            </motion.div>
            <span className='text-xl font-bold text-white tracking-wide font-minecraft'>
              SPATIUM DASHBOARD
            </span>
          </motion.a>

          {showNavigation && (
            <motion.nav
              className='hidden md:flex items-center gap-8'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {[
                { href: '#features', label: 'Features' },
                { href: '/pricing', label: 'Pricing' },
                { href: '#docs', label: 'Documentation' },
              ].map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className='text-discord-text hover:text-white transition-colors font-medium font-minecraft'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </motion.nav>
          )}

          <motion.div
            className='flex items-center gap-4'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ThemeToggle />
            <SignedOut>
              <SignInButton mode='modal'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Button className='bg-discord-blurple hover:bg-discord-blurple-hover text-white font-bold px-6 py-2 rounded-lg transition-all duration-300 font-minecraft'>
                    SIGN IN
                  </Button>
                </motion.div>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href='/servers'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Button className='discord-button-outline font-minecraft'>
                    <LayoutDashboard className='h-4 w-4 mr-2' />
                    DASHBOARD
                  </Button>
                </motion.div>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                  },
                }}
              />
            </SignedIn>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
