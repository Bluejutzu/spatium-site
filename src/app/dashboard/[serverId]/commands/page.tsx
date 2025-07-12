import CommandsClient from './CommandsClient';

export default function CommandsPage({
  params,
}: {
  params: { serverId: string };
}) {
  return <CommandsClient params={params} />;
}