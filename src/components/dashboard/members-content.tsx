"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { 
  Users, 
  Search, 
  UserPlus, 
  Crown, 
  Shield, 
  Filter,
  MoreVertical,
  TrendingUp,
  Activity,
  UserCheck,
  UserX,
  Calendar,
  Globe,
  MessageSquare,
  Settings,
  Ban,
  AlertTriangle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MembersContentProps {
    serverId?: string
}

// Enhanced Member Card Component
function MemberCard({ member, index }: { member: any; index: number }) {
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

  const getRoleIcon = (roles: string[]) => {
    if (roles.includes("Owner")) return <Crown className="h-4 w-4 text-yellow-500" />
    if (roles.includes("Admin")) return <Shield className="h-4 w-4 text-red-500" />
    return null
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
                    <AvatarImage src={member.avatar} alt={member.username} />
                    <AvatarFallback className="bg-gradient-to-r from-discord-blurple to-purple-600 text-white font-bold">
                      {member.username.charAt(0).toUpperCase()}
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
                    {member.username}
                  </h3>
                  {getRoleIcon(member.roles)}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  {member.roles.slice(0, 2).map((role: string) => (
                    <Badge
                      key={role}
                      variant="secondary"
                      className="bg-discord-blurple/20 text-discord-text border-discord-blurple/30 text-xs px-2 py-1"
                    >
                      {role}
                    </Badge>
                  ))}
                  {member.roles.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-1 border-discord-border/50">
                      +{member.roles.length - 2}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-discord-text">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
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
                <DropdownMenuItem className="text-discord-text hover:text-white hover:bg-white/5 p-3">
                  <UserCheck className="w-4 h-4 mr-3 text-green-500" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-discord-text hover:text-white hover:bg-white/5 p-3">
                  <MessageSquare className="w-4 h-4 mr-3 text-blue-500" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuItem className="text-discord-text hover:text-white hover:bg-white/5 p-3">
                  <Settings className="w-4 h-4 mr-3 text-purple-500" />
                  Manage Roles
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-discord-border/30" />
                <DropdownMenuItem className="text-discord-text hover:text-red-400 hover:bg-red-500/10 p-3">
                  <AlertTriangle className="w-4 h-4 mr-3 text-yellow-500" />
                  Warn Member
                </DropdownMenuItem>
                <DropdownMenuItem className="text-discord-text hover:text-red-400 hover:bg-red-500/10 p-3">
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

// Enhanced Stats Card Component
function StatsCard({ title, value, icon: Icon, color, change, index }: {
  title: string;
  value: string;
  icon: any;
  color: string;
  change: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <Card className="discord-card border-2 border-discord-border/50 hover:border-discord-blurple/50 transition-all duration-500 relative overflow-hidden">
        {/* Enhanced background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br from-${color}/5 via-transparent to-${color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <CardContent className="p-6 text-center relative z-10">
          <motion.div
            className={`p-4 rounded-2xl bg-gradient-to-r from-${color}/20 to-${color}/10 w-fit mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-${color}/30`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Icon className={`h-8 w-8 text-${color}`} />
          </motion.div>
          
          <div className={`text-3xl font-black text-${color} mb-2 glow-text`}>
            {value}
          </div>
          
          <div className="text-discord-text text-sm mb-3 font-medium">{title}</div>
          
          <Badge className={`bg-${color}/20 text-${color} border-${color}/30 text-xs px-3 py-1`}>
            <TrendingUp className="mr-1 h-3 w-3" />
            {change}
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function MembersContent({ serverId }: MembersContentProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterRole, setFilterRole] = useState("all")
    const [sortBy, setSortBy] = useState("joined")

    // Sample members data - in real app this would come from Convex
    const members = [
        { 
          id: "1",
          username: "AdminUser", 
          roles: ["Administrator"], 
          status: "online", 
          joinedAt: "2023-01-15T10:00:00Z",
          avatar: null,
          messageCount: 1250,
        },
        { 
          id: "2",
          username: "ModeratorX", 
          roles: ["Moderator"], 
          status: "online", 
          joinedAt: "2023-03-20T14:30:00Z",
          avatar: null,
          messageCount: 890,
        },
        { 
          id: "3",
          username: "Helper99", 
          roles: ["Helper"], 
          status: "idle", 
          joinedAt: "2023-06-10T09:15:00Z",
          avatar: null,
          messageCount: 456,
        },
        { 
          id: "4",
          username: "ActiveMember", 
          roles: ["Member"], 
          status: "online", 
          joinedAt: "2023-08-05T16:45:00Z",
          avatar: null,
          messageCount: 234,
        },
        { 
          id: "5",
          username: "NewUser789", 
          roles: ["Member"], 
          status: "offline", 
          joinedAt: "2023-12-01T11:20:00Z",
          avatar: null,
          messageCount: 12,
        },
    ]

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.username.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = filterRole === "all" || member.roles.includes(filterRole)
        return matchesSearch && matchesRole
    })

    const stats = [
        { title: "Total Members", value: "1,247", color: "discord-blurple", change: "+12%", icon: Users },
        { title: "Online Now", value: "342", color: "discord-green", change: "+8%", icon: Activity },
        { title: "New This Month", value: "89", color: "discord-purple", change: "+15%", icon: UserPlus },
        { title: "Active Members", value: "756", color: "discord-orange", change: "+5%", icon: TrendingUp },
    ]

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
                        <Badge className="mb-4 bg-discord-green/20 text-discord-green border-discord-green/30 px-4 py-2 font-bold">
                            <Users className="mr-2 h-4 w-4" />
                            MEMBER MANAGEMENT
                        </Badge>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <StatsCard key={index} {...stat} index={index} />
                        ))}
                    </div>
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
                                    {filteredMembers.length} of {members.length} members
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

                    {filteredMembers.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredMembers.map((member, index) => (
                                <MemberCard key={member.id} member={member} index={index} />
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
                </section>
            </div>
        </div>
    )
}