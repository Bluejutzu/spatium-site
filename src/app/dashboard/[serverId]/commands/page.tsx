"use client"

import React, { useState, useEffect } from "react"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { CSSProperties } from "react"
import { CSS } from "@dnd-kit/utilities"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { motion } from "framer-motion"
import {
  MessageSquare,
  ImageIcon,
  Shield,
  Flag,
  GitBranch,
  Plus,
  Save,
  Settings,
  Trash2,
  GripVertical,
  Zap,
  Crown,
  Bot,
  Hash,
  Eye,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Command,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FloatingHeader } from "@/components/app/floating-header"
import { FloatingSidebar } from "@/components/app/floating-sidebar"

interface BlockType {
  type: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  category: string
  accent: string
}

interface Branch {
  id: number;
  label: string; // e.g. "If", "Else If", "Else"
  condition?: Record<string, any>; // Only for "if"/"else if"
  blocks: Block[];
}

interface Block extends BlockType {
  id: number
  config?: Record<string, any>
  branches?: Branch[]
}

const BLOCK_CATEGORIES = [
  { id: "triggers", label: "TRIGGERS", description: "Events that start commands" },
  { id: "actions", label: "ACTIONS", description: "Things the bot will do" },
  { id: "logic", label: "LOGIC", description: "Control flow and conditions" },
  { id: "utilities", label: "UTILITIES", description: "Helper functions" },
]

const BLOCK_TYPES: BlockType[] = [
  {
    type: "event",
    label: "Event Trigger",
    icon: Zap,
    description: "Trigger when specific events occur",
    category: "triggers",
    accent: "discord-yellow",
  },
  {
    type: "condition",
    label: "Condition",
    icon: GitBranch,
    description: "Check if conditions are met",
    category: "logic",
    accent: "discord-purple",
  },
  {
    type: "message",
    label: "Send Message",
    icon: MessageSquare,
    description: "Send a message to a channel",
    category: "actions",
    accent: "discord-blurple",
  },
  {
    type: "embed",
    label: "Rich Embed",
    icon: ImageIcon,
    description: "Send a rich embed message",
    category: "actions",
    accent: "discord-green",
  },
  {
    type: "role",
    label: "Role Assignment",
    icon: Crown,
    description: "Assign or remove roles from users",
    category: "actions",
    accent: "discord-orange",
  },
  {
    type: "flag",
    label: "Message Flags",
    icon: Flag,
    description: "Set message flags and properties",
    category: "utilities",
    accent: "discord-red",
  },
]

function BlockItem({
  block,
  onRemove,
  onClick,
  isDragging,
}: {
  block: Block
  onRemove: () => void
  onClick: () => void
  isDragging?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const IconComponent = block.icon

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="group relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="discord-card border-2 border-white/10 hover:border-discord-border-hover transition-all duration-300 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Drag Handle */}
            <div
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <GripVertical className="h-4 w-4 text-discord-text" />
            </div>

            {/* Block Icon */}
            <motion.div
              className={`p-3 rounded-xl bg-${block.accent}/20 border border-${block.accent}/30`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <IconComponent className={`h-5 w-5 text-${block.accent}`} />
            </motion.div>

            {/* Block Info */}
            <div className="flex-1 min-w-0" onClick={onClick}>
              <h3 className="font-bold text-white text-lg tracking-wide font-minecraft">{block.label}</h3>
              <p className="text-discord-text text-sm">{block.description}</p>
              {block.config && Object.keys(block.config).length > 0 && (
                <Badge className="mt-2 bg-discord-green/20 text-discord-green border-discord-green/30">
                  <Settings className="mr-1 h-3 w-3" />
                  CONFIGURED
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={onClick}
                className="text-discord-text hover:text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function BlockConfigModal({
  block,
  open,
  onClose,
  onSave,
}: {
  block: Block | null
  open: boolean
  onClose: () => void
  onSave: (config: Record<string, any>) => void
}) {
  const [config, setConfig] = useState<Record<string, any>>(block?.config || {})
  const [roles, setRoles] = useState<{ id: string; name: string; permissions: string }[]>([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [rolesError, setRolesError] = useState<string | null>(null)
  const [editingBranchBlock, setEditingBranchBlock] = useState<null | { branchId: number, blockIdx: number, block: Block }>(null)

  useEffect(() => {
    setConfig(block?.config || {})
  }, [block])

  // Fetch roles when Role block config is opened
  useEffect(() => {
    if (open && block?.type === "role") {
      setRolesLoading(true)
      setRolesError(null)
      const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : ""
      fetch(`/api/discord/roles?serverId=${block.config?.serverId || ""}&userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setRoles(data)
          else setRolesError(data.error || "Failed to fetch roles")
        })
        .catch((err) => setRolesError(err.message))
        .finally(() => setRolesLoading(false))
    }
  }, [open, block])

  if (!open || !block) return null

  const IconComponent = block.icon

  const renderConfigContent = () => {
    switch (block.type) {
      case "message":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-white font-bold text-lg flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-discord-blurple" />
                MESSAGE CONTENT
              </Label>
              <Textarea
                className="bg-white/5 border-white/20 text-white placeholder:text-discord-text min-h-[120px] text-lg"
                value={config.content || ""}
                onChange={(e) => setConfig({ ...config, content: e.target.value })}
                placeholder="Enter the message to send..."
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-discord-green" />
                <div>
                  <Label className="text-white font-bold">TEXT-TO-SPEECH</Label>
                  <p className="text-discord-text text-sm">Enable TTS for this message</p>
                </div>
              </div>
              <Switch checked={!!config.tts} onCheckedChange={(checked) => setConfig({ ...config, tts: checked })} />
            </div>

            <div className="space-y-3">
              <Label className="text-white font-bold text-lg">MESSAGE FLAGS</Label>
              <Input
                className="bg-white/5 border-white/20 text-white placeholder:text-discord-text h-12 text-lg"
                value={config.flags || ""}
                onChange={(e) => setConfig({ ...config, flags: e.target.value })}
                placeholder="e.g. SUPPRESS_EMBEDS, EPHEMERAL"
              />
              <p className="text-sm text-discord-text">Comma-separated Discord message flags</p>
            </div>
          </div>
        )

      case "embed":
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-white font-bold">EMBED TITLE</Label>
                <Input
                  className="bg-white/5 border-white/20 text-white placeholder:text-discord-text h-12"
                  value={config.title || ""}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="Embed title..."
                />
              </div>
              <div className="space-y-3">
                <Label className="text-white font-bold">EMBED COLOR</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    className="w-12 h-12 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                    value={config.color || "#5865F2"}
                    onChange={(e) => setConfig({ ...config, color: e.target.value })}
                  />
                  <Input
                    className="bg-white/5 border-white/20 text-white placeholder:text-discord-text h-12"
                    value={config.color || "#5865F2"}
                    onChange={(e) => setConfig({ ...config, color: e.target.value })}
                    placeholder="#5865F2"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-white font-bold">DESCRIPTION</Label>
              <Textarea
                className="bg-white/5 border-white/20 text-white placeholder:text-discord-text min-h-[120px]"
                value={config.description || ""}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder="Embed description..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-white font-bold">AUTHOR NAME</Label>
                <Input
                  className="bg-white/5 border-white/20 text-white placeholder:text-discord-text h-12"
                  value={config.author || ""}
                  onChange={(e) => setConfig({ ...config, author: e.target.value })}
                  placeholder="Author name..."
                />
              </div>
              <div className="space-y-3">
                <Label className="text-white font-bold">FOOTER TEXT</Label>
                <Input
                  className="bg-white/5 border-white/20 text-white placeholder:text-discord-text h-12"
                  value={config.footer || ""}
                  onChange={(e) => setConfig({ ...config, footer: e.target.value })}
                  placeholder="Footer text..."
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-white font-bold">IMAGE URL</Label>
                <Input
                  className="bg-white/5 border-white/20 text-white placeholder:text-discord-text h-12"
                  value={config.image || ""}
                  onChange={(e) => setConfig({ ...config, image: e.target.value })}
                  placeholder="https://example.com/image.png"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-white font-bold">THUMBNAIL URL</Label>
                <Input
                  className="bg-white/5 border-white/20 text-white placeholder:text-discord-text h-12"
                  value={config.thumbnail || ""}
                  onChange={(e) => setConfig({ ...config, thumbnail: e.target.value })}
                  placeholder="https://example.com/thumb.png"
                />
              </div>
            </div>
          </div>
        )

      case "role":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-white font-bold text-lg flex items-center gap-2">
                <Crown className="h-4 w-4 text-discord-orange" />
                ROLE TO ASSIGN
              </Label>
              {rolesLoading ? (
                <div className="flex items-center gap-2 p-4 bg-white/5 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-discord-blurple"></div>
                  <span className="text-discord-text">Loading roles...</span>
                </div>
              ) : rolesError ? (
                <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-lg">
                  <Flag className="h-4 w-4 inline mr-2" />
                  {rolesError}
                </div>
              ) : (
                <Select value={config.roleId || ""} onValueChange={(value) => setConfig({ ...config, roleId: value })}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white h-12">
                    <SelectValue placeholder="Select a role..." />
                  </SelectTrigger>
                  <SelectContent className="bg-discord-dark border-white/20">
                    {roles.map((role) => {
                      const risky =
                        /admin|administrator|moderate|manage|ban|kick|mod/i.test(role.name) ||
                        (BigInt(role.permissions) & (BigInt(0x8) | BigInt(0x20) | BigInt(0x10) | BigInt(0x4))) !==
                        BigInt(0)
                      return (
                        <SelectItem key={role.id} value={role.id} className="text-white hover:bg-white/10">
                          <div className="flex items-center gap-2">
                            <span>{role.name}</span>
                            {risky && <Badge className="bg-yellow-500/20 text-yellow-400">⚠️ RISKY</Badge>}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )}
            </div>

            {roles.find((role) => role.id === config.roleId) &&
              (/admin|administrator|moderate|manage|ban|kick|mod/i.test(
                roles.find((role) => role.id === config.roleId)?.name || "",
              ) ||
                (BigInt(roles.find((role) => role.id === config.roleId)?.permissions || "0") &
                  (BigInt(0x8) | BigInt(0x20) | BigInt(0x10) | BigInt(0x4))) !==
                BigInt(0)) && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4" />
                    <strong>RISKY ROLE DETECTED</strong>
                  </div>
                  <p className="text-sm">
                    This role has administrative or moderation permissions. Assigning it automatically can be dangerous!
                  </p>
                </div>
              )}
          </div>
        )

      case "condition":
        return (
          <div className="space-y-6">
            <Label className="text-white font-bold text-lg flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-discord-purple" />
              CONDITION BRANCHES
            </Label>
            <div className="space-y-4">
              {block.branches && block.branches.map((branch, idx) => (
                <div key={branch.id} className="p-4 bg-white/5 rounded-lg border border-white/10 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-white">{branch.label}</span>
                    {branch.label !== "If" && (
                      <Button size="sm" variant="ghost" className="text-red-400 ml-2" onClick={() => {
                        // Remove branch
                        const newBranches = (block.branches || []).filter(b => b.id !== branch.id)
                        onSave({ ...block.config, branches: newBranches })
                      }}>Remove</Button>
                    )}
                  </div>
                  {branch.label !== "Else" && (
                    <div className="mb-2">
                      <Label className="text-discord-text text-xs">Condition</Label>
                      <Select
                        value={branch.condition?.conditionType || ""}
                        onValueChange={(value) => {
                          const newBranches = (block.branches || []).map(br =>
                            br.id === branch.id
                              ? { ...br, condition: { ...br.condition, conditionType: value } }
                              : br
                          )
                          onSave({ ...block.config, branches: newBranches })
                        }}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white h-10">
                          <SelectValue placeholder="Select a condition..." />
                        </SelectTrigger>
                        <SelectContent className="bg-discord-dark border-white/20">
                          <SelectItem value="user_is_admin" className="text-white hover:bg-white/10">User is Admin</SelectItem>
                          <SelectItem value="user_has_role" className="text-white hover:bg-white/10">User has Role</SelectItem>
                          <SelectItem value="user_is_owner" className="text-white hover:bg-white/10">User is Server Owner</SelectItem>
                          <SelectItem value="message_contains" className="text-white hover:bg-white/10">Message Contains...</SelectItem>
                          <SelectItem value="channel_is" className="text-white hover:bg-white/10">Channel is...</SelectItem>
                        </SelectContent>
                      </Select>
                      {['user_has_role', 'channel_is', 'message_contains'].includes(branch.condition?.conditionType) && (
                        <div className="mt-2">
                          <Input
                            className="bg-white/5 border-white/20 text-white placeholder:text-discord-text h-10"
                            value={branch.condition?.conditionValue || ""}
                            onChange={e => {
                              const newBranches = (block.branches || []).map(br =>
                                br.id === branch.id
                                  ? { ...br, condition: { ...br.condition, conditionValue: e.target.value } }
                                  : br
                              )
                              onSave({ ...block.config, branches: newBranches })
                            }}
                            placeholder={
                              branch.condition?.conditionType === 'user_has_role'
                                ? 'Role ID or name'
                                : branch.condition?.conditionType === 'channel_is'
                                  ? 'Channel ID or name'
                                  : 'Text to search for...'
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {/* Blocks in branch */}
                  <div className="space-y-2">
                    {branch.blocks.length === 0 && (
                      <div className="text-discord-text text-xs italic">No blocks in this branch.</div>
                    )}
                    {branch.blocks.map((b, bIdx) => (
                      <div key={b.id} className="flex items-center gap-2 bg-discord-dark/40 p-2 rounded">
                        <span className="text-white font-minecraft text-sm">{b.label}</span>
                        <Button size="sm" variant="ghost" className="text-discord-text" onClick={() => {
                          setEditingBranchBlock({ branchId: branch.id, blockIdx: bIdx, block: b })
                        }}>Configure</Button>
                        <Button size="sm" variant="ghost" className="text-red-400" onClick={() => {
                          // Remove block from branch
                          const newBranches = (block.branches || []).map(br =>
                            br.id === branch.id
                              ? { ...br, blocks: br.blocks.filter((_, i) => i !== bIdx) }
                              : br
                          )
                          onSave({ ...block.config, branches: newBranches })
                        }}>Remove</Button>
                      </div>
                    ))}
                  </div>
                  {/* Add block to branch with type picker */}
                  <div className="mt-2 flex gap-2 items-center">
                    <Select onValueChange={(blockType) => {
                      const newBlock = {
                        ...BLOCK_TYPES.find(bt => bt.type === blockType),
                        id: Date.now() + Math.random(),
                      }
                      const newBranches = (block.branches || []).map(br =>
                        br.id === branch.id
                          ? { ...br, blocks: [...br.blocks, newBlock] }
                          : br
                      )
                      onSave({ ...block.config, branches: newBranches })
                    }}>
                      <SelectTrigger className="w-48 bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Add Action Block..." />
                      </SelectTrigger>
                      <SelectContent className="bg-discord-dark border-white/20">
                        {BLOCK_TYPES.filter(bt => bt.category === "actions" || bt.category === "utilities").map(bt => (
                          <SelectItem key={bt.type} value={bt.type} className="text-white hover:bg-white/10">
                            {bt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => {
                  // Add Else If branch
                  const newBranch = {
                    id: Date.now() + Math.random(),
                    label: "Else If",
                    condition: {},
                    blocks: [],
                  }
                  onSave({ ...block.config, branches: [...(block.branches || []), newBranch] })
                }}>Add Else If</Button>
                {!(block.branches || []).some(b => b.label === "Else") && (
                  <Button size="sm" variant="outline" onClick={() => {
                    // Add Else branch
                    const newBranch = {
                      id: Date.now() + Math.random(),
                      label: "Else",
                      blocks: [],
                    }
                    onSave({ ...block.config, branches: [...(block.branches || []), newBranch] })
                  }}>Add Else</Button>
                )}
              </div>
            </div>
          </div>
        )

      case "event":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-white font-bold text-lg flex items-center gap-2">
                <Zap className="h-4 w-4 text-discord-yellow" />
                EVENT TYPE
              </Label>
              <Select
                value={config.eventType || ""}
                onValueChange={(value) => setConfig({ ...config, eventType: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/20 text-white h-12">
                  <SelectValue placeholder="Select an event..." />
                </SelectTrigger>
                <SelectContent className="bg-discord-dark border-white/20">
                  <SelectItem value="on_message" className="text-white hover:bg-white/10">
                    On Message
                  </SelectItem>
                  <SelectItem value="on_join" className="text-white hover:bg-white/10">
                    On Member Join
                  </SelectItem>
                  <SelectItem value="on_leave" className="text-white hover:bg-white/10">
                    On Member Leave
                  </SelectItem>
                  <SelectItem value="on_react" className="text-white hover:bg-white/10">
                    On Reaction Add
                  </SelectItem>
                  <SelectItem value="on_voice_join" className="text-white hover:bg-white/10">
                    On Voice Join
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-discord-text mx-auto mb-4" />
            <p className="text-discord-text">No configuration available for this block type.</p>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-discord-dark border-white/20 text-white max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <motion.div
              className={`p-3 rounded-xl bg-${block.accent}/20 border border-${block.accent}/30`}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <IconComponent className={`h-6 w-6 text-${block.accent}`} />
            </motion.div>
            <div>
              <DialogTitle className="text-2xl font-black text-white tracking-wide font-minecraft">
                CONFIGURE {block.label.toUpperCase()}
              </DialogTitle>
              <DialogDescription className="text-discord-text text-lg">{block.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="py-6">{renderConfigContent()}</div>
        </ScrollArea>

        <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
          <Button variant="outline" onClick={onClose} className="discord-button-outline bg-transparent">
            CANCEL
          </Button>
          <Button
            onClick={() => {
              onSave(config)
              onClose()
            }}
            className="discord-button-primary"
          >
            <Save className="mr-2 h-4 w-4" />
            SAVE CONFIGURATION
          </Button>
        </div>
      </DialogContent>

      {editingBranchBlock && (
        <BlockConfigModal
          block={editingBranchBlock.block}
          open={true}
          onClose={() => setEditingBranchBlock(null)}
          onSave={(config) => {
            // Update config for the block in the branch
            const newBranches = (block.branches || []).map(br =>
              br.id === editingBranchBlock.branchId
                ? {
                    ...br,
                    blocks: br.blocks.map((blk, i) =>
                      i === editingBranchBlock.blockIdx ? { ...blk, config } : blk
                    ),
                  }
                : br
            )
            onSave({ ...block.config, branches: newBranches })
            setEditingBranchBlock(null)
          }}
        />
      )}
    </Dialog>
  )
}

function isPromise<T>(value: any): value is Promise<T> {
  return value && typeof value.then === "function"
}

export default function CommandBuilderPage({ params }: any) {
  const unwrappedParams = isPromise<{ serverId: string }>(params) ? React.use(params) : params
  const serverId = unwrappedParams?.serverId || ""

  const [blocks, setBlocks] = useState<Block[]>([])
  const [configBlock, setConfigBlock] = useState<Block | null>(null)
  const [commandName, setCommandName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("triggers")
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null)
  // Sidebar/Header visibility state
  const [showUI, setShowUI] = useState(true)

  const commands = useQuery(api.discord.getCommands, serverId ? { serverId } : "skip")
  const saveCommandMutation = useMutation(api.discord.saveCommand)

  useEffect(() => {
    if (selectedCommand && commands) {
      const cmd = commands.find((c: any) => c.name === selectedCommand)
      if (cmd) {
        setBlocks(JSON.parse(cmd.blocks))
        setCommandName(cmd.name)
        setDescription(cmd.description || "")
      }
    }
  }, [selectedCommand, commands])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const addBlock = (type: string) => {
    const blockType = BLOCK_TYPES.find((b) => b.type === type)
    if (blockType) {
      if (type === "condition") {
        // Initialize with one branch ("If")
        const branchId = Date.now() + Math.random();
        setBlocks([
          ...blocks,
          {
            ...blockType,
            id: Date.now() + Math.random(),
            branches: [
              {
                id: branchId,
                label: "If",
                condition: {},
                blocks: [],
              },
            ],
          },
        ])
      } else {
        setBlocks([...blocks, { ...blockType, id: Date.now() + Math.random() }])
      }
    }
  }

  const removeBlock = (id: number) => {
    setBlocks(blocks.filter((b) => b.id !== id))
  }

  const handleDragStart = (event: any) => {
    const block = blocks.find((b) => b.id === event.active.id)
    setDraggedBlock(block || null)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    setDraggedBlock(null)

    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)
      setBlocks(arrayMove(blocks, oldIndex, newIndex))
    }
  }

  const handleSaveConfig = (config: Record<string, any>) => {
    if (!configBlock) return
    setBlocks(blocks.map((b) => (b.id === configBlock.id ? { ...b, config } : b)))
  }

  const saveCommand = async () => {
    if (!commandName) {
      alert("Please enter a command name.")
      return
    }

    await saveCommandMutation({
      serverId,
      name: commandName,
      description,
      blocks: JSON.stringify(blocks),
    })
    alert("Command saved!")
  }

  const clearCanvas = () => {
    setBlocks([])
    setCommandName("")
    setDescription("")
    setSelectedCommand(null)
  }

  return (
    <div className="bg-discord-dark min-h-screen font-minecraft">
      {/* Toggle UI Button */}
      <div className="fixed top-4 left-4 z-50">
        {showUI ? (
          <Button size="sm" variant="outline" className="bg-discord-dark/80 border-white/20 text-white hover:bg-discord-blurple/20" onClick={() => setShowUI(false)}>
            Hide UI
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="bg-discord-dark/80 border-white/20 text-white hover:bg-discord-blurple/20" onClick={() => setShowUI(true)}>
            Show UI
          </Button>
        )}
      </div>

      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />
      </div>

      {/* Floating Navigation */}
      {showUI && <FloatingSidebar />}
      {showUI && <FloatingHeader title="COMMAND BUILDER" />}

      <div className="relative z-10 flex min-h-screen">
        {/* Block Palette Sidebar */}
        <motion.aside
          className="w-80 bg-discord-dark/80 backdrop-blur-xl border-r border-white/10 p-6 overflow-y-auto"
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <motion.div
                className="p-4 bg-discord-blurple/20 rounded-xl border border-discord-blurple/30 w-fit mx-auto mb-4"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Command className="h-8 w-8 text-discord-blurple" />
              </motion.div>
              <h2 className="text-2xl font-black text-white tracking-wide">BLOCK PALETTE</h2>
              <p className="text-discord-text">Drag blocks to build your command</p>
            </div>

            {/* Category Tabs */}
            <div className="space-y-2">
              {BLOCK_CATEGORIES.map((category) => (
                <motion.button
                  key={category.id}
                  className={`w-full text-left p-3 rounded-lg transition-all ${activeCategory === category.id
                      ? "bg-discord-blurple/20 text-discord-blurple border border-discord-blurple/30"
                      : "text-discord-text hover:text-white hover:bg-white/5"
                    }`}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm">{category.label}</div>
                      <div className="text-xs opacity-70">{category.description}</div>
                    </div>
                    {activeCategory === category.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Block Types */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-discord-text uppercase tracking-wider">
                {BLOCK_CATEGORIES.find((c) => c.id === activeCategory)?.label} BLOCKS
              </h3>
              <div className="space-y-2">
                {BLOCK_TYPES.filter((block) => block.category === activeCategory).map((block) => {
                  const IconComponent = block.icon
                  return (
                    <motion.button
                      key={block.type}
                      className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all group"
                      onClick={() => addBlock(block.type)}
                      whileHover={{ x: 2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`p-2 rounded-lg bg-${block.accent}/20 border border-${block.accent}/30 group-hover:scale-110 transition-transform`}
                        >
                          <IconComponent className={`h-4 w-4 text-${block.accent}`} />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white text-sm">{block.label}</div>
                          <div className="text-xs text-discord-text truncate">{block.description}</div>
                        </div>
                        <Plus className="h-4 w-4 text-discord-text group-hover:text-white transition-colors" />
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Saved Commands */}
            <Separator className="bg-white/10" />
            <div className="space-y-3">
              <h3 className="text-sm font-black text-discord-text uppercase tracking-wider">SAVED COMMANDS</h3>
              {commands && commands.length > 0 ? (
                <div className="space-y-2">
                  {commands.map((cmd: any) => (
                    <motion.button
                      key={cmd._id}
                      className={`w-full text-left p-3 rounded-lg transition-all ${selectedCommand === cmd.name
                          ? "bg-discord-green/20 text-discord-green border border-discord-green/30"
                          : "bg-white/5 hover:bg-white/10 text-discord-text hover:text-white border border-white/10"
                        }`}
                      onClick={() => setSelectedCommand(cmd.name)}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-bold text-sm">{cmd.name}</div>
                      {cmd.description && <div className="text-xs opacity-70 truncate">{cmd.description}</div>}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-discord-text p-3 bg-white/5 rounded-lg border border-white/10">
                  No saved commands yet. Create your first command!
                </div>
              )}
            </div>
          </div>
        </motion.aside>

        {/* Main Canvas Area */}
        <main className="flex-1 flex flex-col">
          {/* Command Header */}
          <div className="p-8 border-b border-white/10 bg-discord-dark/50 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto">
              <motion.div
                className="flex flex-col lg:flex-row items-start lg:items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex-1 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white font-bold flex items-center gap-2">
                        <Hash className="h-4 w-4 text-discord-blurple" />
                        COMMAND NAME
                      </Label>
                      <Input
                        className="bg-white/5 border-white/20 text-white placeholder:text-discord-text h-12 text-lg font-bold"
                        placeholder="my-awesome-command"
                        value={commandName}
                        onChange={(e) => setCommandName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white font-bold flex items-center gap-2">
                        <Eye className="h-4 w-4 text-discord-green" />
                        DESCRIPTION
                      </Label>
                      <Input
                        className="bg-white/5 border-white/20 text-white placeholder:text-discord-text h-12 text-lg"
                        placeholder="What does this command do?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={clearCanvas} className="discord-button-outline bg-transparent">
                    <X className="mr-2 h-4 w-4" />
                    CLEAR
                  </Button>
                  <Button onClick={saveCommand} className="discord-button-primary text-lg px-8">
                    <Save className="mr-2 h-5 w-5" />
                    SAVE COMMAND
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  <motion.div
                    className="min-h-[600px] bg-discord-darker/30 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-2xl p-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {blocks.length === 0 ? (
                      <motion.div
                        className="flex flex-col items-center justify-center h-full text-center py-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        <motion.div
                          className="p-8 bg-discord-blurple/10 rounded-2xl border border-discord-blurple/20 mb-6"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        >
                          <Sparkles className="h-16 w-16 text-discord-blurple mx-auto" />
                        </motion.div>
                        <h3 className="text-3xl font-black text-white mb-4 font-minecraft">BUILD YOUR COMMAND</h3>
                        <p className="text-xl text-discord-text max-w-2xl">
                          Drag blocks from the sidebar to create powerful Discord bot commands. Start with an{" "}
                          <span className="text-discord-yellow font-bold">Event Trigger</span> to get started!
                        </p>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {blocks.map((block, index) => (
                          <motion.div
                            key={block.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                          >
                            <BlockItem
                              block={block}
                              onRemove={() => removeBlock(block.id)}
                              onClick={() => setConfigBlock(block)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </SortableContext>

                <DragOverlay>
                  {draggedBlock ? (
                    <BlockItem block={draggedBlock} onRemove={() => { }} onClick={() => { }} isDragging />
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </div>
        </main>
      </div>

      {/* Block Configuration Modal */}
      <BlockConfigModal
        block={configBlock}
        open={!!configBlock}
        onClose={() => setConfigBlock(null)}
        onSave={handleSaveConfig}
      />
    </div>
  )
}
