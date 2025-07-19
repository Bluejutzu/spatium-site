"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Webhook, Key, ExternalLink, Plus, Settings, Trash2 } from "lucide-react"
import { useState } from "react"

export default function IntegrationsPage({ params }: { params: { serverId: string } }) {
  const serverSettings = useQuery(api.serverSettings.getServerSettings, {
    serverId: params.serverId
  })

  const [integrations, setIntegrations] = useState<any[]>([])

  const [apiKeys, setApiKeys] = useState<any[]>([])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "inactive": return "bg-gray-500"
      case "error": return "bg-red-500"
      default: return "bg-yellow-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Active"
      case "inactive": return "Inactive"
      case "error": return "Error"
      default: return "Pending"
    }
  }

  if (!serverSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-discord-text">Loading integrations...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Integrations</h1>
          <p className="text-discord-text">Connect external services and webhooks</p>
        </div>
        <Button className="bg-discord-blurple hover:bg-discord-blurple/80">
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Active Integrations</CardTitle>
            <Webhook className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {integrations.filter(i => i.status === "active").length}
            </div>
            <p className="text-xs text-discord-text">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">API Keys</CardTitle>
            <Key className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{apiKeys.length}</div>
            <p className="text-xs text-discord-text">Generated keys</p>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Webhooks</CardTitle>
            <ExternalLink className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {integrations.filter(i => i.type === "webhook").length}
            </div>
            <p className="text-xs text-discord-text">Configured webhooks</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white">Webhooks</CardTitle>
            <CardDescription className="text-discord-text">
              Configure webhooks for external services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrations.filter(i => i.type === "webhook").map((webhook) => (
                <div
                  key={webhook.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-discord-dark border border-discord-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(webhook.status)}`} />
                    <div>
                      <div className="font-medium text-white">{webhook.name}</div>
                      <div className="text-sm text-discord-text">{webhook.url}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-discord-blurple/20 text-discord-text border-discord-blurple/30">
                      {getStatusText(webhook.status)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-discord-border text-discord-text hover:bg-discord-blurple/10"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white">External Services</CardTitle>
            <CardDescription className="text-discord-text">
              Connect with popular platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrations.filter(i => i.type !== "webhook").map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-discord-dark border border-discord-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(integration.status)}`} />
                    <div>
                      <div className="font-medium text-white">{integration.name}</div>
                      <div className="text-sm text-discord-text">
                        {integration.events.join(", ")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={integration.status === "active"}
                      className="data-[state=checked]:bg-discord-blurple"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-discord-border text-discord-text hover:bg-discord-blurple/10"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-discord-darker border-discord-border">
        <CardHeader>
          <CardTitle className="text-white">API Keys</CardTitle>
          <CardDescription className="text-discord-text">
            Manage API keys for external access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 rounded-lg bg-discord-dark border border-discord-border/50"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium text-white">{apiKey.name}</div>
                    <div className="text-sm text-discord-text">{apiKey.key}</div>
                  </div>
                  <div className="flex gap-1">
                    {apiKey.permissions.map((permission) => (
                      <Badge
                        key={permission}
                        variant="secondary"
                        className="bg-discord-blurple/20 text-discord-text border-discord-blurple/30 text-xs"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm text-discord-text">Created {apiKey.created}</div>
                    <div className="text-xs text-discord-text">Last used {apiKey.lastUsed}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-discord-border text-discord-text hover:bg-discord-blurple/10"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Generate New API Key
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white">Available Integrations</CardTitle>
            <CardDescription className="text-discord-text">
              Popular services you can connect
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10 justify-start"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Twitch
            </Button>
            <Button
              variant="outline"
              className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10 justify-start"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              YouTube
            </Button>
            <Button
              variant="outline"
              className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10 justify-start"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10 justify-start"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Spotify
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white">Integration Stats</CardTitle>
            <CardDescription className="text-discord-text">
              Usage statistics and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-discord-text">Total Requests:</span>
              <span className="text-white font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-discord-text">Success Rate:</span>
              <span className="text-white font-medium">0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-discord-text">Average Response:</span>
              <span className="text-white font-medium">0ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-discord-text">Active Connections:</span>
              <span className="text-white font-medium">0</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
