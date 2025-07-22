'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation,useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import {
    Bell,
    Bot,
    CheckCircle,
    Copy,
    Crown,
    Eye,
    Hash,
    Lock,
    RefreshCw,
    Save,
    Settings,
    Shield,
    Users,
} from 'lucide-react';
import { useCallback, useEffect, useRef,useState } from 'react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

import { api } from '../../../../../convex/_generated/api';
import WelcomeSettingsSection from './WelcomeSettingsSection';

function VariableCopyBadge({ variable }: { variable: string }) {
    const toast = useToast();
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(variable);
        setCopied(true);
        toast.success('Copied!', `${variable} copied to clipboard`);
        setTimeout(() => setCopied(false), 1200);
    };
    return (
        <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-mono hover:bg-discord-blurple/30 transition-colors focus:outline-none"
            title="Copy variable"
        >
            <span>{variable}</span>
            <Copy className="w-4 h-4" />
            {copied && <span className="ml-1 text-discord-green">✓</span>}
        </button>
    );
}

export default function SettingsClient({ serverId }: { serverId: string }) {
    const { user, isLoaded } = useUser();
    const toast = useToast();

    const settings = useQuery(api.serverSettings.getServerSettings, { serverId });
    const updateSettings = useMutation(api.serverSettings.updateServerSettings);

    const [form, setForm] = useState({
        prefix: '',
        welcomeMessage: '',
        autoRole: false,
        moderationEnabled: false,
        spamFilter: false,
        linkFilter: false,
        joinNotifications: false,
        leaveNotifications: false,
        logChannelId: '',
        welcomeChannelId: '',
        autoRoleId: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState<import('@/types/discord').DiscordRole[]>(
        []
    );
    const [rolesLoading, setRolesLoading] = useState(false);
    const [rolesError, setRolesError] = useState<string | null>(null);
    const [channels, setChannels] = useState<import('@/types/discord').DiscordChannel[]>([]);
    const [channelsLoading, setChannelsLoading] = useState(false);
    const [channelsError, setChannelsError] = useState<string | null>(null);
    const [channelQuery, setChannelQuery] = useState('');
    const [showChannelDropdown, setShowChannelDropdown] = useState(false);
    const channelInputRef = useRef<HTMLInputElement>(null);
    const [channelRefreshLoading, setChannelRefreshLoading] = useState(false);
    const [lastChannelRefresh, setLastChannelRefresh] = useState<number>(0);

    const fetchRoles = useCallback(async () => {
        if (!isLoaded || !user) {
            return console.log('No user or loading state is false ', isLoaded);
        }

        setRolesLoading(true);
        setRolesError(null);

        try {
            const res = await fetch(
                '/api/discord/roles?serverId=' + serverId + '&userId=' + user?.id
            );
            if (!res.ok) throw new Error('Failed to fetch roles');
            const data = await res.json();
            setRoles(data);
        } catch (err: any) {
            setRolesError(err.message);
        } finally {
            setRolesLoading(false);
        }
    }, [serverId, isLoaded, user]);

    const fetchChannels = useCallback(async () => {
        if (!isLoaded || !user) {
            return console.log('No user or loading state is false ', isLoaded);
        }
        setChannelsLoading(true);
        setChannelsError(null);
        try {
            const res = await fetch(
                '/api/discord/channels?serverId=' + serverId + '&userId=' + user?.id
            );
            if (!res.ok) throw new Error('Failed to fetch channels');
            const data = await res.json();
            setChannels(data.filter((c: any) => c.type === 0)); // Only text channels
        } catch (err: any) {
            setChannelsError(err.message);
        } finally {
            setChannelsLoading(false);
        }
    }, [serverId, isLoaded, user]);

    const handleRefreshChannels = useCallback(async () => {
        const now = Date.now();
        if (now - lastChannelRefresh < 10000) return; // 10s debounce
        setChannelRefreshLoading(true);
        try {
            await fetchChannels();
            setLastChannelRefresh(now);
        } finally {
            setChannelRefreshLoading(false);
        }
    }, [fetchChannels, lastChannelRefresh]);

    useEffect(() => {
        if (form.autoRole) {
            fetchRoles();
        }
    }, [form.autoRole, fetchRoles]);

    useEffect(() => {
        fetchChannels();
    }, [fetchChannels]);

    // Sync form state with loaded settings
    useEffect(() => {
        if (settings) {
            setForm({
                prefix: settings.prefix || '!',
                welcomeMessage: settings.welcomeMessage || '',
                autoRole: settings.autoRole || false,
                moderationEnabled: settings.moderationEnabled || false,
                spamFilter: settings.spamFilter || false,
                linkFilter: settings.linkFilter || false,
                joinNotifications: settings.joinNotifications || false,
                leaveNotifications: settings.leaveNotifications || false,
                logChannelId: settings.logChannelId || '',
                welcomeChannelId: settings.welcomeChannelId || '',
                autoRoleId:
                    'autoRoleId' in settings ? (settings as any).autoRoleId || '' : '',
            });
        }
    }, [settings]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value, type } = e.target;
        let newValue: string | boolean = value;

        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            newValue = e.target.checked;
        }

        setForm(prev => ({
            ...prev,
            [id]: newValue,
        }));
    };

    const handleSwitch = (id: string, value: boolean) => {
        setForm(prev => ({ ...prev, [id]: value }));
    };

    const handleSaveSettings = async () => {
        if (isLoading) return;

        setIsLoading(true);
        const ref = toast.loading('Saving settings...', 'Your changes are being applied');

        try {
            await updateSettings({
                serverId,
                prefix: form.prefix,
                welcomeMessage: form.welcomeMessage,
                welcomeChannelId: form.welcomeChannelId,
                autoRole: form.autoRole,
                moderationEnabled: form.moderationEnabled,
                spamFilter: form.spamFilter,
                linkFilter: form.linkFilter,
                joinNotifications: form.joinNotifications,
                leaveNotifications: form.leaveNotifications,
                logChannelId: form.logChannelId,
                ...(form.autoRoleId ? { autoRoleId: form.autoRoleId } : {}),
            });

            toast.dismiss(ref);
            toast.success(
                'Settings saved successfully!',
                'Your bot configuration has been updated'
            );
        } catch (_error) {
            toast.dismiss(ref);
            toast.error(
                'Failed to save settings',
                'Please try again or contact support'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const selectedRole = roles.find(role => role.id === form.autoRoleId);
    const isRiskyRole =
        selectedRole &&
        (/admin|administrator|moderate|manage|ban|kick|mod/i.test(
            selectedRole.name
        ) ||
            (BigInt(selectedRole.permissions) &
                (BigInt(0x8) | BigInt(0x20) | BigInt(0x10) | BigInt(0x4))) !==
            BigInt(0));

    return (
        <div className='bg-discord-dark min-h-screen font-minecraft'>
            {/* Atmospheric Background */}
            <div className='fixed inset-0 z-0'>
                <div className='absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black' />
                <div className='absolute inset-0 bg-grid-pattern opacity-5' />
                <div className='floating-orb floating-orb-1' />
                <div className='floating-orb floating-orb-2' />
                <div className='floating-orb floating-orb-3' />
            </div>

            <div className='relative z-10'>
                {/* Hero Section */}
                <section className='max-h-screen flex items-center justify-center pt-20'>
                    <div className='container mx-auto px-6'>
                        <motion.div
                            className='text-center'
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Badge className='mb-8 bg-discord-green/20 text-discord-green border-discord-green/30 px-4 py-2 font-bold'>
                                <Crown className='mr-2 h-4 w-4' />
                                CONFIGURATION CENTER
                            </Badge>

                            <h1 className='text-6xl md:text-8xl font-black text-white leading-tight tracking-tight'>
                                <span className='block mb-4'>SERVER</span>
                                <span className='block text-discord-blurple glow-text'>
                                    SETTINGS
                                </span>
                            </h1>
                        </motion.div>
                    </div>
                </section>

                {/* Settings Sections */}
                <section className='min-h-screen flex items-center justify-center py-20 bg-discord-darker/50'>
                    <div className='container mx-auto px-6 max-w-8xl'>
                        <div className='space-y-12'>
                            {/* General Settings */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <Card className='discord-card border-2 border-white/10'>
                                    <CardHeader className='border-b border-discord-border p-8'>
                                        <div className='flex items-center gap-4'>
                                            <motion.div
                                                className='p-4 bg-discord-blurple/20 rounded-xl'
                                                whileHover={{ scale: 1.05, rotate: 5 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 400,
                                                    damping: 17,
                                                }}
                                            >
                                                <Settings className='h-8 w-8 text-discord-blurple' />
                                            </motion.div>
                                            <div>
                                                <CardTitle className='text-3xl font-black text-white tracking-wide font-minecraft'>
                                                    GENERAL CONFIGURATION
                                                </CardTitle>
                                                <p className='text-discord-text text-lg'>
                                                    Core bot settings and behavior
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className='p-8 space-y-8'>
                                        <div className='grid md:grid-cols-2 gap-8'>
                                            <div className='space-y-3'>
                                                <Label
                                                    htmlFor='prefix'
                                                    className='text-white font-bold text-lg flex items-center gap-2'
                                                >
                                                    <Hash className='h-4 w-4 text-discord-blurple' />
                                                    COMMAND PREFIX
                                                </Label>
                                                <Input
                                                    id='prefix'
                                                    placeholder='!'
                                                    value={form.prefix}
                                                    onChange={handleChange}
                                                    className='bg-white/5 border-white/20 text-white placeholder:text-discord-text h-12 text-lg'
                                                />
                                                <p className='text-sm text-discord-text'>
                                                    Character that triggers bot commands
                                                </p>
                                            </div>

                                            <div className='space-y-3'>
                                                <Label
                                                    htmlFor='logChannelId'
                                                    className='text-white font-bold text-lg flex items-center gap-2'
                                                >
                                                    <Eye className='h-4 w-4 text-discord-green' />
                                                    LOG CHANNEL
                                                </Label>
                                                <div className='relative'>
                                                    <Input
                                                        id='logChannelId'
                                                        ref={channelInputRef}
                                                        placeholder='#bot-logs'
                                                        value={
                                                            channels.find(c => c.id === form.logChannelId)?.name
                                                                ? `#${channels.find(c => c.id === form.logChannelId)?.name}`
                                                                : channelQuery
                                                        }
                                                        onChange={e => {
                                                            setChannelQuery(e.target.value);
                                                            setForm(prev => ({ ...prev, logChannelId: '' }));
                                                            setShowChannelDropdown(true);
                                                        }}
                                                        onFocus={() => setShowChannelDropdown(true)}
                                                        onBlur={() => setTimeout(() => setShowChannelDropdown(false), 150)}
                                                        className='bg-white/5 border-white/20 text-white placeholder:text-discord-text h-12 text-lg pr-10'
                                                        autoComplete='off'
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={handleRefreshChannels}
                                                        disabled={channelRefreshLoading || Date.now() - lastChannelRefresh < 10000}
                                                        variant={"ghost"}
                                                        className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 z-100 cursor-pointer'
                                                    >
                                                        <RefreshCw
                                                            color='var(--color-discord-text)'
                                                            className={channelRefreshLoading ? 'animate-spin' : ''}
                                                        />
                                                    </Button>
                                                    {showChannelDropdown && (channelQuery.length > 0 || !form.logChannelId) && (
                                                        <div className='absolute z-20 mt-1 w-full bg-discord-dark border border-white/10 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                                                            {channelsLoading ? (
                                                                <div className='p-3 text-discord-text'>Loading channels...</div>
                                                            ) : channelsError ? (
                                                                <div className='p-3 text-red-400'>{channelsError}</div>
                                                            ) : (
                                                                channels
                                                                    .filter(c =>
                                                                        c.name.toLowerCase().includes(channelQuery.toLowerCase())
                                                                    )
                                                                    .slice(0, 10)
                                                                    .map(channel => (
                                                                        <div
                                                                            key={channel.id}
                                                                            className='px-4 py-2 cursor-pointer hover:bg-discord-blurple/20 text-white flex items-center gap-2'
                                                                            onMouseDown={e => {
                                                                                e.preventDefault();
                                                                                setForm(prev => ({ ...prev, logChannelId: channel.id }));
                                                                                setChannelQuery('');
                                                                                setShowChannelDropdown(false);
                                                                                if (channelInputRef.current) {
                                                                                    channelInputRef.current.blur();
                                                                                }
                                                                            }}
                                                                        >
                                                                            <span className='text-discord-blurple'>#</span>
                                                                            {channel.name}
                                                                        </div>
                                                                    ))
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className='text-sm text-discord-text'>
                                                    Channel for bot activity logs
                                                </p>
                                            </div>
                                        </div>

                                        <WelcomeSettingsSection serverId={serverId} />
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Moderation Settings */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <Card className='discord-card border-2 border-white/10'>
                                    <CardHeader className='border-b border-discord-border p-8'>
                                        <div className='flex items-center gap-4'>
                                            <motion.div
                                                className='p-4 bg-discord-green/20 rounded-xl'
                                                whileHover={{ scale: 1.05, rotate: 5 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 400,
                                                    damping: 17,
                                                }}
                                            >
                                                <Shield className='h-8 w-8 text-discord-green' />
                                            </motion.div>
                                            <div>
                                                <CardTitle className='text-3xl font-black text-white tracking-wide font-minecraft'>
                                                    SECURITY & MODERATION
                                                </CardTitle>
                                                <p className='text-discord-text text-lg'>
                                                    Automated protection systems
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className='p-8 space-y-6'>
                                        {[
                                            {
                                                id: 'moderationEnabled',
                                                icon: Bot,
                                                title: 'AUTO-MODERATION',
                                                description:
                                                    'Enable intelligent content filtering and automated moderation',
                                                checked: form.moderationEnabled,
                                            },
                                            {
                                                id: 'spamFilter',
                                                icon: Shield,
                                                title: 'SPAM PROTECTION',
                                                description:
                                                    'Automatically detect and prevent spam messages',
                                                checked: form.spamFilter,
                                            },
                                            {
                                                id: 'linkFilter',
                                                icon: Lock,
                                                title: 'LINK FILTERING',
                                                description:
                                                    'Block external links from untrusted sources',
                                                checked: form.linkFilter,
                                            },
                                        ].map((setting, index) => (
                                            <motion.div
                                                key={setting.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                                viewport={{ once: true }}
                                                className='flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors'
                                            >
                                                <div className='flex items-center gap-4'>
                                                    <setting.icon className='h-6 w-6 text-discord-green' />
                                                    <div>
                                                        <Label className='text-white font-bold text-lg'>
                                                            {setting.title}
                                                        </Label>
                                                        <p className='text-discord-text'>
                                                            {setting.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Switch
                                                    id={setting.id}
                                                    checked={setting.checked}
                                                    onCheckedChange={v => handleSwitch(setting.id, v)}
                                                    className='scale-125'
                                                />
                                            </motion.div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Notification Settings */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <Card className='discord-card border-2 border-white/10'>
                                    <CardHeader className='border-b border-discord-border p-8'>
                                        <div className='flex items-center gap-4'>
                                            <motion.div
                                                className='p-4 bg-discord-yellow/20 rounded-xl'
                                                whileHover={{ scale: 1.05, rotate: 5 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 400,
                                                    damping: 17,
                                                }}
                                            >
                                                <Bell className='h-8 w-8 text-discord-yellow' />
                                            </motion.div>
                                            <div>
                                                <CardTitle className='text-3xl font-black text-white tracking-wide font-minecraft'>
                                                    NOTIFICATION CENTER
                                                </CardTitle>
                                                <p className='text-discord-text text-lg'>
                                                    Member activity alerts and logging
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className='p-8 space-y-6'>
                                        {[
                                            {
                                                id: 'joinNotifications',
                                                icon: Users,
                                                title: 'JOIN NOTIFICATIONS',
                                                description:
                                                    'Announce when new members join the server',
                                                checked: form.joinNotifications,
                                            },
                                            {
                                                id: 'leaveNotifications',
                                                icon: Users,
                                                title: 'LEAVE NOTIFICATIONS',
                                                description: 'Announce when members leave the server',
                                                checked: form.leaveNotifications,
                                            },
                                        ].map((setting, index) => (
                                            <motion.div
                                                key={setting.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                                viewport={{ once: true }}
                                                className='flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors'
                                            >
                                                <div className='flex items-center gap-4'>
                                                    <setting.icon className='h-6 w-6 text-discord-yellow' />
                                                    <div>
                                                        <Label className='text-white font-bold text-lg'>
                                                            {setting.title}
                                                        </Label>
                                                        <p className='text-discord-text'>
                                                            {setting.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                {form.logChannelId ? (
                                                    <Switch
                                                        id={setting.id}
                                                        checked={setting.checked}
                                                        disabled={false}
                                                        onCheckedChange={v => handleSwitch(setting.id, v)}
                                                        className='scale-125'
                                                    />
                                                ) : (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span>
                                                                    <Switch
                                                                        id={setting.id}
                                                                        checked={setting.checked}
                                                                        disabled={true}
                                                                        onCheckedChange={v => handleSwitch(setting.id, v)}
                                                                        className='scale-125'
                                                                    />
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <span>Please select a log channel to enable notifications.</span>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </motion.div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Save Button */}
                            <motion.div
                                className='text-center pt-8'
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                >
                                    <Button
                                        onClick={handleSaveSettings}
                                        disabled={isLoading}
                                        className='discord-button-primary text-xl px-12 py-6 min-w-[200px]'
                                    >
                                        {isLoading ? (
                                            <>
                                                <RefreshCw className='mr-2 h-6 w-6 animate-spin' />
                                                SAVING...
                                            </>
                                        ) : (
                                            <>
                                                <Save className='mr-2 h-6 w-6' />
                                                SAVE CONFIGURATION
                                            </>
                                        )}
                                    </Button>
                                </motion.div>

                                <div className='mt-6 flex items-center justify-center gap-2 text-discord-text'>
                                    <CheckCircle className='h-4 w-4 text-discord-green' />
                                    <span>Changes are applied instantly across your server</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
