"use client"

import { useMutation, useQuery } from "convex/react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  CheckCircle,
  Clock,
  Crown,
  Eye,
  FileText,
  Filter,
  MessageSquare,
  MoreVertical,
  RefreshCw,
  Search,
  Shield,
  Timer,
  Users,
  UserX,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { ModerationAction } from "spatium-types"

import { api } from "@/../convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useDiscordCache } from "@/store/discordCache"

interface ModerationContentProps {
  serverId?: string
}

interface UserProfile {
  id: string
  username: string
  avatar?: string
  global_name?: string
}

// Enhanced Moderation Row Component (Discord-style)
function ModerationRow({
  action,
  profileCache,
  loadingProfiles,
  onAction,
}: {
  action: ModerationAction
  profileCache: Record<string, UserProfile>
  loadingProfiles: Set<string>
  onAction: (type: string, action: ModerationAction) => void
}) {
  const [showActions, setShowActions] = useState(false)

  const getActionIcon = useCallback((actionType: string) => {
    switch (actionType) {
      case "Ban":
        return <Ban className="h-4 w-4 text-red-500" />
      case "Kick":
        return <UserX className="h-4 w-4 text-orange-500" />
      case "Warn":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "Timeout":
        return <Timer className="h-4 w-4 text-purple-500" />
      default:
        return <Shield className="h-4 w-4 text-discord-blurple" />
    }
  }, [])

  const getActionColor = useCallback((actionType: string) => {
    switch (actionType) {
      case "Ban":
        return "text-red-500 bg-red-500/20 border-red-500/30"
      case "Kick":
        return "text-orange-500 bg-orange-500/20 border-orange-500/30"
      case "Warn":
        return "text-yellow-500 bg-yellow-500/20 border-yellow-500/30"
      case "Timeout":
        return "text-purple-500 bg-purple-500/20 border-purple-500/30"
      default:
        return "text-discord-blurple bg-discord-blurple/20 border-discord-blurple/30"
    }
  }, [])

  // Get user and moderator profile
  const userProfile = profileCache[action.userId]
  const modProfile = profileCache[action.moderator]
  const closerProfile = profileCache[action.closedBy!] // temp fix as spatium-types package needs to be bumped
  const isUserLoading = loadingProfiles.has(action.userId)
  const isModLoading = loadingProfiles.has(action.moderator)
  const isCloserLoading = loadingProfiles.has(action.closedBy!) // temp fix as spatium-types package needs to be bumped

  const getAvatarUrl = (userId: string, avatar?: string) => {
    if (avatar) {
      return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png?size=64`
    }
    return "/placeholder.svg?height=40&width=40"
  }

  return (
    <div
      className="group flex cursor-pointer items-center px-4 py-3 transition-colors duration-200 border-b border-discord-border/20 hover:bg-discord-darker/40"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onAction("view", action)}
    >
      {/* Case ID with action type indicator */}
      <div className="w-24 flex items-center gap-2">
        <div className={`p-1 rounded ${getActionColor(action.action)}`}>{getActionIcon(action.action)}</div>
        <span className="text-discord-text text-xs font-mono">..{action._id.slice(-6).toUpperCase()}</span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3 min-w-[180px]">
        <Avatar className="h-8 w-8">
          {isUserLoading ? (
            <AvatarFallback>
              <div className="animate-spin w-4 h-4 border-2 border-discord-blurple border-t-transparent rounded-full" />
            </AvatarFallback>
          ) : userProfile?.avatar ? (
            <AvatarImage
              src={getAvatarUrl(userProfile.id, userProfile.avatar) || "/placeholder.svg"}
              alt={userProfile.username}
            />
          ) : (
            <AvatarFallback className="bg-gradient-to-r from-discord-blurple to-purple-600 text-white font-bold text-xs">
              {userProfile?.username?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="font-semibold text-white text-sm">
            {isUserLoading ? "Loading..." : userProfile?.username || action.userId}
          </div>
          <div className="text-discord-text text-xs">ID: {action.userId.slice(-8)}</div>
        </div>
      </div>

      {/* Reason */}
      <div className="flex-1 min-w-0 mx-4">
        <span className="text-discord-text text-sm truncate block">{action.reason || "No reason provided"}</span>
      </div>

      <div className="w-40 flex items-center gap-2">
        <Avatar className="h-6 w-6">
          {isCloserLoading ? (
            <AvatarFallback>
              <div className="animate-spin w-3 h-3 border border-discord-blurple border-t-transparent rounded-full" />
            </AvatarFallback>
          ) : closerProfile?.avatar ? (
            <AvatarImage
              src={getAvatarUrl(closerProfile.id, closerProfile.avatar) || "/placeholder.svg"}
              alt={closerProfile.username}
            />
          ) : (
            <AvatarFallback className="bg-gradient-to-r from-discord-blurple to-purple-600 text-white font-bold text-xs">
              {closerProfile?.username?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          )}
        </Avatar>
        <span className="text-discord-text text-xs truncate">
          {isCloserLoading ? "Loading..." : closerProfile?.username || "Well idk"}
        </span>
      </div>

      <div className="w-40 flex items-center gap-2">
        <span className="text-discord-text text-sm truncate block">
          {action.closedAt ? (
            typeof action.closedAt === "number" ? (
              new Date(action.closedAt).toLocaleDateString()
            ) : (
              action.closedAt
            )
          ) : (
            <span className="text-red-400">Permanent</span>
          )}
        </span>
      </div>

      {/* Moderator */}
      <div className="w-40 flex items-center gap-2">
        <Avatar className="h-6 w-6">
          {isModLoading ? (
            <AvatarFallback>
              <div className="animate-spin w-3 h-3 border border-discord-blurple border-t-transparent rounded-full" />
            </AvatarFallback>
          ) : modProfile?.avatar ? (
            <AvatarImage
              src={getAvatarUrl(modProfile.id, modProfile.avatar) || "/placeholder.svg"}
              alt={modProfile.username}
            />
          ) : (
            <AvatarFallback className="bg-gradient-to-r from-discord-blurple to-purple-600 text-white font-bold text-xs">
              {modProfile?.username?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          )}
        </Avatar>
        <span className="text-discord-text text-xs truncate">
          {isModLoading ? "Loading..." : modProfile?.username || action.moderator}
        </span>
      </div>

      {/* Duration */}
      <div className="w-24 text-discord-text text-xs">
        {action.duration ? (
          typeof action.duration === "number" ? (
            new Date(action.duration).toLocaleDateString()
          ) : (
            action.duration
          )
        ) : (
          <span className="text-red-400">Permanent</span>
        )}
      </div>

      {/* Created date */}
      <div className="w-32 text-discord-text text-xs">
        <div className="flex flex-col">
          <span>{action.time ? new Date(action.time).toLocaleDateString() : "Unknown"}</span>
          <span className="text-xs opacity-60">
            {action.time ? new Date(action.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
          </span>
        </div>
      </div>

      {/* Actions - appear on hover */}
      <div className="ml-4 w-8">
        <div
          className={`flex items-center gap-1 transition-opacity duration-200 ${showActions ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-discord-text hover:text-white hover:bg-white/10"
                title="More Actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-discord-darker border-discord-border shadow-2xl">
              <DropdownMenuItem
                onClick={() => onAction("view", action)}
                className="text-discord-text hover:text-white hover:bg-white/5 p-3"
              >
                <Eye className="w-4 h-4 mr-3 text-blue-500" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

function ModerationActionDetails({
  action,
  onBack,
  profileCache,
  loadingProfiles,
  fetchProfiles,
}: {
  action: ModerationAction
  onBack: () => void
  profileCache: Record<string, UserProfile>
  loadingProfiles: Set<string>
  fetchProfiles: (userIds: string[]) => void
}) {
  const updateReason = useMutation(api.discord.updateModerationActionReason)

  const [editReason, setEditReason] = useState("")
  const [editDuration, setEditDuration] = useState("")
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!action) return

    const userIds = [action.userId, action.moderator, action.closedBy].filter(Boolean) as string[]
    fetchProfiles(userIds)

    setEditReason(action.reason || "")

    if (action.duration && typeof action.duration === "number") {
      const now = Date.now()
      const timeLeft = action.duration - now
      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

        let durationStr = ""
        if (days > 0) durationStr += `${days}d`
        if (hours > 0) durationStr += `${hours}h`
        if (minutes > 0) durationStr += `${minutes}m`
        if (seconds > 0) durationStr += `${seconds}s`

        setEditDuration(durationStr)
      } else {
        setEditDuration("")
      }
    } else {
      setEditDuration("")
    }
  }, [action, fetchProfiles])

  const handleSave = useCallback(async () => {
    if (!action) return

    setSaveLoading(true)
    setSaveError(null)

    try {
      const durationChanged = editDuration !== (action.duration || "")

      await updateReason({
        auditId: action.auditId,
        serverId: action.serverId,
        reason: editReason,
      })

      if (durationChanged) {
        const durationMs = parseDuration(editDuration)
        const endTime = Date.now() + durationMs

        await fetch(`http://localhost:4000/v1/moderationAction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: action.userId,
            serverId: action.serverId,
            duration: endTime,
            auditId: action.auditId,
          }),
        })
      }

      onBack()
    } catch (err) {
      console.error("Save error:", err)
      setSaveError("Failed to save changes. Please try again.")
    } finally {
      setSaveLoading(false)
    }
  }, [action, editReason, editDuration, updateReason, onBack])

  function parseDuration(input: string): number {
    if (!input.trim()) return 0

    const regex = /(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/
    const match = regex.exec(input.trim())

    if (!match) return 0

    const days = parseInt(match[1] || "0", 10)
    const hours = parseInt(match[2] || "0", 10)
    const minutes = parseInt(match[3] || "0", 10)
    const seconds = parseInt(match[4] || "0", 10)

    return ((days * 24 + hours) * 60 + minutes) * 60 + seconds * 1000
  }

  const getUserDisplayInfo = useCallback(
    (userId: string) => {
      const profile = profileCache[userId]
      const isLoading = loadingProfiles.has(userId)

      return {
        displayName: profile?.global_name || profile?.username || userId,
        username: profile?.username || userId,
        avatar: profile?.avatar,
        id: profile?.id || userId,
        isLoading,
      }
    },
    [profileCache, loadingProfiles],
  )

  if (!action) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-discord-darkest border border-discord-border rounded-lg mt-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-discord-text">Loading action details...</div>
        </div>
      </div>
    )
  }

  const targetUserId = action.userId
  const moderatorId = action.moderator
  const closerId = action.closedBy

  const userInfo = getUserDisplayInfo(targetUserId)
  const moderatorInfo = getUserDisplayInfo(moderatorId)
  const closerInfo = closerId ? getUserDisplayInfo(closerId) : null

  return (
    <div className="max-w-4xl mx-auto p-8 bg-discord-darkest border border-discord-border rounded-lg mt-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mr-4 flex items-center gap-2 text-discord-text hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Moderation Log
        </Button>
        <div className="text-2xl font-bold text-white">Moderation Action Details</div>
      </div>

      <div className="mb-6">
        <div className="text-lg font-semibold text-white mb-4">General Information</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* ID */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-discord-text uppercase tracking-wide">ID</span>
            <span className="font-mono text-white text-sm bg-discord-darker px-2 py-1 rounded">
              {action.auditId || "N/A"}
            </span>
          </div>

          {/* State */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-discord-text uppercase tracking-wide">State</span>
            <span
              className={`font-semibold ${action.state === "Done"
                ? "text-green-400"
                : action.state === "Active"
                  ? "text-yellow-400"
                  : "text-gray-400"
                }`}
            >
              {action.state || "Unknown"}
            </span>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-discord-text uppercase tracking-wide">Type</span>
            <span className="text-white font-semibold">{action.action}</span>
          </div>

          {/* Target User */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-discord-text uppercase tracking-wide">Target User</span>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {userInfo.isLoading ? (
                  <AvatarFallback>
                    <div className="animate-spin w-4 h-4 border-2 border-discord-blurple border-t-transparent rounded-full" />
                  </AvatarFallback>
                ) : userInfo.avatar ? (
                  <AvatarImage
                    src={`https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png?size=32`}
                    alt={userInfo.username}
                  />
                ) : (
                  <AvatarFallback>{userInfo.username.charAt(0).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <span className="text-white font-medium">{userInfo.isLoading ? "Loading..." : userInfo.displayName}</span>
                <span className="text-discord-text text-xs font-mono">{targetUserId}</span>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-discord-text uppercase tracking-wide">Duration</span>
            {action.state === "Done" ? (
              <span className="text-white font-semibold pt-2">
                {action.duration ? `Expired on ${new Date(action.duration).toLocaleString()}` : "Permanent"}
              </span>
            ) : (
              <>
                <input
                  className="w-full px-3 py-2 rounded bg-discord-darker border border-discord-border text-white focus:outline-none focus:ring-2 focus:ring-discord-blurple focus:border-transparent transition-all"
                  type="text"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  placeholder="e.g. 1d, 2h, 30m, or leave empty for permanent"
                />
                <span className="text-xs text-discord-text mt-1 h-4">
                  {editDuration.trim()
                    ? `Expires on: ${new Date(Date.now() + parseDuration(editDuration)).toLocaleString()}`
                    : "Permanent"}
                </span>
              </>
            )}
          </div>

          {/* Created */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-discord-text uppercase tracking-wide">Created</span>
            <span className="text-white">
              {action.time ? new Date(action.time).toLocaleString() : new Date(action._creationTime).toLocaleString()}
            </span>
          </div>

          {/* Moderator */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-discord-text uppercase tracking-wide">Moderator</span>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {moderatorInfo.isLoading ? (
                  <AvatarFallback>
                    <div className="animate-spin w-4 h-4 border-2 border-discord-blurple border-t-transparent rounded-full" />
                  </AvatarFallback>
                ) : moderatorInfo.avatar ? (
                  <AvatarImage
                    src={`https://cdn.discordapp.com/avatars/${moderatorInfo.id}/${moderatorInfo.avatar}.png?size=32`}
                    alt={moderatorInfo.username}
                  />
                ) : (
                  <AvatarFallback>{moderatorInfo.username.charAt(0).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <span className="text-white font-medium">
                  {moderatorInfo.isLoading ? "Loading..." : moderatorInfo.displayName}
                </span>
                <span className="text-discord-text text-xs font-mono">{moderatorId}</span>
              </div>
            </div>
          </div>

          {action.state === "Done" && (
            <>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-discord-text uppercase tracking-wide">Closed At</span>
                <span className="text-white">
                  {action.closedAt
                    ? typeof action.closedAt === "number"
                      ? new Date(action.closedAt).toLocaleString()
                      : action.closedAt
                    : "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-discord-text uppercase tracking-wide">Closed By</span>
                {closerInfo && closerId ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {closerInfo.isLoading ? (
                        <AvatarFallback>
                          <div className="animate-spin w-4 h-4 border-2 border-discord-blurple border-t-transparent rounded-full" />
                        </AvatarFallback>
                      ) : closerInfo.avatar ? (
                        <AvatarImage
                          src={`https://cdn.discordapp.com/avatars/${closerInfo.id}/${closerInfo.avatar}.png?size=32`}
                          alt={closerInfo.username}
                        />
                      ) : (
                        <AvatarFallback>{closerInfo.username.charAt(0).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-white font-medium">
                        {closerInfo.isLoading ? "Loading..." : closerInfo.displayName}
                      </span>
                      <span className="text-discord-text text-xs font-mono">{closerId}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-white font-medium">System</span>
                )}
              </div>
            </>
          )}

          {/* Reason */}
          <div className="flex flex-col gap-2 col-span-2">
            <span className="text-xs text-discord-text uppercase tracking-wide">Reason</span>
            <textarea
              className="w-full px-3 py-2 rounded bg-discord-darker border border-discord-border text-white focus:outline-none focus:ring-2 focus:ring-discord-blurple focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              rows={3}
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              disabled={action.state === "Done"}
              placeholder="Reason for this moderation action..."
            />
          </div>
        </div>

        {saveError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
            {saveError}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 pt-6 border-t border-discord-border">
        <Button variant="outline" onClick={onBack} className="px-6">
          Cancel
        </Button>

        {action.state !== "Done" && (
          <Button
            disabled={saveLoading || !editReason.trim()}
            onClick={handleSave}
            className="px-6 bg-discord-blurple hover:bg-discord-blurple/80"
          >
            {saveLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export function ModerationContent({ serverId }: ModerationContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [timeRange, setTimeRange] = useState("24h")
  const [debounce, setDebounce] = useState(false)
  const [selectedAction, setSelectedAction] = useState<ModerationAction | null>(null)

  const actions = useQuery(api.discord.getModerationActions, serverId ? { serverId } : "skip")

  const { profileCache, loadingProfiles, fetchProfiles } = useDiscordCache()

  // Extract unique user IDs from actions and batch fetch profiles
  const uniqueUserIds = useMemo(() => {
    if (!actions) return []

    const userIds = new Set<string>()
    actions.forEach((action) => {
      if (action.userId) userIds.add(action.userId)
      if (action.moderator) userIds.add(action.moderator)
      if (action.closedBy) userIds.add(action.closedBy)
    })

    return Array.from(userIds)
  }, [actions])

  // Fetch profiles when actions change
  useEffect(() => {
    if (uniqueUserIds.length > 0 || !Object.values(profileCache).flat()) {
      fetchProfiles(uniqueUserIds)
    }
  }, [uniqueUserIds, fetchProfiles, profileCache])

  const refreshProfiles = useCallback(() => {
    if (!actions) return
    const userIds = new Set<string>()
    actions.forEach((v) => {
      if (v.userId) userIds.add(v.userId)
      if (v.moderator) userIds.add(v.moderator)
      if (v.closedBy) userIds.add(v.closedBy)
    })
    fetchProfiles(Array.from(userIds))
  }, [actions, fetchProfiles])

  // Memoize filtered actions to prevent unnecessary recalculations
  const filteredActions = useMemo(() => {
    if (!actions) return []

    return actions.filter((action) => {
      const userProfile = profileCache[action.userId]
      const matchesSearch =
        (userProfile?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (action.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (action.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

      const matchesFilter = filterType === "all" || action.action?.toLowerCase() === filterType.toLowerCase()

      return matchesSearch && matchesFilter
    })
  }, [actions, profileCache, searchQuery, filterType])

  const handleClearFilters = useCallback(() => {
    setSearchQuery("")
    setFilterType("all")
  }, [])

  const handleDebouncedRefresh = () => {
    if (debounce) return
    setDebounce(true)
    refreshProfiles()
    setTimeout(() => setDebounce(false), 15000) // 15 second debounce
  }

  const handleModerationAction = useCallback(
    (type: string, action: ModerationAction) => {
      switch (type) {
        case "view":
          setSelectedAction(action)
          break
        case "edit":
          // Handle edit action
          console.log("Edit action:", action)
          break
        case "delete":
          // Handle delete action
          console.log("Delete action:", action)
          break
        default:
          break
      }
    },
    [setSelectedAction],
  )

  if (selectedAction) {
    return (
      <ModerationActionDetails
        action={selectedAction}
        onBack={() => setSelectedAction(null)}
        profileCache={profileCache}
        loadingProfiles={loadingProfiles}
        fetchProfiles={fetchProfiles}
      />
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-discord-dark">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-20 bg-discord-darker/95 backdrop-blur-xl border-b border-discord-border/50 p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-black text-white font-minecraft tracking-wide mb-2">SECURITY CONTROL</h1>
            <p className="text-discord-text text-lg">Monitor and manage server moderation activities</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto"
          >
            {/* Enhanced Search */}
            <div className="relative flex-1 lg:flex-initial">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-discord-text w-5 h-5" />
              <Input
                placeholder="Search actions, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-discord-dark/50 border-discord-border text-white placeholder:text-discord-text focus:border-discord-blurple focus:ring-2 focus:ring-discord-blurple/20 rounded-xl lg:w-80"
              />
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="discord-button-outline h-12 px-6 bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  {filterType === "all" ? "All Actions" : filterType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-discord-darker border-discord-border shadow-2xl">
                <DropdownMenuItem
                  onClick={() => setFilterType("all")}
                  className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                >
                  All Actions
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterType("ban")}
                  className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                >
                  <Ban className="w-4 h-4 mr-2 text-discord-red" />
                  Bans
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterType("kick")}
                  className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                >
                  <UserX className="w-4 h-4 mr-2 text-discord-orange" />
                  Kicks
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterType("warn")}
                  className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                >
                  <AlertTriangle className="w-4 h-4 mr-2 text-discord-yellow" />
                  Warnings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex gap-3">
              <Button variant="outline" className="discord-button-outline h-12 px-6 bg-transparent">
                <Eye className="w-4 h-4 mr-2" />
                View Logs
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-discord-red to-pink-600 hover:from-discord-red/80 hover:to-pink-600/80 text-white font-bold h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Quick Action
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="p-8 space-y-10">
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">
                  RECENT <span className="text-discord-green glow-text">ACTIONS</span>
                </h2>
                <p className="text-discord-text text-lg">
                  {filteredActions.length} of {actions?.length || 0} actions
                  {searchQuery && ` matching "${searchQuery}"`}
                  {filterType !== "all" && ` filtered by ${filterType}`}
                </p>
              </div>

              {/* Time Range Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="discord-button-outline bg-transparent">
                    <Clock className="w-4 h-4 mr-2" />
                    Last {timeRange}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-discord-darker border-discord-border shadow-2xl">
                  <DropdownMenuItem
                    onClick={() => setTimeRange("24h")}
                    className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                  >
                    Last 24 Hours
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTimeRange("7d")}
                    className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                  >
                    Last 7 Days
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTimeRange("30d")}
                    className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                  >
                    Last 30 Days
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>

          {filteredActions.length > 0 ? (
            <div className="bg-discord-dark/60 rounded-xl overflow-hidden">
              {/* Table header */}
              <div className="flex items-center px-4 py-3 bg-discord-darker/80 border-b border-discord-border/30 text-discord-text text-xs font-semibold uppercase tracking-wide">
                <div className="w-24">Case ID</div>
                <div className="min-w-[180px]">User</div>
                <div className="flex-1 mx-4">Reason</div>
                <div className="w-40">Closed By</div>
                <div className="w-40">Closed At</div>
                <div className="w-40">Moderator</div>
                <div className="w-24">Duration</div>
                <div className="w-32">Created</div>
                <div className="ml-4 w-8"></div>
              </div>

              {/* Moderation rows */}
              <div className="divide-y divide-discord-border/20">
                {filteredActions.map((action) => (
                  <ModerationRow
                    key={action._id}
                    action={action}
                    profileCache={profileCache}
                    loadingProfiles={loadingProfiles}
                    onAction={handleModerationAction}
                  />
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-discord-green to-teal-600 flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No moderation actions found</h3>
              <p className="text-discord-text mb-6 max-w-md mx-auto">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Your server is running smoothly with no recent moderation actions"}
              </p>
              {(searchQuery || filterType !== "all") && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="discord-button-outline bg-transparent"
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          )}
        </section>
        <div className="fixed bottom-0.5 z-30">
          <Button
            onClick={handleDebouncedRefresh}
            variant="outline"
            size="sm"
            className={`discord-button-outline`}
            disabled={debounce}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Profiles
          </Button>
        </div>
        <p className="text-discord-text text-center text-sm">Pretty lonely down here...</p>
      </div>
    </div>
  )
}
''
