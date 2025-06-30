"use client"

import { UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Bot,
  Home,
  BarChart3,
  Settings,
  Users,
  MessageSquare,
  Shield,
  HelpCircle,
  Server,
  Crown,
  Zap,
  Activity,
  Plus,
  ExternalLink,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"

const navigationSections = [
  {
    title: "COMMAND CENTER",
    items: [
      {
        title: "OVERVIEW",
        url: "/dashboard",
        icon: Home,
        description: "Main dashboard",
        accent: "discord-blurple",
      },
      {
        title: "SERVERS",
        url: "/servers",
        icon: Server,
        description: "Manage communities",
        accent: "discord-green",
      },
      {
        title: "ANALYTICS",
        url: "/analytics",
        icon: BarChart3,
        description: "Performance insights",
        accent: "discord-purple",
      },
    ],
  },
  {
    title: "MANAGEMENT TOOLS",
    items: [
      {
        title: "MEMBERS",
        url: "/members",
        icon: Users,
        description: "User management",
        accent: "discord-orange",
      },
      {
        title: "COMMANDS",
        url: "/commands",
        icon: MessageSquare,
        description: "Bot interactions",
        accent: "discord-yellow",
      },
      {
        title: "MODERATION",
        url: "/moderation",
        icon: Shield,
        description: "Security center",
        accent: "discord-red",
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        title: "SETTINGS",
        url: "/settings",
        icon: Settings,
        description: "Configuration",
        accent: "discord-text",
      },
      {
        title: "SUPPORT",
        url: "/support",
        icon: HelpCircle,
        description: "Get assistance",
        accent: "discord-text",
      },
    ],
  },
]

const quickActions = [
  {
    title: "ADD SERVER",
    description: "Expand your empire",
    icon: Plus,
    href: "https://discord.com/oauth2/authorize?client_id=1384798729055375410&permissions=8&scope=bot%20applications.commands",
    external: true,
    accent: "discord-green",
  },
  {
    title: "VIEW DOCS",
    description: "Learn & explore",
    icon: ExternalLink,
    href: "/docs",
    external: false,
    accent: "discord-blurple",
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const servers = useQuery(api.discord.getUserServers, user ? { userId: user.id } : "skip")

  const totalServers = servers?.length || 0
  const totalMembers = servers?.reduce((acc, server) => acc + server.memberCount, 0) || 0

  return (
    <Sidebar className="border-r border-discord-border bg-discord-dark/95 backdrop-blur-xl">
      {/* Enhanced Header */}
      <SidebarHeader className="border-b border-discord-border p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="p-3 bg-discord-blurple rounded-xl shadow-glow-blurple"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Bot className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h2 className="font-black text-white tracking-wide font-minecraft text-lg">DISCORD EMPIRE</h2>
              <p className="text-sm text-discord-text font-bold">Command Dashboard</p>
            </div>
          </div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 w-full justify-center py-2">
              <Activity className="mr-2 h-3 w-3 animate-pulse" />
              ALL SYSTEMS OPERATIONAL
            </Badge>
          </motion.div>
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="p-6">
        {/* Empire Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Server className="h-4 w-4 text-discord-blurple" />
                <span className="text-xs text-discord-text font-bold">SERVERS</span>
              </div>
              <div className="text-2xl font-black text-white">{totalServers}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-discord-green" />
                <span className="text-xs text-discord-text font-bold">MEMBERS</span>
              </div>
              <div className="text-2xl font-black text-white">{totalMembers.toLocaleString()}</div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Sections */}
        {navigationSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + sectionIndex * 0.1 }}
          >
            <SidebarGroup className="mb-8">
              <SidebarGroupLabel className="text-xs font-black text-discord-text uppercase tracking-wider mb-4 font-minecraft">
                {section.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item, itemIndex) => {
                    const isActive = pathname === item.url || pathname.startsWith(item.url + "/")

                    return (
                      <SidebarMenuItem key={item.title}>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + itemIndex * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className={`w-full justify-start gap-4 px-4 py-3 mb-2 rounded-lg transition-all duration-300 group ${isActive
                                ? "bg-discord-blurple/20 text-discord-blurple border border-discord-blurple/30 shadow-glow-blurple"
                                : "text-discord-text hover:text-white hover:bg-white/10 border border-transparent"
                              }`}
                          >
                            <Link href={item.url}>
                              <div className="flex items-center gap-4 w-full">
                                <motion.div
                                  className={`p-2 rounded-lg ${isActive ? `bg-discord-blurple/30` : `bg-${item.accent}/20`
                                    }`}
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                  <item.icon
                                    className={`h-4 w-4 ${isActive ? "text-discord-blurple" : `text-${item.accent}`}`}
                                  />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <span className="font-bold tracking-wide font-minecraft text-sm">{item.title}</span>
                                  <p className="text-xs opacity-70 truncate">{item.description}</p>
                                </div>
                                {isActive && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                  >
                                    <ArrowRight className="h-4 w-4 text-discord-blurple" />
                                  </motion.div>
                                )}
                              </div>
                            </Link>
                          </SidebarMenuButton>
                        </motion.div>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {sectionIndex < navigationSections.length - 1 && <SidebarSeparator className="bg-discord-border" />}
          </motion.div>
        ))}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-black text-discord-text uppercase tracking-wider mb-4 font-minecraft">
              QUICK ACTIONS
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {action.external ? (
                      <a href={action.href} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full justify-start gap-3 discord-button-outline bg-transparent h-auto py-3">
                          <action.icon className={`h-4 w-4 text-${action.accent}`} />
                          <div className="text-left">
                            <div className="font-bold text-sm">{action.title}</div>
                            <div className="text-xs opacity-70">{action.description}</div>
                          </div>
                        </Button>
                      </a>
                    ) : (
                      <Link href={action.href}>
                        <Button className="w-full justify-start gap-3 discord-button-outline bg-transparent h-auto py-3">
                          <action.icon className={`h-4 w-4 text-${action.accent}`} />
                          <div className="text-left">
                            <div className="font-bold text-sm">{action.title}</div>
                            <div className="text-xs opacity-70">{action.description}</div>
                          </div>
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </motion.div>
      </SidebarContent>

      {/* Enhanced Footer */}
      <SidebarFooter className="border-t border-discord-border p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {/* User Section */}
          <div className="flex items-center gap-3 mb-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10 ring-2 ring-discord-blurple/30",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate font-minecraft">COMMANDER</p>
              <p className="text-xs text-discord-text">Empire Manager</p>
            </div>
            <ThemeToggle />
          </div>

          {/* Status Indicator */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-white">ONLINE</span>
              </div>
              <Badge className="bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 text-xs">
                <Crown className="mr-1 h-2 w-2" />
                PREMIUM
              </Badge>
            </div>
            <div className="mt-2 text-xs text-discord-text">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-discord-yellow" />
                <span>99.9% uptime</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <Link href="/pricing" className="text-discord-text hover:text-white transition-colors">
              Upgrade
            </Link>
            <Link href="/docs" className="text-discord-text hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/support" className="text-discord-text hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  )
}
