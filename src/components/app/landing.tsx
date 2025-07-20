"use client"

import { SignInButton, SignedOut, SignedIn } from "@clerk/nextjs"
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
  Zap,
  Bot,
  Crown,
  Activity,
  Layers,
  Palette,
  Rocket,
} from "lucide-react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { AnimatedHeader } from "./header"
import { DiscordFooter } from "./footer"
import { VelocityScroll } from "../ui/scrollbasedvelocity"
import Hero1 from "../mvpblocks/hero-1"
import CurvedLoop from "../ui/CurvedLoop"
import { StaticNoise } from "../ui/AnimatedNoise"
import Link from "next/link"

// Enhanced Animated Counter Component with better performance
function AnimatedCounter({ 
  end, 
  duration = 2000, 
  suffix = "",
  prefix = "",
  className = ""
}: { 
  end: number; 
  duration?: number; 
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    const startCount = 0

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Improved easing function for smoother animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(easeOutCubic * (end - startCount) + startCount)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [end, duration, isInView])

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// Enhanced Interactive Feature Card with better accessibility and animations
function InteractiveFeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  delay = 0,
  interactive = false,
  features = [],
}: {
  icon: any
  title: string
  description: string
  gradient: string
  delay?: number
  interactive?: boolean
  features?: string[]
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
      className="group relative h-full"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-discord-darker/95 to-discord-dark/95 border-discord-border backdrop-blur-sm hover:border-discord-blurple/50 transition-all duration-500 h-full">
        {/* Enhanced background effects */}
        <StaticNoise opacity={0.03} />
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
          animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Improved floating particles effect */}
        {interactive && isHovered && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-discord-blurple rounded-full"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: "100%",
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  y: "-20%",
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.15,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 1.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}

        <CardContent className="p-8 relative z-10 h-full flex flex-col">
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-16 h-16 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>

          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-discord-blurple transition-colors duration-300">
            {title}
          </h3>

          <p className="text-discord-text leading-relaxed group-hover:text-white/90 transition-colors duration-300 mb-6 flex-grow">
            {description}
          </p>

          {/* Feature list for enhanced cards */}
          {features.length > 0 && (
            <div className="space-y-2 mt-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: delay + 0.1 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-discord-text group-hover:text-white/80 transition-colors duration-300"
                >
                  <CheckCircle className="w-4 h-4 text-discord-green flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Enhanced Stats Section Component
function StatsSection() {
  const stats = [
    { label: "Active Servers", value: 15000, suffix: "+", icon: Database },
    { label: "Commands Executed", value: 2500000, suffix: "+", icon: Zap },
    { label: "Happy Users", value: 50000, suffix: "+", icon: Users },
    { label: "Uptime", value: 99.9, suffix: "%", icon: Activity },
  ]

  return (
    <section className="relative py-20 bg-discord-darker/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-discord-green/20 text-discord-green border-discord-green/30 mb-4 px-4 py-2">
            <TrendingUp className="mr-2 h-4 w-4" />
            Trusted Worldwide
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Powering Discord Communities
          </h2>
          <p className="text-xl text-discord-text max-w-2xl mx-auto">
            Join thousands of servers already using Spatium to enhance their Discord experience
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-discord-blurple/20 to-purple-600/20 w-fit mx-auto mb-4 border border-discord-blurple/30">
                <stat.icon className="w-8 h-8 text-discord-blurple" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix}
                  className="bg-gradient-to-r from-discord-blurple to-purple-400 bg-clip-text text-transparent"
                />
              </div>
              <p className="text-discord-text font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Enhanced Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Community Manager",
      server: "TechHub Discord",
      content: "Spatium transformed how we manage our 50k+ member community. The visual command builder is incredible!",
      avatar: "AC",
    },
    {
      name: "Sarah Johnson",
      role: "Server Owner",
      server: "Gaming Central",
      content: "The moderation tools are top-notch. We've seen a 90% reduction in spam since implementing Spatium.",
      avatar: "SJ",
    },
    {
      name: "Mike Rodriguez",
      role: "Bot Developer",
      server: "Dev Community",
      content: "As a developer, I appreciate the clean API and extensive customization options. Highly recommended!",
      avatar: "MR",
    },
  ]

  return (
    <section className="relative py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-discord-yellow/20 text-discord-yellow border-discord-yellow/30 mb-4 px-4 py-2">
            <Star className="mr-2 h-4 w-4" />
            Community Love
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            What Our Users Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-gradient-to-br from-discord-darker/90 to-discord-dark/90 border-discord-border backdrop-blur-sm h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-discord-blurple to-purple-600 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-discord-text">{testimonial.role}</p>
                      <p className="text-xs text-discord-blurple">{testimonial.server}</p>
                    </div>
                  </div>
                  <p className="text-discord-text leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex text-discord-yellow mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
      description: "Create powerful Discord commands with our intuitive drag-and-drop interface. No coding required!",
      gradient: "from-blue-500 to-purple-600",
      interactive: true,
      features: [
        "Drag & drop interface",
        "Real-time preview",
        "Pre-built templates",
        "Custom logic blocks"
      ],
    },
    {
      icon: Shield,
      title: "Advanced Moderation",
      description: "Keep your community safe with AI-powered moderation tools and automated protection systems.",
      gradient: "from-red-500 to-pink-600",
      interactive: true,
      features: [
        "AI spam detection",
        "Auto-moderation rules",
        "Member screening",
        "Audit logging"
      ],
    },
    {
      icon: Users,
      title: "Member Management",
      description: "Streamline member onboarding and management with automated role assignment and welcome systems.",
      gradient: "from-orange-500 to-red-600",
      features: [
        "Auto role assignment",
        "Welcome messages",
        "Member analytics",
        "Permission management"
      ],
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Get deep insights into your community with comprehensive analytics and reporting tools.",
      gradient: "from-green-500 to-teal-600",
      features: [
        "Real-time metrics",
        "Growth tracking",
        "Engagement analysis",
        "Custom reports"
      ],
    },
    {
      icon: Palette,
      title: "Custom Branding",
      description: "Make your bot truly yours with custom themes, colors, and personalized experiences.",
      gradient: "from-purple-500 to-indigo-600",
      features: [
        "Custom themes",
        "Brand colors",
        "Logo integration",
        "White-label options"
      ],
    },
    {
      icon: Rocket,
      title: "Easy Deployment",
      description: "Deploy your bot instantly with one-click deployment and automatic scaling capabilities.",
      gradient: "from-yellow-500 to-orange-600",
      features: [
        "One-click deploy",
        "Auto-scaling",
        "99.9% uptime",
        "Global CDN"
      ],
    },
  ]

  return (
    <div className="bg-discord-dark overflow-hidden font-minecraft min-h-screen" ref={containerRef}>
      {/* Enhanced Atmospheric Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black" />
        <motion.div className="absolute inset-0 bg-grid-pattern opacity-5" style={{ y }} />
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />
        
        {/* Additional atmospheric elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-discord-blurple/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <AnimatedHeader />
      <Hero1 />

      {/* Enhanced Features Section */}
      <section className="relative py-32 bg-discord-darker/50">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 mb-6 px-6 py-3 text-lg font-bold">
              <Sparkles className="mr-2 h-5 w-5" />
              Powerful Features
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-discord-blurple to-purple-400 bg-clip-text text-transparent">
                Build Amazing Communities
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-discord-text max-w-4xl mx-auto leading-relaxed">
              From visual command building to advanced analytics, Spatium provides all the tools you need to create 
              engaging Discord experiences that your community will love.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <InteractiveFeatureCard 
                key={feature.title} 
                {...feature} 
                delay={index * 0.1} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Enhanced Feature Showcase Section */}
      <section className="relative py-32 bg-discord-dark">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-6 px-4 py-2">
                <Code className="mr-2 h-4 w-4" />
                Visual Builder
              </Badge>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                Build Complex Commands with
                <br />
                <span className="text-discord-blurple glow-text">Simple Drag & Drop</span>
              </h3>
              <p className="text-discord-text text-xl mb-10 leading-relaxed">
                Our revolutionary visual interface lets you create sophisticated bot commands without writing a single line
                of code. Connect blocks, set conditions, and deploy instantly to your Discord server.
              </p>
              <div className="space-y-4">
                {[
                  "Intuitive drag-and-drop interface",
                  "200+ pre-built command blocks",
                  "Real-time preview and testing",
                  "One-click deployment to Discord",
                  "Advanced logic and conditions",
                  "Custom variable management",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-discord-green to-teal-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                className="mt-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SignedIn>
                  <Link href="/servers">
                    <Button className="bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                      Try Builder Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button className="bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                      Try Builder Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </SignInButton>
                </SignedOut>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-discord-darker to-discord-dark rounded-3xl p-10 border border-discord-border shadow-2xl backdrop-blur-sm">
                <div className="bg-discord-dark rounded-2xl p-8 mb-6 border border-discord-border/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="ml-4 text-discord-text text-sm">Command Builder</span>
                  </div>
                  <div className="space-y-4">
                    <motion.div 
                      className="flex items-center gap-4 p-4 bg-discord-blurple/20 rounded-xl border border-discord-blurple/30"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="w-10 h-10 bg-discord-blurple rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-medium">Send Message Block</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-4 p-4 bg-green-500/20 rounded-xl border border-green-500/30 ml-8"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-medium">Add Role Block</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-4 p-4 bg-purple-500/20 rounded-xl border border-purple-500/30 ml-16"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-medium">Condition Block</span>
                    </motion.div>
                  </div>
                </div>
                <div className="text-center">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Command Ready for Deployment
                  </Badge>
                </div>
              </div>
              
              {/* Floating elements for visual appeal */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-discord-blurple to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Analytics showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 relative"
            >
              <div className="bg-gradient-to-br from-discord-darker to-discord-dark rounded-3xl p-10 border border-discord-border shadow-2xl backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-discord-dark rounded-2xl p-6 border border-discord-border/50">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="text-white text-sm font-medium">Active Users</span>
                    </div>
                    <div className="text-3xl font-black text-green-500">
                      <AnimatedCounter end={12470} />
                    </div>
                    <p className="text-xs text-discord-text mt-2">+12% this week</p>
                  </div>
                  <div className="bg-discord-dark rounded-2xl p-6 border border-discord-border/50">
                    <div className="flex items-center gap-3 mb-4">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <span className="text-white text-sm font-medium">Messages</span>
                    </div>
                    <div className="text-3xl font-black text-blue-500">
                      <AnimatedCounter end={89340} />
                    </div>
                    <p className="text-xs text-discord-text mt-2">+8% this week</p>
                  </div>
                </div>
                <div className="h-40 bg-discord-dark rounded-2xl flex items-end justify-between p-6 border border-discord-border/50">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-t from-discord-blurple to-purple-500 w-4 rounded-t-lg shadow-lg"
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
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-6 px-4 py-2">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Badge>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                Understand Your Community with
                <br />
                <span className="text-discord-green glow-text">Powerful Insights</span>
              </h3>
              <p className="text-discord-text text-xl mb-10 leading-relaxed">
                Get detailed analytics about your server activity, member engagement, and growth trends. 
                Make data-driven decisions to improve your community and boost engagement.
              </p>
              <div className="space-y-4">
                {[
                  "Real-time member activity tracking",
                  "Message and engagement metrics",
                  "Growth trend analysis and forecasting",
                  "Custom report generation",
                  "Export data in multiple formats",
                  "Advanced filtering and segmentation",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-discord-green to-teal-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Enhanced Velocity Scroll */}
      <div className="py-20">
        <VelocityScroll 
          default_velocity={3} 
          text="SPATIUM • DISCORD • AUTOMATION • COMMUNITY • " 
          className="text-8xl md:text-9xl font-black opacity-10" 
        />
      </div>

      {/* Enhanced CTA Section */}
      <section className="relative py-32 min-h-screen flex items-center justify-center bg-discord-darker">
        <StaticNoise opacity={0.05} />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 mb-8 px-6 py-3 text-lg font-bold">
              <Crown className="mr-2 h-5 w-5" />
              Ready to Get Started?
            </Badge>

            <h2 className="text-6xl md:text-9xl font-black text-white mb-10 leading-tight">
              READY TO
              <br />
              <span className="bg-gradient-to-r from-discord-blurple via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text">
                TRANSFORM
              </span>
              <br />
              YOUR SERVER?
            </h2>
            
            <p className="text-xl md:text-2xl text-discord-text mb-16 max-w-3xl mx-auto leading-relaxed">
              Start building amazing Discord experiences today with Spatium's powerful visual tools, 
              advanced analytics, and comprehensive moderation features.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16">
              <SignedOut>
                <SignInButton mode="modal">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button className="bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-12 py-6 rounded-2xl text-xl shadow-2xl hover:shadow-discord-blurple/30 transition-all duration-300">
                      START BUILDING NOW
                      <Sparkles className="ml-3 h-6 w-6" />
                    </Button>
                  </motion.div>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link href="/servers">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button className="bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple-hover hover:to-purple-700 text-white font-bold px-12 py-6 rounded-2xl text-xl shadow-2xl hover:shadow-discord-blurple/30 transition-all duration-300">
                      GO TO DASHBOARD
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                  </motion.div>
                </Link>
              </SignedIn>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button variant="outline" className="discord-button-outline text-xl px-12 py-6 rounded-2xl border-2">
                  VIEW DOCUMENTATION
                  <Globe className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {[
                { icon: Shield, text: "Enterprise Security" },
                { icon: Cloud, text: "99.9% Uptime" },
                { icon: Users, text: "24/7 Support" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-center gap-3 text-discord-text">
                  <item.icon className="w-5 h-5 text-discord-blurple" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        <CurvedLoop
          marqueeText="Be ✦ Creative ✦ With ✦ Spatium ✦ Transform ✦ Your ✦ Discord ✦"
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