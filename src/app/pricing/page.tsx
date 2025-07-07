"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, X, Crown, Sparkles, Shield, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedHeader } from "@/components/app/header"
import { DiscordFooter } from "@/components/app/footer"
import { toast } from "sonner"
import { randomInt } from "crypto"

interface FeatureTooltipProps {
  title: string
  description: string
  isOpen: boolean
  onClose: () => void
}

interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  planName: string
}

interface PricingPlan {
  id: string
  name: string
  subtitle: string
  price: string
  period: string
  description: string
  cta: string
  ctaVariant: "default" | "outline"
  popular: boolean
  accent: string
  icon: any
  features: Array<{ name: string; included: boolean }>
}

function FeatureTooltip({ title, description, isOpen, onClose }: FeatureTooltipProps) {
  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Card className="relative z-10 max-w-lg w-full discord-card border-2 border-discord-blurple/50">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-discord-blurple/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-discord-blurple" />
                </div>
                <h3 className="text-xl font-bold text-white font-minecraft">{title}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 hover:bg-white/10 text-discord-text hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-discord-text leading-relaxed">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

const featureExplanations = {
  "Advanced analytics": {
    title: "Advanced Analytics",
    description:
      "Get comprehensive insights into your community's engagement patterns, growth metrics, member activity heatmaps, and bot performance analytics with real-time monitoring.",
  },
  "Custom integrations": {
    title: "Custom Integrations",
    description:
      "Connect Spatium with external services, APIs, and tools. Build custom workflows and automate complex processes across your tech stack.",
  },
  "White-label solution": {
    title: "White-label Solution",
    description:
      "Completely customize the dashboard with your branding, colors, logo, and custom domain. Remove all references to our platform for a seamless brand experience.",
  },
}

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "STARTER",
    subtitle: "For small communities",
    price: "$0",
    period: "FOREVER",
    description: "Everything you need to get started with your Discord community",
    cta: "GET STARTED",
    ctaVariant: "outline",
    popular: false,
    accent: "discord-green",
    icon: Shield,
    features: [
      { name: "Up to 3 servers", included: true },
      { name: "Basic analytics", included: true },
      { name: "5 custom commands", included: true },
      { name: "Community support", included: true },
      { name: "Basic moderation", included: true },
      { name: "30-day data retention", included: true },
      { name: "Advanced analytics", included: false },
      { name: "Priority support", included: false },
      { name: "Custom integrations", included: false },
    ],
  },
  {
    id: "premium",
    name: "PREMIUM",
    subtitle: "For growing communities",
    price: "$9.99",
    period: "PER MONTH",
    description: "Advanced features and priority support for serious community builders",
    cta: "UPGRADE NOW",
    ctaVariant: "default",
    popular: true,
    accent: "discord-blurple",
    icon: Crown,
    features: [
      { name: "Up to 25 servers", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Unlimited commands", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced moderation", included: true },
      { name: "1-year data retention", included: true },
      { name: "Custom integrations", included: true },
      { name: "API access", included: true },
      { name: "White-label branding", included: false },
    ],
  },
]

export default function PricingPage() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscriptionLoading, setSubscriptionLoading] = useState<string | null>(null)
  const { user, isLoaded } = useUser()

  // Fetch user's current subscription status
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      // Simulate 5-second loading
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock subscription data for demonstration
      setUserSubscription({
        id: "mock-sub",
        userId: user.id,
        planId: "starter",
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        cancelAtPeriodEnd: false,
        planName: "STARTER"
      })
      
      setLoading(false)
    }

    if (isLoaded) {
      fetchSubscription()
    }
  }, [user, isLoaded])

  const handleFeatureClick = (featureName: string) => {
    if (featureExplanations[featureName as keyof typeof featureExplanations]) {
      setActiveTooltip(featureName)
    }
  }

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe")
      return
    }

    if (userSubscription?.planId === planId && userSubscription?.status === "active") {
      toast.info("You're already subscribed to this plan")
      return
    }

    setSubscriptionLoading(planId)

    try {
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.checkoutUrl) {
          // Redirect to Clerk's checkout page
          window.location.href = data.checkoutUrl
        } else {
          // Free plan activation
          setUserSubscription(data.subscription)
          toast.success("Plan activated successfully!")
        }
      } else {
        throw new Error(data.error || "Failed to create subscription")
      }
    } catch (error) {
      console.error("Subscription error:", error)
      toast.error("Failed to process subscription. Please try again.")
    } finally {
      setSubscriptionLoading(null)
    }
  }

  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/subscription/manage", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok && data.portalUrl) {
        window.location.href = data.portalUrl
      } else {
        throw new Error(data.error || "Failed to open customer portal")
      }
    } catch (error) {
      console.error("Portal error:", error)
      toast.error("Failed to open subscription management")
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveTooltip(null)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  if (!isLoaded || loading) {
    return (
      <div className="bg-discord-dark font-minecraft min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="h-6 w-6 animate-spin text-discord-blurple" />
          <span className="text-xl">Loading pricing...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-discord-dark font-minecraft">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />
      </div>

      <AnimatedHeader showNavigation={false} />

      {/* Hero Section */}
      <section className="relative py-32 pt-40 min-h-screen flex items-center justify-center">
        <div className="relative container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Badge className="mb-8 bg-discord-yellow/20 text-discord-yellow border-discord-yellow/30 px-4 py-2 font-bold">
              <AlertCircle className="mr-2 h-4 w-4" />
              SERVICE UPDATE
            </Badge>

            <h1 className="text-6xl md:text-8xl font-black mb-8 text-white leading-tight tracking-tight">
              <span className="block mb-4">PRICING</span>
              <span className="block text-discord-yellow glow-text">UNAVAILABLE</span>
            </h1>

            <p className="text-xl md:text-2xl text-discord-text max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
              We're currently updating our billing system to serve you better.
              <span className="text-white font-bold"> Pricing and subscriptions are temporarily disabled</span> while we
              make improvements.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Badge className="bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30 px-6 py-3 font-bold text-lg">
                <Star className="mr-2 h-5 w-5" />
                ALL FEATURES REMAIN FREE DURING MAINTENANCE
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12"
            >
              <p className="text-discord-text text-lg">
                Thank you for your patience. We'll be back soon with exciting new plans!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <DiscordFooter />
    </div>
  )
}
