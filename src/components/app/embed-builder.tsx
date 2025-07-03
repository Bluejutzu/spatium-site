"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, ImageIcon, User, Calendar, Palette, Eye, Save, X, ChevronUp, ChevronDown } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface DiscordEmbed {
    title?: string
    description?: string
    color?: number
    fields?: Array<{
        name: string
        value: string
        inline?: boolean
    }>
    author?: {
        name?: string
        url?: string
        icon_url?: string
    }
    footer?: {
        text?: string
        icon_url?: string
    }
    image?: {
        url?: string
    }
    thumbnail?: {
        url?: string
    }
    url?: string
    timestamp?: string
}

interface EmbedBuilderProps {
    open: boolean
    onClose: () => void
    onSave: (embed: DiscordEmbed) => void
    initialEmbed?: DiscordEmbed
}

export function EmbedBuilder({ open, onClose, onSave, initialEmbed }: EmbedBuilderProps) {
    const [embed, setEmbed] = useState<DiscordEmbed>(
        initialEmbed || {
            title: "",
            description: "",
            color: 0x5865f2,
            fields: [],
            author: { name: "" },
            footer: { text: "" },
            image: { url: "" },
            thumbnail: { url: "" },
        },
    )
    const [previewMode, setPreviewMode] = useState(false)
    const isMobile = useIsMobile()

    const updateEmbed = (updates: Partial<DiscordEmbed>) => {
        setEmbed((prev) => ({ ...prev, ...updates }))
    }

    const addField = () => {
        const newField = { name: "Field Name", value: "Field Value", inline: false }
        setEmbed((prev) => ({
            ...prev,
            fields: [...(prev.fields || []), newField],
        }))
    }

    const updateField = (index: number, updates: Partial<NonNullable<DiscordEmbed["fields"]>[number]>) => {
        setEmbed((prev) => ({
            ...prev,
            fields: (prev.fields ?? []).map((field, i) => (i === index ? { ...field, ...updates } : field)),
        }))
    }

    const removeField = (index: number) => {
        setEmbed((prev) => ({
            ...prev,
            fields: prev.fields?.filter((_, i) => i !== index) || [],
        }))
    }

    const moveField = (index: number, direction: "up" | "down") => {
        if (!embed.fields) return

        const newFields = [...embed.fields]
        const targetIndex = direction === "up" ? index - 1 : index + 1

        if (targetIndex >= 0 && targetIndex < newFields.length) {
            ;[newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]]
            setEmbed((prev) => ({ ...prev, fields: newFields }))
        }
    }

    const hexToDecimal = (hex: string): number => {
        return Number.parseInt(hex.replace("#", ""), 16)
    }

    const decimalToHex = (decimal: number): string => {
        return `#${decimal.toString(16).padStart(6, "0")}`
    }

    const EmbedPreview = () => (
        <Card className="bg-slate-800 border-l-4 border-blue-500 w-full max-w-md mx-auto">
            <CardContent className="p-4 space-y-3">
                {embed.author?.name && (
                    <div className="flex items-center gap-2 text-sm">
                        {embed.author.icon_url && (
                            <img
                                src={embed.author.icon_url || "/placeholder.svg?height=20&width=20"}
                                alt=""
                                className="w-5 h-5 rounded-full"
                            />
                        )}
                        <span className="text-white font-medium">{embed.author.name}</span>
                    </div>
                )}
                {embed.title && (
                    <h3 className="text-blue-400 font-bold text-lg hover:underline cursor-pointer">{embed.title}</h3>
                )}
                {embed.description && <p className="text-slate-300 text-sm whitespace-pre-wrap">{embed.description}</p>}
                {embed.fields && embed.fields.length > 0 && (
                    <div className="grid gap-2">
                        {embed.fields.map((field, index) => (
                            <div key={index} className={field.inline ? "inline-block w-1/3 pr-2" : "block"}>
                                <div className="font-bold text-white text-sm">{field.name}</div>
                                <div className="text-slate-300 text-sm">{field.value}</div>
                            </div>
                        ))}
                    </div>
                )}
                {embed.image?.url && (
                    <img src={embed.image.url || "/placeholder.svg?height=200&width=400"} alt="" className="max-w-full rounded" />
                )}
                <div className="flex items-center justify-between">
                    {embed.thumbnail?.url && (
                        <img
                            src={embed.thumbnail.url || "/placeholder.svg?height=80&width=80"}
                            alt=""
                            className="w-20 h-20 rounded ml-auto"
                        />
                    )}
                </div>
                {embed.footer?.text && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        {embed.footer.icon_url && (
                            <img
                                src={embed.footer.icon_url || "/placeholder.svg?height=16&width=16"}
                                alt=""
                                className="w-4 h-4 rounded-full"
                            />
                        )}
                        <span>{embed.footer.text}</span>
                        {embed.timestamp && <span>• {new Date(embed.timestamp).toLocaleString()}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    )

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className={`bg-slate-800 border-slate-700 text-white p-0 ${isMobile
                        ? "w-[95vw] h-[95vh] max-w-[95vw] max-h-[95vh]"
                        : "min-w-[50vw] max-w-[90vw] max-h-[90vh] w-[90vw] h-[90vh]"
                    }`}
            >
                <DialogHeader className={`border-b border-slate-700 ${isMobile ? "p-4" : "p-6"}`}>
                    <div className="flex items-center justify-between">
                        <DialogTitle className={`font-bold flex items-center gap-2 ${isMobile ? "text-lg" : "text-2xl"}`}>
                            <ImageIcon className={`text-blue-500 ${isMobile ? "w-5 h-5" : "w-6 h-6"}`} />
                            Embed Builder
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size={isMobile ? "sm" : "sm"}
                                onClick={() => setPreviewMode(!previewMode)}
                                className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                {previewMode ? "Edit" : "Preview"}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className={`flex-1 overflow-hidden ${isMobile ? "flex flex-col" : "flex"}`}>
                    {!previewMode ? (
                        <>
                            {/* Editor Panel */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <Tabs defaultValue="content" className="flex-1 flex flex-col p-4 md:p-6">
                                    <TabsList className={`bg-slate-700 w-full ${isMobile ? "grid grid-cols-2" : "grid grid-cols-4"}`}>
                                        <TabsTrigger value="content" className={isMobile ? "text-xs" : ""}>
                                            {isMobile ? "Content" : "Content"}
                                        </TabsTrigger>
                                        <TabsTrigger value="fields" className={isMobile ? "text-xs" : ""}>
                                            {isMobile ? "Fields" : "Fields"}
                                        </TabsTrigger>
                                        {!isMobile && <TabsTrigger value="media">Media</TabsTrigger>}
                                        {!isMobile && <TabsTrigger value="metadata">Metadata</TabsTrigger>}
                                    </TabsList>

                                    {/* Mobile: Show additional tabs in a second row */}
                                    {isMobile && (
                                        <TabsList className="bg-slate-700 w-full grid grid-cols-2 mt-2">
                                            <TabsTrigger value="media" className="text-xs">
                                                Media
                                            </TabsTrigger>
                                            <TabsTrigger value="metadata" className="text-xs">
                                                Metadata
                                            </TabsTrigger>
                                        </TabsList>
                                    )}

                                    <div className="flex-1 mt-4 overflow-hidden">
                                        <ScrollArea className="h-full">
                                            <TabsContent value="content" className="space-y-4 mt-0">
                                                <Card className="bg-slate-700 border-slate-600 mb-4">
                                                    <CardHeader className={isMobile ? "p-4" : ""}>
                                                        <CardTitle className="text-white">Basic Content</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className={`space-y-4 ${isMobile ? "p-4" : ""}`}>
                                                        <div>
                                                            <Label className="text-white font-medium">Title</Label>
                                                            <Input
                                                                className="bg-slate-600 border-slate-500 text-white mt-1 w-full"
                                                                value={embed.title || ""}
                                                                onChange={(e) => updateEmbed({ title: e.target.value })}
                                                                placeholder="Embed title..."
                                                                maxLength={256}
                                                            />
                                                            <div className="text-xs text-slate-400 mt-1">
                                                                {(embed.title || "").length}/256 characters
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label className="text-white font-medium">Description</Label>
                                                            <Textarea
                                                                className={`bg-slate-600 border-slate-500 text-white mt-1 w-full ${isMobile ? "min-h-[100px]" : "min-h-[120px]"
                                                                    }`}
                                                                value={embed.description || ""}
                                                                onChange={(e) => updateEmbed({ description: e.target.value })}
                                                                placeholder="Embed description..."
                                                                maxLength={4096}
                                                            />
                                                            <div className="text-xs text-slate-400 mt-1">
                                                                {(embed.description || "").length}/4096 characters
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label className="text-white font-medium">URL</Label>
                                                            <Input
                                                                className="bg-slate-600 border-slate-500 text-white mt-1 w-full"
                                                                value={embed.url || ""}
                                                                onChange={(e) => updateEmbed({ url: e.target.value })}
                                                                placeholder="https://example.com"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-white font-medium flex items-center gap-2">
                                                                <Palette className="w-4 h-4" />
                                                                Color
                                                            </Label>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <input
                                                                    type="color"
                                                                    className="w-12 h-10 rounded border border-slate-500 bg-transparent cursor-pointer"
                                                                    value={decimalToHex(embed.color || 0x5865f2)}
                                                                    onChange={(e) => updateEmbed({ color: hexToDecimal(e.target.value) })}
                                                                />
                                                                <Input
                                                                    className="bg-slate-600 border-slate-500 text-white flex-1 w-full"
                                                                    value={decimalToHex(embed.color || 0x5865f2)}
                                                                    onChange={(e) => updateEmbed({ color: hexToDecimal(e.target.value) })}
                                                                    placeholder="#5865F2"
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </TabsContent>

                                            <TabsContent value="fields" className="space-y-4 mt-0">
                                                <Card className="bg-slate-700 border-slate-600 mb-4">
                                                    <CardHeader className={isMobile ? "p-4" : ""}>
                                                        <div className={`flex items-center justify-between ${isMobile ? "flex-col gap-2" : ""}`}>
                                                            <CardTitle className="text-white">Fields</CardTitle>
                                                            <Button onClick={addField} size="sm" disabled={(embed.fields?.length || 0) >= 25}>
                                                                <Plus className="w-4 h-4 mr-2" />
                                                                Add Field
                                                            </Button>
                                                        </div>
                                                        <div className="text-sm text-slate-400">{embed.fields?.length || 0}/25 fields</div>
                                                    </CardHeader>
                                                    <CardContent className={`space-y-4 ${isMobile ? "p-4" : ""}`}>
                                                        {embed.fields?.map((field, index) => (
                                                            <Card key={index} className="bg-slate-600 border-slate-500">
                                                                <CardContent className={`space-y-3 ${isMobile ? "p-3" : "p-4"}`}>
                                                                    <div className="flex items-center justify-between">
                                                                        <Badge variant="outline" className="text-slate-300 border-slate-400">
                                                                            Field {index + 1}
                                                                        </Badge>
                                                                        <div className="flex items-center gap-1">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => moveField(index, "up")}
                                                                                disabled={index === 0}
                                                                                className={isMobile ? "h-8 w-8 p-0" : ""}
                                                                            >
                                                                                <ChevronUp className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => moveField(index, "down")}
                                                                                disabled={index === (embed.fields?.length || 0) - 1}
                                                                                className={isMobile ? "h-8 w-8 p-0" : ""}
                                                                            >
                                                                                <ChevronDown className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => removeField(index)}
                                                                                className={`text-red-400 hover:text-red-300 ${isMobile ? "h-8 w-8 p-0" : ""}`}
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-white text-sm">Name</Label>
                                                                        <Input
                                                                            className="bg-slate-500 border-slate-400 text-white mt-1 w-full"
                                                                            value={field.name}
                                                                            onChange={(e) => updateField(index, { name: e.target.value })}
                                                                            placeholder="Field name..."
                                                                            maxLength={256}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-white text-sm">Value</Label>
                                                                        <Textarea
                                                                            className={`bg-slate-500 border-slate-400 text-white mt-1 w-full ${isMobile ? "min-h-[80px]" : ""
                                                                                }`}
                                                                            value={field.value}
                                                                            onChange={(e) => updateField(index, { value: e.target.value })}
                                                                            placeholder="Field value..."
                                                                            maxLength={1024}
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Switch
                                                                            checked={field.inline || false}
                                                                            onCheckedChange={(checked) => updateField(index, { inline: checked })}
                                                                        />
                                                                        <Label className="text-white text-sm">Inline</Label>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        )) || (
                                                                <div className="text-center py-8 text-slate-400">
                                                                    No fields added yet. Click "Add Field" to get started.
                                                                </div>
                                                            )}
                                                    </CardContent>
                                                </Card>
                                            </TabsContent>

                                            <TabsContent value="media" className="space-y-4 mt-0">
                                                <Card className="bg-slate-700 border-slate-600 mb-4">
                                                    <CardHeader className={isMobile ? "p-4" : ""}>
                                                        <CardTitle className="text-white">Media & Images</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className={`space-y-4 ${isMobile ? "p-4" : ""}`}>
                                                        <div>
                                                            <Label className="text-white font-medium">Image URL</Label>
                                                            <Input
                                                                className="bg-slate-600 border-slate-500 text-white mt-1 w-full"
                                                                value={embed.image?.url || ""}
                                                                onChange={(e) =>
                                                                    updateEmbed({
                                                                        image: e.target.value ? { url: e.target.value } : undefined,
                                                                    })
                                                                }
                                                                placeholder="https://example.com/image.png"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-white font-medium">Thumbnail URL</Label>
                                                            <Input
                                                                className="bg-slate-600 border-slate-500 text-white mt-1 w-full"
                                                                value={embed.thumbnail?.url || ""}
                                                                onChange={(e) =>
                                                                    updateEmbed({
                                                                        thumbnail: e.target.value ? { url: e.target.value } : undefined,
                                                                    })
                                                                }
                                                                placeholder="https://example.com/thumbnail.png"
                                                            />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </TabsContent>

                                            <TabsContent value="metadata" className="space-y-4 mt-0">
                                                <Card className="bg-slate-700 border-slate-600 mb-4">
                                                    <CardHeader className={isMobile ? "p-4" : ""}>
                                                        <CardTitle className="text-white">Author & Footer</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className={`space-y-6 ${isMobile ? "p-4" : ""}`}>
                                                        <div className="space-y-3">
                                                            <Label className="text-white font-medium flex items-center gap-2">
                                                                <User className="w-4 h-4" />
                                                                Author
                                                            </Label>
                                                            <div className="space-y-2">
                                                                <Input
                                                                    className="bg-slate-600 border-slate-500 text-white w-full"
                                                                    value={embed.author?.name || ""}
                                                                    onChange={(e) =>
                                                                        updateEmbed({
                                                                            author: { ...embed.author, name: e.target.value },
                                                                        })
                                                                    }
                                                                    placeholder="Author name..."
                                                                    maxLength={256}
                                                                />
                                                                <Input
                                                                    className="bg-slate-600 border-slate-500 text-white w-full"
                                                                    value={embed.author?.url || ""}
                                                                    onChange={(e) =>
                                                                        updateEmbed({
                                                                            author: {
                                                                                name: embed.author?.name ?? "",
                                                                                url: e.target.value,
                                                                                icon_url: embed.author?.icon_url,
                                                                            },
                                                                        })
                                                                    }
                                                                    placeholder="Author URL..."
                                                                />
                                                                <Input
                                                                    className="bg-slate-600 border-slate-500 text-white w-full"
                                                                    value={embed.author?.icon_url || ""}
                                                                    onChange={(e) =>
                                                                        updateEmbed({
                                                                            author: {
                                                                                name: embed.author?.name ?? "",
                                                                                url: embed.author?.url,
                                                                                icon_url: e.target.value,
                                                                            },
                                                                        })
                                                                    }
                                                                    placeholder="Author icon URL..."
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <Label className="text-white font-medium">Footer</Label>
                                                            <div className="space-y-2">
                                                                <Input
                                                                    className="bg-slate-600 border-slate-500 text-white w-full"
                                                                    value={embed.footer?.text || ""}
                                                                    onChange={(e) =>
                                                                        updateEmbed({
                                                                            footer: { ...embed.footer, text: e.target.value },
                                                                        })
                                                                    }
                                                                    placeholder="Footer text..."
                                                                    maxLength={2048}
                                                                />
                                                                <Input
                                                                    className="bg-slate-600 border-slate-500 text-white w-full"
                                                                    value={embed.footer?.icon_url || ""}
                                                                    onChange={(e) =>
                                                                        updateEmbed({
                                                                            footer: {
                                                                                text: embed.footer?.text ?? "",
                                                                                icon_url: e.target.value,
                                                                            },
                                                                        })
                                                                    }
                                                                    placeholder="Footer icon URL..."
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <Label className="text-white font-medium flex items-center gap-2">
                                                                <Calendar className="w-4 h-4" />
                                                                Timestamp
                                                            </Label>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Switch
                                                                    checked={!!embed.timestamp}
                                                                    onCheckedChange={(checked) =>
                                                                        updateEmbed({
                                                                            timestamp: checked ? new Date().toISOString() : undefined,
                                                                        })
                                                                    }
                                                                />
                                                                <span className="text-slate-400 text-sm">Use current timestamp</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </TabsContent>
                                        </ScrollArea>
                                    </div>
                                </Tabs>
                            </div>

                            {/* Live Preview - Hidden on mobile when not in preview mode */}
                            {!isMobile && (
                                <div className="w-80 border-l border-slate-700 p-6 flex flex-col">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        Live Preview
                                    </h3>
                                    <div className="flex-1 flex items-start justify-center">
                                        <EmbedPreview />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-4 md:p-6">
                            <EmbedPreview />
                        </div>
                    )}
                </div>

                <div className={`flex gap-4 border-t border-slate-700 ${isMobile ? "flex-col p-4" : "justify-end p-6"}`}>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className={`bg-slate-700 border-slate-600 hover:bg-slate-600 ${isMobile ? "w-full" : ""}`}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onSave(embed)
                            onClose()
                        }}
                        className={isMobile ? "w-full" : ""}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Embed
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
