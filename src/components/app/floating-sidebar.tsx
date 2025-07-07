"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Server,
  BarChart3,
  Users,
  Settings,
  MessageSquare,
  Shield,
  Bot,
  Menu,
  X,
  Crown,
  Zap,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"

const navigationItems = [
  { icon: Home, label: "Dashboard", href: "/", description: "Overview & Analytics" },
  { icon: Server, label: "Servers", href: "/servers", description: "Manage Communities", badge: "3" },
  { icon: BarChart3, label: "Analytics", href: "/analytics", description: "Performance Insights" },
  { icon: Users, label: "Members", href: "/members", description: "User Management" },
  { icon: MessageSquare, label: "Messages", href: "/messages", description: "Communication Hub" },
  { icon: Shield, label: "Moderation", href: "/moderation", description: "Security & Safety" },
  { icon: Bot, label: "Commands", href: "/commands", description: "Bot Configuration" },
  { icon: Settings, label: "Settings", href: "/settings", description: "System Preferences" },
]

const quickActions = [
  { icon: Zap, label: "Quick Setup", description: "Fast server configuration" },
  { icon: Crown, label: "Premium", description: "Upgrade your plan" },
  { icon: HelpCircle, label: "Support", description: "Get help & documentation" },
]

export function FloatingSidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()
  const servers = useQuery(api.discord.getUserServers, user ? { userId: user.id } : "skip")

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const totalServers = servers?.length || 0
  const totalMembers = servers?.reduce((acc, server) => acc + server.memberCount, 0) || 0

  const getMobileNavHref = (itemHref: string) => {
    const dashboardMatch = pathname.match(/^\/dashboard\/([^/]+)(?:\/([^/]+))?$/)
    if (dashboardMatch && itemHref.startsWith("/")) {
      const serverId = dashboardMatch[1]
      if (["/commands", "/settings"].includes(itemHref)) {
        return `/dashboard/${serverId}${itemHref}`
      }
      if (itemHref === "/") {
        return `/dashboard/${serverId}`
      }
    }
    return itemHref
  }

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-slate-900/80 backdrop-blur-xl border border-white/10 text-white hover:bg-blue-600/20"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="w-80 h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10 p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-8 mt-12">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">DISCORD BOT</h2>
                    <p className="text-slate-400 text-sm">Command Center</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={getMobileNavHref(item.href)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${pathname === item.href
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && <Badge className="ml-auto bg-green-500 text-white text-xs">{item.badge}</Badge>}
                    </Link>
                  ))}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <TooltipProvider>
      {/* Hidden Sidebar Tab */}
      <AnimatePresence>
        {!isVisible && (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-40"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-slate-900/80 backdrop-blur-xl border border-white/10 text-white hover:bg-blue-600/20 rounded-l-none rounded-r-lg h-16 w-8 p-0 shadow-lg"
                  onClick={() => setIsVisible(true)}
                >
                  <div className="flex flex-col items-center gap-1">
                    <ChevronRight className="h-4 w-4" />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                <p>Show Navigation</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sidebar */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed left-4 top-1/2 -translate-y-1/2 z-40"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              initial={{ width: 80 }}
              animate={{ width: isExpanded ? 280 : 80 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden h-[600px] flex flex-col relative"
            >
              {/* Hide Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10 text-slate-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                onClick={() => setIsVisible(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="p-2 bg-blue-600 rounded-lg shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Bot className="h-6 w-6 text-white" />
                  </motion.div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h2 className="text-white font-bold text-lg tracking-wide">DISCORD BOT</h2>
                        <p className="text-slate-400 text-sm">Quick Access</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href

                  return (
                    <Tooltip key={item.href} delayDuration={isExpanded ? 1000 : 300}>
                      <TooltipTrigger asChild>
                        <Link href={getMobileNavHref(item.href)}>
                          <motion.div
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${isActive
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                              }`}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ delay: 0.05 }}
                                  className="flex items-center justify-between w-full"
                                >
                                  <span className="font-medium">{item.label}</span>
                                  {item.badge && (
                                    <Badge className="bg-green-500 text-white text-xs">{totalServers}</Badge>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </Link>
                      </TooltipTrigger>
                      {!isExpanded && (
                        <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-xs text-slate-400">{item.description}</p>
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )
                })}
              </nav>

              {/* Stats Section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 border-t border-white/10"
                  >
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">{totalServers}</div>
                        <div className="text-xs text-slate-400">Servers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{totalMembers.toLocaleString()}</div>
                        <div className="text-xs text-slate-400">Members</div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      {quickActions.map((action, index) => (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <motion.button
                              className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <action.icon className="h-4 w-4" />
                              <span className="text-sm font-medium">{action.label}</span>
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                            <p>{action.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status Indicator */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-slate-400"
                      >
                        System Operational
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  )
}
