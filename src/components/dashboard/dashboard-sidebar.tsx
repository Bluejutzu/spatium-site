"use client"

import { useState } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import { useRouter, usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUserPresence } from "@/hooks/use-user-presence"
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Settings,
    Users,
    Shield,
    Home,
    Bot,
    Webhook,
    Activity,
    Crown,
    UserPlus,
    ChevronDown,
    Check,
    Bell,
    Search,
    BarChart3,
    MessageSquare,
    Zap,
    Globe,
    ArrowLeft,
    Copy,
} from "lucide-react"
import type { DashboardSection } from "@/app/dashboard/[serverId]/page"
import { motion, AnimatePresence } from "framer-motion"

interface DashboardSidebarProps {
    activeSection: DashboardSection
    onSectionChange: (section: DashboardSection) => void
    selectedServerId: string
    onServerChange: (serverId: string) => void
}

const navigationItems = [
    {
        id: "dashboard" as DashboardSection,
        title: "Dashboard",
        icon: Home,
        badge: null,
        description: "Overview & Analytics",
    },
    {
        id: "bot-management" as DashboardSection,
        title: "Bot Management",
        icon: Bot,
        badge: null,
        description: "Bot Configuration",
        subItems: [
            { id: "commands" as DashboardSection, title: "Commands", badge: "12", description: "Manage bot commands" },
            { id: "permissions", title: "Permissions", description: "Configure permissions" },
            { id: "status", title: "Status", description: "Bot health & status" },
        ],
    },
    {
        id: "moderation" as DashboardSection,
        title: "Moderation",
        icon: Shield,
        badge: "3",
        description: "Security & Safety",
        subItems: [
            { id: "auto-mod", title: "Auto Mod", description: "Automated moderation" },
            { id: "warnings", title: "Warnings", badge: "2", description: "User warnings" },
            { id: "bans-kicks", title: "Bans & Kicks", description: "Moderation actions" },
            { id: "audit-log", title: "Audit Log", description: "Activity logs" },
        ],
    },
    {
        id: "server-management" as DashboardSection,
        title: "Server Management",
        icon: Users,
        badge: null,
        description: "Community Management",
        subItems: [
            { id: "members" as DashboardSection, title: "Members", badge: "1.2K", description: "Member management" },
            { id: "roles", title: "Roles", description: "Role configuration" },
            { id: "channels", title: "Channels", description: "Channel management" },
            { id: "invites", title: "Invites", description: "Invitation tracking" },
        ],
    },
    {
        id: "features" as DashboardSection,
        title: "Features",
        icon: Activity,
        badge: null,
        description: "Advanced Features",
        subItems: [
            { id: "welcome", title: "Welcome System", description: "Member onboarding" },
            { id: "reaction-roles", title: "Reaction Roles", description: "Role automation" },
            { id: "auto-voice", title: "Auto Voice", description: "Voice management" },
            { id: "leveling", title: "Leveling", description: "XP & levels" },
        ],
    },
    {
        id: "integrations" as DashboardSection,
        title: "Integrations",
        icon: Webhook,
        badge: null,
        description: "External Services",
        subItems: [
            { id: "webhooks", title: "Webhooks", description: "Webhook management" },
            { id: "api", title: "API Keys", description: "API configuration" },
            { id: "external", title: "External Services", description: "Third-party integrations" },
        ],
    },
]

const settingsItems = [
    {
        id: "settings" as DashboardSection,
        title: "Server Settings",
        icon: Settings,
        description: "Configuration",
    },
    {
        id: "premium",
        title: "Premium",
        icon: Crown,
        badge: "UPGRADE",
        description: "Premium Features",
    },
]

export function DashboardSidebar({
    activeSection,
    onSectionChange,
    selectedServerId,
}: DashboardSidebarProps) {
    const [expandedItems, setExpandedItems] = useState<string[]>(["bot-management"])
    const [copiedTooltip, setCopiedTooltip] = useState(false)
    const { user } = useUser()
    const router = useRouter()
    const pathname = usePathname()
    const { status, statusColor, statusText, activities, isLoading, error } = useUserPresence(selectedServerId || '')

    const toggleExpanded = (itemId: string) => {
        setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
    }

    const handleSectionClick = (sectionId: DashboardSection) => {
        // Handle navigation to specific pages
        const routes = {
            commands: `/dashboard/${selectedServerId}/commands`,
            members: `/dashboard/${selectedServerId}/members`,
            roles: `/dashboard/${selectedServerId}/roles`,
            channels: `/dashboard/${selectedServerId}/channels`,
            moderation: `/dashboard/${selectedServerId}/moderation`,
            welcome: `/dashboard/${selectedServerId}/welcome`,
            integrations: `/dashboard/${selectedServerId}/integrations`,
            settings: `/dashboard/${selectedServerId}/settings`,
            premium: `/dashboard/${selectedServerId}/premium`,
        }

        if (routes[sectionId as keyof typeof routes]) {
            router.push(routes[sectionId as keyof typeof routes])
            return
        }

        onSectionChange(sectionId)
    }

    const isActiveRoute = (sectionId: string) => {
        if (sectionId === 'dashboard') {
            return pathname === `/dashboard/${selectedServerId}`
        }
        return pathname.includes(`/${sectionId}`)
    }

    return (
        <Sidebar className="border-r border-discord-border bg-discord-darker/98 backdrop-blur-xl w-80 shadow-2xl">
            {/* Enhanced Header */}
            <SidebarHeader className="border-b border-discord-border/50 p-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-between mb-6"
                >
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="p-3 bg-gradient-to-r from-discord-blurple to-purple-600 rounded-xl shadow-lg"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                            <Bot className="h-6 w-6 text-white" />
                        </motion.div>
                        <div>
                            <h2 className="font-black text-white tracking-wide font-minecraft text-lg">
                                SPATIUM
                            </h2>
                            <p className="text-xs text-discord-text">Control Center</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="text-discord-text hover:text-white hover:bg-white/10 transition-all duration-300">
                            <Bell className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-discord-text hover:text-white hover:bg-white/10 transition-all duration-300">
                            <Search className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>

                {/* Enhanced Server Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant="ghost"
                                className="w-full justify-between p-4 h-auto bg-discord-dark/50 hover:bg-discord-blurple/10 border border-discord-border/30 hover:border-discord-blurple/50 rounded-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-discord-blurple to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        🎮
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-white text-sm">Gaming Community</div>
                                        <div className="text-xs text-discord-text">
                                            ID: {selectedServerId}
                                        </div>
                                    </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-discord-text" />
                            </Button>
                        </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72 bg-discord-darker border-discord-border shadow-2xl">
                        <DropdownMenuItem className="p-4 text-discord-text hover:text-white hover:bg-discord-blurple/10 cursor-pointer transition-all duration-300">
                            <div className="flex items-center gap-4 w-full">
                                <div className="w-8 h-8 bg-gradient-to-r from-discord-blurple to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                    🎮
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-white">Gaming Community</div>
                                    <div className="text-xs text-discord-text">
                                        Current server
                                    </div>
                                </div>
                                <Check className="w-4 h-4 text-discord-green" />
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Back to servers link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-4"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/servers')}
                        className="text-discord-text hover:text-white hover:bg-white/10 transition-all duration-300 w-full justify-start"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Servers
                    </Button>
                </motion.div>
            </SidebarHeader>

            {/* Enhanced Content */}
            <SidebarContent className="bg-transparent p-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-discord-text/70 font-minecraft text-xs uppercase tracking-wider px-3 py-2 mb-2">
                        Main Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            {navigationItems.map((item, index) => (
                                <SidebarMenuItem key={item.id}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                    >
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <SidebarMenuButton
                                                        onClick={() => {
                                                            if (item.subItems) {
                                                                toggleExpanded(item.id)
                                                            } else {
                                                                handleSectionClick(item.id)
                                                            }
                                                        }}
                                                        className={`
                                                            text-discord-text hover:text-white hover:bg-discord-blurple/10
                                                            transition-all duration-300 rounded-xl p-4 w-full justify-between
                                                            border border-transparent hover:border-discord-blurple/30
                                                            ${isActiveRoute(item.id) ? "bg-discord-blurple/20 text-white border-discord-blurple/50 shadow-lg shadow-discord-blurple/20" : ""}
                                                        `}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <item.icon className="w-5 h-5" />
                                                            <span className="font-medium">{item.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {item.badge && (
                                                                <Badge
                                                                    className={`
                                                                        text-xs px-2 py-1 font-bold
                                                                        ${item.badge === "NEW" ? "bg-discord-green/20 text-discord-green border-discord-green/30" : ""}
                                                                        ${item.badge === "3" ? "bg-discord-red/20 text-discord-red border-discord-red/30" : ""}
                                                                        ${!isNaN(Number(item.badge)) && item.badge !== "3" ? "bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30" : ""}
                                                                    `}
                                                                >
                                                                    {item.badge}
                                                                </Badge>
                                                            )}
                                                            {item.subItems && (
                                                                <motion.div
                                                                    animate={{ rotate: expandedItems.includes(item.id) ? 180 : 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                >
                                                                    <ChevronDown className="w-4 h-4" />
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </SidebarMenuButton>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className="bg-discord-darker border-discord-border text-white">
                                                    <div>
                                                        <p className="font-medium">{item.title}</p>
                                                        <p className="text-xs text-discord-text">{item.description}</p>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        {/* Enhanced Submenu */}
                                        <AnimatePresence>
                                            {item.subItems && expandedItems.includes(item.id) && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <SidebarMenuSub className="border-l-2 border-discord-border/30 ml-8 mt-3 pl-4">
                                                        {item.subItems.map((subItem, subIndex) => (
                                                            <SidebarMenuSubItem key={subItem.id || subItem.title}>
                                                                <motion.div
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ duration: 0.3, delay: subIndex * 0.05 }}
                                                                >
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <SidebarMenuSubButton
                                                                                    onClick={() => subItem.id && handleSectionClick(subItem.id as DashboardSection)}
                                                                                    className={`
                                                                                        text-discord-text/80 hover:text-white hover:bg-discord-blurple/5
                                                                                        rounded-lg p-3 w-full justify-between transition-all duration-300
                                                                                        border border-transparent hover:border-discord-blurple/20
                                                                                        ${isActiveRoute(subItem.id || '') ? "bg-discord-blurple/10 text-white border-discord-blurple/30" : ""}
                                                                                    `}
                                                                                >
                                                                                    <span className="font-medium">{subItem.title}</span>
                                                                                    {subItem.badge && (
                                                                                        <Badge
                                                                                            className={`
                                                                                                text-xs px-2 py-1 font-bold
                                                                                                ${subItem.badge === "2" ? "bg-discord-red/20 text-discord-red border-discord-red/30" : ""}
                                                                                                ${subItem.badge === "12" ? "bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30" : ""}
                                                                                                ${subItem.badge === "1.2K" ? "bg-discord-green/20 text-discord-green border-discord-green/30" : ""}
                                                                                            `}
                                                                                        >
                                                                                            {subItem.badge}
                                                                                        </Badge>
                                                                                    )}
                                                                                </SidebarMenuSubButton>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="right" className="bg-discord-darker border-discord-border text-white">
                                                                                <div>
                                                                                    <p className="font-medium">{subItem.title}</p>
                                                                                    <p className="text-xs text-discord-text">{subItem.description}</p>
                                                                                </div>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </motion.div>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Enhanced Settings Section */}
                <SidebarGroup className="mt-8">
                    <SidebarGroupLabel className="text-discord-text/70 font-minecraft text-xs uppercase tracking-wider px-3 py-2 mb-2">
                        Settings & Premium
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            {settingsItems.map((item, index) => (
                                <SidebarMenuItem key={item.id}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                                    >
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <SidebarMenuButton
                                                        onClick={() => handleSectionClick(item.id as DashboardSection)}
                                                        className={`
                                                            text-discord-text hover:text-white hover:bg-discord-blurple/10
                                                            transition-all duration-300 rounded-xl p-4 w-full justify-between
                                                            border border-transparent hover:border-discord-blurple/30
                                                            ${isActiveRoute(item.id) ? "bg-discord-blurple/20 text-white border-discord-blurple/50 shadow-lg shadow-discord-blurple/20" : ""}
                                                        `}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <item.icon className="w-5 h-5" />
                                                            <span className="font-medium">{item.title}</span>
                                                        </div>
                                                        {item.badge && (
                                                            <Badge className="bg-discord-yellow/20 text-discord-yellow border-discord-yellow/30 text-xs px-2 py-1 font-bold animate-pulse">
                                                                {item.badge}
                                                            </Badge>
                                                        )}
                                                    </SidebarMenuButton>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className="bg-discord-darker border-discord-border text-white">
                                                    <div>
                                                        <p className="font-medium">{item.title}</p>
                                                        <p className="text-xs text-discord-text">{item.description}</p>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </motion.div>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Enhanced Footer */}
            <SidebarFooter className="border-t border-discord-border/50 p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex items-center gap-4 p-4 bg-discord-dark/50 rounded-xl border border-discord-border/30 hover:bg-discord-dark/70 transition-colors duration-300"
                >
                    <div className="w-10 h-10 flex items-center justify-center">
                        {user?.imageUrl ? (
                            <UserButton 
                                appearance={{
                                    elements: {
                                        avatarBox: 'w-10 h-10 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300',
                                    },
                                }}
                            />
                        ) : (
                            <UserPlus className="w-5 h-5 text-white" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                            {user?.fullName || user?.username || "User"}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            className="text-xs bg-discord-dark/50 px-2 py-1 rounded border border-discord-border/30 hover:bg-discord-dark/70 cursor-pointer transition-colors duration-300 font-mono"
                                            onClick={() => {
                                                navigator.clipboard.writeText(user?.externalAccounts[0]?.providerUserId || '')
                                                setCopiedTooltip(true)
                                                setTimeout(() => setCopiedTooltip(false), 2000)
                                            }}
                                        >
                                            <Copy className="w-3 h-3 inline mr-1" />
                                            ID
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-discord-darker border-discord-border text-white">
                                        {copiedTooltip ? "Copied!" : "Click to copy Discord ID"}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-xs text-discord-text flex items-center gap-2 cursor-help">
                                        <motion.div 
                                            className={`w-2 h-2 ${statusColor} rounded-full ${status === 'online' ? 'animate-pulse' : ''} shadow-sm`}
                                            animate={status === 'online' ? { scale: [1, 1.2, 1] } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        <span className="font-medium">
                                            {isLoading ? 'Loading...' : error ? 'Error' : statusText}
                                        </span>
                                        {!error && activities.length > 0 && (
                                            <span className="text-xs text-discord-text/70 truncate max-w-20">
                                                • {activities[0].name}
                                            </span>
                                        )}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-discord-darker border-discord-border text-white max-w-xs">
                                    <div className="text-xs">
                                        <div className="font-medium mb-1">{statusText}</div>
                                        {!error && activities.length > 0 && (
                                            <div className="text-discord-text/70 space-y-1">
                                                <div className="font-medium text-white">{activities[0].name}</div>
                                                {activities[0].details && <div>{activities[0].details}</div>}
                                                {activities[0].state && <div>{activities[0].state}</div>}
                                            </div>
                                        )}
                                        {error && <div className="text-discord-red/70">Failed to load presence</div>}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </motion.div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}