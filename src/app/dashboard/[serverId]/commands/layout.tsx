import type React from 'react';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export default function CommandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <div className='min-h-screen relative'>
        <div className='absolute top-4 right-4 z-50'>
          <ThemeToggle />
        </div>
        {children}
      </div>
    </ThemeProvider>
  );
}
