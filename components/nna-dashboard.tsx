"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, User, Calendar, BarChart3, Settings, LogOut, Sparkles, MessageCircle, BookOpen } from "lucide-react"
import ModeManager from "./mode-manager"

interface NNADashboardProps {
  userAlias: string
  avatarConfig?: any
  onEditAvatar: () => void
  onStartEmotionalRegistry: () => void
  onOpenChat: () => void
  onOpenContainment: () => void
  onLogout: () => void
}

export default function NNADashboard({
  userAlias,
  avatarConfig,
  onEditAvatar,
  onStartEmotionalRegistry,
  onOpenChat,
  onOpenContainment,
  onLogout,
}: NNADashboardProps) {
  const [currentMode, setCurrentMode] = useState<{
    currentMode: "individual" | "taller"
    sessionDuration?: number
    sessionEndTime?: Date
    permissions: {
      canReceiveDirectMessages: boolean
      canShareRegistriesWithGroup: boolean
      canSendImages: boolean
      canUseVoiceNotes: boolean
    }
    groupSettings?: {
      allowPeerToPeer: boolean
      moderationLevel: "low" | "medium" | "high"
      maxMessageLength: number
    }
  }>({
    currentMode: "individual",
    permissions: {
      canReceiveDirectMessages: true,
      canShareRegistriesWithGroup: false,
      canSendImages: true,
      canUseVoiceNotes: true,
    },
  })

  // Mock data for demonstration
  const todayRegistries = 3
  const weeklyGoal = 5
  const currentEmotion = avatarConfig?.emotion || "happy"

  const emotionEmojis: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    scared: "😨",
    calm: "😌",
    surprised: "😲",
  }

  const recentActivities = [
    { time: "10:30", activity: "Registro emocional: Feliz", type: "emotion" },
    { time: "09:15", activity: "Personalización de avatar", type: "avatar" },
    { time: "08:45", activity: "Sesión individual completada", type: "session" },
  ]

  const handleModeChange = (newMode: "individual" | "taller") => {
    setCurrentMode((prev) => ({ ...prev, currentMode: newMode }))
  }

  const handleSettingsChange = (settings: any) => {
    setCurrentMode(settings)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Header */}
      <header className="w-full p-6 border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
              <img 
                src="/new_logo.png" 
                alt="Inner World Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">¡Hola, {userAlias}!</h1>
              <p className="text-sm text-muted-foreground">
                Modo:{" "}
                <Badge variant={currentMode.currentMode === "individual" ? "default" : "secondary"}>
                  {currentMode.currentMode === "individual" ? "Individual" : "Taller"}
                </Badge>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Column - Avatar & Quick Actions */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center gap-2 justify-center">
                  <User className="w-5 h-5 text-primary" />
                  Mi Avatar
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden bg-gradient-to-br from-card to-muted flex items-center justify-center">
                  <div className="text-4xl">{emotionEmojis[currentEmotion] || "😊"}</div>
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">Estado actual</p>
                  <p className="text-sm text-muted-foreground capitalize">{currentEmotion}</p>
                </div>
                <Button onClick={onEditAvatar} variant="outline" className="w-full bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Personalizar
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={onStartEmotionalRegistry} className="w-full bg-primary hover:bg-primary/90">
                  <Heart className="w-4 h-4 mr-2" />
                  Registrar Emoción
                </Button>

                <Button 
                  onClick={onOpenContainment} 
                  variant="outline" 
                  className="w-full"
                  style={{ backgroundColor: "var(--opcion-blue)10", borderColor: "var(--opcion-blue)" }}
                >
                  <Heart className="w-4 h-4 mr-2" style={{ color: "var(--opcion-blue)" }} />
                  Espacio de Calma
                </Button>

                <Button
                  onClick={onOpenChat}
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled={currentMode.currentMode === "individual"}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat Grupal
                  {currentMode.currentMode === "individual" && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Solo en Taller
                    </Badge>
                  )}
                </Button>

                <Button variant="outline" className="w-full bg-transparent">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Mi Diario
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Today's Progress */}
          <div className="space-y-6">
            {/* Daily Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  Progreso de Hoy
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Registros emocionales</span>
                    <span>
                      {todayRegistries}/{weeklyGoal}
                    </span>
                  </div>
                  <Progress value={(todayRegistries / weeklyGoal) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{todayRegistries}</div>
                    <div className="text-xs text-muted-foreground">Registros</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-accent">2</div>
                    <div className="text-xs text-muted-foreground">Sesiones</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emotional Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-secondary" />
                  Resumen Emocional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">😊</span>
                      <span className="text-sm">Feliz</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={60} className="w-16 h-2" />
                      <span className="text-xs text-muted-foreground">60%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">😌</span>
                      <span className="text-sm">Tranquilo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={30} className="w-16 h-2" />
                      <span className="text-xs text-muted-foreground">30%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">😲</span>
                      <span className="text-sm">Sorprendido</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={10} className="w-16 h-2" />
                      <span className="text-xs text-muted-foreground">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Mode Manager & Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <ModeManager
              userAlias={userAlias}
              currentSettings={currentMode}
              onModeChange={handleModeChange}
              onSettingsChange={handleSettingsChange}
              isParticipant={true}
            />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground font-mono mt-1">{activity.time}</div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.activity}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {activity.type === "emotion" && "💝"}
                          {activity.type === "avatar" && "👤"}
                          {activity.type === "session" && "📚"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg text-accent">💡 Consejo del Día</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {currentMode.currentMode === "individual"
                    ? "En modo individual, puedes explorar tus emociones a tu ritmo. Registra cómo te sientes cuando quieras."
                    : "En modo taller, puedes compartir y aprender con otros. Recuerda ser respetuoso y pedir turno para hablar."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
