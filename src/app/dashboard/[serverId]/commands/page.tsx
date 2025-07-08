"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { useRouter } from "next/navigation"
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
    Power,
    Loader2
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
                await new Promise((resolve) => setTimeout(resolve, 300))
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
        router.push(`commands/builder`)
    }

    const handleEditCommand = (commandId: string) => {
        router.push(`commands/builder?commandId=${commandId}`)
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
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (loading || !commands) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "rgb(15 23 42)" }}>
                <div className="flex items-center gap-3 text-white">
                    <Loader2 className="h-6 w-6 animate-spin text-discord-blurple" />
                    <span className="text-xl">Loading commands...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="z-50 min-h-screen p-6" style={{ backgroundColor: "rgb(15 23 42)" }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Commands</h1>
                        <p className="text-slate-400">Manage your Discord bot commands</p>
                    </div>
                    <Button onClick={handleCreateCommand} className="discord-button-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Command
                    </Button>
                </div>

                {/* Search and Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Search commands..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                                style={{ backgroundColor: "rgb(30 41 59)", borderColor: "rgb(51 65 85)", color: "white" }}
                            />
                        </div>
                    </div>

                    <Card className="discord-card">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Total Commands</p>
                                    <p className="text-2xl font-bold text-white">{commands.length}</p>
                                </div>
                                <Settings className="w-8 h-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="discord-card">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Active Commands</p>
                                    <p className="text-2xl font-bold text-white">
                                        {commands.filter((cmd) => cmd.enabled !== false).length}
                                    </p>
                                </div>
                                <Power className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Commands Grid */}
                {filteredCommands.length === 0 ? (
                    <Card className="discord-card">
                        <CardContent className="p-12 text-center">
                            <Settings className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {searchQuery ? "No commands found" : "No commands yet"}
                            </h3>
                            <p className="text-slate-400 mb-6">
                                {searchQuery
                                    ? "Try adjusting your search terms"
                                    : "Create your first command to get started with your Discord bot"}
                            </p>
                            {!searchQuery && (
                                <Button onClick={handleCreateCommand} className="discord-button-primary">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Your First Command
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCommands.map((command) => {
                            const IconComponent = getCommandIcon(command.blocks)
                            const blockCount = getBlockCount(command.blocks)
                            const isEnabled = command.enabled !== false

                            return (
                                <Card key={command._id} className="discord-card hover:shadow-xl transition-all duration-200">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="p-2 rounded-lg"
                                                    style={{ backgroundColor: isEnabled ? "var(--color-discord-blurple)" : "rgb(71 85 105)" }}
                                                >
                                                    <IconComponent className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-white text-lg">/{command.name}</CardTitle>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge
                                                            variant={isEnabled ? "default" : "secondary"}
                                                            className={isEnabled ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"}
                                                        >
                                                            {isEnabled ? "Active" : "Disabled"}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-slate-400 border-slate-600">
                                                            {blockCount} blocks
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Switch
                                                    checked={isEnabled}
                                                    onCheckedChange={(checked) => handleToggleCommand(command._id, checked, command.name)}
                                                    className="data-[state=checked]:bg-green-600"
                                                />
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                            {command.description || "No description provided"}
                                        </p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-xs text-slate-500">
                                                <span>Created:</span>
                                                <span>{formatDate(command.creationTime)}</span>
                                            </div>
                                            {command.lastUpdateTime && (
                                                <div className="flex justify-between text-xs text-slate-500">
                                                    <span>Updated:</span>
                                                    <span>{formatDate(command.lastUpdateTime)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleEditCommand(command._id)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 discord-button-outline"
                                            >
                                                <Edit3 className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent style={{ backgroundColor: "rgb(30 41 59)", borderColor: "rgb(51 65 85)" }}>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-white">Delete Command</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-slate-400">
                                                            Are you sure you want to delete the command "/{command.name}"? This action cannot be
                                                            undone and will permanently remove the command and all its configurations.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="discord-button-outline">Cancel</AlertDialogCancel>
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
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
