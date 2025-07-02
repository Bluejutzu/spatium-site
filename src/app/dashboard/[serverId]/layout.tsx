"use client"

import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useParams } from "next/navigation"
import { FloatingSidebar } from "@/components/app/floating-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const serverId =
    typeof params.serverId === "string"
      ? params.serverId
      : Array.isArray(params.serverId)
        ? params.serverId[0]
        : undefined

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
          <div className="flex-1 flex flex-col">
            <FloatingSidebar />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
