"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Crown, User, Plus, Settings } from "lucide-react"

export default function RolesPage({ params }: { params: { serverId: string } }) {
  const serverSettings = useQuery(api.serverSettings.getServerSettings, {
    serverId: params.serverId
  })

  // In a real app, this would come from Discord API via Convex
  const mockRoles: any[] = []

  const getRoleIcon = (roleName: string) => {
    if (roleName === "Owner") return <Crown className="h-4 w-4 text-yellow-500" />
    if (roleName === "Admin") return <Shield className="h-4 w-4 text-red-500" />
    return <User className="h-4 w-4 text-discord-text" />
  }

  if (!serverSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-discord-text">Loading roles...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Roles</h1>
          <p className="text-discord-text">Manage server roles and permissions</p>
        </div>
        <Button className="bg-discord-blurple hover:bg-discord-blurple/80">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockRoles.length}</div>
            <p className="text-xs text-discord-text">Active roles</p>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Custom Roles</CardTitle>
            <User className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {mockRoles.filter(r => !r.isOwner).length}
            </div>
            <p className="text-xs text-discord-text">User-created roles</p>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Total Members</CardTitle>
            <Crown className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-discord-text">Across all roles</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-discord-darker border-discord-border">
        <CardHeader>
          <CardTitle className="text-white">Role Hierarchy</CardTitle>
          <CardDescription className="text-discord-text">
            Manage role permissions and hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRoles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between p-4 rounded-lg bg-discord-dark border border-discord-border/50 hover:border-discord-border transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(role.name)}
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                    <span className="font-medium text-white">{role.name}</span>
                    {role.isOwner && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Owner
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-discord-text">
                      {role.memberCount} members
                    </span>
                    <span className="text-sm text-discord-text">•</span>
                    <span className="text-sm text-discord-text">
                      Position {role.position}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <Badge
                        key={permission}
                        variant="secondary"
                        className="bg-discord-blurple/20 text-discord-text border-discord-blurple/30 text-xs"
                      >
                        {permission}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="bg-discord-blurple/20 text-discord-text border-discord-blurple/30 text-xs"
                      >
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white">Role Permissions</CardTitle>
            <CardDescription className="text-discord-text">
              Overview of role permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRoles.map((role) => (
                <div key={role.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                    <span className="text-discord-text">{role.name}</span>
                  </div>
                  <span className="text-white font-medium">
                    {role.permissions.length} permissions
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-discord-text">
              Common role management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-discord-blurple hover:bg-discord-blurple/80">
              <Plus className="h-4 w-4 mr-2" />
              Create New Role
            </Button>
            <Button variant="outline" className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10">
              Import Roles
            </Button>
            <Button variant="outline" className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10">
              Export Role Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
