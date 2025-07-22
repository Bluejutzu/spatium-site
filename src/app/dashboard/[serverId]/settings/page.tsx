import SettingsClient from "./SettingsClient";

export function SettingsContent({ serverId }: { serverId: string }) {
  return <SettingsClient serverId={serverId} />;
}
