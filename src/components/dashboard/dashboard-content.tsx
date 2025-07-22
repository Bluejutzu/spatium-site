"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Activity,
  TrendingUp,
  Settings,
  ExternalLink,
  Shield,
  MessageSquare,
  Zap,
  Bell,
  Search,
  Webhook,
} from "lucide-react"

interface DashboardContentProps {
  serverId?: string
}

function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count.toLocaleString()}</span>
}

export function DashboardContent({ serverId }: DashboardContentProps) {
  const [realTimeData, setRealTimeData] = useState({
    onlineUsers: 0,
    messagesPerMinute: 0,
    commandsPerHour: 0,
  })

  useEffect(() => {
    // In a real app, this would fetch actual data from Convex
    // For now, we'll keep it at 0 to avoid placeholder data
  }, [])

  const totalMembers = 0
  const onlineMembers = realTimeData.onlineUsers

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-discord-darker/80 backdrop-blur-sm border-b border-discord-border/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-minecraft tracking-wide">COMMAND CENTER</h1>
            <p className="text-discord-text">Server Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="ghost" className="text-discord-text hover:text-white">
              <Search className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-discord-text hover:text-white relative">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-discord-red rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </Button>
            <Badge className="bg-discord-green/20 text-discord-green border-discord-green/30">
              <div className="w-2 h-2 bg-discord-green rounded-full mr-2 animate-pulse" />
              ONLINE
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        {/* Stats Overview */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: "TOTAL MEMBERS",
                value: totalMembers,
                icon: Users,
                accent: "discord-blurple",
                description: "Community members",
                growth: "No data",
              },
              {
                title: "ONLINE NOW",
                value: onlineMembers,
                icon: Activity,
                accent: "discord-green",
                description: "Currently active",
                growth: "No data",
              },
              {
                title: "MESSAGES/MIN",
                value: realTimeData.messagesPerMinute,
                icon: MessageSquare,
                accent: "discord-purple",
                description: "Live activity",
                growth: "No data",
              },
              {
                title: "COMMANDS/HR",
                value: realTimeData.commandsPerHour,
                icon: Zap,
                accent: "discord-orange",
                description: "Bot interactions",
                growth: "No data",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="discord-card border-2 border-white/10 h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className={`p-3 rounded-xl bg-${stat.accent}/20 w-fit mx-auto mb-4`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <stat.icon className={`h-6 w-6 text-${stat.accent}`} />
                    </motion.div>
                    <h3 className="text-sm font-bold text-white mb-2 tracking-wide">{stat.title}</h3>
                    <div className={`text-3xl font-black text-${stat.accent} mb-2 glow-text`}>
                      <AnimatedCounter end={stat.value} />
                    </div>
                    <p className="text-xs text-discord-text mb-2">{stat.description}</p>
                    <Badge className={`bg-${stat.accent}/20 text-${stat.accent} border-${stat.accent}/30 text-xs`}>
                      <TrendingUp className="mr-1 h-2 w-2" />
                      {stat.growth}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Quick Actions */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="mb-6">
              <Badge className="mb-4 bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 px-4 py-2 font-bold">
                MANAGEMENT TOOLS
              </Badge>
              <h2 className="text-3xl font-black text-white mb-2">
                QUICK <span className="text-discord-blurple glow-text">ACTIONS</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: "SECURITY CENTER",
                  description: "Multi-layered protection with automated moderation.",
                  accent: "discord-green",
                },
                {
                  icon: Settings,
                  title: "AUTOMATION HUB",
                  description: "Streamline operations with intelligent workflows.",
                  accent: "discord-yellow",
                },
                {
                  icon: Users,
                  title: "MEMBER CONTROL",
                  description: "Sophisticated onboarding and role management.",
                  accent: "discord-red",
                },
                {
                  icon: Webhook,
                  title: "INTEGRATIONS",
                  description: "Connect with external services and webhooks.",
                  accent: "discord-purple",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.02 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="discord-card h-full cursor-pointer group hover:border-discord-border-hover">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className={`p-4 rounded-xl bg-${feature.accent}/20 w-fit mx-auto mb-4`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <feature.icon className={`h-8 w-8 text-${feature.accent}`} />
                      </motion.div>
                      <h4 className="text-lg font-bold text-white mb-3 tracking-wide group-hover:text-discord-blurple transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-discord-text leading-relaxed mb-4">{feature.description}</p>
                      <Button className="discord-button-outline w-full">
                        EXPLORE
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Activity & System Status */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="discord-card h-full">
              <CardHeader className="border-b border-discord-border">
                <CardTitle className="text-xl font-bold text-white tracking-wide">RECENT ACTIVITY</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { command: "ban", user: "ToxicUser123", time: "2 min ago", success: true },
                    { command: "welcome", user: "NewMember456", time: "5 min ago", success: true },
                    { command: "modlog", user: "AdminUser", time: "8 min ago", success: true },
                    { command: "purge", user: "ModeratorX", time: "12 min ago", success: false },
                    { command: "role", user: "Helper99", time: "15 min ago", success: true },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${activity.success ? "bg-green-500" : "bg-red-500"
                          } animate-pulse`}
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          /{activity.command} executed by {activity.user}
                        </p>
                        <p className="text-xs text-discord-text">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="discord-card h-full">
              <CardHeader className="border-b border-discord-border">
                <CardTitle className="text-xl font-bold text-white tracking-wide">SYSTEM STATUS</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <motion.div
                    className="flex items-center justify-between p-4 bg-green-900/20 rounded-lg border border-green-500/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-white font-medium">All systems operational</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">HEALTHY</Badge>
                  </motion.div>

                  <div className="space-y-4">
                    {[
                      { label: "API Response Time", value: "45ms", color: "green" },
                      { label: "Memory Usage", value: "68%", color: "yellow" },
                      { label: "Active Connections", value: totalMembers.toLocaleString(), color: "blue" },
                      { label: "Uptime", value: "99.9%", color: "green" },
                    ].map((metric, index) => (
                      <motion.div
                        key={index}
                        className="flex justify-between items-center text-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                      >
                        <span className="text-discord-text">{metric.label}</span>
                        <span className={`font-bold text-${metric.color}-400`}>{metric.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
