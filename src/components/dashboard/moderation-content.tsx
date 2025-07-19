"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Shield, AlertTriangle, Ban, UserX, Eye } from "lucide-react"

interface ModerationContentProps {
  serverId?: string
}

export function ModerationContent({ serverId }: ModerationContentProps) {
  const recentActions = [
    { action: "Ban", user: "ToxicUser123", reason: "Spam", moderator: "AdminUser", time: "2 min ago" },
    {
      action: "Kick",
      user: "RuleBreaker456",
      reason: "Inappropriate content",
      moderator: "ModeratorX",
      time: "15 min ago",
    },
    { action: "Warn", user: "NewUser789", reason: "Minor rule violation", moderator: "Helper99", time: "1 hour ago" },
  ]

  return (
    <div className="flex-1 overflow-auto">
      <header className="sticky top-0 z-20 bg-discord-darker/80 backdrop-blur-sm border-b border-discord-border/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge className="mb-2 bg-discord-red/20 text-discord-red border-discord-red/30">
              <Shield className="mr-2 h-4 w-4" />
              MODERATION CENTER
            </Badge>
            <h1 className="text-2xl font-bold text-white font-minecraft tracking-wide">SECURITY CONTROL</h1>
            <p className="text-discord-text">Monitor and manage server moderation</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="discord-button-outline">
              <Eye className="w-4 h-4 mr-2" />
              View Logs
            </Button>
            <Button className="discord-button-primary">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Quick Action
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Active Warnings", value: "3", icon: AlertTriangle, color: "discord-yellow" },
            { title: "Bans This Month", value: "12", icon: Ban, color: "discord-red" },
            { title: "Kicks This Month", value: "8", icon: UserX, color: "discord-orange" },
            { title: "Auto-Mod Actions", value: "45", icon: Shield, color: "discord-green" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="discord-card">
                <CardContent className="p-6 text-center">
                  <div className={`p-3 rounded-xl bg-${stat.color}/20 w-fit mx-auto mb-4`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                  </div>
                  <div className={`text-3xl font-black text-${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-discord-text text-sm">{stat.title}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="discord-card">
          <CardHeader>
            <CardTitle className="text-white">Recent Moderation Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        action.action === "Ban"
                          ? "bg-discord-red/20"
                          : action.action === "Kick"
                            ? "bg-discord-orange/20"
                            : "bg-discord-yellow/20"
                      }`}
                    >
                      {action.action === "Ban" && <Ban className="w-4 h-4 text-discord-red" />}
                      {action.action === "Kick" && <UserX className="w-4 h-4 text-discord-orange" />}
                      {action.action === "Warn" && <AlertTriangle className="w-4 h-4 text-discord-yellow" />}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {action.action} - {action.user}
                      </div>
                      <div className="text-xs text-discord-text">
                        {action.reason} • by {action.moderator}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-discord-text">{action.time}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
