import CommandsClient from './CommandsClient';

export function CommandsContent({ serverId }: { serverId: string }) {
  return <CommandsClient params={{ serverId }} />;
}
