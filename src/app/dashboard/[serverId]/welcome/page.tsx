"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, UserPlus, Settings, Preview } from "lucide-react"
import { useState } from "react"

export default function WelcomePage({ params }: { params: { serverId: string } }) {
  const serverSettings = useQuery(api.serverSettings.getServerSettings, {
    serverId: params.serverId
  })

  const updateSettings = useMutation(api.serverSettings.updateServerSettings)

  const [localSettings, setLocalSettings] = useState({
    welcomeMessage: "",
    welcomeChannelId: "",
    autoRole: false,
    autoRoleId: "",
    joinNotifications: false,
    leaveNotifications: false,
  })

  if (!serverSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-discord-text">Loading welcome settings...</div>
      </div>
    )
  }

  // Update local state when server settings load
  if (serverSettings && localSettings.welcomeMessage !== serverSettings.welcomeMessage) {
    setLocalSettings({
      welcomeMessage: serverSettings.welcomeMessage || "",
      welcomeChannelId: serverSettings.welcomeChannelId || "",
      autoRole: serverSettings.autoRole,
      autoRoleId: serverSettings.autoRoleId || "",
      joinNotifications: serverSettings.joinNotifications,
      leaveNotifications: serverSettings.leaveNotifications,
    })
  }

  const handleSettingChange = async (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))

    await updateSettings({
      serverId: params.serverId,
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
    })
  }

  const previewMessage = localSettings.welcomeMessage
    .replace("{user}", "NewMember")
    .replace("{server}", "Gaming Community")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome System</h1>
        <p className="text-discord-text">Configure welcome messages and member onboarding</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-discord-darker border-discord-border">
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
              <Label className="text-white">Welcome Channel ID</Label>
              <Input
                placeholder="Channel ID for welcome messages"
                value={localSettings.welcomeChannelId}
                onChange={(e) => handleSettingChange("welcomeChannelId", e.target.value)}
                className="bg-discord-dark border-discord-border text-white"
              />
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
              <p className="text-sm text-discord-text">
                Use {"{user}"} for username and {"{server}"} for server name
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Message Preview</Label>
              <div className="p-3 rounded-lg bg-discord-dark border border-discord-border text-white">
                {previewMessage || "No message configured"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
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
                <Label className="text-white">Auto Role ID</Label>
                <Input
                  placeholder="Role ID to assign"
                  value={localSettings.autoRoleId}
                  onChange={(e) => handleSettingChange("autoRoleId", e.target.value)}
                  className="bg-discord-dark border-discord-border text-white"
                />
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
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Preview className="h-5 w-5" />
              Message Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10"
              onClick={() => handleSettingChange("welcomeMessage", "Welcome {user} to {server}! 🎉")}
            >
              Simple Welcome
            </Button>
            <Button
              variant="outline"
              className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10"
              onClick={() => handleSettingChange("welcomeMessage", "🎊 {user} has joined {server}! Say hello!")}
            >
              Celebratory
            </Button>
            <Button
              variant="outline"
              className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10"
              onClick={() => handleSettingChange("welcomeMessage", "👋 Hey {user}! Welcome to {server}. Check out our rules!")}
            >
              Friendly
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10"
            >
              Embed Builder
            </Button>
            <Button
              variant="outline"
              className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10"
            >
              DM Welcome
            </Button>
            <Button
              variant="outline"
              className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10"
            >
              Welcome Image
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-discord-text">Welcome Messages Sent:</span>
              <span className="text-white font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-discord-text">Auto Roles Assigned:</span>
              <span className="text-white font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-discord-text">This Month:</span>
              <span className="text-white font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-discord-text">System Status:</span>
              <span className="text-green-500 font-medium">Active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
