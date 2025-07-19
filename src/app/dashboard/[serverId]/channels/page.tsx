"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Hash, Volume2, Lock, Plus, Settings, Users } from "lucide-react"

export default function ChannelsPage({ params }: { params: { serverId: string } }) {
  const serverSettings = useQuery(api.serverSettings.getServerSettings, {
    serverId: params.serverId
  })

  // In a real app, this would come from Discord API via Convex
  const mockChannels: any[] = []

  const categories = [...new Set(mockChannels.map(channel => channel.category))]

  const getChannelIcon = (type: string) => {
    return type === "voice" ? <Volume2 className="h-4 w-4" /> : <Hash className="h-4 w-4" />
  }

  const getChannelTypeColor = (type: string) => {
    return type === "voice" ? "text-green-500" : "text-discord-text"
  }

  if (!serverSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-discord-text">Loading channels...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Channels</h1>
          <p className="text-discord-text">Manage server channels and categories</p>
        </div>
        <Button className="bg-discord-blurple hover:bg-discord-blurple/80">
          <Plus className="h-4 w-4 mr-2" />
          Create Channel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Total Channels</CardTitle>
            <Hash className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockChannels.length}</div>
            <p className="text-xs text-discord-text">All channels</p>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Text Channels</CardTitle>
            <Hash className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {mockChannels.filter(c => c.type === "text").length}
            </div>
            <p className="text-xs text-discord-text">Text channels</p>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Voice Channels</CardTitle>
            <Volume2 className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {mockChannels.filter(c => c.type === "voice").length}
            </div>
            <p className="text-xs text-discord-text">Voice channels</p>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Categories</CardTitle>
            <Users className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{categories.length}</div>
            <p className="text-xs text-discord-text">Channel categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category} className="bg-discord-darker border-discord-border">
            <CardHeader>
              <CardTitle className="text-white">{category}</CardTitle>
              <CardDescription className="text-discord-text">
                {mockChannels.filter(c => c.category === category).length} channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockChannels
                  .filter(channel => channel.category === category)
                  .map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-discord-dark border border-discord-border/50 hover:border-discord-border transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 ${getChannelTypeColor(channel.type)}`}>
                          {getChannelIcon(channel.type)}
                          <span className="font-medium text-white">#{channel.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {channel.isPrivate && (
                            <Lock className="h-4 w-4 text-yellow-500" />
                          )}
                          {channel.isNSFW && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              NSFW
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-discord-text">
                            {channel.memberCount} members
                          </div>
                          <div className="text-xs text-discord-text">
                            {channel.lastMessage}
                          </div>
                        </div>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white">Channel Statistics</CardTitle>
            <CardDescription className="text-discord-text">
              Overview of channel activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                          <div className="flex justify-between">
              <span className="text-discord-text">Most Active Channel:</span>
              <span className="text-white font-medium">None</span>
            </div>
            <div className="flex justify-between">
              <span className="text-discord-text">Total Members:</span>
              <span className="text-white font-medium">0</span>
            </div>
              <div className="flex justify-between">
                <span className="text-discord-text">Private Channels:</span>
                <span className="text-white font-medium">
                  {mockChannels.filter(c => c.isPrivate).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-discord-text">NSFW Channels:</span>
                <span className="text-white font-medium">
                  {mockChannels.filter(c => c.isNSFW).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-discord-text">
              Common channel management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-discord-blurple hover:bg-discord-blurple/80">
              <Plus className="h-4 w-4 mr-2" />
              Create Text Channel
            </Button>
            <Button variant="outline" className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10">
              <Volume2 className="h-4 w-4 mr-2" />
              Create Voice Channel
            </Button>
            <Button variant="outline" className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10">
              <Users className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
