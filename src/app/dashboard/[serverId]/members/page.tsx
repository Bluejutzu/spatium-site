"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Crown, Shield, User } from "lucide-react"
import { useState } from "react"

export default function MembersPage({ params }: { params: { serverId: string } }) {
  const serverSettings = useQuery(api.serverSettings.getServerSettings, {
    serverId: params.serverId
  })

  const [searchQuery, setSearchQuery] = useState("")

  // In a real app, this would come from Discord API via Convex
  const mockMembers: any[] = []

  const filteredMembers = mockMembers.filter(member =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500"
      case "idle": return "bg-yellow-500"
      case "dnd": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getRoleIcon = (roles: string[]) => {
    if (roles.includes("Owner")) return <Crown className="h-4 w-4 text-yellow-500" />
    if (roles.includes("Admin")) return <Shield className="h-4 w-4 text-red-500" />
    return <User className="h-4 w-4 text-discord-text" />
  }

  if (!serverSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-discord-text">Loading members...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Members</h1>
        <p className="text-discord-text">Manage server members and roles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Total Members</CardTitle>
            <Users className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockMembers.length}</div>
            <p className="text-xs text-discord-text">Active members</p>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Online Now</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {mockMembers.filter(m => m.status === "online").length}
            </div>
            <p className="text-xs text-discord-text">Currently online</p>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Roles</CardTitle>
            <Shield className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-discord-text">Active roles</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-discord-darker border-discord-border">
        <CardHeader>
          <CardTitle className="text-white">Member List</CardTitle>
          <CardDescription className="text-discord-text">
            View and manage server members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-discord-text" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-discord-dark border-discord-border text-white"
              />
            </div>

            <div className="space-y-2">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-discord-dark border border-discord-border/50 hover:border-discord-border transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.username} />
                        <AvatarFallback className="bg-discord-blurple text-white">
                          {member.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-discord-darker ${getStatusColor(member.status)}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{member.username}</span>
                        {getRoleIcon(member.roles)}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {member.roles.map((role) => (
                          <Badge
                            key={role}
                            variant="secondary"
                            className="bg-discord-blurple/20 text-discord-text border-discord-blurple/30"
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-discord-text">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-discord-border text-discord-text hover:bg-discord-blurple/10"
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
