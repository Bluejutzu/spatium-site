"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { ModerationContent } from "@/components/dashboard/moderation-content"
import { MembersContent } from "@/components/dashboard/members-content"
import { SidebarProvider } from "@/components/ui/sidebar"

export type DashboardSection =
  | "dashboard"
  | "moderation"
  | "members"
  | "bot-management"
  | "server-management"
  | "features"
  | "integrations"
  | "commands"
  | "permissions"
  | "status"
  | "auto-mod"
  | "warnings"
  | "bans-kicks"
  | "audit-log"
  | "roles"
  | "channels"
  | "invites"
  | "welcome"
  | "reaction-roles"
  | "auto-voice"
  | "leveling"
  | "webhooks"
  | "api"
  | "external"
  | "settings"
  | "premium"

export default function DashboardPage() {
  const params = useParams<{ serverId: string }>()
  const [activeSection, setActiveSection] = useState<DashboardSection>("dashboard")
  const [selectedServerId, setSelectedServerId] = useState<string>(params.serverId)

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardContent serverId={selectedServerId} />
      case "moderation":
        return <ModerationContent serverId={selectedServerId} />
      case "members":
        return <MembersContent serverId={selectedServerId} />
      default:
        return <DashboardContent serverId={selectedServerId} />
    }
  }

  return (
    <div className="bg-discord-dark min-h-screen font-minecraft">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />
      </div>

      <SidebarProvider>
        <div className="relative z-10 flex min-h-screen w-full">
          <DashboardSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            selectedServerId={selectedServerId}
            onServerChange={setSelectedServerId}
          />
          <main className="flex-1 overflow-hidden">{renderContent()}</main>
        </div>
      </SidebarProvider>
    </div>
  )
}
