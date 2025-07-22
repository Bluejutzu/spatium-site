"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, UserPlus, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function WelcomeSettingsSection({ serverId }: { serverId: string }) {
  const serverSettings = useQuery(api.serverSettings.getServerSettings, {
    serverId
  });

  const updateSettings = useMutation(api.serverSettings.updateServerSettings);
  const { user } = useUser();
  const toast = useToast();
  const [roles, setRoles] = useState<any[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [highPermRole, setHighPermRole] = useState<string | null>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(false);

  const [localSettings, setLocalSettings] = useState({
    welcomeMessage: "",
    welcomeChannelId: "",
    autoRole: false,
    autoRoleId: "",
    joinNotifications: false,
    leaveNotifications: false,
  });

  // Fetch roles on mount
  useEffect(() => {
    async function fetchRoles() {
      if (!user || !serverId) return;
      setLoadingRoles(true);
      try {
        const res = await fetch(`/api/discord/roles?serverId=${serverId}&userId=${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) setRoles(data);
      } catch (e) {
        toast.error("Failed to fetch roles", "Could not load Discord roles.");
      } finally {
        setLoadingRoles(false);
      }
    }
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, serverId]);

  // Fetch channels on mount
  useEffect(() => {
    async function fetchChannels() {
      if (!user || !serverId) return;
      setLoadingChannels(true);
      try {
        const res = await fetch(`/api/discord/channels?serverId=${serverId}&userId=${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) setChannels(data);
      } catch (e) {
        toast.error("Failed to fetch channels", "Could not load Discord channels.");
      } finally {
        setLoadingChannels(false);
      }
    }
    fetchChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, serverId]);

  // Update local state when server settings load
  useEffect(() => {
    if (serverSettings) {
      setLocalSettings(prev => ({
        ...prev,
        welcomeMessage: serverSettings.welcomeMessage || "",
        welcomeChannelId: serverSettings.welcomeChannelId || "",
        autoRole: serverSettings.autoRole,
        autoRoleId: serverSettings.autoRoleId || "",
        joinNotifications: serverSettings.joinNotifications,
        leaveNotifications: serverSettings.leaveNotifications,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverSettings]);

  // Helper: Check if a role has high permissions
  function hasHighPermissions(permissions: string) {
    // Discord permission bits: https://discord.com/developers/docs/topics/permissions
    const ADMINISTRATOR = BigInt(0x8);
    const MANAGE_GUILD = BigInt(0x20);
    const BAN_MEMBERS = BigInt(0x4);
    const KICK_MEMBERS = BigInt(0x2);
    const MANAGE_ROLES = BigInt(0x10000000);
    const perms = BigInt(permissions);
    return (
      (perms & ADMINISTRATOR) !== BigInt(0) ||
      (perms & MANAGE_GUILD) !== BigInt(0) ||
      (perms & BAN_MEMBERS) !== BigInt(0) ||
      (perms & KICK_MEMBERS) !== BigInt(0) ||
      (perms & MANAGE_ROLES) !== BigInt(0)
    );
  }

  const handleSettingChange = async (key: string, value: any) => {
    // If changing autoRoleId, check for high permissions
    if (key === "autoRoleId") {
      const selectedRole = roles.find(r => r.id === value);
      if (selectedRole && hasHighPermissions(selectedRole.permissions)) {
        setHighPermRole(selectedRole.name);
        toast.warning(
          "Warning: High Permission Role",
          `The role '${selectedRole.name}' has high permissions. Are you sure you want to set this as the auto role?`
        );
      } else {
        setHighPermRole(null);
      }
    }
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    if (!serverSettings) return;
    await updateSettings({
      serverId,
      prefix: serverSettings.prefix,
      welcomeMessage: key === "welcomeMessage" ? value : serverSettings.welcomeMessage,
      welcomeChannelId: key === "welcomeChannelId" ? value : serverSettings.welcomeChannelId,
      autoRole: key === "autoRole" ? value : serverSettings.autoRole,
      autoRoleId: key === "autoRoleId" ? value : serverSettings.autoRoleId,
      moderationEnabled: serverSettings.moderationEnabled,
      spamFilter: serverSettings.spamFilter,
      linkFilter: serverSettings.linkFilter,
      logChannelId: serverSettings.logChannelId,
      joinNotifications: key === "joinNotifications" ? value : serverSettings.joinNotifications,
      leaveNotifications: key === "leaveNotifications" ? value : serverSettings.leaveNotifications,
    });
  };

  const previewMessage = localSettings.welcomeMessage
    .replace("{user}", "NewMember")
    .replace("{server}", "Gaming Community");

  if (!serverSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-discord-text">Loading welcome settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome System</h1>
        <p className="text-discord-text">Configure welcome messages and member onboarding</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        <Card className="bg-discord-darker border-discord-border lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Welcome Message
            </CardTitle>
            <CardDescription className="text-discord-text">
              Customize the welcome message for new members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Welcome Channel</Label>
              <Select
                value={localSettings.welcomeChannelId}
                onValueChange={(val) => handleSettingChange("welcomeChannelId", val)}
                disabled={loadingChannels || channels.length === 0}
              >
                <SelectTrigger className="bg-discord-dark border-discord-border text-white">
                  <SelectValue placeholder={loadingChannels ? "Loading channels..." : "Select a channel"} />
                </SelectTrigger>
                <SelectContent className="bg-discord-dark border-discord-border text-white max-h-60 overflow-y-auto">
                  {channels
                    .filter((ch) => ch.type === 0) // Only text channels
                    .map((ch) => (
                      <SelectItem key={ch.id} value={ch.id} className="text-white">
                        #{ch.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-discord-text">Channel where welcome messages will be sent</p>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Welcome Message</Label>
              <Textarea
                placeholder="Welcome {user} to {server}! 🎉"
                value={localSettings.welcomeMessage}
                onChange={(e) => handleSettingChange("welcomeMessage", e.target.value)}
                className="bg-discord-dark border-discord-border text-white min-h-[120px]"
              />
              <div className="mt-4">
                <Label className="text-white mb-2 block">Available Variables</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { key: "{user}", desc: "The username of the new member" },
                    { key: "{userMention}", desc: "Mentions the new member" },
                    { key: "{userAvatarUrl}", desc: "Avatar URL of the new member" },
                    { key: "{guildIconUrl}", desc: "Icon URL of the server" },
                    { key: "{guildBannerUrl}", desc: "Banner URL of the server" },
                    { key: "{guildMemberCount}", desc: "Total member count before join" },
                    { key: "{newGuildMemberCount}", desc: "Total member count after join" },
                    { key: "{server}", desc: "The server name" },
                  ].map((v) => (
                    <div key={v.key} className="flex items-center gap-2 bg-discord-dark border border-discord-border rounded px-2 py-1">
                      <span className="font-mono text-discord-text text-sm select-all">{v.key}</span>
                      <span className="text-xs text-discord-text flex-1">{v.desc}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-discord-text hover:text-white"
                        onClick={() => {
                          navigator.clipboard.writeText(v.key);
                          toast.success("Copied!", `${v.key} copied to clipboard`);
                        }}
                        aria-label={`Copy ${v.key}`}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Message Preview</Label>
              <div className="p-3 rounded-lg bg-discord-dark border border-discord-border text-white">
                {previewMessage || "No message configured"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Auto Role
            </CardTitle>
            <CardDescription className="text-discord-text">
              Automatically assign roles to new members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Enable Auto Role</Label>
                <p className="text-sm text-discord-text">Automatically assign a role to new members</p>
              </div>
              <Switch
                checked={localSettings.autoRole}
                onCheckedChange={(checked) => handleSettingChange("autoRole", checked)}
              />
            </div>

            {localSettings.autoRole && (
              <div className="space-y-2">
                <Label className="text-white">Auto Role</Label>
                <Select
                  value={localSettings.autoRoleId}
                  onValueChange={(val) => handleSettingChange("autoRoleId", val)}
                  disabled={loadingRoles || roles.length === 0}
                >
                  <SelectTrigger className="bg-discord-dark border-discord-border text-white">
                    <SelectValue placeholder={loadingRoles ? "Loading roles..." : "Select a role"} />
                  </SelectTrigger>
                  <SelectContent className="bg-discord-dark border-discord-border text-white max-h-60 overflow-y-auto">
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id} className="text-white">
                        {role.name}
                        {hasHighPermissions(role.permissions) && " (⚠️ High Permissions)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {highPermRole && (
                  <p className="text-sm text-red-400">Warning: The selected role has high permissions!</p>
                )}
                <p className="text-sm text-discord-text">Role that will be automatically assigned</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Join Notifications</Label>
                <p className="text-sm text-discord-text">Send notifications when members join</p>
              </div>
              <Switch
                checked={localSettings.joinNotifications}
                onCheckedChange={(checked) => handleSettingChange("joinNotifications", checked)}
                disabled={!serverSettings?.logChannelId}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Leave Notifications</Label>
                <p className="text-sm text-discord-text">Send notifications when members leave</p>
              </div>
              <Switch
                checked={localSettings.leaveNotifications}
                onCheckedChange={(checked) => handleSettingChange("leaveNotifications", checked)}
                disabled={!serverSettings?.logChannelId}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
