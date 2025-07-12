import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className='bg-discord-dark font-minecraft min-h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4 text-white'>
        <Loader2 className='h-8 w-8 animate-spin text-discord-blurple' />
        <p className='text-discord-text'>Loading builder...</p>
      </div>
    </div>
  );
}
