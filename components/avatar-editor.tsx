"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Shirt, Scissors, Sparkles } from "lucide-react"

interface AvatarConfig {
  skin: string
  hair: string
  clothing: string
  accessories: string[]
  emotion: string
}

const AVATAR_OPTIONS = {
  skin: [
    { id: "light", name: "Clara", color: "#F5DEB3" },
    { id: "medium", name: "Morena", color: "#D2B48C" },
    { id: "dark", name: "Oscura", color: "#8B4513" },
  ],
  hair: [
    { id: "short", name: "Corto", color: "#8B4513" },
    { id: "long", name: "Largo", color: "#654321" },
    { id: "curly", name: "Rizado", color: "#2F1B14" },
  ],
  clothing: [
    { id: "casual", name: "Casual", color: "#4A90E2" },
    { id: "formal", name: "Elegante", color: "#7B68EE" },
    { id: "sporty", name: "Deportivo", color: "#32CD32" },
  ],
  accessories: [
    { id: "glasses", name: "Lentes", icon: "👓" },
    { id: "hat", name: "Gorro", icon: "🧢" },
    { id: "necklace", name: "Collar", icon: "📿" },
    { id: "watch", name: "Reloj", icon: "⌚" },
    { id: "earrings", name: "Aretes", icon: "💎" },
  ],
}

const EMOTIONS = [
  { id: "happy", name: "Feliz", color: "bg-yellow-400", emoji: "😊" },
  { id: "sad", name: "Triste", color: "bg-blue-400", emoji: "😢" },
  { id: "angry", name: "Enojado", color: "bg-red-400", emoji: "😠" },
  { id: "scared", name: "Asustado", color: "bg-purple-400", emoji: "😨" },
  { id: "calm", name: "Tranquilo", color: "bg-green-400", emoji: "😌" },
  { id: "surprised", name: "Sorprendido", color: "bg-orange-400", emoji: "😲" },
]

interface AvatarEditorProps {
  onSave: (config: AvatarConfig) => void
  initialConfig?: AvatarConfig
}

export default function AvatarEditor({ onSave, initialConfig }: AvatarEditorProps) {
  const [config, setConfig] = useState<AvatarConfig>(
    initialConfig || {
      skin: "light",
      hair: "short",
      clothing: "casual",
      accessories: [],
      emotion: "happy",
    },
  )

  const updateConfig = (key: keyof AvatarConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const toggleAccessory = (accessoryId: string) => {
    setConfig((prev) => ({
      ...prev,
      accessories: prev.accessories.includes(accessoryId)
        ? prev.accessories.filter((id) => id !== accessoryId)
        : prev.accessories.length < 3
          ? [...prev.accessories, accessoryId]
          : prev.accessories,
    }))
  }

  const handleSave = () => {
    onSave(config)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Crea tu Avatar</h2>
        <p className="text-muted-foreground">Personaliza tu avatar para que te represente</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Avatar Preview */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
              Vista Previa
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {/* Avatar representation */}
            <div className="relative w-48 h-48 rounded-full border-4 border-primary/20 overflow-hidden bg-gradient-to-br from-card to-muted flex items-center justify-center">
              <div className="text-6xl">{EMOTIONS.find((e) => e.id === config.emotion)?.emoji || "😊"}</div>
              {/* Emotion indicator */}
              <div
                className={`absolute bottom-2 right-2 w-8 h-8 rounded-full ${EMOTIONS.find((e) => e.id === config.emotion)?.color} flex items-center justify-center`}
              >
                <span className="text-xs font-bold text-white">
                  {EMOTIONS.find((e) => e.id === config.emotion)?.name.charAt(0)}
                </span>
              </div>
            </div>

            {/* Current configuration display */}
            <div className="text-center space-y-2">
              <div className="flex flex-wrap gap-2 justify-center">
                {config.accessories.map((acc) => (
                  <Badge key={acc} variant="secondary" className="text-xs">
                    {AVATAR_OPTIONS.accessories.find((a) => a.id === acc)?.icon}{" "}
                    {AVATAR_OPTIONS.accessories.find((a) => a.id === acc)?.name}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Estado: {EMOTIONS.find((e) => e.id === config.emotion)?.name}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Customization Options */}
        <div className="space-y-6">
          {/* Skin tone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Palette className="w-5 h-5 text-accent" />
                Tono de Piel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_OPTIONS.skin.map((option) => (
                  <Button
                    key={option.id}
                    variant={config.skin === option.id ? "default" : "outline"}
                    className="h-12 flex flex-col gap-1"
                    onClick={() => updateConfig("skin", option.id)}
                  >
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white"
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="text-xs">{option.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hair */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Scissors className="w-5 h-5 text-secondary" />
                Cabello
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_OPTIONS.hair.map((option) => (
                  <Button
                    key={option.id}
                    variant={config.hair === option.id ? "default" : "outline"}
                    className="h-12 flex flex-col gap-1"
                    onClick={() => updateConfig("hair", option.id)}
                  >
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white"
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="text-xs">{option.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Clothing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shirt className="w-5 h-5 text-primary" />
                Ropa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_OPTIONS.clothing.map((option) => (
                  <Button
                    key={option.id}
                    variant={config.clothing === option.id ? "default" : "outline"}
                    className="h-12 flex flex-col gap-1"
                    onClick={() => updateConfig("clothing", option.id)}
                  >
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white"
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="text-xs">{option.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Accessories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Accesorios</CardTitle>
              <CardDescription>Máximo 3 accesorios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {AVATAR_OPTIONS.accessories.map((option) => (
                  <Button
                    key={option.id}
                    variant={config.accessories.includes(option.id) ? "default" : "outline"}
                    className="h-12 flex items-center gap-2"
                    onClick={() => toggleAccessory(option.id)}
                    disabled={!config.accessories.includes(option.id) && config.accessories.length >= 3}
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-xs">{option.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emotion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estado Emocional</CardTitle>
              <CardDescription>Tu avatar reflejará cómo te sientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {EMOTIONS.map((emotion) => (
                  <Button
                    key={emotion.id}
                    variant={config.emotion === emotion.id ? "default" : "outline"}
                    className="h-12 flex flex-col gap-1"
                    onClick={() => updateConfig("emotion", emotion.id)}
                  >
                    <span className="text-lg">{emotion.emoji}</span>
                    <span className="text-xs">{emotion.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save button */}
          <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 h-12 text-lg">
            Guardar Avatar
          </Button>
        </div>
      </div>
    </div>
  )
}
