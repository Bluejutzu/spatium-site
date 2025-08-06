'use client';

import { Chrome, Expand, Smartphone } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface DeviceContext {
  windowWidth: number;
  isMobile: boolean;
  isTablet: boolean;
}

interface DeviceCase {
  condition: boolean | ((context: DeviceContext) => boolean);
  header: React.ReactNode;
  subHeader: React.ReactNode;
  icon?: React.ReactNode;
  action?: 'show' | 'toast' | 'none';
}

interface ScreenSizeGateProps {
  minWidth?: number;
  header?: React.ReactNode;
  subHeader?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  cases?: DeviceCase[];
  showGate?: boolean;
}

export function ScreenSizeGate({
  minWidth = 1200,
  header = 'Your browser window is too small',
  subHeader = 'Your browser has to be at least 1200px wide to be able to use the dashboard properly.',
  icon = <Expand className='w-16 h-16 text-[#ff3e3e]' />,
  className = '',
  cases,
  showGate = true,
}: ScreenSizeGateProps) {
  const [mounted, setMounted] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState<number>(0);
  const [show, setShow] = React.useState(false);
  const [hasShownFirefoxWarning, setHasShownFirefoxWarning] =
    React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    // Browser detection
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

    // Detect device type based on current window width
    const isMobile = windowWidth <= 768;
    const isTablet = windowWidth > 768 && windowWidth <= 1024;

    // Initial size check
    let shouldShow = showGate && windowWidth < minWidth;
    let currentHeader = header;
    let currentSubHeader = subHeader;
    let currentIcon = icon;

    // Special handling for Firefox
    if (isFirefox) {
      if (!hasShownFirefoxWarning) {
        toast.warning(
          'Firefox may have display issues. For the best experience, please use Chrome.'
        );
        setHasShownFirefoxWarning(true);
      }
      shouldShow = false;
    }

    // Check custom cases if provided
    if (cases && shouldShow) {
      for (const case_ of cases) {
        // Evaluate condition function if it exists
        const conditionMet =
          typeof case_.condition === 'function'
            ? case_.condition({ windowWidth, isMobile, isTablet })
            : case_.condition;

        if (conditionMet) {
          currentHeader = case_.header ?? header;
          currentSubHeader = case_.subHeader ?? subHeader;
          currentIcon = case_.icon || icon;

          if (case_.action === 'toast') {
            toast.info(case_.header);
            shouldShow = false;
            break;
          } else if (case_.action === 'none') {
            shouldShow = false;
            break;
          }
        }
      }
    }

    setShow(shouldShow);
  }, [
    mounted,
    windowWidth,
    minWidth,
    cases,
    showGate,
    header,
    subHeader,
    icon,
    hasShownFirefoxWarning,
  ]);

  if (!mounted || !show) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0E14] text-white p-4 
        animate-in fade-in-0 duration-300
        ${className}`}
    >
      <div className='flex flex-col items-center justify-center space-y-6 max-w-md text-center scale-95 animate-in zoom-in-95 duration-300'>
        {icon}
        <h1 className='text-2xl font-bold md:text-3xl'>{header}</h1>
        <p className='text-[#8B8D91] text-lg'>{subHeader}</p>
        <p className='text-[#8B8D91]'>
          Please resize your browser. (no we dont support mobile)
        </p>
      </div>
    </div>
  );
}
