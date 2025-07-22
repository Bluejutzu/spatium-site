"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, AlertTriangle, Ban, MessageSquare } from "lucide-react"
import { useState } from "react"

export default function ModerationPage({ params }: { params: { serverId: string } }) {
  const serverSettings = useQuery(api.serverSettings.getServerSettings, {
    serverId: params.serverId
  })

  const updateSettings = useMutation(api.serverSettings.updateServerSettings)

  const [localSettings, setLocalSettings] = useState({
    moderationEnabled: false,
    spamFilter: false,
    linkFilter: false,
    logChannelId: "",
    welcomeMessage: "",
    welcomeChannelId: "",
  })

  if (!serverSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-discord-text">Loading moderation settings...</div>
      </div>
    )
  }

  // Update local state when server settings load
  if (serverSettings && localSettings.moderationEnabled !== serverSettings.moderationEnabled) {
    setLocalSettings({
      moderationEnabled: serverSettings.moderationEnabled,
      spamFilter: serverSettings.spamFilter,
      linkFilter: serverSettings.linkFilter,
      logChannelId: serverSettings.logChannelId || "",
      welcomeMessage: serverSettings.welcomeMessage || "",
      welcomeChannelId: serverSettings.welcomeChannelId || "",
    })
  }

  const handleSettingChange = async (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))

    await updateSettings({
      serverId: params.serverId,
      prefix: serverSettings.prefix,
      welcomeMessage: key === "welcomeMessage" ? value : serverSettings.welcomeMessage,
      welcomeChannelId: key === "welcomeChannelId" ? value : serverSettings.welcomeChannelId,
      autoRole: serverSettings.autoRole,
      autoRoleId: serverSettings.autoRoleId,
      moderationEnabled: key === "moderationEnabled" ? value : serverSettings.moderationEnabled,
      spamFilter: key === "spamFilter" ? value : serverSettings.spamFilter,
      linkFilter: key === "linkFilter" ? value : serverSettings.linkFilter,
      logChannelId: key === "logChannelId" ? value : serverSettings.logChannelId,
      joinNotifications: serverSettings.joinNotifications,
      leaveNotifications: serverSettings.leaveNotifications,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Moderation</h1>
        <p className="text-discord-text">Configure moderation tools and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Moderation Settings
            </CardTitle>
            <CardDescription className="text-discord-text">
              Enable and configure moderation features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Enable Moderation</Label>
                <p className="text-sm text-discord-text">Turn on moderation features</p>
              </div>
              <Switch
                checked={localSettings.moderationEnabled}
                onCheckedChange={(checked) => handleSettingChange("moderationEnabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Spam Filter</Label>
                <p className="text-sm text-discord-text">Automatically detect and remove spam</p>
              </div>
              <Switch
                checked={localSettings.spamFilter}
                onCheckedChange={(checked) => handleSettingChange("spamFilter", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Link Filter</Label>
                <p className="text-sm text-discord-text">Block unauthorized links</p>
              </div>
              <Switch
                checked={localSettings.linkFilter}
                onCheckedChange={(checked) => handleSettingChange("linkFilter", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Log Channel ID</Label>
              <Input
                placeholder="Channel ID for moderation logs"
                value={localSettings.logChannelId}
                onChange={(e) => handleSettingChange("logChannelId", e.target.value)}
                className="bg-discord-dark border-discord-border text-white"
              />
              <p className="text-sm text-discord-text">Channel where moderation actions will be logged</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Welcome System
            </CardTitle>
            <CardDescription className="text-discord-text">
              Configure welcome messages for new members
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
            </div>

            <div className="space-y-2">
              <Label className="text-white">Welcome Message</Label>
              <Textarea
                placeholder="Welcome {user} to {server}!"
                value={localSettings.welcomeMessage}
                onChange={(e) => handleSettingChange("welcomeMessage", e.target.value)}
                className="bg-discord-dark border-discord-border text-white min-h-[100px]"
              />
              <p className="text-sm text-discord-text">
                Use {"{user}"} for username and {"{server}"} for server name
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-discord-text mb-4">Manage user warnings and infractions</p>
            <Button className="w-full bg-discord-blurple hover:bg-discord-blurple/80">
              View Warnings
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-500" />
              Bans & Kicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-discord-text mb-4">Review and manage bans and kicks</p>
            <Button className="w-full bg-discord-blurple hover:bg-discord-blurple/80">
              View History
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Audit Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-discord-text mb-4">View moderation action history</p>
            <Button className="w-full bg-discord-blurple hover:bg-discord-blurple/80">
              View Log
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
