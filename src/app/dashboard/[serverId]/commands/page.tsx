"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "../../../../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
    Plus,
    Settings,
    Trash2,
    Search,
    MessageSquare,
    Crown,
    Shield,
    Hash,
    Volume2,
    Webhook,
    GitBranch,
    Database,
    Clock,
    Edit3,
    Loader2,
    Zap,
    Activity,
    Command,
    Sparkles,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function isPromise<T>(value: any): value is Promise<T> {
    return value && typeof value.then === "function"
}

// Helper function to get command icon based on blocks
const getCommandIcon = (blocks: string) => {
    try {
        const parsed = JSON.parse(blocks)
        const nodes = parsed.nodes || []

        // Find the most common block type to determine icon
        const blockTypes = nodes
            .filter((node: any) => node.type !== "root" && node.type !== "error")
            .map((node: any) => node.type)

        if (blockTypes.includes("send-message")) return MessageSquare
        if (blockTypes.includes("add-role") || blockTypes.includes("remove-role")) return Crown
        if (blockTypes.includes("kick-member") || blockTypes.includes("ban-member")) return Shield
        if (blockTypes.includes("create-channel") || blockTypes.includes("delete-channel")) return Hash
        if (blockTypes.includes("move-member") || blockTypes.includes("mute-member")) return Volume2
        if (blockTypes.includes("create-webhook")) return Webhook
        if (blockTypes.includes("condition")) return GitBranch
        if (blockTypes.includes("wait")) return Clock
        if (blockTypes.includes("unq-variable")) return Database

        return Settings
    } catch {
        return Settings
    }
}

// Helper function to get block count
const getBlockCount = (blocks: string) => {
    try {
        const parsed = JSON.parse(blocks)
        const nodes = parsed.nodes || []
        return nodes.filter((node: any) => node.type !== "root" && node.type !== "error").length
    } catch {
        return 0
    }
}

// Helper function to get category color
const getCategoryColor = (blocks: string) => {
    try {
        const parsed = JSON.parse(blocks)
        const nodes = parsed.nodes || []
        const blockTypes = nodes
            .filter((node: any) => node.type !== "root" && node.type !== "error")
            .map((node: any) => node.type)

        if (blockTypes.includes("send-message")) return "from-blue-500 to-purple-600"
        if (blockTypes.includes("add-role") || blockTypes.includes("remove-role")) return "from-orange-500 to-red-600"
        if (blockTypes.includes("kick-member") || blockTypes.includes("ban-member")) return "from-red-500 to-pink-600"
        if (blockTypes.includes("create-channel") || blockTypes.includes("delete-channel"))
            return "from-green-500 to-teal-600"
        if (blockTypes.includes("move-member") || blockTypes.includes("mute-member")) return "from-yellow-500 to-orange-600"
        if (blockTypes.includes("create-webhook")) return "from-emerald-500 to-green-600"
        if (blockTypes.includes("condition")) return "from-indigo-500 to-blue-600"
        if (blockTypes.includes("wait")) return "from-gray-500 to-slate-600"
        if (blockTypes.includes("unq-variable")) return "from-purple-500 to-indigo-600"

        return "from-slate-500 to-gray-600"
    } catch {
        return "from-slate-500 to-gray-600"
    }
}

export default function CommandsPage({ params }: any) {
    const unwrappedParams = isPromise<{ serverId: string }>(params) ? React.use(params) : params
    const serverId = unwrappedParams?.serverId || ""

    const router = useRouter()
    const toast = useToast()
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)

    const commands = useQuery(api.discord.getCommands, { serverId })
    const deleteCommandMutation = useMutation(api.discord.deleteCommand)
    const toggleCommandMutation = useMutation(api.discord.toggleCommandStatus)

    useEffect(() => {
        const fetchCommands = async () => {
            if (commands !== undefined) {
                await new Promise((resolve) => setTimeout(resolve, 800))
                setLoading(false)
            }
        }
        fetchCommands()
    }, [commands])

    const filteredCommands =
        commands?.filter(
            (command) =>
                command.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                command.description?.toLowerCase().includes(searchQuery.toLowerCase()),
        ) || []

    const handleCreateCommand = () => {
        router.push(`commands/builder?serverId=${serverId}`)
    }

    const handleEditCommand = (commandId: string) => {
        router.push(`commands/builder?serverId=${serverId}&commandId=${commandId}`)
    }

    const handleDeleteCommand = async (commandId: string, commandName: string) => {
        try {
            await deleteCommandMutation({ commandId: commandId as any })
            toast.success("Command Deleted", `Command "${commandName}" has been deleted successfully.`)
        } catch (error) {
            toast.error("Delete Failed", "Failed to delete the command. Please try again.")
        }
    }

    const handleToggleCommand = async (commandId: string, enabled: boolean, commandName: string) => {
        try {
            await toggleCommandMutation({ commandId: commandId as any, enabled })
            toast.success(
                enabled ? "Command Enabled" : "Command Disabled",
                `Command "${commandName}" has been ${enabled ? "enabled" : "disabled"}.`,
            )
        } catch (error) {
            toast.error("Update Failed", "Failed to update command status. Please try again.")
        }
    }

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return "Never"
        return new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (loading || !commands) {
        return (
            <div className="bg-discord-dark font-minecraft min-h-screen">
                {/* Atmospheric Background */}
                <div className="fixed inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black" />
                    <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                    <div className="floating-orb floating-orb-1" />
                    <div className="floating-orb floating-orb-2" />
                    <div className="floating-orb floating-orb-3" />
                </div>

                <div className="relative z-10 min-h-screen flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-6 text-white"
                    >
                        <div className="relative">
                            <Loader2 className="h-12 w-12 animate-spin text-discord-blurple" />
                            <div className="absolute inset-0 h-12 w-12 rounded-full bg-discord-blurple/20 animate-ping" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Loading Commands</h2>
                            <p className="text-discord-text">Fetching your bot commands...</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-discord-dark font-minecraft min-h-screen">
            {/* Atmospheric Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black" />
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="floating-orb floating-orb-1" />
                <div className="floating-orb floating-orb-2" />
                <div className="floating-orb floating-orb-3" />
            </div>

            <div className="relative z-10 min-h-screen">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="container mx-auto px-4 py-8"
                >
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-center mb-12"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-discord-blurple to-purple-600 shadow-lg">
                                <Command className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-5xl font-black text-white tracking-tight">COMMANDS</h1>
                        </div>
                        <p className="text-xl text-discord-text max-w-2xl mx-auto">
                            Manage and configure your Discord bot commands with powerful visual tools
                        </p>
                    </motion.div>

                    {/* Create Command Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex justify-center mb-8"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleCreateCommand}
                                className="bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                size="lg"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create New Command
                                <Sparkles className="w-4 h-4 ml-2" />
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Stats and Search Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-discord-text w-5 h-5 group-focus-within:text-discord-blurple transition-colors" />
                                <Input
                                    placeholder="Search commands..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-12 bg-discord-darker/50 border-discord-border text-white placeholder:text-discord-text focus:border-discord-blurple focus:ring-discord-blurple/20 backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* Total Commands Stat */}
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Card className="bg-gradient-to-br from-discord-darker/80 to-discord-dark/80 border-discord-border backdrop-blur-sm hover:border-discord-blurple/50 transition-all duration-300">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-discord-text font-medium">Total Commands</p>
                                            <p className="text-3xl font-black text-white">{commands.length}</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                                            <Settings className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Active Commands Stat */}
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Card className="bg-gradient-to-br from-discord-darker/80 to-discord-dark/80 border-discord-border backdrop-blur-sm hover:border-green-500/50 transition-all duration-300">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-discord-text font-medium">Active Commands</p>
                                            <p className="text-3xl font-black text-white">
                                                {commands.filter((cmd) => cmd.enabled !== false).length}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
                                            <Activity className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Commands Grid */}
                    <AnimatePresence mode="wait">
                        {filteredCommands.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="bg-gradient-to-br from-discord-darker/80 to-discord-dark/80 border-discord-border backdrop-blur-sm">
                                    <CardContent className="p-12 text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                        >
                                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-discord-blurple to-purple-600 flex items-center justify-center">
                                                <Command className="w-12 h-12 text-white" />
                                            </div>
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-white mb-3">
                                            {searchQuery ? "No commands found" : "No commands yet"}
                                        </h3>
                                        <p className="text-discord-text mb-8 text-lg">
                                            {searchQuery
                                                ? "Try adjusting your search terms"
                                                : "Create your first command to get started with your Discord bot"}
                                        </p>
                                        {!searchQuery && (
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    onClick={handleCreateCommand}
                                                    className="bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-6 py-3 rounded-lg"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Create Your First Command
                                                </Button>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="commands"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {filteredCommands.map((command, index) => {
                                    const IconComponent = getCommandIcon(command.blocks)
                                    const blockCount = getBlockCount(command.blocks)
                                    const isEnabled = command.enabled !== false
                                    const gradientColor = getCategoryColor(command.blocks)

                                    return (
                                        <motion.div
                                            key={command._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            whileHover={{ y: -5 }}
                                            className="group"
                                        >
                                            <Card className="bg-gradient-to-br from-discord-darker/90 to-discord-dark/90 border-discord-border backdrop-blur-sm hover:border-discord-blurple/50 transition-all duration-300 h-full overflow-hidden relative">
                                                {/* Gradient overlay */}
                                                <div
                                                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientColor} opacity-80`}
                                                />

                                                <CardHeader className="pb-3 pt-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <motion.div
                                                                whileHover={{ rotate: 360 }}
                                                                transition={{ duration: 0.5 }}
                                                                className={`p-2.5 rounded-lg bg-gradient-to-r ${gradientColor} shadow-lg`}
                                                            >
                                                                <IconComponent className="w-5 h-5 text-white" />
                                                            </motion.div>
                                                            <div className="min-w-0 flex-1">
                                                                <CardTitle className="text-white text-lg font-bold truncate">/{command.name}</CardTitle>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Badge
                                                                        variant={isEnabled ? "default" : "secondary"}
                                                                        className={`${isEnabled
                                                                                ? "bg-green-600/80 text-white border-green-500/50"
                                                                                : "bg-gray-600/80 text-gray-300 border-gray-500/50"
                                                                            } backdrop-blur-sm font-medium`}
                                                                    >
                                                                        {isEnabled ? "Active" : "Disabled"}
                                                                    </Badge>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-discord-text border-discord-border bg-discord-darker/50 backdrop-blur-sm"
                                                                    >
                                                                        <Zap className="w-3 h-3 mr-1" />
                                                                        {blockCount}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <motion.div whileTap={{ scale: 0.9 }}>
                                                            <Switch
                                                                checked={isEnabled}
                                                                onCheckedChange={(checked) => handleToggleCommand(command._id, checked, command.name)}
                                                                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
                                                            />
                                                        </motion.div>
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="pt-0 pb-4">
                                                    <p className="text-discord-text text-sm mb-4 line-clamp-2 leading-relaxed">
                                                        {command.description || "No description provided"}
                                                    </p>

                                                    <div className="space-y-1.5 mb-4 text-xs">
                                                        <div className="flex justify-between text-discord-text/80">
                                                            <span>Created:</span>
                                                            <span className="font-medium">{formatDate(command.creationTime)}</span>
                                                        </div>
                                                        {command.lastUpdateTime && (
                                                            <div className="flex justify-between text-discord-text/80">
                                                                <span>Updated:</span>
                                                                <span className="font-medium">{formatDate(command.lastUpdateTime)}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                                            <Button
                                                                onClick={() => handleEditCommand(command._id)}
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full bg-discord-darker/50 border-discord-border text-white hover:bg-discord-blurple hover:border-discord-blurple transition-all duration-200"
                                                            >
                                                                <Edit3 className="w-4 h-4 mr-2" />
                                                                Edit
                                                            </Button>
                                                        </motion.div>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        className="bg-red-600/80 hover:bg-red-600 border-red-500/50 hover:border-red-500"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </motion.div>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="bg-discord-darker border-discord-border">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-white">Delete Command</AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-discord-text">
                                                                        Are you sure you want to delete the command "/{command.name}"? This action cannot be
                                                                        undone and will permanently remove the command and all its configurations.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="bg-discord-dark border-discord-border text-white hover:bg-discord-darker">
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDeleteCommand(command._id, command.name)}
                                                                        className="bg-red-600 hover:bg-red-700 text-white"
                                                                    >
                                                                        Delete Command
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    )
}
