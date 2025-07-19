"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Users, Search, UserPlus, Crown, Shield } from "lucide-react"

interface MembersContentProps {
    serverId?: string
}

export function MembersContent({ serverId }: MembersContentProps) {
    const members = [
        { name: "AdminUser", role: "Administrator", status: "online", joinDate: "Jan 2023" },
        { name: "ModeratorX", role: "Moderator", status: "online", joinDate: "Mar 2023" },
        { name: "Helper99", role: "Helper", status: "idle", joinDate: "Jun 2023" },
        { name: "ActiveMember", role: "Member", status: "online", joinDate: "Aug 2023" },
        { name: "NewUser789", role: "Member", status: "offline", joinDate: "Dec 2023" },
    ]

    return (
        <div className="flex-1 overflow-auto">
            <header className="sticky top-0 z-20 bg-discord-darker/80 backdrop-blur-sm border-b border-discord-border/50 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Badge className="mb-2 bg-discord-green/20 text-discord-green border-discord-green/30">
                            <Users className="mr-2 h-4 w-4" />
                            MEMBER MANAGEMENT
                        </Badge>
                        <h1 className="text-2xl font-bold text-white font-minecraft tracking-wide">COMMUNITY MEMBERS</h1>
                        <p className="text-discord-text">Manage server members and roles</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-discord-text w-4 h-4" />
                            <Input
                                placeholder="Search members..."
                                className="pl-10 bg-discord-dark border-discord-border text-white"
                            />
                        </div>
                        <Button className="discord-button-primary">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Invite Members
                        </Button>
                    </div>
                </div>
            </header>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { title: "Total Members", value: "1,247", color: "discord-blurple" },
                        { title: "Online Now", value: "342", color: "discord-green" },
                        { title: "New This Month", value: "89", color: "discord-purple" },
                        { title: "Active Members", value: "756", color: "discord-orange" },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card className="discord-card">
                                <CardContent className="p-6 text-center">
                                    <div className={`text-3xl font-black text-${stat.color} mb-2`}>{stat.value}</div>
                                    <div className="text-discord-text text-sm">{stat.title}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <Card className="discord-card">
                    <CardHeader>
                        <CardTitle className="text-white">Member List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {members.map((member, index) => (
                                <motion.div
                                    key={member.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-discord-blurple rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">{member.name.charAt(0)}</span>
                                            </div>
                                            <div
                                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-discord-darker ${member.status === "online"
                                                        ? "bg-discord-green"
                                                        : member.status === "idle"
                                                            ? "bg-discord-yellow"
                                                            : "bg-gray-500"
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white flex items-center gap-2">
                                                {member.name}
                                                {member.role === "Administrator" && <Crown className="w-4 h-4 text-discord-yellow" />}
                                                {member.role === "Moderator" && <Shield className="w-4 h-4 text-discord-red" />}
                                            </div>
                                            <div className="text-xs text-discord-text">
                                                {member.role} • Joined {member.joinDate}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            className={`text-xs ${member.status === "online"
                                                    ? "bg-discord-green/20 text-discord-green border-discord-green/30"
                                                    : member.status === "idle"
                                                        ? "bg-discord-yellow/20 text-discord-yellow border-discord-yellow/30"
                                                        : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                                }`}
                                        >
                                            {member.status}
                                        </Badge>
                                        <Button size="sm" variant="ghost" className="text-discord-text hover:text-white">
                                            Manage
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
