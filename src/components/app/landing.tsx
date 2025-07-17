"use client"

import { SignInButton, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Shield,
  Users,
  Database,
  Cloud,
  MessageSquare,
  Settings,
  BarChart3,
  Code,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Globe,
} from "lucide-react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { AnimatedHeader } from "./header"
import { DiscordFooter } from "./footer"
import { VelocityScroll } from "../ui/scrollbasedvelocity"
import Hero1 from "../mvpblocks/hero-1"
import CurvedLoop from "../ui/CurvedLoop"
import { StaticNoise } from "../ui/AnimatedNoise"

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    const startCount = 0

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * (end - startCount) + startCount)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [end, duration, isInView])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

// Interactive Feature Card Component
function InteractiveFeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  delay = 0,
  interactive = false,
}: {
  icon: any
  title: string
  description: string
  gradient: string
  delay?: number
  interactive?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-discord-darker/90 to-discord-dark/90 border-discord-border backdrop-blur-sm hover:border-discord-blurple/50 transition-all duration-500 h-full">
        {/* Animated gradient overlay */}
        <StaticNoise opacity={0.05} />
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Floating particles effect */}
        {interactive && isHovered && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-discord-blurple rounded-full"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: "100%",
                  opacity: 0,
                }}
                animate={{
                  y: "-10%",
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 1,
                }}
              />
            ))}
          </div>
        )}

        <CardContent className="p-6 relative z-10">
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center mb-4 shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-discord-blurple transition-colors duration-300">
            {title}
          </h3>

          <p className="text-discord-text leading-relaxed group-hover:text-white/90 transition-colors duration-300">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}


export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const features = [
    {
      icon: Code,
      title: "Visual Command Builder",
      description:
        "Drag-and-drop interface to create complex bot commands without coding. Build powerful workflows with an intuitive visual editor.",
      gradient: "from-blue-500 to-purple-600",
      interactive: true,
    },
    {
      icon: Shield,
      title: "Advanced Moderation",
      description:
        "AI-powered moderation tools to keep your community safe and engaged with automated spam detection and smart filtering.",
      gradient: "from-red-500 to-pink-600",
      interactive: true,
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Comprehensive insights into your server's activity and growth with beautiful dashboards and detailed reports.",
      gradient: "from-green-500 to-emerald-600",
      interactive: true,
    },
    {
      icon: Users,
      title: "Member Management",
      description:
        "Sophisticated tools for managing roles, permissions, and user engagement with automated welcome systems.",
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: Database,
      title: "Custom Databases",
      description: "Store and manage custom data for your server with powerful queries and seamless integration.",
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description:
        "Reliable, scalable hosting with 99.9% uptime guarantee and global CDN for lightning-fast performance.",
      gradient: "from-cyan-500 to-blue-600",
    },
  ]

  return (
    <div className="bg-discord-dark overflow-hidden font-minecraft min-h-screen" ref={containerRef}>
      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black" />
        <motion.div className="absolute inset-0 bg-grid-pattern opacity-5" style={{ y }} />
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />
      </div>

      <AnimatedHeader />
      <Hero1 />

      {/* Features Section */}
      <section className="relative py-32 bg-discord-darker">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 mb-4">
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Everything you need to create, manage, and scale your Discord community
            </h2>
            <p className="text-xl text-discord-text max-w-3xl mx-auto leading-relaxed">
              From visual command building to advanced analytics, Spatium provides all the tools you need to build an
              engaging Discord experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <InteractiveFeatureCard key={feature.title} {...feature} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="relative py-32 bg-discord-dark">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4">Visual Builder</Badge>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-6">
                Build complex commands with simple drag & drop
              </h3>
              <p className="text-discord-text text-lg mb-8 leading-relaxed">
                Our intuitive visual interface lets you create sophisticated bot commands without writing a single line
                of code. Connect blocks, set conditions, and deploy instantly.
              </p>
              <div className="space-y-4">
                {[
                  "Drag-and-drop interface",
                  "Pre-built command blocks",
                  "Real-time preview",
                  "One-click deployment",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-white">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-discord-darker to-discord-dark rounded-2xl p-8 border border-discord-border shadow-2xl">
                <div className="bg-discord-dark rounded-lg p-6 mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-discord-blurple rounded flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white">Send Message Block</span>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white">Add Role Block</span>
                    </div>
                    <div className="flex items-center gap-3 ml-8">
                      <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white">Condition Block</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Command Ready</Badge>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 relative"
            >
              <div className="bg-gradient-to-br from-discord-darker to-discord-dark rounded-2xl p-8 border border-discord-border shadow-2xl">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-discord-dark rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-white text-sm">Active Users</span>
                    </div>
                    <div className="text-2xl font-bold text-green-500">
                      <AnimatedCounter end={1247} />
                    </div>
                  </div>
                  <div className="bg-discord-dark rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <span className="text-white text-sm">Messages</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-500">
                      <AnimatedCounter end={8934} />
                    </div>
                  </div>
                </div>
                <div className="h-32 bg-discord-dark rounded-lg flex items-end justify-between p-4">
                  {[40, 65, 45, 80, 55, 90, 70].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-t from-discord-blurple to-purple-500 w-6 rounded-t"
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">Analytics</Badge>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-6">
                Understand your community with powerful insights
              </h3>
              <p className="text-discord-text text-lg mb-8 leading-relaxed">
                Get detailed analytics about your server activity, member engagement, and growth trends. Make
                data-driven decisions to improve your community.
              </p>
              <div className="space-y-4">
                {[
                  "Real-time member activity",
                  "Message and engagement metrics",
                  "Growth trend analysis",
                  "Custom report generation",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-white">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <VelocityScroll default_velocity={3} text="SPATIUM" className="text-9xl" />

      {/* CTA Section */}
      <section className="relative py-32 min-h-[150vh] flex items-center justify-center bg-discord-darker">
        <StaticNoise opacity={0.05} />
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 mb-6">
              Ready to Get Started?
            </Badge>
            <h2 className="text-5xl md:text-9xl font-black text-white mb-8">
              READY TO
              <br />
              <span className="text-discord-blurple glow-text">JOIN THE PARTY?</span>
            </h2>
            <p className="text-xl text-discord-text mb-12 max-w-2xl mx-auto">
              Start building amazing Discord experiences today with Spatium's powerful visual tools and analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <SignedOut>
                <SignInButton mode="modal">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button className="discord-button-primary text-xl px-12 py-6">
                      START BUILDING NOW
                      <Sparkles className="ml-2 h-6 w-6" />
                    </Button>
                  </motion.div>
                </SignInButton>
              </SignedOut>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button variant="outline" className="discord-button-outline text-xl px-12 py-6">
                  VIEW DOCUMENTATION
                  <Globe className="ml-2 h-6 w-6" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <CurvedLoop
          marqueeText="Be ✦ Creative ✦ With ✦ Spatium ✦"
          speed={2}
          curveAmount={500}
          direction="left"
          interactive={true}
          className="font-minecraft animate-pulse-glow"
        />
      </section>

      <DiscordFooter />
    </div>
  )
}
