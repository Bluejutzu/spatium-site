"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Star, Zap, Shield, Users, Bot, Check } from "lucide-react"

export default function PremiumPage({ params }: { params: { serverId: string } }) {
  const serverSettings = useQuery(api.serverSettings.getServerSettings, {
    serverId: params.serverId
  })

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Basic bot commands",
        "Standard moderation",
        "1 server",
        "Community support",
      ],
      current: true,
      popular: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "month",
      features: [
        "Advanced bot commands",
        "Enhanced moderation",
        "Unlimited servers",
        "Priority support",
        "Custom welcome messages",
        "Advanced analytics",
        "Webhook integrations",
      ],
      current: false,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$29.99",
      period: "month",
      features: [
        "Everything in Pro",
        "Custom bot development",
        "Dedicated support",
        "Advanced integrations",
        "Custom branding",
        "API access",
        "White-label options",
      ],
      current: false,
      popular: false,
    },
  ]

  const premiumFeatures = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Advanced Commands",
      description: "Create custom commands with complex logic and integrations",
      available: true,
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: "Enhanced Moderation",
      description: "AI-powered spam detection and advanced moderation tools",
      available: true,
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "Member Management",
      description: "Advanced member tracking, roles, and permission management",
      available: true,
    },
    {
      icon: <Bot className="h-6 w-6 text-purple-500" />,
      title: "Custom Bot Features",
      description: "Build and deploy custom bot functionality",
      available: false,
    },
    {
      icon: <Star className="h-6 w-6 text-pink-500" />,
      title: "Premium Support",
      description: "24/7 priority support with dedicated team",
      available: false,
    },
    {
      icon: <Crown className="h-6 w-6 text-yellow-500" />,
      title: "Custom Branding",
      description: "Remove branding and add your own custom styling",
      available: false,
    },
  ]

  if (!serverSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-discord-text">Loading premium features...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Premium</h1>
        <p className="text-discord-text">Unlock advanced features and capabilities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Current Plan</CardTitle>
            <Crown className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Free</div>
            <p className="text-xs text-discord-text">Basic features</p>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Premium Features</CardTitle>
            <Star className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3/6</div>
            <p className="text-xs text-discord-text">Available features</p>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-discord-text">Next Billing</CardTitle>
            <Zap className="h-4 w-4 text-discord-text" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">-</div>
            <p className="text-xs text-discord-text">No active subscription</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`bg-discord-darker border-discord-border relative ${
              plan.popular ? 'ring-2 ring-discord-blurple' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-discord-blurple text-white">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {plan.name === "Pro" && <Crown className="h-5 w-5 text-yellow-500" />}
                {plan.name}
              </CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-discord-text">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-discord-text text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.current
                    ? 'bg-discord-dark border-discord-border text-discord-text'
                    : 'bg-discord-blurple hover:bg-discord-blurple/80'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-discord-darker border-discord-border">
        <CardHeader>
          <CardTitle className="text-white">Premium Features</CardTitle>
          <CardDescription className="text-discord-text">
            Explore what's available with premium plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature) => (
              <div
                key={feature.title}
                className={`p-4 rounded-lg border ${
                  feature.available
                    ? 'bg-discord-dark border-discord-border'
                    : 'bg-discord-dark/50 border-discord-border/30 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  {feature.icon}
                  <div>
                    <h3 className="font-medium text-white">{feature.title}</h3>
                    <p className="text-sm text-discord-text mt-1">
                      {feature.description}
                    </p>
                    <Badge
                      className={`mt-2 ${
                        feature.available
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-discord-blurple/20 text-discord-text border-discord-blurple/30'
                      }`}
                    >
                      {feature.available ? 'Available' : 'Premium Only'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white">Usage Statistics</CardTitle>
            <CardDescription className="text-discord-text">
              Your current usage and limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-discord-text">Commands Used:</span>
              <span className="text-white font-medium">0 / 5,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-discord-text">Webhooks:</span>
              <span className="text-white font-medium">0 / 5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-discord-text">Custom Commands:</span>
              <span className="text-white font-medium">0 / 10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-discord-text">API Requests:</span>
              <span className="text-white font-medium">0 / 50,000</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-discord-darker border-discord-border">
          <CardHeader>
            <CardTitle className="text-white">Billing & Subscription</CardTitle>
            <CardDescription className="text-discord-text">
              Manage your subscription and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-discord-text">Current Plan:</span>
              <span className="text-white font-medium">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-discord-text">Next Billing:</span>
              <span className="text-white font-medium">-</span>
            </div>
            <div className="flex justify-between">
              <span className="text-discord-text">Payment Method:</span>
              <span className="text-white font-medium">None</span>
            </div>
            <div className="flex justify-between">
              <span className="text-discord-text">Status:</span>
              <span className="text-green-500 font-medium">Active</span>
            </div>
            <div className="pt-4 space-y-2">
              <Button className="w-full bg-discord-blurple hover:bg-discord-blurple/80">
                Upgrade to Pro
              </Button>
              <Button variant="outline" className="w-full border-discord-border text-discord-text hover:bg-discord-blurple/10">
                View Billing History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
