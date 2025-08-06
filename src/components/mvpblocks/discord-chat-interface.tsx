/* eslint-disable prettier/prettier */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    Ban,
    Hash,
    Send,
    Shield,
    Timer,
    Users,
    UserX,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatMessage {
    id: string;
    type: 'command' | 'response' | 'system';
    content: string;
    user: {
        id: string;
        username: string;
        avatar?: string;
        role: 'admin' | 'moderator' | 'member';
    };
    timestamp: Date;
    command?: {
        name: string;
        target?: string;
        reason?: string;
        duration?: string;
        command?: string;
    };
}

interface ModerationLog {
    id: string;
    action: string;
    userId: string;
    username: string;
    reason: string;
    moderator: string;
    timestamp: Date;
    duration?: string;
    status: 'active' | 'completed' | 'pending';
}

const SAMPLE_COMMANDS = [
    '/ban @spammer Excessive spam in general chat',
    '/warn @toxicuser Please keep discussions civil',
    '/mute @louduser 1h Disrupting voice chat',
];

export function DiscordChatInterface({
    onModerationAction,
}: {
    onModerationAction: (log: ModerationLog) => void;
}) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            type: 'system',
            content:
                'Welcome to the moderation panel. Use slash commands to manage your server.',
            user: { id: 'system', username: 'Spatium Bot', role: 'admin' },
            timestamp: new Date(Date.now() - 300000),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const getActionIcon = (action: string) => {
        switch (action.toLowerCase()) {
            case 'ban':
                return <Ban className='w-4 h-4 text-red-500' />;
            case 'kick':
                return <UserX className='w-4 h-4 text-orange-500' />;
            case 'warn':
                return <AlertTriangle className='w-4 h-4 text-yellow-500' />;
            case 'mute':
                return <Timer className='w-4 h-4 text-purple-500' />;
            default:
                return <Shield className='w-4 h-4 text-discord-blurple' />;
        }
    };

    const parseCommand = (input: string) => {
        const parts = input.trim().split(' ');
        const command = parts[0].toLowerCase();
        const target = parts[1]?.replace('@', '');
        const reason = parts.slice(2).join(' ');

        return { command, target, reason };
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            type: inputValue.startsWith('/') ? 'command' : 'response',
            content: inputValue,
            user: {
                id: 'user1',
                username: 'ModeratorUser',
                avatar: '/placeholder.svg?height=32&width=32',
                role: 'moderator',
            },
            timestamp: new Date(),
        };

        if (inputValue.startsWith('/')) {
            const { command, target, reason } = parseCommand(inputValue);
            newMessage.command = { name: command, target, reason, command: command };
        }

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            if (newMessage.type === 'command' && newMessage.command) {
                const { command, target, reason } = newMessage.command;
                let responseContent = '';
                let logEntry: ModerationLog | null = null;

                switch (command) {
                    case '/ban':
                        responseContent = `✅ Successfully banned ${target} for "${reason}"`;
                        logEntry = {
                            id: Date.now().toString(),
                            action: 'Ban',
                            userId: `user_${target}`,
                            username: target || 'Unknown User',
                            reason: reason || 'No reason provided',
                            moderator: 'ModeratorUser',
                            timestamp: new Date(),
                            status: 'active',
                        };
                        break;
                    case '/warn':
                        responseContent = `⚠️ Warning issued to ${target} for "${reason}"`;
                        logEntry = {
                            id: Date.now().toString(),
                            action: 'Warn',
                            userId: `user_${target}`,
                            username: target || 'Unknown User',
                            reason: reason || 'No reason provided',
                            moderator: 'ModeratorUser',
                            timestamp: new Date(),
                            status: 'completed',
                        };
                        break;
                    case '/mute':
                        responseContent = `👢 ${target} has been muted  Reason: "${reason}"`;
                        logEntry = {
                            id: Date.now().toString(),
                            action: 'Mute',
                            userId: `user_${target}`,
                            username: target || 'Unknown User',
                            reason: reason || 'No reason provided',
                            moderator: 'ModeratorUser',
                            timestamp: new Date(),
                            status: 'completed',
                        };
                        break;
                    default:
                        responseContent = `❌ Unknown command: ${command}`;
                }

                const responseMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    type: 'response',
                    content: responseContent,
                    user: {
                        id: 'spatium',
                        username: 'Spatium Bot',
                        role: 'admin',
                    },
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, responseMessage]);

                if (logEntry) {
                    onModerationAction(logEntry);
                }
            }
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const insertSampleCommand = (command: string) => {
        setInputValue(command);
    };

    return (
        <div className='flex flex-col h-full bg-discord-dark rounded-xl overflow-hidden'>
            {/* Discord-style header */}
            <div className='flex items-center justify-between p-4 bg-discord-darker border-b border-discord-border'>
                <div className='flex items-center gap-3'>
                    <Hash className='w-5 h-5 text-discord-text' />
                    <span className='text-white font-semibold'>moderation-commands</span>
                    <Badge
                        variant='secondary'
                        className='bg-discord-blurple/20 text-discord-blurple text-xs'
                    >
                        Admin Only
                    </Badge>
                </div>
                <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4 text-discord-text' />
                    <span className='text-discord-text text-sm'>3</span>
                </div>
            </div>

            {/* Messages area */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                <AnimatePresence>
                    {messages.map(message => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className='flex gap-3'
                        >
                            <Avatar className='w-8 h-8 mt-1'>
                                {message.user.avatar ? (
                                    <AvatarImage
                                        src={message.user.avatar || '/placeholder.svg'}
                                        alt={message.user.username}
                                    />
                                ) : (
                                    <AvatarFallback
                                        className={`text-xs font-bold ${message.user.role === 'admin'
                                            ? 'bg-red-500'
                                            : message.user.role === 'moderator'
                                                ? 'bg-discord-blurple'
                                                : 'bg-gray-500'
                                            }`}
                                    >
                                        {message.user.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <span
                                        className={`font-semibold text-sm ${message.user.role === 'admin'
                                            ? 'text-red-400'
                                            : message.user.role === 'moderator'
                                                ? 'text-discord-blurple'
                                                : 'text-white'
                                            }`}
                                    >
                                        {message.user.username}
                                    </span>
                                    {message.user.role === 'admin' && (
                                        <Badge variant='destructive' className='text-xs px-1 py-0'>
                                            ADMIN
                                        </Badge>
                                    )}
                                    {message.user.role === 'moderator' && (
                                        <Badge className='bg-discord-blurple text-xs px-1 py-0'>
                                            MOD
                                        </Badge>
                                    )}
                                    <span className='text-discord-text text-xs'>
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <div
                                    className={`text-sm ${message.type === 'command'
                                        ? 'font-mono bg-discord-darker p-2 rounded border-l-4 border-discord-blurple'
                                        : message.type === 'response'
                                            ? 'text-green-400'
                                            : 'text-discord-text'
                                        }`}
                                >
                                    {message.command && (
                                        <div className='flex items-center gap-2 mb-1'>
                                            {getActionIcon(message.command.name.replace('/', ''))}
                                            <span className='text-discord-blurple font-semibold'>
                                                {message.command.name}
                                            </span>
                                        </div>
                                    )}
                                    {message.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='flex gap-3'
                    >
                        <Avatar className='w-8 h-8'>
                            <AvatarFallback className='bg-red-500 text-xs font-bold'>
                                S
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex items-center gap-2 text-discord-text text-sm'>
                            <div className='flex gap-1'>
                                <div
                                    className='w-2 h-2 bg-discord-text rounded-full animate-bounce'
                                    style={{ animationDelay: '0ms' }}
                                />
                                <div
                                    className='w-2 h-2 bg-discord-text rounded-full animate-bounce'
                                    style={{ animationDelay: '150ms' }}
                                />
                                <div
                                    className='w-2 h-2 bg-discord-text rounded-full animate-bounce'
                                    style={{ animationDelay: '300ms' }}
                                />
                            </div>
                            <span>Spatium Bot is typing...</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Sample commands */}
            <div className='p-3 bg-discord-darker/50 border-t border-discord-border'>
                <div className='text-xs text-discord-text mb-2'>Quick Commands:</div>
                <div className='flex flex-wrap gap-2'>
                    {SAMPLE_COMMANDS.map((command, index) => (
                        <Button
                            key={index}
                            variant='ghost'
                            size='sm'
                            onClick={() => insertSampleCommand(command)}
                            className='text-xs h-6 px-2 bg-discord-dark hover:bg-discord-darker text-discord-text hover:text-white'
                        >
                            {command.split(' ')[0]}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Input area */}
            <div className='p-4 bg-discord-darker'>
                <div className='flex gap-3 items-end'>
                    <div className='flex-1 relative'>
                        <Input
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder='Type a moderation command... (e.g., /ban @user reason)'
                            className='bg-discord-dark border-discord-border text-white placeholder:text-discord-text focus:border-discord-blurple pr-12'
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            size='sm'
                            className='absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 bg-discord-blurple hover:bg-discord-blurple/80'
                        >
                            <Send className='w-3 h-3' />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
