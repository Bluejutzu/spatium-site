import { auth } from "@clerk/nextjs/server"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { planId } = await req.json()

        if (!planId) {
            return Response.json({ error: "Plan ID is required" }, { status: 400 })
        }

        // Handle free plan
        if (planId === "starter") {
            // Create free subscription record
            const subscription = {
                id: `sub_${Date.now()}`,
                userId,
                planId: "starter",
                status: "active",
                planName: "Starter",
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
                cancelAtPeriodEnd: false,
            }

            // In a real app, save to database
            console.log("Created free subscription:", subscription)

            return Response.json({ subscription })
        }

        // For paid plans, create Clerk checkout session
        const checkoutUrl = await createClerkCheckoutSession(userId, planId)

        return Response.json({ checkoutUrl })
    } catch (error) {
        console.error("Error creating subscription:", error)
        return Response.json({ error: "Internal server error" }, { status: 500 })
    }
}

async function createClerkCheckoutSession(userId: string, planId: string): Promise<string> {
    // This would integrate with Clerk's billing API
    // For now, we'll return a mock checkout URL

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // In a real implementation, you would:
    // 1. Call Clerk's API to create a checkout session
    // 2. Pass the user ID and plan ID
    // 3. Set success/cancel URLs
    // 4. Return the checkout URL from Clerk

    const mockCheckoutUrl = `${baseUrl}/checkout?plan=${planId}&user=${userId}`

    console.log(`Creating checkout session for user ${userId}, plan ${planId}`)

    // Mock implementation - replace with actual Clerk API call
    return mockCheckoutUrl
}
