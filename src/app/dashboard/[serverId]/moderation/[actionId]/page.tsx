"use client"

import { useMutation, useQuery } from 'convex/react';
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";

import { api } from "../../../../../../convex/_generated/api";

interface UserProfile {
    id: string;
    username: string;
    avatar?: string;
    discriminator?: string;
    global_name?: string;
    display_name?: string;
}

export default function ModerationActionPage() {
    const params = useParams();
    const serverId = params?.serverId as string;
    const actionId = params?.actionId as string;
    const router = useRouter();

    const actions = useQuery(api.discord.getModerationActions, {
        serverId: serverId
    });

    const action = actions?.find((a: any) => a._id === actionId);
    const updateReason = useMutation(api.discord.updateModerationActionReason);

    const [editReason, setEditReason] = useState('');
    const [editDuration, setEditDuration] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [profileCache, setProfileCache] = useState<Record<UserProfile["id"], UserProfile>>({});
    const [loadingProfiles, setLoadingProfiles] = useState<Set<string>>(new Set());
    const fetchingProfiles = useRef<Set<UserProfile["id"]>>(new Set());
    const abortControllerRef = useRef<AbortController | null>(null);

    // Add back button
    const handleBack = useCallback(() => {
        router.push(`/dashboard/${serverId}?tab=moderation`);
    }, [router, serverId]);

    // Optimized profile fetching with proper error handling
    const fetchProfile = useCallback(async (userId: string) => {
        if (!userId || profileCache[userId] || fetchingProfiles.current.has(userId)) return;

        fetchingProfiles.current.add(userId);
        setLoadingProfiles(prev => new Set([...prev, userId]));

        try {
            const res = await fetch(`/api/discord/user?userId=${userId}`, {
                signal: abortControllerRef.current?.signal
            });

            if (res.ok) {
                const data = await res.json();
                setProfileCache(prev => ({ ...prev, [userId]: data }));
            } else {
                console.warn(`Failed to fetch profile for ${userId}: ${res.status}`);
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error(`Error fetching profile for ${userId}:`, error);
            }
        } finally {
            fetchingProfiles.current.delete(userId);
            setLoadingProfiles(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    }, [profileCache]);

    // Batch fetch profiles when action loads
    useEffect(() => {
        if (!action) return;

        // Cancel previous requests
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        // Fetch required profiles
        const userIds = [action.userId, action.userId, action.moderator].filter(Boolean);
        userIds.forEach(fetchProfile);

        // Set form values
        setEditReason(action.reason || '');

        // Convert timestamp to duration string for editing
        if (action.duration && typeof action.duration === 'number') {
          const now = Date.now();
          const timeLeft = action.duration - now;
          if (timeLeft > 0) {
            // Convert milliseconds to duration string
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            let durationStr = '';
            if (days > 0) durationStr += `${days}d`;
            if (hours > 0) durationStr += `${hours}h`;
            if (minutes > 0) durationStr += `${minutes}m`;
            if (seconds > 0) durationStr += `${seconds}s`;

            setEditDuration(durationStr);
          } else {
            setEditDuration('');
          }
        } else {
          setEditDuration('');
        }

        // Cleanup on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [action, fetchProfile]);

    const handleSave = useCallback(async () => {
        if (!action) return;

        setSaveLoading(true);
        setSaveError(null);

        try {
            const durationChanged = editDuration !== (action.duration || '');

            await updateReason({
                auditId: action.auditId,
                serverId: action.serverId,
                reason: editReason,
            });

            if (durationChanged) {
                // Convert duration to timestamp format
                const durationMs = parseDuration(editDuration);
                const endTime = Date.now() + durationMs;

                await fetch(`http://localhost:4000/v1/moderationAction`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: action.userId || action.userId,
                        serverId: action.serverId,
                        duration: endTime, // Send timestamp instead of ISO string
                        auditId: action.auditId,
                    }),
                });
            }

            router.back();
        } catch (err) {
            console.error('Save error:', err);
            setSaveError('Failed to save changes. Please try again.');
        } finally {
            setSaveLoading(false);
        }
    }, [action, editReason, editDuration, updateReason, router]);

    function parseDuration(input: string): number {
        if (!input.trim()) return 0;

        const regex = /(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;
        const match = regex.exec(input.trim());

        if (!match) return 0;

        const days = parseInt(match[1] || '0', 10);
        const hours = parseInt(match[2] || '0', 10);
        const minutes = parseInt(match[3] || '0', 10);
        const seconds = parseInt(match[4] || '0', 10);

        return (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
    }

    // Helper function to get user display info
    const getUserDisplayInfo = useCallback((userId: string) => {
        const profile = profileCache[userId];
        const isLoading = loadingProfiles.has(userId);

        return {
            displayName: profile?.global_name || profile?.username || userId,
            username: profile?.username || userId,
            avatar: profile?.avatar,
            id: profile?.id || userId,
            isLoading
        };
    }, [profileCache, loadingProfiles]);

    if (!action) {
        return (
            <div className="max-w-4xl mx-auto p-8 bg-discord-darkest border border-discord-border rounded-lg mt-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-discord-text">Loading action details...</div>
                </div>
            </div>
        );
    }

    // Get user and moderator info
    const targetUserId = action.userId
    const moderatorId = action.moderator;

    const userInfo = getUserDisplayInfo(targetUserId);
    const moderatorInfo = getUserDisplayInfo(moderatorId);

    return (
        <div className="max-w-4xl mx-auto p-8 bg-discord-darkest border border-discord-border rounded-lg mt-8">
            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    onClick={handleBack}
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
                            {action.auditId || 'N/A'}
                        </span>
                    </div>

                    {/* State */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-discord-text uppercase tracking-wide">State</span>
                        <span className={`font-semibold ${action.state === 'Done' ? 'text-green-400' :
                            action.state === 'Active' ? 'text-yellow-400' :
                                'text-gray-400'
                            }`}>
                            {action.state || 'Unknown'}
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
                                    <AvatarFallback>
                                        {userInfo.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-white font-medium">
                                    {userInfo.isLoading ? 'Loading...' : userInfo.displayName}
                                </span>
                                <span className="text-discord-text text-xs font-mono">
                                    {targetUserId}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-discord-text uppercase tracking-wide">Duration</span>
                        <input
                            className="w-full px-3 py-2 rounded bg-discord-darker border border-discord-border text-white focus:outline-none focus:ring-2 focus:ring-discord-blurple focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            type="text"
                            value={editDuration}
                            disabled={action.state === 'Done'}
                            onChange={e => setEditDuration(e.target.value)}
                            placeholder="e.g. 1d, 2h, 30m, or leave empty for permanent"
                        />
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
                                    <AvatarFallback>
                                        {moderatorInfo.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-white font-medium">
                                    {moderatorInfo.isLoading ? 'Loading...' : moderatorInfo.displayName}
                                </span>
                                <span className="text-discord-text text-xs font-mono">
                                    {moderatorId}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="flex flex-col gap-2 col-span-2">
                        <span className="text-xs text-discord-text uppercase tracking-wide">Reason</span>
                        <textarea
                            className="w-full px-3 py-2 rounded bg-discord-darker border border-discord-border text-white focus:outline-none focus:ring-2 focus:ring-discord-blurple focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                            rows={3}
                            value={editReason}
                            onChange={e => setEditReason(e.target.value)}
                            disabled={action.state === 'Done'}
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
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className="px-6"
                >
                    Cancel
                </Button>

                {action.state !== 'Done' && (
                    <Button
                        disabled={saveLoading || (!editReason.trim())}
                        onClick={handleSave}
                        className="px-6 bg-discord-blurple hover:bg-discord-blurple/80"
                    >
                        {saveLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                Saving...
                            </div>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
