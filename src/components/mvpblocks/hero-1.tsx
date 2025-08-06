'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

import DarkVeil from '../ui/DarkVeil';
import { DiscordChatInterface } from './discord-chat-interface';
import { ModerationDashboard } from './moderation-dashboard';

interface ModerationLog {
  id: string;
  action: string;
  userId: string;
  username: string;
  reason: string;
  moderator: string;
  timestamp: Date;
  duration?: string;
  status: 'active' | 'completed' | 'pending';
}

export default function Hero1() {
  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>([
    {
      id: '1',
      action: 'Warn',
      userId: 'user_example',
      username: 'ExampleUser',
      reason: 'Inappropriate language in general chat',
      moderator: 'AutoMod',
      timestamp: new Date(Date.now() - 600000),
      status: 'completed',
    },
    {
      id: '2',
      action: 'Mute',
      userId: 'user_spammer',
      username: 'SpammerUser',
      reason: 'Excessive message spam',
      moderator: 'ModeratorUser',
      timestamp: new Date(Date.now() - 300000),
      duration: '1h',
      status: 'active',
    },
  ]);

  const handleModerationAction = (newLog: ModerationLog) => {
    setModerationLogs(prev => [...prev, newLog]);
  };

  return (
    <div className='relative w-full bg-neutral-950 min-h-screen'>
      <DarkVeil speed={0.75} warpAmount={3} />
      <div className='absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]'></div>

      {/* Animated grid background */}
      <div className='pointer-events-none absolute h-full w-full overflow-hidden opacity-50 [perspective:200px]'>
        <div className='absolute inset-0 [transform:rotateX(35deg)]'>
          <div className='animate-grid [background-image:linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)] [background-repeat:repeat] [background-size:120px_120px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw]'></div>
        </div>
        <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent to-90%'></div>
      </div>

      <section className='z-1 relative mx-auto max-w-full'>
        <div className='z-10 mx-auto max-w-screen-xl gap-12 px-4 py-28 text-gray-600 md:px-8'>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='leading-0 mx-auto max-w-4xl space-y-5 text-center lg:leading-5 mb-16'
          >
            <h2 className='font-geist font-black mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-4xl tracking-tighter text-transparent md:text-6xl'>
              Community Management <br />
              <span className='bg-gradient-to-r from-purple-300 to-orange-200 bg-clip-text text-transparent'>
                Made Simple
              </span>
            </h2>

            <p className='mx-auto max-w-2xl text-xl text-gray-300/70'>
              Experience seamless server management with our intuitive command
              interface and real-time moderation dashboard.
            </p>
          </motion.div>

          {/* Main Interface */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2'
          >
            {/* Left Panel: Discord Chat Interface */}
            <div className='h-[600px]'>
              <div className='mb-4'>
                <h3 className='text-white font-bold text-xl mb-2'>
                  Command Interface
                </h3>
                <p className='text-gray-400 text-sm'>
                  Execute moderation commands just like in Discord
                </p>
              </div>
              <DiscordChatInterface
                onModerationAction={handleModerationAction}
              />
            </div>

            {/* Right Panel: Moderation Dashboard */}
            <div className='h-[600px]'>
              <div className='mb-4'>
                <h3 className='text-white font-bold text-xl mb-2'>
                  Live Dashboard
                </h3>
                <p className='text-gray-400 text-sm'>
                  Monitor all moderation activities in real-time thanks to{' '}
                  <a
                    className='text-discord-blurple hover:text-discord-blurple-hover'
                    href='http://convex.dev'
                    target='_blank'
                  >
                    Convex
                  </a>
                </p>
              </div>
              <ModerationDashboard logs={moderationLogs} />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
