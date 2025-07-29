"use client"

import { useQuery } from "convex/react";
import { motion, useInView } from "framer-motion"
import {
  Activity,
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Filter,
  MessageSquare,
  Search,
  Shield,
  Timer,
  TrendingUp,
  Users,
  UserX,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { api } from "@/../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface ModerationContentProps {
  serverId?: string
}

interface UserProfile {
  id: string;
  username: string;
  avatar?: string;
}

// Custom hook for optimized profile fetching
function useProfileCache() {
  const [profileCache, setProfileCache] = useState<Record<string, UserProfile>>({});
  const [loadingProfiles, setLoadingProfiles] = useState<Set<string>>(new Set());
  const fetchingRef = useRef<Set<string>>(new Set());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Batch fetch profiles to reduce API calls
  const fetchProfiles = useCallback(async (userIds: string[]) => {
    // Filter out already cached or currently fetching profiles
    const uniqueIds = [...new Set(userIds)].filter(
      id => id && !profileCache[id] && !fetchingRef.current.has(id)
    );

    if (uniqueIds.length === 0) return;

    // Mark as fetching
    uniqueIds.forEach(id => fetchingRef.current.add(id));
    setLoadingProfiles(prev => new Set([...prev, ...uniqueIds]));

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      // Batch request - modify your API to accept multiple user IDs
      const promises = uniqueIds.map(async (userId) => {
        try {
          const res = await fetch(`/api/discord/user?userId=${userId}`, {
            signal: abortControllerRef.current!.signal
          });
          if (res.ok) {
            const data = await res.json();
            return { userId, data };
          }
          return { userId, data: null };
        } catch (error: any) {
          if (error?.name !== 'AbortError') {
            console.warn(`Failed to fetch profile for ${userId}:`, error);
          }
          return { userId, data: null };
        }
      });

      const results = await Promise.allSettled(promises);

      const newProfiles: Record<string, UserProfile> = {};

      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.data) {
          newProfiles[result.value.userId] = result.value.data;
        }
      });

      // Update cache with successful fetches
      if (Object.keys(newProfiles).length > 0) {
        setProfileCache(prev => ({ ...prev, ...newProfiles }));
      }

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Batch profile fetch failed:', error);
      }
    } finally {
      // Clean up loading states
      uniqueIds.forEach(id => {
        fetchingRef.current.delete(id);
      });
      setLoadingProfiles(prev => {
        const newSet = new Set(prev);
        uniqueIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    }
  }, [profileCache]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { profileCache, loadingProfiles, fetchProfiles };
}

// Enhanced Action Card Component
function ActionCard({ action, serverId, profileCache, loadingProfiles }: {
  action: any;
  serverId: string;
  profileCache: Record<string, UserProfile>;
  loadingProfiles: Set<string>;
}) {
  const router = useRouter();

  const getActionIcon = useCallback((actionType: string) => {
    switch (actionType) {
      case "Ban": return <Ban className="w-5 h-5 text-discord-red" />
      case "Kick": return <UserX className="w-5 h-5 text-discord-orange" />
      case "Warn": return <AlertTriangle className="w-5 h-5 text-discord-yellow" />
      case "Timeout": return <Timer className="w-5 h-5 text-discord-purple" />
      default: return <Shield className="w-5 h-5 text-discord-blurple" />
    }
  }, []);

  const getActionColor = useCallback((actionType: string) => {
    switch (actionType) {
      case "Ban": return "discord-red"
      case "Kick": return "discord-orange"
      case "Warn": return "discord-yellow"
      case "Timeout": return "discord-purple"
      default: return "discord-blurple"
    }
  }, []);

  const actionColor = getActionColor(action.action);

  // Get user and moderator profile
  const userProfile = profileCache[action.user];
  const modProfile = profileCache[action.moderator];
  const isUserLoading = loadingProfiles.has(action.user);
  const isModLoading = loadingProfiles.has(action.moderator);

  const handleClick = useCallback(() => {
    router.push(`/dashboard/${serverId}/moderation/${action._id}`);
  }, [router, serverId, action._id]);

  return (
    <Card
      className={`flex flex-row items-center gap-6 border border-discord-border/50 hover:border-discord-blurple/50 transition-all duration-300 overflow-hidden relative cursor-pointer bg-discord-darker/80 hover:bg-discord-darker/95`}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`View moderation action ${action.action}`}
    >
      <div className={`p-3 rounded-xl bg-gradient-to-r from-${actionColor}/20 to-${actionColor}/10 border border-${actionColor}/30 shadow-lg flex-shrink-0 ml-4`}>
        {getActionIcon(action.action)}
      </div>

      {/* User avatar/username */}
      <div className="flex flex-col items-center mr-4">
        <Avatar className="h-10 w-10 mb-1">
          {isUserLoading ? (
            <AvatarFallback>
              <div className="animate-spin w-4 h-4 border-2 border-discord-blurple border-t-transparent rounded-full" />
            </AvatarFallback>
          ) : userProfile?.avatar ? (
            <AvatarImage src={`https://cdn.discordapp.com/avatars/${userProfile.id}/${userProfile.avatar}.png?size=64`} alt={userProfile.username} />
          ) : (
            <AvatarFallback>{userProfile?.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
          )}
        </Avatar>
        <span className="text-xs text-white font-semibold truncate max-w-[80px]">
          {isUserLoading ? 'Loading...' : userProfile?.username || action.user}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-white group-hover:text-discord-blurple transition-colors duration-300 truncate">
            {action.action} - {userProfile?.username || action.user}
          </h3>
          <Badge className={`bg-${actionColor}/20 text-${actionColor} border-${actionColor}/30 text-xs px-2 py-1`}>
            {action.action}
          </Badge>
        </div>
        <p className="text-discord-text text-sm mb-2 truncate">
          <span className="font-medium">Reason:</span> {action.reason}
        </p>
        <div className="flex items-center gap-4 text-xs text-discord-text">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            by {isModLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : modProfile ? (
              <span className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  {modProfile.avatar ? (
                    <AvatarImage src={`https://cdn.discordapp.com/avatars/${modProfile.id}/${modProfile.avatar}.png?size=32`} alt={modProfile.username} />
                  ) : (
                    <AvatarFallback>{modProfile?.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                  )}
                </Avatar>
                <span className="text-white font-medium">{modProfile.username}</span>
              </span>
            ) : (
              action.moderator
            )}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {action.time}
          </span>
          {action.duration && (
            <span className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              {action.duration}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

// Enhanced Stats Card Component
function ModerationStatsCard({ title, value, icon: Icon, color, change, index }: {
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
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Card className="discord-card border-2 border-discord-border/50 hover:border-discord-blurple/50 transition-all duration-500 relative overflow-hidden">
        {/* Enhanced background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br from-${color}/5 via-transparent to-${color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <CardContent className="p-8 text-center relative z-10">
          <motion.div
            className={`p-4 rounded-2xl bg-gradient-to-r from-${color}/20 to-${color}/10 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-${color}/30`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Icon className={`h-8 w-8 text-${color}`} />
          </motion.div>

          <div className={`text-4xl font-black text-${color} mb-3 glow-text`}>
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

export function ModerationContent({ serverId }: ModerationContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");

  const actions = useQuery(
    api.discord.getModerationActions,
    serverId ? { serverId } : "skip"
  );

  const bansMonth = actions?.filter(e => e.action === "ban").length ?? 0;
  const kicksMonth = actions?.filter(e => e.action === "kick").length ?? 0;
  const warnsMonth = actions?.filter(e => e.action === "warn").length ?? 0;

  const { profileCache, loadingProfiles, fetchProfiles } = useProfileCache();

  // Extract unique user IDs from actions and batch fetch profiles
  const uniqueUserIds = useMemo(() => {
    if (!actions) return [];

    const userIds = new Set<string>();
    actions.forEach((action: any) => {
      if (action.user) userIds.add(action.user);
      if (action.moderator) userIds.add(action.moderator);
    });

    return Array.from(userIds);
  }, [actions]);

  // Fetch profiles when actions change
  useEffect(() => {
    if (uniqueUserIds.length > 0) {
      fetchProfiles(uniqueUserIds);
    }
  }, [uniqueUserIds, fetchProfiles]);

  // Memoize filtered actions to prevent unnecessary recalculations
  const filteredActions = useMemo(() => {
    if (!actions) return [];

    return actions.filter(action => {
      const userProfile = profileCache[action.userId];
      const matchesSearch =
        (userProfile?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (action.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (action.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesFilter =
        filterType === "all" ||
        (action.action?.toLowerCase() === filterType.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [actions, profileCache, searchQuery, filterType]);

  // Memoize stats to prevent recalculation
  const stats = useMemo(() => [
    { title: "Active Warnings", value: `${warnsMonth}`, icon: AlertTriangle, color: "discord-yellow", change: "+1 today" },
    { title: "Bans This Month", value: `${bansMonth}`, icon: Ban, color: "discord-red", change: "-2 vs last month" },
    { title: "Kicks This Month", value: `${kicksMonth}`, icon: UserX, color: "discord-orange", change: "+3 vs last month" },
    { title: "Auto-Mod Actions", value: "45", icon: Shield, color: "discord-green", change: "+15 today" },
  ], [warnsMonth, bansMonth, kicksMonth]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setFilterType("all");
  }, []);

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
            <Badge className="mb-4 bg-discord-red/20 text-discord-red border-discord-red/30 px-4 py-2 font-bold">
              <Shield className="mr-2 h-4 w-4" />
              MODERATION CENTER
            </Badge>
            <h1 className="text-4xl font-black text-white font-minecraft tracking-wide mb-2">
              SECURITY CONTROL
            </h1>
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
                <Button variant="outline" className="discord-button-outline h-12 px-6">
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
              <Button variant="outline" className="discord-button-outline h-12 px-6">
                <Eye className="w-4 h-4 mr-2" />
                View Logs
              </Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
        {/* Enhanced Stats Grid */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge className="mb-4 bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 px-4 py-2 font-bold">
              <Activity className="mr-2 h-4 w-4" />
              MODERATION METRICS
            </Badge>
            <h2 className="text-3xl font-black text-white mb-2">
              SECURITY <span className="text-discord-red glow-text">OVERVIEW</span>
            </h2>
            <p className="text-discord-text text-lg">Track moderation activity and server safety metrics</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ModerationStatsCard key={index} {...stat} index={index} />
            ))}
          </div>
        </section>

        {/* Enhanced Recent Actions */}
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
                  <FileText className="mr-2 h-4 w-4" />
                  ACTIVITY LOG
                </Badge>
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
                  <Button variant="outline" className="discord-button-outline">
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
            <div className="space-y-4">
              {filteredActions.map((action) => (
                <ActionCard
                  key={action._id}
                  action={action}
                  serverId={serverId!}
                  profileCache={profileCache}
                  loadingProfiles={loadingProfiles}
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
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-discord-green to-teal-600 flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No moderation actions found</h3>
              <p className="text-discord-text mb-6 max-w-md mx-auto">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Your server is running smoothly with no recent moderation actions"
                }
              </p>
              {(searchQuery || filterType !== "all") && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="discord-button-outline"
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          )}
        </section>

        {/* Enhanced Quick Actions Grid */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Badge className="mb-4 bg-discord-purple/20 text-discord-purple border-discord-purple/30 px-4 py-2 font-bold">
              <Zap className="mr-2 h-4 w-4" />
              QUICK TOOLS
            </Badge>
            <h2 className="text-3xl font-black text-white mb-2">
              MODERATION <span className="text-discord-purple glow-text">TOOLS</span>
            </h2>
            <p className="text-discord-text text-lg">Access powerful moderation features and automation</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: AlertTriangle,
                title: "Warning System",
                description: "Manage user warnings and infractions with automated escalation",
                color: "discord-yellow",
                action: "Manage Warnings",
              },
              {
                icon: Ban,
                title: "Ban Management",
                description: "Review and manage server bans with appeal system",
                color: "discord-red",
                action: "View Bans",
              },
              {
                icon: Shield,
                title: "Auto Moderation",
                description: "Configure automated moderation rules and filters",
                color: "discord-green",
                action: "Configure AutoMod",
              },
              {
                icon: FileText,
                title: "Audit Logs",
                description: "Comprehensive logging of all moderation activities",
                color: "discord-blurple",
                action: "View Audit Log",
              },
              {
                icon: Users,
                title: "Member Screening",
                description: "Set up member verification and screening processes",
                color: "discord-purple",
                action: "Setup Screening",
              },
              {
                icon: MessageSquare,
                title: "Message Filtering",
                description: "Advanced content filtering and spam protection",
                color: "discord-orange",
                action: "Configure Filters",
              },
            ].map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="discord-card h-full border-2 border-discord-border/50 hover:border-discord-blurple/50 transition-all duration-500 overflow-hidden relative">
                  {/* Enhanced background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${tool.color}/5 via-transparent to-${tool.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <CardContent className="p-8 text-center relative z-10 h-full flex flex-col">
                    <motion.div
                      className={`p-4 rounded-2xl bg-gradient-to-r from-${tool.color}/20 to-${tool.color}/10 w-fit mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-${tool.color}/30`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <tool.icon className={`h-8 w-8 text-${tool.color}`} />
                    </motion.div>

                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-discord-blurple transition-colors duration-300">
                      {tool.title}
                    </h3>

                    <p className="text-discord-text mb-6 flex-grow group-hover:text-white/90 transition-colors duration-300">
                      {tool.description}
                    </p>

                    <Button className="discord-button-outline w-full group-hover:bg-discord-blurple/10 transition-all duration-300">
                      {tool.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
