"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
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
  BarChart3,
  Crown,
  Bot,
  Globe,
  Layers,
  Database,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"

interface DashboardContentProps {
  serverId?: string
}

// Enhanced Animated Counter with better performance
function AnimatedCounter({
  end,
  duration = 2000,
  suffix = "",
  prefix = "",
  className = ""
}: {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Smooth easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOutCubic * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, isInView])

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// Enhanced Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  description,
  accent,
  index,
  onClick
}: {
  icon: any;
  title: string;
  description: string;
  accent: string;
  index: number;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <Card className="discord-card h-full cursor-pointer group hover:border-discord-border-hover transition-all duration-500 relative overflow-hidden border-2 border-discord-border/50">
        {/* Enhanced background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br from-${accent}/5 via-transparent to-${accent}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Animated border glow */}
        <div className={`absolute inset-0 bg-gradient-to-r from-${accent} via-${accent} to-${accent} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />

        <CardContent className="p-8 text-center relative z-10 h-full flex flex-col">
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`p-6 rounded-2xl bg-gradient-to-r from-${accent}/20 to-${accent}/10 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-${accent}/30`}
          >
            <Icon className={`h-10 w-10 text-${accent}`} />
          </motion.div>

          <h4 className="text-xl font-bold text-white mb-4 tracking-wide group-hover:text-discord-blurple transition-colors duration-300">
            {title}
          </h4>

          <p className="text-discord-text leading-relaxed mb-6 flex-grow group-hover:text-white/90 transition-colors duration-300">
            {description}
          </p>

          <Button className="discord-button-outline w-full group-hover:bg-discord-blurple/10 transition-all duration-300">
            EXPLORE
            <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Enhanced Activity Item Component
function ActivityItem({ activity, index }: { activity: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ x: 5 }}
    >
      <div className={`w-3 h-3 rounded-full ${
        activity.success ? "bg-green-500" : "bg-red-500"
      } animate-pulse shadow-lg`} />
      <div className="flex-1">
        <p className="text-white font-medium group-hover:text-discord-blurple transition-colors duration-300">
          <span className="font-mono text-discord-blurple">/{activity.command}</span> executed by{" "}
          <span className="font-semibold">{activity.user}</span>
        </p>
        <p className="text-xs text-discord-text">{activity.time}</p>
      </div>
      <Badge className={`${
        activity.success
          ? 'bg-green-500/20 text-green-400 border-green-500/30'
          : 'bg-red-500/20 text-red-400 border-red-500/30'
      }`}>
        {activity.success ? 'Success' : 'Failed'}
      </Badge>
    </motion.div>
  )
}

export function DashboardContent({ serverId }: DashboardContentProps) {
  const [realTimeData, setRealTimeData] = useState({
    onlineUsers: 0,
    messagesPerMinute: 0,
    commandsPerHour: 0,
  })

  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: 99.9,
    responseTime: 45,
    memoryUsage: 68,
    activeConnections: 0,
  })

  useEffect(() => {
    // In a real app, this would fetch actual data from Convex
    // For now, we'll keep it at 0 to avoid placeholder data
  }, [])

  const totalMembers = 0
  const onlineMembers = realTimeData.onlineUsers

  // Sample activity data
  const recentActivity = [
    { command: "ban", user: "ToxicUser123", time: "2 min ago", success: true },
    { command: "welcome", user: "NewMember456", time: "5 min ago", success: true },
    { command: "modlog", user: "AdminUser", time: "8 min ago", success: true },
    { command: "purge", user: "ModeratorX", time: "12 min ago", success: false },
    { command: "role", user: "Helper99", time: "15 min ago", success: true },
  ]

  return (
    <div className="flex-1 overflow-auto bg-discord-dark">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-20 bg-discord-darker/95 backdrop-blur-xl border-b border-discord-border/50 p-8">
        <div className="flex items-center justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-black text-white font-minecraft tracking-wide mb-2">
                COMMAND CENTER
              </h1>
              <p className="text-discord-text text-lg">Server Dashboard • Real-time Overview</p>
            </motion.div>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm" variant="ghost" className="text-discord-text hover:text-white hover:bg-white/10 transition-all duration-300">
              <Search className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-discord-text hover:text-white hover:bg-white/10 relative transition-all duration-300">
              <Bell className="w-4 h-4" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-discord-red rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs text-white font-bold">3</span>
              </motion.div>
            </Button>
            <Badge className="bg-discord-green/20 text-discord-green border-discord-green/30 px-4 py-2">
              <div className="w-2 h-2 bg-discord-green rounded-full mr-2 animate-pulse" />
              ONLINE
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 space-y-12">
        {/* Enhanced Stats Overview */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge className="mb-4 bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 px-4 py-2 font-bold">
              <BarChart3 className="mr-2 h-4 w-4" />
              LIVE METRICS
            </Badge>
            <h2 className="text-4xl font-black text-white mb-2">
              SERVER <span className="text-discord-blurple glow-text">OVERVIEW</span>
            </h2>
            <p className="text-discord-text text-lg">Real-time statistics and performance metrics</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "TOTAL MEMBERS",
                value: totalMembers,
                icon: Users,
                accent: "discord-blurple",
                description: "Community members",
                growth: "No data",
                trend: "neutral",
              },
              {
                title: "ONLINE NOW",
                value: onlineMembers,
                icon: Activity,
                accent: "discord-green",
                description: "Currently active",
                growth: "No data",
                trend: "neutral",
              },
              {
                title: "MESSAGES/MIN",
                value: realTimeData.messagesPerMinute,
                icon: MessageSquare,
                accent: "discord-purple",
                description: "Live activity",
                growth: "No data",
                trend: "neutral",
              },
              {
                title: "COMMANDS/HR",
                value: realTimeData.commandsPerHour,
                icon: Zap,
                accent: "discord-orange",
                description: "Bot interactions",
                growth: "No data",
                trend: "neutral",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card className="discord-card border-2 border-white/10 h-full hover:border-discord-blurple/50 transition-all duration-500 relative overflow-hidden">
                  {/* Enhanced background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${stat.accent}/5 via-transparent to-${stat.accent}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <CardContent className="p-8 text-center relative z-10">
                    <motion.div
                      className={`p-4 rounded-2xl bg-gradient-to-r from-${stat.accent}/20 to-${stat.accent}/10 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-${stat.accent}/30`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <stat.icon className={`h-8 w-8 text-${stat.accent}`} />
                    </motion.div>

                    <h3 className="text-sm font-bold text-white mb-3 tracking-wide uppercase">
                      {stat.title}
                    </h3>

                    <div className={`text-4xl font-black text-${stat.accent} mb-3 glow-text`}>
                      <AnimatedCounter end={stat.value} />
                    </div>

                    <p className="text-xs text-discord-text mb-3">{stat.description}</p>

                    <Badge className={`bg-${stat.accent}/20 text-${stat.accent} border-${stat.accent}/30 text-xs px-3 py-1`}>
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {stat.growth}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced Quick Actions */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="mb-8">
              <Badge className="mb-4 bg-discord-green/20 text-discord-green border-discord-green/30 px-4 py-2 font-bold">
                <Crown className="mr-2 h-4 w-4" />
                MANAGEMENT TOOLS
              </Badge>
              <h2 className="text-4xl font-black text-white mb-2">
                QUICK <span className="text-discord-green glow-text">ACTIONS</span>
              </h2>
              <p className="text-discord-text text-lg">Access powerful tools to manage your Discord community</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: "SECURITY CENTER",
                  description: "Multi-layered protection with automated moderation, spam detection, and member screening.",
                  accent: "discord-green",
                },
                {
                  icon: Settings,
                  title: "AUTOMATION HUB",
                  description: "Streamline operations with intelligent workflows, auto-roles, and custom triggers.",
                  accent: "discord-yellow",
                },
                {
                  icon: Users,
                  title: "MEMBER CONTROL",
                  description: "Sophisticated onboarding, role management, and community engagement tools.",
                  accent: "discord-red",
                },
                {
                  icon: Webhook,
                  title: "INTEGRATIONS",
                  description: "Connect with external services, webhooks, and third-party applications seamlessly.",
                  accent: "discord-purple",
                },
              ].map((feature, index) => (
                <FeatureCard
                  key={index}
                  {...feature}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Enhanced Activity & System Status */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="discord-card h-full border-2 border-discord-border/50 hover:border-discord-border transition-all duration-300">
              <CardHeader className="border-b border-discord-border p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
                    <Activity className="w-6 h-6 text-discord-blurple" />
                    RECENT ACTIVITY
                  </CardTitle>
                  <Button size="sm" variant="outline" className="discord-button-outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <ActivityItem key={index} activity={activity} index={index} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced System Status */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="discord-card h-full border-2 border-discord-border/50 hover:border-discord-border transition-all duration-300">
              <CardHeader className="border-b border-discord-border p-6">
                <CardTitle className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
                  <Globe className="w-6 h-6 text-discord-green" />
                  SYSTEM STATUS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Overall status */}
                  <motion.div
                    className="flex items-center justify-between p-6 bg-green-900/20 rounded-xl border border-green-500/20 hover:bg-green-900/30 transition-colors duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                      <span className="text-white font-bold text-lg">All systems operational</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 font-bold">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      HEALTHY
                    </Badge>
                  </motion.div>

                  {/* Detailed metrics */}
                  <div className="space-y-6">
                    {[
                      {
                        label: "API Response Time",
                        value: `${systemHealth.responseTime}ms`,
                        color: "green",
                        icon: Clock,
                        status: "excellent"
                      },
                      {
                        label: "Memory Usage",
                        value: `${systemHealth.memoryUsage}%`,
                        color: "yellow",
                        icon: Database,
                        status: "good"
                      },
                      {
                        label: "Active Connections",
                        value: totalMembers.toLocaleString(),
                        color: "blue",
                        icon: Users,
                        status: "stable"
                      },
                      {
                        label: "System Uptime",
                        value: `${systemHealth.uptime}%`,
                        color: "green",
                        icon: TrendingUp,
                        status: "excellent"
                      },
                    ].map((metric, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300 group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-3">
                          <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
                          <span className="text-discord-text group-hover:text-white transition-colors duration-300">
                            {metric.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-bold text-${metric.color}-400 text-lg`}>
                            {metric.value}
                          </span>
                          <Badge className={`bg-${metric.color}-500/20 text-${metric.color}-400 border-${metric.color}-500/30 text-xs`}>
                            {metric.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick system actions */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="discord-button-outline hover:bg-discord-blurple/10"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Metrics
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="discord-button-outline hover:bg-discord-green/10"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      System Config
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Performance Insights */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Badge className="mb-4 bg-discord-purple/20 text-discord-purple border-discord-purple/30 px-4 py-2 font-bold">
              <Layers className="mr-2 h-4 w-4" />
              PERFORMANCE INSIGHTS
            </Badge>
            <h2 className="text-4xl font-black text-white mb-2">
              OPTIMIZE YOUR <span className="text-discord-purple glow-text">COMMUNITY</span>
            </h2>
            <p className="text-discord-text text-lg">Advanced analytics and recommendations to grow your server</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Engagement Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="discord-card border-2 border-discord-border/50 hover:border-discord-border transition-all duration-300">
                <CardHeader className="border-b border-discord-border p-6">
                  <CardTitle className="text-xl font-bold text-white tracking-wide flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-discord-blurple" />
                    ENGAGEMENT TRENDS
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64 bg-discord-dark/50 rounded-xl flex items-end justify-between p-6 border border-discord-border/30">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80, 88, 92].map((height, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        transition={{ duration: 0.8, delay: index * 0.05 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-t from-discord-blurple via-purple-500 to-pink-500 w-4 rounded-t-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4 text-sm text-discord-text">
                    <span>Last 14 days</span>
                    <Badge className="bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +15% growth
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="discord-card border-2 border-discord-border/50 hover:border-discord-border transition-all duration-300 h-full">
                <CardHeader className="border-b border-discord-border p-6">
                  <CardTitle className="text-xl font-bold text-white tracking-wide flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-discord-yellow" />
                    QUICK STATS
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {[
                    { label: "Commands Created", value: "0", change: "+0", color: "discord-blurple" },
                    { label: "Active Automations", value: "0", change: "+0", color: "discord-green" },
                    { label: "Mod Actions", value: "0", change: "+0", color: "discord-red" },
                    { label: "API Calls", value: "0", change: "+0", color: "discord-purple" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300 group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-discord-text group-hover:text-white transition-colors duration-300">
                        {stat.label}
                      </span>
                      <div className="text-right">
                        <div className={`text-xl font-bold text-${stat.color}`}>
                          {stat.value}
                        </div>
                        <div className={`text-xs text-${stat.color}/70`}>
                          {stat.change}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
