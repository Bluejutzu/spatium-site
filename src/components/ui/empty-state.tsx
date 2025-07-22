import { Server } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-discord-darkest">
        <Server className="w-10 h-10 text-discord-blurple" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">No Servers Found</h3>
      <p className="text-discord-text max-w-md mx-auto">
        You have not added any servers yet. Click the button above to invite the bot to your Discord server and get started!
      </p>
    </div>
  );
}
