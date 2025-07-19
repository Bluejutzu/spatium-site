"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Users, MessageSquare, Calendar, Download } from "lucide-react"

interface AnalyticsContentProps {
    serverId?: string
}

export function AnalyticsContent({ serverId }: AnalyticsContentProps) {
    return (
        <div className="flex-1 overflow-auto">
            <header className="sticky top-0 z-20 bg-discord-darker/80 backdrop-blur-sm border-b border-discord-border/50 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Badge className="mb-2 bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            ANALYTICS SUITE
                        </Badge>
                        <h1 className="text-2xl font-bold text-white font-minecraft tracking-wide">SERVER ANALYTICS</h1>
                        <p className="text-discord-text">Deep insights into your community&apos;s engagement</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button className="discord-button-outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export Data
                        </Button>
                        <Button className="discord-button-primary">
                            <Calendar className="w-4 h-4 mr-2" />
                            Custom Range
                        </Button>
                    </div>
                </div>
            </header>

            <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "Total Messages",
                            value: "1.2M",
                            change: "+12%",
                            icon: MessageSquare,
                            color: "discord-blurple",
                        },
                        {
                            title: "Active Members",
                            value: "8.4K",
                            change: "+8%",
                            icon: Users,
                            color: "discord-green",
                        },
                        {
                            title: "Growth Rate",
                            value: "15.2%",
                            change: "+3%",
                            icon: TrendingUp,
                            color: "discord-purple",
                        },
                        {
                            title: "Engagement",
                            value: "92%",
                            change: "+5%",
                            icon: BarChart3,
                            color: "discord-orange",
                        },
                    ].map((metric, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card className="discord-card border-2 border-white/10">
                                <CardContent className="p-6">
                                    <div className={`p-3 rounded-xl bg-${metric.color}/20 w-fit mb-4`}>
                                        <metric.icon className={`h-6 w-6 text-${metric.color}`} />
                                    </div>
                                    <h3 className="text-sm font-bold text-discord-text mb-2 tracking-wide">{metric.title}</h3>
                                    <div className={`text-3xl font-black text-${metric.color} mb-2`}>{metric.value}</div>
                                    <Badge className={`bg-${metric.color}/20 text-${metric.color} border-${metric.color}/30 text-xs`}>
                                        <TrendingUp className="mr-1 h-2 w-2" />
                                        {metric.change}
                                    </Badge>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="discord-card">
                        <CardHeader>
                            <CardTitle className="text-white">Message Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 bg-discord-dark/50 rounded-lg flex items-end justify-between p-4">
                                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((height, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="bg-gradient-to-t from-discord-blurple to-purple-500 w-6 rounded-t"
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="discord-card">
                        <CardHeader>
                            <CardTitle className="text-white">Member Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 bg-discord-dark/50 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-discord-green mb-2">+247</div>
                                    <div className="text-discord-text">New members this month</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
