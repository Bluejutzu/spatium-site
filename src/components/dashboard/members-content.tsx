"use client"

import { motion, useInView } from "framer-motion"
import {
  Activity,
  AlertTriangle,
  Ban,
  BarChart3,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent,TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from '@/components/ui/textarea';

interface MembersContentProps {
  serverId?: string
}

// Enhanced Member Card Component
function MemberCard({ member, index, onAction }: { member: any; index: number; onAction: (type: string, member: any) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [isHovered, setIsHovered] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-discord-green shadow-green-500/50'
      case 'idle': return 'bg-discord-yellow shadow-yellow-500/50'
      case 'dnd': return 'bg-discord-red shadow-red-500/50'
      default: return 'bg-gray-500'
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -2, scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="discord-card border border-discord-border/50 hover:border-discord-blurple/50 transition-all duration-300 overflow-hidden relative">
        {/* Enhanced background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-discord-blurple/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <motion.div
                  animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Avatar className="h-12 w-12 ring-2 ring-discord-border group-hover:ring-discord-blurple/50 transition-all duration-300">
                    <AvatarImage src={member.user?.avatar} alt={member.user?.username} />
                    <AvatarFallback className="bg-gradient-to-r from-discord-blurple to-purple-600 text-white font-bold">
                      {member.user?.username ? member.user.username.charAt(0).toUpperCase() : ""}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                {/* Enhanced status indicator */}
                <motion.div
                  className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-discord-dark ${getStatusColor(member.status)}`}
                  animate={{ scale: member.status === 'online' ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white truncate group-hover:text-discord-blurple transition-colors duration-300">
                    {member.user?.username}
                  </h3>
                </div>
                {/* Roles as chips with spacing and color */}
                <div className="flex flex-wrap gap-2 mb-2 mt-2">
                  {member.roles?.slice(0, 3).map((roleId: string) => (
                    <span
                      key={roleId}
                      className="rounded px-2 py-1 text-xs font-semibold border"
                      style={{
                        background: '#23272A',
                        borderColor: '#23272A',
                        color: '#fff',
                        // If you have allRoles context, you can get color here
                      }}
                    >
                      {roleId}
                    </span>
                  ))}
                  {member.roles?.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-1 border-discord-border/50">
                      +{member.roles.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-discord-text">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {member.messageCount || 0} messages
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced action menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-discord-text hover:text-white hover:bg-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-discord-darker border-discord-border shadow-2xl">
                <DropdownMenuItem onClick={() => onAction('profile', member)} className="text-discord-text hover:text-white hover:bg-white/5 p-3">
                  <UserCheck className="w-4 h-4 mr-3 text-green-500" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction('message', member)} className="text-discord-text hover:text-white hover:bg-white/5 p-3">
                  <MessageSquare className="w-4 h-4 mr-3 text-blue-500" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction('roles', member)} className="text-discord-text hover:text-white hover:bg-white/5 p-3">
                  <Settings className="w-4 h-4 mr-3 text-purple-500" />
                  Manage Roles
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-discord-border/30" />
                <DropdownMenuItem onClick={() => onAction('moderate', member)} className="text-discord-text hover:text-red-400 hover:bg-red-500/10 p-3">
                  <Ban className="w-4 h-4 mr-3 text-red-500" />
                  Moderate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


export function MembersContent({ serverId }: MembersContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("joined");
  const [page, setPage] = useState(0);
  const [afterCursors, setAfterCursors] = useState<string[]>([""]);
  const [members, setMembers] = useState<any[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const cache = useRef<{ [key: string]: any[] }>({});
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [modalType, setModalType] = useState<null | 'profile' | 'roles' | 'moderate' | 'message'>(null);
  const PAGE_SIZE = 10;

  // Add state for all roles and editing roles
  const [allRoles, setAllRoles] = useState<any[]>([]);
  const [editRoles, setEditRoles] = useState<string[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);

  // Fetch paginated, filtered members from API
  const fetchMembers = useCallback(async (pageIdx: number, after: string) => {
    if (!serverId) return;
    setLoading(true);
    const params = new URLSearchParams({
      serverId,
      limit: PAGE_SIZE.toString(),
    });
    if (after) params.append('after', after);
    if (searchQuery) params.append('search', searchQuery);
    // Discord API does not support role filter directly, so filter client-side
    const res = await fetch(`/api/discord/members?${params.toString()}`);
    const data = await res.json();
    let filtered = data.members;
    if (filterRole !== 'all') {
      filtered = filtered.filter((m: any) => (m.roles || []).includes(filterRole));
    }
    cache.current[`${pageIdx}:${after}`] = filtered;
    setMembers(filtered);
    setTotal(data.total);
    setLoading(false);
  }, [serverId, searchQuery, filterRole]);

  useEffect(() => {
    // Reset to first page on filter/search change
    setPage(0);
    setAfterCursors([""]);
    fetchMembers(0, "");
  }, [serverId, searchQuery, filterRole, fetchMembers]);

  useEffect(() => {
    const after = afterCursors[page] || "";
    if (cache.current[`${page}:${after}`]) {
      setMembers(cache.current[`${page}:${after}`]);
    } else {
      fetchMembers(page, after);
    }
  }, [page, afterCursors, fetchMembers]);

  // Pagination logic
  const handleNextPage = () => {
    if (members.length > 0) {
      const last = members[members.length - 1];
      const after = last.user?.id || last.user?.userId || last.user?.discordUserId || last.user?._id || "";
      setAfterCursors((prev) => {
        const next = [...prev];
        next[page + 1] = after;
        return next;
      });
      setPage((p) => p + 1);
    }
  };
  const handlePrevPage = () => {
    if (page > 0) setPage((p) => p - 1);
  };
  const pageCount = null; // Discord API does not provide total

  // Actions
  async function handleManageRoles(member: any, newRoles: string[]) {
    await fetch('http://localhost:4000/v1/users/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: member.user?.id || member.id, serverId, roles: newRoles }),
    });
  }
  async function handleSendMessage(member: any, message: string) {
    await fetch('http://localhost:4000/v1/users/interaction/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: member.user?.id || member.id, serverId, message }),
    });
  }
  async function handleModerate(member: any, action: 'kick' | 'mute' | 'ban', options: any) {
    // POST to moderation endpoint (implement as needed)
    await fetch('http://localhost:4000/v1/moderationAction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: member.user?.id || member.id, serverId, ...options, action }),
    });
  }

  // Modal state and handlers
  function openModal(type: typeof modalType, member: any) {
    setSelectedMember(member);
    setModalType(type);
  }
  function closeModal() {
    setSelectedMember(null);
    setModalType(null);
  }

  // Fetch all roles when Manage Roles modal opens
  useEffect(() => {
    if (modalType === 'roles' && serverId) {
      setRolesLoading(true);
      setRolesError(null);
      fetch(`/api/discord/roles?serverId=${serverId}`)
        .then(res => res.json())
        .then(data => {
          setAllRoles(data.roles || []);
          setRolesLoading(false);
        })
        .catch(err => {
          setRolesError('Failed to fetch roles');
          setRolesLoading(false);
        });
      setEditRoles(selectedMember?.roles || []);
    }
  }, [modalType, serverId, selectedMember]);

  // Remove a role
  const handleRemoveRole = (roleId: string) => {
    setEditRoles(prev => prev.filter(r => r !== roleId));
  };
  // Add a role
  const handleAddRole = (roleId: string) => {
    if (!editRoles.includes(roleId)) {
      setEditRoles(prev => [...prev, roleId]);
    }
  };
  // On Done, call handleManageRoles
  const handleDoneRoles = () => {
    handleManageRoles(selectedMember, editRoles);
    closeModal();
  };

  return (
    <div className="flex-1 overflow-auto bg-discord-dark">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-20 bg-discord-darker/95 backdrop-blur-xl border-b border-discord-border/50 p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >

            <h1 className="text-4xl font-black text-white font-minecraft tracking-wide mb-2">
              COMMUNITY MEMBERS
            </h1>
            <p className="text-discord-text text-lg">Manage server members, roles, and permissions</p>
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
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-discord-dark/50 border-discord-border text-white placeholder:text-discord-text focus:border-discord-blurple focus:ring-2 focus:ring-discord-blurple/20 rounded-xl lg:w-80"
              />
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="discord-button-outline h-12 px-6">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-discord-darker border-discord-border shadow-2xl">
                <DropdownMenuItem
                  onClick={() => setFilterRole("all")}
                  className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                >
                  All Roles
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterRole("Administrator")}
                  className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                >
                  <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                  Administrators
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterRole("Moderator")}
                  className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                >
                  <Shield className="w-4 h-4 mr-2 text-red-500" />
                  Moderators
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterRole("Member")}
                  className="text-discord-text hover:text-white hover:bg-white/5 p-3"
                >
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  Members
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Invite Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Members
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </header>

      <div className="p-8 space-y-10">
        {/* Enhanced Stats Grid */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge className="mb-4 bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 px-4 py-2 font-bold">
              <BarChart3 className="mr-2 h-4 w-4" />
              MEMBER STATISTICS
            </Badge>
            <h2 className="text-3xl font-black text-white mb-2">
              COMMUNITY <span className="text-discord-blurple glow-text">INSIGHTS</span>
            </h2>
            <p className="text-discord-text text-lg">Track member growth and engagement metrics</p>
          </motion.div>
        </section>

        {/* Enhanced Member List */}
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
                  <Button variant="outline" className="discord-button-outline">
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
          </motion.div>

          {members.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {members.map((member, index) => (
                <MemberCard
                  key={member.user?.id || index}
                  member={member}
                  index={index}
                  onAction={(type: string, memberObj: any) => openModal(type as "profile" | "roles" | "moderate" | "message" | null, memberObj)}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-discord-blurple to-purple-600 flex items-center justify-center shadow-2xl">
                <UserX className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No members found</h3>
              <p className="text-discord-text mb-6 max-w-md mx-auto">
                {searchQuery || filterRole !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No members to display"
                }
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
            </motion.div>
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
      <Dialog open={modalType === 'profile'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMember?.user?.username}'s Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={selectedMember?.user?.avatar} />
              <AvatarFallback>{selectedMember?.user?.username ? selectedMember.user.username.charAt(0).toUpperCase() : ""}</AvatarFallback>
            </Avatar>
            <div className="text-lg text-white font-bold">{selectedMember?.user?.username}</div>
            <div className="text-discord-text">{selectedMember?.user?.email}</div>
            <div className="flex gap-2 flex-wrap">
              {(selectedMember?.roles || []).map((role: string) => (
                <Badge key={role} className="bg-discord-blurple/20 text-discord-text border-discord-blurple/30 text-xs px-2 py-1">{role}</Badge>
              ))}
            </div>
            <div className="text-discord-text text-sm">Joined: {selectedMember?.joined_at ? new Date(selectedMember.joined_at).toLocaleDateString() : ''}</div>
          </div>
          <DialogFooter>
            <Button onClick={closeModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Manage Roles Modal */}
      <Dialog open={modalType === 'roles'} onOpenChange={closeModal}>
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
                {editRoles.map(roleId => {
                  const role = allRoles.find((r: any) => r.id === roleId) || { id: roleId, name: roleId, color: 0 };
                  // fallback to Discord blurple if no color
                  const color = role.color
                    ? (typeof role.color === "string" ? role.color : `#${role.color.toString(16).padStart(6, "0")}`)
                    : "#5865F2";
                  return (
                    <span
                      key={roleId}
                      className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold border"
                      style={{
                        background: color + '22', // transparent bg
                        borderColor: color,
                        color: color === '#5865F2' ? '#fff' : color,
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
                  );
                })}
                {/* Add role dropdown */}
                <Select
                  onValueChange={handleAddRole}
                  value=""
                >
                  <SelectTrigger className="w-auto px-2 py-1 h-7 border-dashed border-2 border-discord-blurple/30 bg-discord-blurple/10 text-discord-blurple flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    <span>Add Role</span>
                  </SelectTrigger>
                  <SelectContent>
                    {allRoles.filter((r: any) => !editRoles.includes(r.id)).map((role: any) => {
                      const color = role.color
                        ? (typeof role.color === "string" ? role.color : `#${role.color.toString(16).padStart(6, "0")}`)
                        : "#5865F2";
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
                      );
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
      <Dialog open={modalType === 'moderate'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Moderate {selectedMember?.user?.username}</DialogTitle>
          </DialogHeader>
          {/* Moderation Panel with dynamic fields */}
          <ModerationPanel member={selectedMember} onModerate={handleModerate} onClose={closeModal} />
          <DialogFooter>
            <Button onClick={closeModal} variant="outline">Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Send Message Modal */}
      <Dialog open={modalType === 'message'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {selectedMember?.user?.username}</DialogTitle>
          </DialogHeader>
          <Textarea placeholder="Type your message..." onBlur={e => handleSendMessage(selectedMember, e.target.value)} />
          <DialogFooter>
            <Button onClick={closeModal}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ModerationPanel component
function ModerationPanel({ member, onModerate, onClose }: { member: any, onModerate: Function, onClose: Function }) {
  const [action, setAction] = useState<'warn' | 'kick' | 'mute' | 'ban'>('warn');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');
  const [deleteMsg, setDeleteMsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle submit
  const handleSubmit = async () => {
    setError(null);
    if (!reason.trim()) {
      setError('Reason is required.');
      return;
    }
    setLoading(true);
    try {
      const options: any = { reason };
      if (action === 'mute' || action === 'ban') {
        if (duration) options.duration = parseDuration(duration);
      }
      if (action === 'ban') {
        options.deleteMessageHistory = deleteMsg;
      }
      await onModerate(member, action, options);
      onClose();
    } catch (e) {
      setError('Failed to perform moderation action.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse duration string (e.g., '10m', '1h') to seconds
  function parseDuration(str: string): number | undefined {
    if (!str) return undefined;
    const match = str.match(/^(\d+)([smhd])$/);
    if (!match) return undefined;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return undefined;
    }
  }

  return (
    <div className="flex flex-col gap-6 mt-2 mb-2">
      <Tabs value={action} onValueChange={v => setAction(v as any)} className="w-full">
        <TabsList className="flex w-full justify-between mb-4">
          <TabsTrigger value="warn">Warn</TabsTrigger>
          <TabsTrigger value="kick">Kick</TabsTrigger>
          <TabsTrigger value="mute">Mute</TabsTrigger>
          <TabsTrigger value="ban">Ban</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="reason">Reason<span className="text-red-500 ml-1">*</span></Label>
          <Input
            id="reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Enter reason for moderation..."
            className="mt-1"
            required
          />
        </div>
        {(action === 'mute' || action === 'ban') && (
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="e.g. 10m, 1h, 1d (leave blank for indefinite)"
              className="mt-1"
            />
          </div>
        )}
        {action === 'ban' && (
          <div className="flex items-center gap-2">
            <Checkbox id="deleteMsg" checked={deleteMsg} onCheckedChange={v => setDeleteMsg(!!v)} />
            <Label htmlFor="deleteMsg">Delete message history</Label>
          </div>
        )}
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        <Button onClick={handleSubmit} disabled={loading} className="mt-2 w-full">
          {loading ? 'Processing...' : 'Submit'}
        </Button>
      </div>
    </div>
  );
}
