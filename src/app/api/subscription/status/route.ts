import { auth } from "@clerk/nextjs/server"
import { getUserSubscription, getSubscriptionStatus, getUserUsage } from "@/lib/subscription"

export async function GET() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get user's subscription
        const subscription = await getUserSubscription(userId)

        // Get subscription status for display
        const status = getSubscriptionStatus(subscription)

        // Get user's current usage
        const usage = await getUserUsage(userId)

        return Response.json({
            subscription: subscription || {
                planId: "starter",
                planName: "Starter",
                ...status,
            },
            status,
            usage,
        })
    } catch (error) {
        console.error("Error fetching subscription status:", error)
        return Response.json({ error: "Internal server error" }, { status: 500 })
    }
}
