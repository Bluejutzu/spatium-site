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
import { Plus, Trash2, ImageIcon, User, Calendar, Palette, Eye, Save, X, Move3D } from "lucide-react"
import type { DiscordEmbed } from "@/types/discord"

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

    const updateField = (
        index: number,
        updates: Partial<NonNullable<DiscordEmbed["fields"]>[number]>
    ) => {
        setEmbed((prev) => ({
            ...prev,
            fields: (prev.fields ?? []).map((field, i) =>
                i === index ? { ...field, ...updates } : field
            ),
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
        <Card className="bg-discord-dark border-l-4 border-discord-blurple max-w-md">
            <CardContent className="p-4 space-y-3">
                {embed.author?.name && (
                    <div className="flex items-center gap-2 text-sm">
                        {embed.author.icon_url && (
                            <img src={embed.author.icon_url || "/placeholder.svg"} alt="" className="w-5 h-5 rounded-full" />
                        )}
                        <span className="text-white font-medium">{embed.author.name}</span>
                    </div>
                )}

                {embed.title && (
                    <h3 className="text-discord-blurple font-bold text-lg hover:underline cursor-pointer">{embed.title}</h3>
                )}

                {embed.description && <p className="text-discord-text text-sm whitespace-pre-wrap">{embed.description}</p>}

                {embed.fields && embed.fields.length > 0 && (
                    <div className="grid gap-2">
                        {embed.fields.map((field, index) => (
                            <div key={index} className={field.inline ? "inline-block w-1/3 pr-2" : "block"}>
                                <div className="font-bold text-white text-sm">{field.name}</div>
                                <div className="text-discord-text text-sm">{field.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {embed.image?.url && <img src={embed.image.url || "/placeholder.svg"} alt="" className="max-w-full rounded" />}

                <div className="flex items-center justify-between">
                    {embed.thumbnail?.url && (
                        <img src={embed.thumbnail.url || "/placeholder.svg"} alt="" className="w-20 h-20 rounded ml-auto" />
                    )}
                </div>

                {embed.footer?.text && (
                    <div className="flex items-center gap-2 text-xs text-discord-text">
                        {embed.footer.icon_url && (
                            <img src={embed.footer.icon_url || "/placeholder.svg"} alt="" className="w-4 h-4 rounded-full" />
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
            <DialogContent className="bg-discord-dark border-discord-border text-white max-w-6xl max-h-[90vh] overflow-hidden">
                <DialogHeader className="border-b border-discord-border pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <ImageIcon className="w-6 h-6 text-discord-blurple" />
                            Embed Builder
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPreviewMode(!previewMode)}
                                className="discord-button-outline"
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

                <div className="flex gap-6 h-[70vh]">
                    {!previewMode ? (
                        <>
                            {/* Editor Panel */}
                            <div className="flex-1">
                                <ScrollArea className="h-full pr-4">
                                    <Tabs defaultValue="content" className="space-y-4">
                                        <TabsList className="bg-discord-darker">
                                            <TabsTrigger value="content">Content</TabsTrigger>
                                            <TabsTrigger value="fields">Fields</TabsTrigger>
                                            <TabsTrigger value="media">Media</TabsTrigger>
                                            <TabsTrigger value="metadata">Metadata</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="content" className="space-y-4">
                                            <Card className="discord-card">
                                                <CardHeader>
                                                    <CardTitle className="text-white">Basic Content</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div>
                                                        <Label className="text-white font-medium">Title</Label>
                                                        <Input
                                                            className="bg-white/10 border-discord-border text-white mt-1"
                                                            value={embed.title || ""}
                                                            onChange={(e) => updateEmbed({ title: e.target.value })}
                                                            placeholder="Embed title..."
                                                            maxLength={256}
                                                        />
                                                        <div className="text-xs text-discord-text mt-1">
                                                            {(embed.title || "").length}/256 characters
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label className="text-white font-medium">Description</Label>
                                                        <Textarea
                                                            className="bg-white/10 border-discord-border text-white mt-1 min-h-[120px]"
                                                            value={embed.description || ""}
                                                            onChange={(e) => updateEmbed({ description: e.target.value })}
                                                            placeholder="Embed description..."
                                                            maxLength={4096}
                                                        />
                                                        <div className="text-xs text-discord-text mt-1">
                                                            {(embed.description || "").length}/4096 characters
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label className="text-white font-medium">URL</Label>
                                                        <Input
                                                            className="bg-white/10 border-discord-border text-white mt-1"
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
                                                                className="w-12 h-10 rounded border border-discord-border bg-transparent cursor-pointer"
                                                                value={decimalToHex(embed.color || 0x5865f2)}
                                                                onChange={(e) => updateEmbed({ color: hexToDecimal(e.target.value) })}
                                                            />
                                                            <Input
                                                                className="bg-white/10 border-discord-border text-white flex-1"
                                                                value={decimalToHex(embed.color || 0x5865f2)}
                                                                onChange={(e) => updateEmbed({ color: hexToDecimal(e.target.value) })}
                                                                placeholder="#5865F2"
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="fields" className="space-y-4">
                                            <Card className="discord-card">
                                                <CardHeader>
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="text-white">Fields</CardTitle>
                                                        <Button
                                                            onClick={addField}
                                                            size="sm"
                                                            className="discord-button-primary"
                                                            disabled={(embed.fields?.length || 0) >= 25}
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Add Field
                                                        </Button>
                                                    </div>
                                                    <div className="text-sm text-discord-text">{embed.fields?.length || 0}/25 fields</div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {embed.fields?.map((field, index) => (
                                                        <Card key={index} className="bg-white/5 border-white/10">
                                                            <CardContent className="p-4 space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <Badge variant="outline" className="text-discord-text">
                                                                        Field {index + 1}
                                                                    </Badge>
                                                                    <div className="flex items-center gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => moveField(index, "up")}
                                                                            disabled={index === 0}
                                                                        >
                                                                            <Move3D className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => removeField(index)}
                                                                            className="text-red-400 hover:text-red-300"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <Label className="text-white text-sm">Name</Label>
                                                                    <Input
                                                                        className="bg-white/10 border-white/20 text-white mt-1"
                                                                        value={field.name}
                                                                        onChange={(e) => updateField(index, { name: e.target.value })}
                                                                        placeholder="Field name..."
                                                                        maxLength={256}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Label className="text-white text-sm">Value</Label>
                                                                    <Textarea
                                                                        className="bg-white/10 border-white/20 text-white mt-1"
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
                                                            <div className="text-center py-8 text-discord-text">
                                                                No fields added yet. Click "Add Field" to get started.
                                                            </div>
                                                        )}
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="media" className="space-y-4">
                                            <Card className="discord-card">
                                                <CardHeader>
                                                    <CardTitle className="text-white">Media & Images</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div>
                                                        <Label className="text-white font-medium">Image URL</Label>
                                                        <Input
                                                            className="bg-white/10 border-discord-border text-white mt-1"
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
                                                            className="bg-white/10 border-discord-border text-white mt-1"
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

                                        <TabsContent value="metadata" className="space-y-4">
                                            <Card className="discord-card">
                                                <CardHeader>
                                                    <CardTitle className="text-white">Author & Footer</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <div className="space-y-3">
                                                        <Label className="text-white font-medium flex items-center gap-2">
                                                            <User className="w-4 h-4" />
                                                            Author
                                                        </Label>
                                                        <div className="space-y-2">
                                                            <Input
                                                                className="bg-white/10 border-discord-border text-white"
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
                                                                className="bg-white/10 border-discord-border text-white"
                                                                value={embed.author?.url || ""}
                                                                onChange={(e) =>
                                                                    updateEmbed({
                                                                        author: {
                                                                            name: embed.author?.name ?? "",
                                                                            url: e.target.value,
                                                                            icon_url: embed.author?.icon_url
                                                                        },
                                                                    })
                                                                }
                                                                placeholder="Author URL..."
                                                            ></Input>
                                                            <Input
                                                                className="bg-white/10 border-discord-border text-white"
                                                                value={embed.author?.icon_url || ""}
                                                                onChange={(e) =>
                                                                    updateEmbed({
                                                                        author: {
                                                                            name: embed.author?.name ?? "",
                                                                            url: embed.author?.url,
                                                                            icon_url: e.target.value
                                                                        },
                                                                    })
                                                                }
                                                                placeholder="Author icon URL..."
                                                            ></Input>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <Label className="text-white font-medium">Footer</Label>
                                                        <div className="space-y-2">
                                                            <Input
                                                                className="bg-white/10 border-discord-border text-white"
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
                                                                className="bg-white/10 border-discord-border text-white"
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
                                                            ></Input>
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
                                                            <span className="text-discord-text text-sm">Use current timestamp</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                    </Tabs>
                                </ScrollArea>
                            </div>

                            {/* Live Preview */}
                            <div className="w-80">
                                <div className="sticky top-0">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        Live Preview
                                    </h3>
                                    <EmbedPreview />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <EmbedPreview />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-discord-border">
                    <Button variant="outline" onClick={onClose} className="discord-button-outline bg-transparent">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onSave(embed)
                            onClose()
                        }}
                        className="discord-button-primary"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Embed
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
