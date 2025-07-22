"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Shield, AlertTriangle, Ban, UserX, Eye } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useRouter } from "next/navigation";

interface ModerationContentProps {
  serverId?: string
}

export function ModerationContent({ serverId }: ModerationContentProps) {
  const actions = useQuery(api.discord.getModerationActions, serverId ? { serverId } : 'skip');
  const router = useRouter();
  // Filtering and searching
  const [actionFilter, setActionFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [search, setSearch] = useState('');
  // User profile cache
  const [profileCache, setProfileCache] = useState<Record<string, any>>({});
  const fetchingProfiles = useRef<Set<string>>(new Set());

  // Fetch and cache a Discord user profile
  const fetchProfile = async (userId: string) => {
    if (!userId || profileCache[userId] || fetchingProfiles.current.has(userId)) return;
    fetchingProfiles.current.add(userId);
    try {
      const res = await fetch(`/api/discord/user?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfileCache(prev => ({ ...prev, [userId]: data }));
      }
    } finally {
      fetchingProfiles.current.delete(userId);
    }
  };

  // Preload visible user/mod profiles
  useEffect(() => {
    if (!actions) return;
    const ids = new Set<string>();
    actions.forEach((a: any) => {
      if (a.user) ids.add(a.user);
      if (a.moderator) ids.add(a.moderator);
    });
    ids.forEach(id => fetchProfile(id));
    // eslint-disable-next-line
  }, [actions]);

  // Filtering and searching logic
  const filteredActions = (actions || []).filter((a: any) => {
    if (actionFilter !== 'All' && a.action !== actionFilter) return false;
    if (stateFilter !== 'All' && a.state !== stateFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        (a.user && a.user.toLowerCase().includes(s)) ||
        (a.moderator && a.moderator.toLowerCase().includes(s)) ||
        (a.reason && a.reason.toLowerCase().includes(s))
      );
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-auto">
      <header className="sticky top-0 z-20 bg-discord-darker/80 backdrop-blur-sm border-b border-discord-border/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge className="mb-2 bg-discord-red/20 text-discord-red border-discord-red/30">
              <Shield className="mr-2 h-4 w-4" />
              MODERATION CENTER
            </Badge>
            <h1 className="text-2xl font-bold text-white font-minecraft tracking-wide">SECURITY CONTROL</h1>
            <p className="text-discord-text">Monitor and manage server moderation</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="discord-button-outline">
              <Eye className="w-4 h-4 mr-2" />
              View Logs
            </Button>
            <Button className="discord-button-primary">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Quick Action
            </Button>
          </div>
        </div>
      </header>
      <div className="p-6 space-y-6">
        {/* Filter/Search Controls */}
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <select
            className="px-2 py-1 rounded bg-discord-darkest text-white border border-discord-border"
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
          >
            <option value="All">All Actions</option>
            <option value="Ban">Ban</option>
            <option value="Kick">Kick</option>
            <option value="Warn">Warn</option>
            <option value="Mute">Mute</option>
            <option value="Timeout">Timeout</option>
            <option value="Unban">Unban</option>
            <option value="Unmute">Unmute</option>
          </select>
          <select
            className="px-2 py-1 rounded bg-discord-darkest text-white border border-discord-border"
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
          >
            <option value="All">All States</option>
            <option value="closed">Closed</option>
            <option value="Done">Done</option>
            <option value="open">Open</option>
          </select>
          <input
            className="px-2 py-1 rounded bg-discord-darkest text-white border border-discord-border flex-1 min-w-[200px]"
            placeholder="Search by user, moderator, or reason..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Card className="discord-card">
          <CardHeader>
            <CardTitle className="text-white">Moderation Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row gap-4 overflow-x-auto py-2">
              {!actions ? (
                <div className="text-discord-text">Loading...</div>
              ) : filteredActions.length === 0 ? (
                <div className="text-discord-text">No moderation actions found.</div>
              ) : (
                filteredActions.map((action: any, index: number) => (
                  <motion.div
                    key={action._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 min-w-[350px] cursor-pointer hover:bg-white/10"
                    onClick={() => router.push(`/dashboard/${serverId}/moderation/${action._id}`)}
                  >
                    <div className="flex items-center gap-3">
                      {/* User Avatar */}
                      {profileCache[action.user] ? (
                        <img
                          src={`https://cdn.discordapp.com/avatars/${profileCache[action.user].id}/${profileCache[action.user].avatar}.png?size=32`}
                          alt="avatar"
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-discord-darkest flex items-center justify-center text-xs text-discord-text">?</div>
                      )}
                      <div className="flex flex-col gap-1">
                        <div className="font-medium text-white">
                          {action.action} - {profileCache[action.user]?.username || action.user}
                        </div>
                        <div className="flex flex-row flex-wrap gap-x-6 gap-y-1 text-xs text-discord-text">
                          <span><b>Reason:</b> {action.reason}</span>
                          <span><b>Moderator:</b> {profileCache[action.moderator]?.username || action.moderator}</span>
                          <span><b>Duration:</b> {action.duration || 'Permanent'}</span>
                          <span><b>State:</b> {action.state || 'Unknown'}</span>
                          <span><b>Time:</b> {action.time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


