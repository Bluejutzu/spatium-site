"use client"

import { useState } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
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
} from "lucide-react"
import type { DashboardSection } from "@/app/dashboard/[serverId]/page"
import { motion } from "framer-motion"

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
    },
    {
        id: "bot-management" as DashboardSection,
        title: "Bot Management",
        icon: Bot,
        badge: null,
        subItems: [
            { id: "commands" as DashboardSection, title: "Commands", badge: "12" },
            { id: "permissions", title: "Permissions" },
            { id: "status", title: "Status" },
        ],
    },
    {
        id: "moderation" as DashboardSection,
        title: "Moderation",
        icon: Shield,
        badge: "3",
        subItems: [
            { id: "auto-mod", title: "Auto Mod" },
            { id: "warnings", title: "Warnings", badge: "2" },
            { id: "bans-kicks", title: "Bans & Kicks" },
            { id: "audit-log", title: "Audit Log" },
        ],
    },
    {
        id: "server-management" as DashboardSection,
        title: "Server Management",
        icon: Users,
        badge: null,
        subItems: [
            { id: "members" as DashboardSection, title: "Members", badge: "1.2K" },
            { id: "roles", title: "Roles" },
            { id: "channels", title: "Channels" },
            { id: "invites", title: "Invites" },
        ],
    },
    {
        id: "features" as DashboardSection,
        title: "Features",
        icon: Activity,
        badge: null,
        subItems: [
            { id: "welcome", title: "Welcome System" },
            { id: "reaction-roles", title: "Reaction Roles" },
            { id: "auto-voice", title: "Auto Voice" },
            { id: "leveling", title: "Leveling" },
        ],
    },
    {
        id: "integrations" as DashboardSection,
        title: "Integrations",
        icon: Webhook,
        badge: null,
        subItems: [
            { id: "webhooks", title: "Webhooks" },
            { id: "api", title: "API Keys" },
            { id: "external", title: "External Services" },
        ],
    },
]

const settingsItems = [
    {
        id: "settings" as DashboardSection,
        title: "Server Settings",
        icon: Settings,
    },
    {
        id: "premium",
        title: "Premium",
        icon: Crown,
        badge: "UPGRADE",
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
    const { status, statusColor, statusText, activities, isLoading, error } = useUserPresence(selectedServerId || '')

    const toggleExpanded = (itemId: string) => {
        setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
    }

    const handleSectionClick = (sectionId: DashboardSection) => {
        // Handle navigation to specific pages
        if (sectionId === "commands") {
            router.push(`/dashboard/${selectedServerId}/commands`)
            return
        }
        if (sectionId === "members") {
            router.push(`/dashboard/${selectedServerId}/members`)
            return
        }
        if (sectionId === "roles") {
            router.push(`/dashboard/${selectedServerId}/roles`)
            return
        }
        if (sectionId === "channels") {
            router.push(`/dashboard/${selectedServerId}/channels`)
            return
        }
        if (sectionId === "moderation") {
            router.push(`/dashboard/${selectedServerId}/moderation`)
            return
        }
        if (sectionId === "welcome") {
            router.push(`/dashboard/${selectedServerId}/welcome`)
            return
        }
        if (sectionId === "integrations") {
            router.push(`/dashboard/${selectedServerId}/integrations`)
            return
        }
        if (sectionId === "settings") {
            router.push(`/dashboard/${selectedServerId}/settings`)
            return
        }
        if (sectionId === "premium") {
            router.push(`/dashboard/${selectedServerId}/premium`)
            return
        }

        onSectionChange(sectionId)
    }

    return (
        <Sidebar className="border-r border-discord-border bg-discord-darker/95 backdrop-blur-sm w-80">
            <SidebarHeader className="border-b border-discord-border/50 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-discord-blurple rounded-lg flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white text-lg">SPATIUM</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="text-discord-text hover:text-white">
                            <Bell className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-discord-text hover:text-white">
                            <Search className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full justify-between p-3 h-auto bg-discord-dark/50 hover:bg-discord-blurple/10 border border-discord-border/30"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🎮</span>
                                <div className="text-left">
                                    <div className="font-semibold text-white text-sm">Server {selectedServerId}</div>
                                    <div className="text-xs text-discord-text">
                                        Click to change server
                                    </div>
                                </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-discord-text" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72 bg-discord-darker border-discord-border">
                        <DropdownMenuItem className="p-3 text-discord-text hover:text-white hover:bg-discord-blurple/10 cursor-pointer">
                            <div className="flex items-center gap-3 w-full">
                                <span className="text-xl">🎮</span>
                                <div className="flex-1">
                                    <div className="font-medium text-white">Server {selectedServerId}</div>
                                    <div className="text-xs text-discord-text">
                                        Current server
                                    </div>
                                </div>
                                <Check className="w-4 h-4 text-discord-green" />
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarHeader>

            <SidebarContent className="bg-transparent p-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-discord-text/70 font-minecraft text-xs uppercase tracking-wider px-3 py-2">
                        Main Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.id}>
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
                      transition-all duration-200 rounded-lg p-3 w-full justify-between
                      ${activeSection === item.id ? "bg-discord-blurple/20 text-white border-r-2 border-discord-blurple" : ""}
                    `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4" />
                                            <span className="font-medium">{item.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {item.badge && (
                                                <Badge
                                                    className={`
                            text-xs px-2 py-0.5
                            ${item.badge === "NEW" ? "bg-discord-green/20 text-discord-green border-discord-green/30" : ""}
                            ${item.badge === "3" ? "bg-discord-red/20 text-discord-red border-discord-red/30" : ""}
                            ${!isNaN(Number(item.badge)) && item.badge !== "3" ? "bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30" : ""}
                          `}
                                                >
                                                    {item.badge}
                                                </Badge>
                                            )}
                                            {item.subItems && (
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform duration-200 ${expandedItems.includes(item.id) ? "rotate-180" : ""
                                                        }`}
                                                />
                                            )}
                                        </div>
                                    </SidebarMenuButton>

                                    {item.subItems && expandedItems.includes(item.id) && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <SidebarMenuSub className="border-l border-discord-border/30 ml-6 mt-2">
                                                {item.subItems.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.id || subItem.title}>
                                                        <SidebarMenuSubButton
                                                            onClick={() => subItem.id && handleSectionClick(subItem.id as DashboardSection)}
                                                            className={`
                                text-discord-text/80 hover:text-white hover:bg-discord-blurple/5
                                rounded-md p-2 w-full justify-between transition-all duration-200
                                ${activeSection === subItem.id ? "bg-discord-blurple/10 text-white" : ""}
                              `}
                                                        >
                                                            <span>{subItem.title}</span>
                                                            {subItem.badge && (
                                                                <Badge
                                                                    className={`
                                    text-xs px-1.5 py-0.5
                                    ${subItem.badge === "2" ? "bg-discord-red/20 text-discord-red border-discord-red/30" : ""}
                                    ${subItem.badge === "12" ? "bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30" : ""}
                                    ${subItem.badge === "1.2K" ? "bg-discord-green/20 text-discord-green border-discord-green/30" : ""}
                                  `}
                                                                >
                                                                    {subItem.badge}
                                                                </Badge>
                                                            )}
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </motion.div>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-6">
                    <SidebarGroupLabel className="text-discord-text/70 font-minecraft text-xs uppercase tracking-wider px-3 py-2">
                        Settings
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {settingsItems.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton
                                        onClick={() => handleSectionClick(item.id as DashboardSection)}
                                        className={`
                      text-discord-text hover:text-white hover:bg-discord-blurple/10
                      transition-all duration-200 rounded-lg p-3 w-full justify-between
                      ${activeSection === item.id ? "bg-discord-blurple/20 text-white border-r-2 border-discord-blurple" : ""}
                    `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4" />
                                            <span className="font-medium">{item.title}</span>
                                        </div>
                                        {item.badge && (
                                            <Badge className="bg-discord-yellow/20 text-discord-yellow border-discord-yellow/30 text-xs px-2 py-0.5">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-discord-border/50 p-4">
                <div className="flex items-center gap-3 p-3 bg-discord-dark/50 rounded-lg border border-discord-border/30">
                    <div className="w-8 h-8 flex items-center justify-center">
                        {user?.imageUrl ? (
                            <UserButton />
                        ) : (
                            <UserPlus className="w-4 h-4 text-white" />
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-white text-sm">
                            {user?.fullName || user?.username || "User"} /
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <code
                                            className="text-xs bg-discord-dark/50 px-1.5 py-0.5 rounded border border-discord-border/30 hover:bg-discord-dark/70 cursor-pointer transition-colors"
                                            onClick={() => {
                                                navigator.clipboard.writeText(user?.externalAccounts[0]?.providerUserId || '')
                                                setCopiedTooltip(true)
                                                setTimeout(() => setCopiedTooltip(false), 2000)
                                            }}
                                        >
                                            {user?.externalAccounts[0]?.providerUserId}
                                        </code>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-discord-darker border-discord-border text-white">
                                        {copiedTooltip ? "Copied!" : "Click to copy"}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-xs text-discord-text flex items-center gap-1 cursor-help">
                                        <div className={`w-2 h-2 ${statusColor} rounded-full ${status === 'online' ? 'animate-pulse' : ''}`} />
                                        {isLoading ? 'Loading...' : error ? 'Error' : statusText}
                                        {!error && activities.length > 0 && (
                                            <span className="text-xs text-discord-text/70 ml-1">
                                                • {activities[0].name}
                                            </span>
                                        )}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-discord-darker border-discord-border text-white">
                                    <div className="text-xs">
                                        <div className="font-medium">{statusText}</div>
                                        {!error && activities.length > 0 && (
                                            <div className="text-discord-text/70 mt-1">
                                                {activities[0].details && <div>{activities[0].details}</div>}
                                                {activities[0].state && <div>{activities[0].state}</div>}
                                            </div>
                                        )}
                                        {error && <div className="text-discord-red/70 mt-1">Failed to load presence</div>}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
