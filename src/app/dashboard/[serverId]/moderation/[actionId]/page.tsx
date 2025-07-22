"use client"

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from 'convex/react';
import { api } from "../../../../../../convex/_generated/api";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function ModerationActionPage() {
    const { serverId, actionId } = useParams();
    const router = useRouter();
    const actions = useQuery(api.discord.getModerationActions, {
        serverId: `${serverId}`
    });
    const action = actions?.find((a: any) => a._id === actionId);
    const updateReason = useMutation(api.discord.updateModerationActionReason);
    const [editReason, setEditReason] = useState('');
    const [editDuration, setEditDuration] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [profileCache, setProfileCache] = useState<Record<string, any>>({});
    const fetchingProfiles = useRef<Set<string>>(new Set());

    // Fetch and cache Discord user profile
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

    useEffect(() => {
        if (!action) return;
        if (action.user) fetchProfile(action.user);
        if (action.moderator) fetchProfile(action.moderator);
        setEditReason(action.reason);
        setEditDuration(action.duration || '');
        // eslint-disable-next-line
    }, [action]);

    const handleSave = async () => {
        if (!action) return;
        setSaveLoading(true);
        setSaveError(null);
        try {
            let durationChanged = editDuration !== (action.duration || '');
            await updateReason({
                auditId: action.auditId,
                serverId: action.serverId,
                reason: editReason,
            });
            if (durationChanged) {
                const durationMs = parseDuration(editDuration);
                await fetch(`http://localhost:4000/v1/moderationAction`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: action.user,
                        serverId: action.serverId,
                        duration: durationMs,
                        auditId: action.auditId,
                    }),
                });
            }
            router.back();
        } catch (err) {
            setSaveError('Failed to save.');
        } finally {
            setSaveLoading(false);
        }
    };

    function parseDuration(input: string): number {
        const regex = /(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;
        const match = regex.exec(input);
        if (!match) return 0;
        const days = parseInt(match[1] || '0', 10);
        const hours = parseInt(match[2] || '0', 10);
        const minutes = parseInt(match[3] || '0', 10);
        const seconds = parseInt(match[4] || '0', 10);
        return (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
    }

    if (!action) return <div className="p-8 text-discord-text">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-discord-darkest border border-discord-border rounded-lg mt-8">
            <div className="text-2xl font-bold mb-4 text-white">Actions</div>
            <div className="mb-6">
                <div className="text-lg font-semibold text-white mb-2">General information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-discord-text">ID</span>
                        <span className="font-mono text-white text-sm">{action.auditId || '-'}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-discord-text">State</span>
                        <span className="text-green-400 font-semibold">{action.state}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-discord-text">Type</span>
                        <span className="text-white font-semibold">{action.action}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-discord-text">User</span>
                        <div className="flex items-center gap-2">
                            {profileCache[action.user] ? (
                                <img
                                    src={`https://cdn.discordapp.com/avatars/${profileCache[action.user].id}/${profileCache[action.user].avatar}.png?size=32`}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-discord-darkest flex items-center justify-center text-xs text-discord-text">?</div>
                            )}
                            <span className="text-white">{profileCache[action.user]?.username || action.user}</span>
                            <span className="text-discord-text text-xs">{action.user}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-discord-text">Duration</span>
                        <input
                            className="w-full px-3 py-2 rounded bg-discord-darker border border-discord-border text-white focus:outline-none focus:ring-2 focus:ring-discord-primary"
                            type="text"
                            value={editDuration}
                            disabled={action.state === 'Done'}
                            onChange={e => setEditDuration(e.target.value)}
                            placeholder="e.g. 1d, 2h, 30m"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-discord-text">Created</span>
                        <span className="text-white">{action.time || '-'}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-discord-text">Author</span>
                        <div className="flex items-center gap-2">
                            {profileCache[action.moderator] ? (
                                <img
                                    src={`https://cdn.discordapp.com/avatars/${profileCache[action.moderator].id}/${profileCache[action.moderator].avatar}.png?size=32`}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-discord-darkest flex items-center justify-center text-xs text-discord-text">?</div>
                            )}
                            <span className="text-white">{profileCache[action.moderator]?.username || action.moderator}</span>
                            <span className="text-discord-text text-xs">{action.moderator}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 col-span-2">
                        <span className="text-xs text-discord-text">Reason</span>
                        <input
                            className="w-full px-3 py-2 rounded bg-discord-darker border border-discord-border text-white focus:outline-none focus:ring-2 focus:ring-discord-primary"
                            type="text"
                            value={editReason}
                            onChange={e => setEditReason(e.target.value)}
                            disabled={action.state === 'Done'}
                        />
                    </div>
                </div>
                {saveError && <div className="text-red-500 text-sm mt-4">{saveError}</div>}
            </div>
            <div className="flex gap-2 mt-4">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                {action.state !== 'Done' && (
                    <Button
                        disabled={saveLoading}
                        onClick={handleSave}
                    >
                        {saveLoading ? 'Saving...' : 'Save'}
                    </Button>
                )}
            </div>
        </div>
    );
}
