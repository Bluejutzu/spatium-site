"use client"

import React from "react"
import CommandFlowBuilder from "./CommandFlowBuilder"

function isPromise<T>(value: any): value is Promise<T> {
  return value && typeof value.then === "function"
}

export default function CommandBuilderPage({ params }: any) {
  const unwrappedParams = isPromise<{ serverId: string }>(params) ? React.use(params) : params
  const serverId = unwrappedParams?.serverId || ""

  return (
    <div className="bg-discord-darker min-h-screen">
      <CommandFlowBuilder serverId={serverId} />
    </div>
  )
}
