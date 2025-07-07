// Comprehensive subscription management utilities
// This handles all subscription-related database operations and business logic

export interface UserSubscription {
    id: string
    userId: string
    subscriptionId: string
    planId: string
    status: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
    lastPaymentAt?: Date
    lastFailedPaymentAt?: Date
    planName: string
    createdAt: Date
    updatedAt: Date
}

export interface CreateSubscriptionData {
    userId: string
    subscriptionId: string
    planId: string
    status: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
}

export interface UpdateSubscriptionData {
    subscriptionId?: string
    planId?: string
    status?: string
    currentPeriodStart?: Date
    currentPeriodEnd?: Date
    cancelAtPeriodEnd?: boolean
    lastPaymentAt?: Date
    lastFailedPaymentAt?: Date
}

// In-memory storage for demo (replace with your database)
const subscriptions = new Map<string, UserSubscription>()
const userRoles = new Map<string, string>()

/**
 * Create a new user subscription
 * Called when a user successfully subscribes to a plan
 */
export async function createUserSubscription(data: CreateSubscriptionData): Promise<UserSubscription> {
    const subscription: UserSubscription = {
        id: `sub_${Date.now()}`,
        ...data,
        planName: getPlanName(data.planId),
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    subscriptions.set(data.userId, subscription)
    console.log(`✅ Created subscription for user ${data.userId}:`, subscription)

    return subscription
}

/**
 * Get user's current subscription
 * Returns null if user has no active subscription (free tier)
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
    const subscription = subscriptions.get(userId)
    return subscription || null
}

/**
 * Update user's subscription
 * Used for plan changes, status updates, and billing cycle changes
 */
export async function updateUserSubscription(
    userId: string,
    updates: UpdateSubscriptionData,
): Promise<UserSubscription | null> {
    const existing = subscriptions.get(userId)
    if (!existing) {
        console.warn(`⚠️ No subscription found for user ${userId}`)
        return null
    }

    const updated: UserSubscription = {
        ...existing,
        ...updates,
        planName: updates.planId ? getPlanName(updates.planId) : existing.planName,
        updatedAt: new Date(),
    }

    subscriptions.set(userId, updated)
    console.log(`✅ Updated subscription for user ${userId}:`, updated)

    return updated
}

/**
 * Delete user's subscription
 * Called when subscription is cancelled or deleted
 */
export async function deleteUserSubscription(userId: string): Promise<boolean> {
    const deleted = subscriptions.delete(userId)
    if (deleted) {
        console.log(`✅ Deleted subscription for user ${userId}`)
    }
    return deleted
}

/**
 * Update user's role based on their subscription plan
 * This affects what features they can access in your application
 */
export async function updateUserRole(userId: string, planId: string): Promise<void> {
    const role = planId === "premium" ? "premium_user" : "free_user"
    userRoles.set(userId, role)

    console.log(`✅ Updated role for user ${userId}: ${role}`)

    // In a real app, you might also update the user's role in Clerk
    // await clerkClient.users.updateUser(userId, { publicMetadata: { role } })
}

/**
 * Sync user access permissions based on subscription status
 * This is the core function that determines what features a user can access
 */
export async function syncUserAccess(userId: string, planId: string, status: string): Promise<void> {
    const limits = getPlanLimits(planId)
    const isActive = status === "active" || status === "trialing"

    // Store user's current access level
    const accessLevel = {
        userId,
        planId,
        status,
        isActive,
        limits,
        syncedAt: new Date(),
    }

    console.log(`✅ Synced access for user ${userId}:`, accessLevel)
}

// Plan configuration and limits
export const PLAN_LIMITS = {
    starter: {
        maxServers: 3,
        maxCommands: 5,
        dataRetentionDays: 30,
        hasAdvancedAnalytics: false,
        hasPrioritySupport: false,
        hasCustomIntegrations: false,
        hasApiAccess: false,
        hasWhiteLabel: false,
        monthlyApiCalls: 1000,
        storageGB: 1,
    },
    premium: {
        maxServers: 25,
        maxCommands: -1, // unlimited
        dataRetentionDays: 365,
        hasAdvancedAnalytics: true,
        hasPrioritySupport: true,
        hasCustomIntegrations: true,
        hasApiAccess: true,
        hasWhiteLabel: false,
        monthlyApiCalls: 50000,
        storageGB: 100,
    },
}

/**
 * Get plan limits for a specific plan
 */
export function getPlanLimits(planId: string) {
    return PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.starter
}

/**
 * Get human-readable plan name
 */
export function getPlanName(planId: string): string {
    const names = {
        starter: "Starter",
        premium: "Premium",
    }
    return names[planId as keyof typeof names] || "Unknown"
}

/**
 * Check if user has access to a specific feature
 */
export function hasFeatureAccess(subscription: UserSubscription | null, feature: string): boolean {
    if (!subscription || subscription.status !== "active") {
        // Free tier access
        const freeLimits = PLAN_LIMITS.starter
        return (freeLimits as any)[feature] === true
    }

    const limits = getPlanLimits(subscription.planId)
    return (limits as any)[feature] === true
}

/**
 * Check if user is within usage limits
 */
export function isWithinUsageLimit(subscription: UserSubscription | null, usage: number, limitType: string): boolean {
    const limits =
        subscription && subscription.status === "active" ? getPlanLimits(subscription.planId) : PLAN_LIMITS.starter

    const limit = (limits as any)[limitType]

    // -1 means unlimited
    if (limit === -1) return true

    return usage <= limit
}

/**
 * Get user's current usage statistics
 * This would typically query your database for actual usage
 */
export async function getUserUsage(userId: string) {
    // Mock usage data - replace with actual database queries
    return {
        servers: 2,
        commands: 3,
        apiCalls: 150,
        storageUsed: 0.5, // GB
        lastUpdated: new Date(),
    }
}

/**
 * Get subscription status for display
 */
export function getSubscriptionStatus(subscription: UserSubscription | null): {
    status: string
    displayText: string
    color: string
    isActive: boolean
} {
    if (!subscription) {
        return {
            status: "free",
            displayText: "Free Plan",
            color: "green",
            isActive: true,
        }
    }

    switch (subscription.status) {
        case "active":
            return {
                status: "active",
                displayText: subscription.cancelAtPeriodEnd ? "Cancelling" : "Active",
                color: subscription.cancelAtPeriodEnd ? "yellow" : "green",
                isActive: true,
            }
        case "trialing":
            return {
                status: "trialing",
                displayText: "Trial",
                color: "blue",
                isActive: true,
            }
        case "past_due":
            return {
                status: "past_due",
                displayText: "Payment Due",
                color: "red",
                isActive: false,
            }
        case "cancelled":
            return {
                status: "cancelled",
                displayText: "Cancelled",
                color: "gray",
                isActive: false,
            }
        default:
            return {
                status: "unknown",
                displayText: "Unknown",
                color: "gray",
                isActive: false,
            }
    }
}
