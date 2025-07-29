"use client"

import {
  ArrowDown,
  ArrowUp,
  Ban,
  Calendar,
  Crown,
  Filter,
  Globe,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Shield,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  X,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useUserPresence } from "@/hooks/use-user-presence"
import { DiscordInvite, DiscordMember, DiscordRole } from "@/types/discord"

interface MembersContentProps {
  serverId?: string
}

// Enhanced Member Row Component (Discord-style)
function MemberRow({
  member,
  serverRoles,
  ownerId,
  serverId,
  onAction,
  isSelected,
  onSelect,
}: {
  member: DiscordMember
  serverRoles: any[]
  ownerId: string | null
  serverId: string
  onAction: (type: string, member: DiscordMember) => void
  isSelected: boolean
  onSelect: (memberId: string, selected: boolean) => void
}) {
  const [showActions, setShowActions] = useState(false)
  const presence = useUserPresence(serverId, member.user.id);

  // Helper function to get role name from role ID
  const getRoleName = (roleId: string) => {
    const role = serverRoles.find((r: any) => r.id === roleId)
    return role?.name || roleId
  }

  // Helper function to get role color
  const getRoleColor = (roleId: string) => {
    const role = serverRoles.find((r: any) => r.id === roleId)
    if (role?.color) {
      return typeof role.color === "string" ? role.color : `#${role.color.toString(16).padStart(6, "0")}`
    }
    return "#5865F2" // Default Discord blurple
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "dnd":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getAvatarUrl = () => {
    if (member.avatar) {
      return `https://cdn.discordapp.com/avatars/${member.user.id}/${member.avatar}.png`
    } else if (member.user?.avatar) {
      return `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
    }
    return "/placeholder.svg?height=40&width=40"
  }

  // Calculate Discord join date (this would come from API in real implementation)
  const getDiscordJoinDate = () => {
    // For demo purposes, using a calculated date based on user ID
    // In real implementation, this would come from Discord API
    const userId = member.user?.id
    if (userId) {
      // Discord snowflake timestamp extraction (simplified)
      const timestamp = (Number.parseInt(userId) >> 22) + 1420070400000
      return new Date(timestamp).toLocaleDateString()
    }
    return "Unknown"
  }

  return (
    <div
      className={`group flex items-center px-4 py-3 transition-colors duration-200 border-b border-discord-border/20 hover:bg-discord-darker/40 ${isSelected ? "bg-discord-blurple/20" : ""
        } ${ownerId && member.user?.id === ownerId ? "bg-yellow-500/10 border-l-4 border-yellow-400" : ""}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Selection checkbox */}
      <div className="flex items-center mr-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(member.user?.id || member.user.id, !!checked)}
          className="data-[state=checked]:bg-discord-blurple data-[state=checked]:border-discord-blurple"
        />
      </div>

      {/* User info with integrated actions */}
      <div className="flex items-center gap-3 min-w-[200px] relative">
        <div className="relative">
          <Avatar className="h-10 w-10 cursor-pointer" onClick={() => onAction("profile", member)}>
            <AvatarImage src={getAvatarUrl() || "/placeholder.svg"} alt={member.user?.username} />
            <AvatarFallback className="bg-gradient-to-r from-discord-blurple to-purple-600 text-white font-bold">
              {member.user?.username ? member.user.username.charAt(0).toUpperCase() : ""}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-discord-dark ${presence.status}`}
          />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white text-sm flex items-center gap-2">
            <span className="cursor-pointer hover:underline" onClick={() => onAction("profile", member)}>
              {member.user?.username}
            </span>
            {ownerId && member.user?.id === ownerId && <Crown className="w-4 h-4 text-yellow-400" />}
          </div>
          {member.user?.discriminator && <div className="text-discord-text text-xs">#{member.user.discriminator}</div>}
        </div>

        {/* Quick action buttons - appear on hover */}
        <div
          className={`absolute right-0 flex items-center gap-1 transition-opacity duration-200 ${showActions ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction("message", member)}
            className="h-8 w-8 p-0 text-discord-text hover:text-white hover:bg-blue-500/20"
            title="Send Message"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction("roles", member)}
            className="h-8 w-8 p-0 text-discord-text hover:text-white hover:bg-purple-500/20"
            title="Manage Roles"
          >
            <Settings className="h-4 w-4" />
          </Button>
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
                onClick={() => onAction("profile", member)}
                className="text-discord-text hover:text-white hover:bg-white/5 p-3"
              >
                <UserCheck className="w-4 h-4 mr-3 text-green-500" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-discord-border/30" />
              <DropdownMenuItem
                onClick={() => onAction("moderate", member)}
                className="text-discord-text hover:text-red-400 hover:bg-red-500/10 p-3"
              >
                <Ban className="w-4 h-4 mr-3 text-red-500" />
                Moderate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Roles - all on same line */}
      <div className="flex-1 min-w-0 mx-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {member.roles && member.roles.length > 0 ? (
            member.roles.map((roleId: string) => {
              const roleName = getRoleName(roleId)
              const roleColor = getRoleColor(roleId)
              return (
                <span
                  key={roleId}
                  className="inline-flex items-center rounded px-2 py-1 text-xs font-medium whitespace-nowrap flex-shrink-0 cursor-pointer hover:opacity-80"
                  style={{
                    background: roleColor + "20",
                    borderColor: roleColor + "60",
                    color: roleColor,
                    border: `1px solid ${roleColor}60`,
                  }}
                  title={`Filter by ${roleName}`}
                >
                  <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: roleColor }} />
                  {roleName}
                </span>
              )
            })
          ) : (
            <span className="text-discord-text text-xs opacity-60">No roles</span>
          )}
        </div>
      </div>

      {/* Server join date */}
      <div className="w-32 text-discord-text text-xs">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : "Unknown"}
        </div>
      </div>

      {/* Discord join date */}
      <div className="w-32 text-discord-text text-xs">
        <div className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          {getDiscordJoinDate()}
        </div>
      </div>

      {/* Empty space for alignment */}
      <div className="ml-4 w-8"></div>
    </div>
  )
}

export function MembersContent({ serverId }: MembersContentProps) {
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [sortBy, setSortBy] = useState("joined")
  const [page, setPage] = useState(0)
  const [afterCursors, setAfterCursors] = useState<string[]>([""])
  const [members, setMembers] = useState<any[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const cache = useRef<{ [key: string]: any[] }>({})
  const [selectedMember, setSelectedMember] = useState<DiscordMember | null>(null)
  const [modalType, setModalType] = useState<null | "profile" | "roles" | "moderate" | "message">(null)
  const PAGE_SIZE = 10

  // Add state for all roles and editing roles
  const [allRoles, setAllRoles] = useState<DiscordRole[]>([])
  const [editRoles, setEditRoles] = useState<string[]>([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [rolesError, setRolesError] = useState<string | null>(null)

  const [serverRoles, setServerRoles] = useState<any[]>([])
  const [serverInvites, setServerInvites] = useState<DiscordInvite[]>()

  // Add these state variables after the existing ones
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  const [sortKey, setSortKey] = useState<"join" | "name" | "role">("join")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const ownerId = "69897317924614144"

  // Fetch server roles for display in member cards
  useEffect(() => {
    if (serverId) {
      fetch(`/api/discord/guild/roles?serverId=${serverId}`)
        .then((res) => res.json())
        .then((data) => {
          setServerRoles(data || [])
        })
        .catch((err) => {
          console.error("Failed to fetch server roles:", err)
        })
    }
  }, [serverId])

  // Fetch paginated, filtered members from API
  const fetchMembers = useCallback(
    async (pageIdx: number, after: string) => {
      if (!serverId) return
      setLoading(true)
      const params = new URLSearchParams({
        serverId,
        limit: PAGE_SIZE.toString(),
      })
      if (after) params.append("after", after)
      if (searchQuery) params.append("search", searchQuery)
      // Discord API does not support role filter directly, so filter client-side
      const res = await fetch(`/api/discord/guild/members?${params.toString()}`)
      const data = await res.json()
      let filtered = data.members
      if (filterRole !== "all") {
        filtered = filtered.filter((m: any) => (m.roles || []).includes(filterRole))
      }
      cache.current[`${pageIdx}:${after}`] = filtered
      setMembers(filtered)
      setTotal(data.total)
      setLoading(false)
    },
    [serverId, searchQuery, filterRole],
  )

  const handleInvite =
    async () => {
      if (serverInvites && serverInvites?.length > 0) {
        console.log(serverInvites[0])
        toast.promise(
          navigator.clipboard.writeText(`https://discord.gg/${serverInvites[0].code}`),
          {
            loading: "Copying...",
            success: `Copied https://discord.gg/${serverInvites[0].code} to clipboard!`,
            error: "Failed to copy invite to clipboard"
          }
        )
        return
      }
      const res = await fetch(`/api/discord/guild/invite?serverId=${serverId}&with_counts=1`);
      const data = await res.json();
      setServerInvites(data.invites)

      toast.promise(
        navigator.clipboard.writeText(`https://discord.gg/${data.invites[0].code}`),
        {
          loading: "Copying...",
          success: `Copied https://discord.gg/${data.invites[0].code} to clipboard!`,
          error: "Failed to copy invite to clipboard",
        }
      )
    }


  useEffect(() => {
    // Reset to first page on filter/search change
    setPage(0)
    setAfterCursors([""])
    fetchMembers(0, "")
  }, [serverId, searchQuery, filterRole, fetchMembers])

  useEffect(() => {
    const after = afterCursors[page] || ""
    if (cache.current[`${page}:${after}`]) {
      setMembers(cache.current[`${page}:${after}`])
    } else {
      fetchMembers(page, after)
    }
  }, [page, afterCursors, fetchMembers])

  // Pagination logic
  const handleNextPage = () => {
    if (members.length > 0) {
      const last = members[members.length - 1]
      const after = last.user?.id || last.user?.userId || last.user?.discordUserId || last.user?._id || ""
      setAfterCursors((prev) => {
        const next = [...prev]
        next[page + 1] = after
        return next
      })
      setPage((p) => p + 1)
    }
  }
  const handlePrevPage = () => {
    if (page > 0) setPage((p) => p - 1)
  }
  const pageCount = null // Discord API does not provide total

  // Actions
  async function handleManageRoles(member: any, newRoles: string[]) {
    await fetch("http://localhost:4000/v1/users/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: member.user?.id || member.id, serverId, roles: newRoles }),
    })
  }
  async function handleSendMessage(member: any, message: string) {
    await fetch("http://localhost:4000/v1/users/interaction/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: member.user?.id || member.id, serverId, message }),
    })
  }
  async function handleModerate(member: any, action: "kick" | "mute" | "ban", options: any) {
    // POST to moderation endpoint (implement as needed)
    await fetch("http://localhost:4000/v1/moderationAction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: member.user?.id || member.id, serverId, ...options, action }),
    })
  }

  const handleSelectMember = (memberId: string, selected: boolean) => {
    setSelectedMembers((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(memberId)
      } else {
        newSet.delete(memberId)
      }
      return newSet
    })
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectAll(selected)
    if (selected) {
      setSelectedMembers(new Set(members.map((m) => m.user?.id || m.id)))
    } else {
      setSelectedMembers(new Set())
    }
  }

  // Modal state and handlers
  function openModal(type: typeof modalType, member: any) {
    console.log(member)
    setSelectedMember(member)
    setModalType(type)
  }
  function closeModal() {
    setSelectedMember(null)
    setModalType(null)
  }

  // Fetch all roles when Manage Roles modal opens
  useEffect(() => {
    if (modalType === "roles" && serverId) {
      setRolesLoading(true)
      setRolesError(null)
      fetch(`/api/discord/guild/roles?serverId=${serverId}`)
        .then((res) => res.json())
        .then((data) => {
          setAllRoles(data || [])
          setRolesLoading(false)
        })
        .catch((err) => {
          setRolesError("Failed to fetch roles")
          setRolesLoading(false)
        })
      setEditRoles(selectedMember?.roles || [])
    }
  }, [modalType, serverId, selectedMember])

  // Remove a role
  const handleRemoveRole = (roleId: string) => {
    setEditRoles((prev) => prev.filter((r) => r !== roleId))
  }
  // Add a role
  const handleAddRole = (roleId: string) => {
    if (!editRoles.includes(roleId)) {
      setEditRoles((prev) => [...prev, roleId])
    }
  }
  // On Done, call handleManageRoles
  const handleDoneRoles = () => {
    handleManageRoles(selectedMember, editRoles)
    closeModal()
  }

  return (
    <div className="flex-1 overflow-auto bg-discord-dark">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-20 bg-discord-darker/95 backdrop-blur-xl border-b border-discord-border/50 p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Remove motion.div for header title */}
          {/* <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          > */}

          <h1 className="text-4xl font-black text-white font-minecraft tracking-wide mb-2">COMMUNITY MEMBERS</h1>
          <p className="text-discord-text text-lg">Manage server members, roles, and permissions</p>
          {/* </motion.div> */}

          {/* Remove motion.div for header buttons */}
          {/* <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto"
          > */}
          {/* Enhanced Search */}
          <div className="relative flex-1 lg:flex-initial">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-discord-text w-5 h-5" />
            <Input
              placeholder="Search members..."
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
                Filter & Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-discord-darker border-discord-border shadow-2xl">
              <div className="p-3 border-b border-discord-border/30">
                <Label className="text-discord-text text-xs font-semibold uppercase tracking-wide">Sort By</Label>
              </div>
              <DropdownMenuItem
                onClick={() => setSortKey("join")}
                className={`text-discord-text hover:text-white hover:bg-white/5 p-3 flex items-center gap-2 ${sortKey === "join" ? "bg-discord-blurple/20 text-discord-blurple" : ""}`}
              >
                <Calendar className="w-4 h-4" />
                Server Join Date
                {sortKey === "join" &&
                  (sortDir === "asc" ? (
                    <ArrowUp className="w-3 h-3 ml-auto" />
                  ) : (
                    <ArrowDown className="w-3 h-3 ml-auto" />
                  ))}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortKey("name")}
                className={`text-discord-text hover:text-white hover:bg-white/5 p-3 flex items-center gap-2 ${sortKey === "name" ? "bg-discord-blurple/20 text-discord-blurple" : ""}`}
              >
                <Users className="w-4 h-4" />
                Display Name
                {sortKey === "name" &&
                  (sortDir === "asc" ? (
                    <ArrowUp className="w-3 h-3 ml-auto" />
                  ) : (
                    <ArrowDown className="w-3 h-3 ml-auto" />
                  ))}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortKey("role")}
                className={`text-discord-text hover:text-white hover:bg-white/5 p-3 flex items-center gap-2 ${sortKey === "role" ? "bg-discord-blurple/20 text-discord-blurple" : ""}`}
              >
                <Shield className="w-4 h-4" />
                Role Hierarchy
                {sortKey === "role" &&
                  (sortDir === "asc" ? (
                    <ArrowUp className="w-3 h-3 ml-auto" />
                  ) : (
                    <ArrowDown className="w-3 h-3 ml-auto" />
                  ))}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-discord-border/30" />
              <DropdownMenuItem
                onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
                className="text-discord-text hover:text-white hover:bg-white/5 p-3 flex items-center gap-2"
              >
                {sortDir === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {sortDir === "asc" ? "Ascending" : "Descending"}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-discord-border/30" />
              <div className="p-3 border-b border-discord-border/30">
                <Label className="text-discord-text text-xs font-semibold uppercase tracking-wide">
                  Filter By Role
                </Label>
              </div>
              <DropdownMenuItem
                onClick={() => setFilterRole("all")}
                className={`text-discord-text hover:text-white hover:bg-white/5 p-3 ${filterRole === "all" ? "bg-discord-blurple/20 text-discord-blurple" : ""}`}
              >
                All Members
              </DropdownMenuItem>
              {serverRoles.slice(0, 5).map((role: any) => (
                <DropdownMenuItem
                  key={role.id}
                  onClick={() => setFilterRole(role.id)}
                  className={`text-discord-text hover:text-white hover:bg-white/5 p-3 flex items-center gap-2 ${filterRole === role.id ? "bg-discord-blurple/20 text-discord-blurple" : ""}`}
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: role.color
                        ? typeof role.color === "string"
                          ? role.color
                          : `#${role.color.toString(16).padStart(6, "0")}`
                        : "#5865F2",
                    }}
                  />
                  {role.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleInvite}
            className="bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Members
          </Button>

        </div>
      </header>

      <div className="p-8 space-y-10">
        <section>
          <div className="flex items-center justify-between">
            <div>
              <Badge className="mb-4 bg-discord-green/20 text-discord-green border-discord-green/30 px-4 py-2 font-bold">
                <Globe className="mr-2 h-4 w-4" />
                MEMBER DIRECTORY
              </Badge>
              <h2 className="text-3xl font-black text-white mb-2">
                ACTIVE <span className="text-discord-green glow-text">MEMBERS</span>
              </h2>
              <p className="text-discord-text text-lg">
                {total} of {total} members
                {searchQuery && ` matching "${searchQuery}"`}
                {filterRole !== "all" && ` with role "${filterRole}"`}
              </p>
            </div>

            {/* Sort Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="discord-button-outline bg-transparent">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Sort by {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-discord-darker border-discord-border shadow-2xl">
                <DropdownMenuItem
                  onClick={() => setSortBy("joined")}
                  className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                >
                  Join Date
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("activity")}
                  className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                >
                  Activity Level
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("role")}
                  className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                >
                  Role Hierarchy
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {members.length > 0 ? (
            <div className="bg-discord-dark/60 rounded-xl overflow-hidden">
              {/* Table header with column filters */}
              <div className="flex items-center px-4 py-3 bg-discord-darker/80 border-b border-discord-border/30 text-discord-text text-xs font-semibold uppercase tracking-wide">
                <div className="flex items-center mr-4">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    className="data-[state=checked]:bg-discord-blurple data-[state=checked]:border-discord-blurple"
                  />
                </div>

                {/* Member column with sort */}
                <div className="min-w-[200px] flex items-center gap-2">
                  <span>Member</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-discord-text hover:text-white">
                        <ArrowUp
                          className={`w-3 h-3 ${sortKey === "name" && sortDir === "asc" ? "text-discord-blurple" : ""}`}
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 bg-discord-darker border-discord-border">
                      <DropdownMenuItem
                        onClick={() => {
                          setSortKey("name")
                          setSortDir("asc")
                        }}
                        className="text-discord-text hover:text-white hover:bg-white/5 p-2"
                      >
                        <ArrowUp className="w-3 h-3 mr-2" />A → Z
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSortKey("name")
                          setSortDir("desc")
                        }}
                        className="text-discord-text hover:text-white hover:bg-white/5 p-2"
                      >
                        <ArrowDown className="w-3 h-3 mr-2" />Z → A
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Roles column with filter */}
                <div className="flex-1 mx-4 flex items-center gap-2">
                  <span>Roles</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-discord-text hover:text-white">
                        <Filter className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-discord-darker border-discord-border max-h-64 overflow-y-auto">
                      <DropdownMenuItem
                        onClick={() => setFilterRole("all")}
                        className={`text-discord-text hover:text-white hover:bg-white/5 p-2 ${filterRole === "all" ? "bg-discord-blurple/20 text-discord-blurple" : ""}`}
                      >
                        All Roles
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-discord-border/30" />
                      {serverRoles.map((role: any) => (
                        <DropdownMenuItem
                          key={role.id}
                          onClick={() => setFilterRole(role.id)}
                          className={`text-discord-text hover:text-white hover:bg-white/5 p-2 flex items-center gap-2 ${filterRole === role.id ? "bg-discord-blurple/20 text-discord-blurple" : ""}`}
                        >
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: role.color
                                ? typeof role.color === "string"
                                  ? role.color
                                  : `#${role.color.toString(16).padStart(6, "0")}`
                                : "#5865F2",
                            }}
                          />
                          {role.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Server Join column with sort */}
                <div className="w-32 flex items-center gap-2">
                  <span>Server Join</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-discord-text hover:text-white">
                        <Calendar className={`w-3 h-3 ${sortKey === "join" ? "text-discord-blurple" : ""}`} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 bg-discord-darker border-discord-border">
                      <DropdownMenuItem
                        onClick={() => {
                          setSortKey("join")
                          setSortDir("desc")
                        }}
                        className="text-discord-text hover:text-white hover:bg-white/5 p-2"
                      >
                        <ArrowDown className="w-3 h-3 mr-2" />
                        Newest First
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSortKey("join")
                          setSortDir("asc")
                        }}
                        className="text-discord-text hover:text-white hover:bg-white/5 p-2"
                      >
                        <ArrowUp className="w-3 h-3 mr-2" />
                        Oldest First
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Discord Join column */}
                <div className="w-32">Discord Join</div>

                {/* Actions column */}
                <div className="ml-4 w-8"></div>
              </div>

              {/* Member rows */}
              <div className="divide-y divide-discord-border/20">
                {members.map((member, index) => (
                  <MemberRow
                    key={member.user?.id || index}
                    member={member}
                    serverRoles={serverRoles}
                    ownerId={ownerId}
                    serverId={serverId!}
                    isSelected={selectedMembers.has(member.user?.id || member.id)}
                    onSelect={handleSelectMember}
                    onAction={(type: string, memberObj: any) =>
                      openModal(type as "profile" | "roles" | "moderate" | "message" | null, memberObj)
                    }
                  />
                ))}
              </div>

              {/* Bulk actions bar */}
              {selectedMembers.size > 0 && (
                <div className="flex items-center justify-between px-4 py-3 bg-discord-blurple/20 border-t border-discord-blurple/30">
                  <span className="text-discord-blurple font-medium">
                    {selectedMembers.size} member{selectedMembers.size !== 1 ? "s" : ""} selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-discord-blurple border-discord-blurple hover:bg-discord-blurple/10 bg-transparent"
                    >
                      Manage Roles
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-400 border-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                      Moderate
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-discord-blurple to-purple-600 flex items-center justify-center shadow-2xl">
                <UserX className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No members found</h3>
              <p className="text-discord-text mb-6 max-w-md mx-auto">
                {searchQuery || filterRole !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No members to display"}
              </p>
              {(searchQuery || filterRole !== "all") && (
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setFilterRole("all")
                  }}
                  variant="outline"
                  className="discord-button-outline"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 gap-2">
            <Button disabled={page === 0 || loading} onClick={handlePrevPage}>
              Previous
            </Button>
            <span className="text-white px-4">Page {page + 1}</span>
            <Button disabled={members.length < PAGE_SIZE || loading} onClick={handleNextPage}>
              Next
            </Button>
          </div>
        </section>
      </div>
      {/* Modals */}
      {/* Profile Modal */}
      <Dialog open={modalType === "profile"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMember?.user?.username}'s Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={`https://cdn.discordapp.com/avatars/${selectedMember?.user.id}/${selectedMember?.avatar || selectedMember?.user.avatar}` || "/placeholder.svg"} />
              <AvatarFallback>
                {selectedMember?.user?.username ? selectedMember.user.username.charAt(0).toUpperCase() : ""}
              </AvatarFallback>
            </Avatar>
            <div className="text-lg text-white font-bold">{selectedMember?.user?.username}</div>
            <div className="text-discord-text">{selectedMember?.user?.email}</div>
            <div className="flex gap-2 flex-wrap">
              {allRoles
                .filter((role) => selectedMember?.roles?.includes(role.id))
                .map((role) => (
                  <Badge
                    key={role.id}
                    className="bg-discord-blurple/20 text-discord-text border-discord-blurple/30 text-xs px-2 py-1"
                  >
                    {role.name}
                  </Badge>
                ))}
            </div>
            <div className="text-discord-text text-sm">
              Joined: {selectedMember?.joined_at ? new Date(selectedMember.joined_at).toLocaleDateString() : ""}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={closeModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Manage Roles Modal */}
      <Dialog open={modalType === "roles"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Roles for {selectedMember?.user?.username}</DialogTitle>
          </DialogHeader>
          {/* User-friendly roles UI */}
          {rolesLoading ? (
            <div className="text-discord-text">Loading roles...</div>
          ) : rolesError ? (
            <div className="text-red-500">{rolesError}</div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {editRoles.map((roleId) => {
                  const role = allRoles.find((r: any) => r.id === roleId) || { id: roleId, name: roleId, color: 0 }
                  // fallback to Discord blurple if no color
                  const color = role.color
                    ? typeof role.color === "string"
                      ? role.color
                      : `#${role.color.toString(16).padStart(6, "0")}`
                    : "#5865F2"
                  return (
                    <span
                      key={roleId}
                      className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold border"
                      style={{
                        background: color + "22", // transparent bg
                        borderColor: color,
                        color: color === "#5865F2" ? "#fff" : color,
                      }}
                    >
                      {role.name || role.id}
                      <button
                        type="button"
                        className="ml-1 text-discord-text hover:text-red-500 focus:outline-none"
                        onClick={() => handleRemoveRole(roleId)}
                        aria-label={`Remove role ${role.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )
                })}
                {/* Add role dropdown */}
                <Select onValueChange={handleAddRole} value="">
                  <SelectTrigger className="w-auto px-2 py-1 h-7 border-dashed border-2 border-discord-blurple/30 bg-discord-blurple/10 text-discord-blurple flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    <span>Add Role</span>
                  </SelectTrigger>
                  <SelectContent>
                    {allRoles
                      .filter((r: any) => !editRoles.includes(r.id))
                      .map((role: any) => {
                        const color = role.color
                          ? typeof role.color === "string"
                            ? role.color
                            : `#${role.color.toString(16).padStart(6, "0")}`
                          : "#5865F2"
                        return (
                          <SelectItem key={role.id} value={role.id}>
                            <span className="flex items-center gap-2">
                              <span
                                className="inline-block w-3 h-3 rounded-full border"
                                style={{ background: color, borderColor: color }}
                              />
                              <span>{role.name}</span>
                            </span>
                          </SelectItem>
                        )
                      })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleDoneRoles}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Moderate Modal */}
      <Dialog open={modalType === "moderate"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Moderate {selectedMember?.user?.username}</DialogTitle>
          </DialogHeader>
          {/* Moderation Panel with dynamic fields */}
          <ModerationPanel member={selectedMember} onModerate={handleModerate} onClose={closeModal} />
          <DialogFooter>
            <Button onClick={closeModal} variant="outline">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Send Message Modal */}
      <Dialog open={modalType === "message"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {selectedMember?.user?.username}</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Type your message..."
            onBlur={(e) => handleSendMessage(selectedMember, e.target.value)}
          />
          <DialogFooter>
            <Button onClick={closeModal}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ModerationPanel component
function ModerationPanel({ member, onModerate, onClose }: { member: any; onModerate: Function; onClose: Function }) {
  const [action, setAction] = useState<"warn" | "kick" | "mute" | "ban">("warn")
  const [reason, setReason] = useState("")
  const [duration, setDuration] = useState("")
  const [deleteMsg, setDeleteMsg] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle submit
  const handleSubmit = async () => {
    setError(null)
    if (!reason.trim()) {
      setError("Reason is required.")
      return
    }
    setLoading(true)
    try {
      const options: any = { reason }
      if (action === "mute" || action === "ban") {
        if (duration) options.duration = parseDuration(duration)
      }
      if (action === "ban") {
        options.deleteMessageHistory = deleteMsg
      }
      await onModerate(member, action, options)
      onClose()
    } catch (e) {
      setError("Failed to perform moderation action.")
    } finally {
      setLoading(false)
    }
  }

  // Helper to parse duration string (e.g., '10m', '1h') to seconds
  function parseDuration(str: string): number | undefined {
    if (!str) return undefined
    const match = str.match(/^(\d+)([smhd])$/)
    if (!match) return undefined
    const value = Number.parseInt(match[1], 10)
    const unit = match[2]
    switch (unit) {
      case "s":
        return value
      case "m":
        return value * 60
      case "h":
        return value * 3600
      case "d":
        return value * 86400
      default:
        return undefined
    }
  }

  return (
    <div className="flex flex-col gap-6 mt-2 mb-2">
      <Tabs value={action} onValueChange={(v) => setAction(v as any)} className="w-full">
        <TabsList className="flex w-full justify-between mb-4">
          <TabsTrigger value="warn">Warn</TabsTrigger>
          <TabsTrigger value="kick">Kick</TabsTrigger>
          <TabsTrigger value="mute">Mute</TabsTrigger>
          <TabsTrigger value="ban">Ban</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="reason">
            Reason<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for moderation..."
            className="mt-1"
            required
          />
        </div>
        {(action === "mute" || action === "ban") && (
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 10m, 1h, 1d (leave blank for indefinite)"
              className="mt-1"
            />
          </div>
        )}
        {action === "ban" && (
          <div className="flex items-center gap-2">
            <Checkbox id="deleteMsg" checked={deleteMsg} onCheckedChange={(v) => setDeleteMsg(!!v)} />
            <Label htmlFor="deleteMsg">Delete message history</Label>
          </div>
        )}
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        <Button onClick={handleSubmit} disabled={loading} className="mt-2 w-full">
          {loading ? "Processing..." : "Submit"}
        </Button>
      </div>
    </div>
  )
}
