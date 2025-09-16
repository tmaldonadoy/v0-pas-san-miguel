"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Palette, Shirt, Scissors, Sparkles } from "lucide-react"

interface AvatarConfig {
  skin: string
  hair: string
  clothing: string
  accessories: string[]
  emotion: string
  level: number
  unlockedItems: string[]
}

const AVATAR_OPTIONS = {
  skin: [
    { id: "light", name: "Clara", color: "#F5DEB3" },
    { id: "medium", name: "Morena", color: "#D2B48C" },
    { id: "dark", name: "Oscura", color: "#8B4513" },
    { id: "warm", name: "Cálida", color: "#DEB887" },
  ],
  hair: [
    { id: "short", name: "Corto", color: "#8B4513" },
    { id: "long", name: "Largo", color: "#654321" },
    { id: "curly", name: "Rizado", color: "#2F1B14" },
    { id: "wavy", name: "Ondulado", color: "#A0522D" },
    { id: "straight", name: "Liso", color: "#8B4513" },
  ],
  clothing: [
    { id: "casual", name: "Casual", color: "#4A90E2" },
    { id: "formal", name: "Elegante", color: "#7B68EE" },
    { id: "sporty", name: "Deportivo", color: "#32CD32" },
    { id: "colorful", name: "Colorido", color: "#FF6B6B" },
    { id: "cozy", name: "Cómodo", color: "#FFB347" },
  ],
  accessories: [
    { id: "glasses", name: "Lentes", icon: "👓" },
    { id: "hat", name: "Gorro", icon: "🧢" },
    { id: "necklace", name: "Collar", icon: "📿" },
    { id: "watch", name: "Reloj", icon: "⌚" },
    { id: "earrings", name: "Aretes", icon: "💎" },
    { id: "backpack", name: "Mochila", icon: "🎒" },
    { id: "bow", name: "Moño", icon: "🎀" },
    { id: "bracelet", name: "Pulsera", icon: "📿" },
  ],
}

// Emociones sincronizadas con emotional-registration
const EMOTIONS = [
  { id: "ansiedad", name: "Ansiedad", color: "bg-red-400", emoji: "😰" },
  { id: "rechazo", name: "Rechazo", color: "bg-gray-400", emoji: "😔" },
  { id: "frustracion", name: "Frustración", color: "bg-orange-400", emoji: "😤" },
  { id: "rabia", name: "Rabia", color: "bg-red-500", emoji: "😡" },
  { id: "miedo", name: "Miedo", color: "bg-purple-400", emoji: "😨" },
  { id: "entretenimiento", name: "Entretenimiento", color: "bg-blue-400", emoji: "🎉" },
  { id: "alegria", name: "Alegría", color: "bg-yellow-400", emoji: "😊" },
  { id: "aceptado", name: "Aceptado", color: "bg-green-400", emoji: "🤗" },
]

interface AvatarEditorProps {
  onSave: (config: AvatarConfig) => void
  initialConfig?: AvatarConfig
}

export default function AvatarEditor({ onSave, initialConfig }: AvatarEditorProps) {
  const [config, setConfig] = useState<AvatarConfig>(() => {
    const defaultConfig = {
      skin: "light",
      hair: "short",
      clothing: "casual",
      accessories: [],
      emotion: "alegria",
      level: 1,
      unlockedItems: ["light", "medium", "short", "long", "casual", "sporty", "glasses", "hat"],
    }
    
    return initialConfig ? {
      ...defaultConfig,
      ...initialConfig,
      accessories: initialConfig.accessories || [],
      unlockedItems: initialConfig.unlockedItems || defaultConfig.unlockedItems,
    } : defaultConfig
  })

  const updateConfig = (key: keyof AvatarConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const toggleAccessory = (accessoryId: string) => {
    setConfig((prev) => {
      const accessories = prev.accessories || []
      return {
        ...prev,
        accessories: accessories.includes(accessoryId)
          ? accessories.filter((id) => id !== accessoryId)
          : accessories.length < 3
            ? [...accessories, accessoryId]
            : accessories,
      }
    })
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
                {(config.accessories || []).map((acc) => {
                  const accessory = AVATAR_OPTIONS.accessories.find((a) => a.id === acc)
                  return accessory ? (
                    <Badge key={acc} variant="secondary" className="text-xs">
                      {accessory.icon} {accessory.name}
                    </Badge>
                  ) : null
                })}
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
              <CardDescription>Máximo 3 accesorios • Nivel {config.level}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {AVATAR_OPTIONS.accessories.map((option) => {
                  const isUnlocked = (config.unlockedItems || []).includes(option.id)
                  const isSelected = (config.accessories || []).includes(option.id)
                  
                  return (
                    <Button
                      key={option.id}
                      variant={isSelected ? "default" : "outline"}
                      className="h-12 flex items-center gap-2"
                      onClick={() => toggleAccessory(option.id)}
                      disabled={(!isSelected && (config.accessories || []).length >= 3) || !isUnlocked}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-xs">{option.name}</span>
                        {!isUnlocked && <span className="text-xs text-muted-foreground">🔒 Nivel {Math.ceil(Math.random() * 5) + 1}</span>}
                      </div>
                    </Button>
                  )
                })}
              </div>
              
              {/* Progress indicator */}
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progreso del Avatar</span>
                  <span className="text-sm text-muted-foreground">Nivel {config.level}</span>
                </div>
                <Progress value={(config.level / 10) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Completa más sesiones para desbloquear nuevos elementos
                </p>
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
