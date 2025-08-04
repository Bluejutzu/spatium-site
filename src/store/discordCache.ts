import { create } from 'zustand';

import { DiscordUser } from '@/types/discord';
import { DiscordMember } from '@/types/discord';
import { DiscordChannel, DiscordRole } from '@/types/discord';

interface ProfileCacheState {
	profileCache: Record<string, DiscordUser>;
	loadingProfiles: Set<string>;
	fetchProfiles: (userIds: string[]) => Promise<void>;
}

interface MembersCacheState {
	membersCache: Record<string, DiscordMember[]>; // key: `${serverId}:${pageIdx}:${after}:${searchQuery}:${filterRole}`
	membersTotal: Record<string, number>; // key: serverId
	loadingMembers: Set<string>; // key: `${serverId}:${pageIdx}:${after}:${searchQuery}:${filterRole}`
	fetchMembers: (params: {
		serverId: string;
		pageIdx: number;
		after: string;
		searchQuery: string;
		filterRole: string;
		pageSize: number;
	}) => Promise<void>;
}

interface RolesChannelsCacheState {
	rolesCache: Record<string, DiscordRole[]>; // key: `${serverId}:${userId}`
	loadingRoles: Set<string>;
	fetchRoles: (serverId: string, userId: string) => Promise<void>;
	channelsCache: Record<string, DiscordChannel[]>; // key: `${serverId}:${userId}`
	loadingChannels: Set<string>;
	fetchChannels: (serverId: string, userId: string) => Promise<void>;
}

interface GlobalCacheState {
	clearCache: () => void;
	populateCache: (serverId: string, userId: string) => Promise<void>;
}

export const useDiscordCache = create<ProfileCacheState & MembersCacheState & RolesChannelsCacheState & GlobalCacheState>((set, get) => ({
	profileCache: {},
	loadingProfiles: new Set(),
	fetchProfiles: async (userIds: string[]) => {
		const { profileCache, loadingProfiles } = get();
		const uniqueIds = [...new Set(userIds)].filter(
			id => id && !profileCache[id] && !loadingProfiles.has(id)
		);
		if (uniqueIds.length === 0) return;
		// Mark as loading
		const newLoading = new Set(loadingProfiles);
		uniqueIds.forEach(id => newLoading.add(id));
		set({ loadingProfiles: newLoading });
		try {
			// Batch fetch (could be optimized to a single API call if backend supports it)
			const results = await Promise.all(
				uniqueIds.map(async (userId) => {
					try {
						const res = await fetch(`/api/discord/user?userId=${userId}`);
						if (res.ok) {
							const data = await res.json();
							return { userId, data };
						}
						return { userId, data: null };
					} catch (error) {
						return { userId, data: null };
					}
				})
			);
			const newProfiles: Record<string, DiscordUser> = {};
			results.forEach((result) => {
				if (result.data) {
					newProfiles[result.userId] = result.data;
				}
			});
			set(state => ({
				profileCache: { ...state.profileCache, ...newProfiles },
				loadingProfiles: (() => {
					const updated = new Set(state.loadingProfiles);
					uniqueIds.forEach(id => updated.delete(id));
					return updated;
				})(),
			}));
		} catch (error) {
			set(state => ({
				loadingProfiles: (() => {
					const updated = new Set(state.loadingProfiles);
					uniqueIds.forEach(id => updated.delete(id));
					return updated;
				})(),
			}));
		}
	},
	membersCache: {},
	membersTotal: {},
	loadingMembers: new Set(),
	fetchMembers: async ({ serverId, pageIdx, after, searchQuery, filterRole, pageSize }) => {
		const key = `${serverId}:${pageIdx}:${after}:${searchQuery}:${filterRole}`;
		const { membersCache, loadingMembers } = get();
		if (membersCache[key] || loadingMembers.has(key)) return;
		const newLoading = new Set(loadingMembers);
		newLoading.add(key);
		set({ loadingMembers: newLoading });
		try {
			const params = new URLSearchParams({
				serverId,
				limit: pageSize.toString(),
			});
			if (after) params.append('after', after);
			if (searchQuery) params.append('search', searchQuery);
			const res = await fetch(`/api/discord/guild/members?${params.toString()}`);
			const data = await res.json();
			let filtered = data.members;
			if (filterRole !== 'all') {
				filtered = filtered.filter((m: DiscordMember) => (m.roles || []).includes(filterRole));
			}
			set(state => ({
				membersCache: { ...state.membersCache, [key]: filtered },
				membersTotal: { ...state.membersTotal, [serverId]: data.total },
				loadingMembers: (() => {
					const updated = new Set(state.loadingMembers);
					updated.delete(key);
					return updated;
				})(),
			}));
		} catch (error) {
			set(state => ({
				loadingMembers: (() => {
					const updated = new Set(state.loadingMembers);
					updated.delete(key);
					return updated;
				})(),
			}));
		}
	},
	rolesCache: {},
	loadingRoles: new Set(),
	fetchRoles: async (serverId, userId) => {
		const key = `${serverId}:${userId}`;
		const { rolesCache, loadingRoles } = get();
		if (rolesCache[key] || loadingRoles.has(key)) return;
		const newLoading = new Set(loadingRoles);
		newLoading.add(key);
		set({ loadingRoles: newLoading });
		try {
			const res = await fetch(`/api/discord/guild/roles?serverId=${serverId}&userId=${userId}`);
			if (!res.ok) throw new Error('Failed to fetch roles');
			const data = await res.json();
			set(state => ({
				rolesCache: { ...state.rolesCache, [key]: data },
				loadingRoles: (() => { const updated = new Set(state.loadingRoles); updated.delete(key); return updated; })(),
			}));
		} catch (err) {
			set(state => ({
				loadingRoles: (() => { const updated = new Set(state.loadingRoles); updated.delete(key); return updated; })(),
			}));
		}
	},
	channelsCache: {},
	loadingChannels: new Set(),
	fetchChannels: async (serverId, userId) => {
		const key = `${serverId}:${userId}`;
		const { channelsCache, loadingChannels } = get();
		if (channelsCache[key] || loadingChannels.has(key)) return;
		const newLoading = new Set(loadingChannels);
		newLoading.add(key);
		set({ loadingChannels: newLoading });
		try {
			const res = await fetch(`/api/discord/guild/channels?serverId=${serverId}&userId=${userId}`);
			if (!res.ok) throw new Error('Failed to fetch channels');
			const data = await res.json();
			set(state => ({
				channelsCache: { ...state.channelsCache, [key]: data.filter((c: DiscordChannel) => c.type === 0) },
				loadingChannels: (() => { const updated = new Set(state.loadingChannels); updated.delete(key); return updated; })(),
			}));
		} catch (err) {
			set(state => ({
				loadingChannels: (() => { const updated = new Set(state.loadingChannels); updated.delete(key); return updated; })(),
			}));
		}
	},
	clearCache: () => set({
		profileCache: {},
		loadingProfiles: new Set(),
		membersCache: {},
		membersTotal: {},
		loadingMembers: new Set(),
		rolesCache: {},
		loadingRoles: new Set(),
		channelsCache: {},
		loadingChannels: new Set(),
	}),
	populateCache: async (serverId: string, userId: string) => {
		const { fetchRoles, fetchChannels, fetchMembers, fetchProfiles } = get();
		await Promise.all([
			fetchRoles(serverId, userId),
			fetchChannels(serverId, userId),
			fetchMembers({
				serverId,
				pageIdx: 0,
				after: '0',
				searchQuery: '',
				filterRole: 'all',
				pageSize: 50,
			}),
			fetchProfiles([userId]),
		]);
	},
}));''
