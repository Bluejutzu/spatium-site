'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' className='h-8 w-8'>
        <div className='h-4 w-4' />
      </Button>
    );
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className='h-8 w-8'
    >
      {theme === 'light' ? (
        <Moon className='h-4 w-4' />
      ) : (
        <Sun className='h-4 w-4' />
      )}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
