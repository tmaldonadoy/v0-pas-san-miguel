"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, User, Clock, Settings, MessageCircle, Eye, EyeOff } from "lucide-react"

interface ModeSettings {
  currentMode: "individual" | "taller"
  sessionDuration?: number // in minutes
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
}

interface ModeManagerProps {
  userAlias: string
  currentSettings: ModeSettings
  onModeChange: (newMode: "individual" | "taller") => void
  onSettingsChange: (settings: ModeSettings) => void
  isParticipant?: boolean // true if this is shown to NNA, false if shown to facilitator
}

export default function ModeManager({
  userAlias,
  currentSettings,
  onModeChange,
  onSettingsChange,
  isParticipant = true,
}: ModeManagerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (currentSettings.sessionEndTime) {
      const interval = setInterval(() => {
        const now = new Date()
        const remaining = Math.max(0, currentSettings.sessionEndTime!.getTime() - now.getTime())
        setTimeRemaining(Math.floor(remaining / 1000))

        if (remaining <= 0) {
          onModeChange("individual")
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [currentSettings.sessionEndTime, onModeChange])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getModeDescription = () => {
    if (currentSettings.currentMode === "individual") {
      return {
        title: "Modo Individual",
        description: "Tu espacio privado y personal",
        color: "bg-blue-100 text-blue-800",
        icon: User,
        features: [
          "Solo tú puedes ver tus registros",
          "Comunicación directa con facilitador",
          "Sugerencias personalizadas",
          "Avatar y progreso privados",
        ],
      }
    } else {
      return {
        title: "Modo Taller",
        description: "Sesión grupal colaborativa",
        color: "bg-green-100 text-green-800",
        icon: Users,
        features: [
          "Chat grupal moderado",
          "Vista de avatares del grupo",
          "Actividades colaborativas",
          "Comunicación dirigida",
        ],
      }
    }
  }

  const modeInfo = getModeDescription()
  const Icon = modeInfo.icon

  return (
    <div className="space-y-6">
      {/* Current Mode Status */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            {modeInfo.title}
            <Badge className={modeInfo.color}>Activo</Badge>
          </CardTitle>
          <CardDescription>{modeInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Session Timer for Taller Mode */}
          {currentSettings.currentMode === "taller" && timeRemaining !== null && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Tiempo restante de sesión:</span>
                  <Badge variant="outline" className="font-mono text-lg">
                    {formatTime(timeRemaining)}
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Mode Features */}
          <div>
            <h4 className="font-medium text-foreground mb-2">Características disponibles:</h4>
            <ul className="space-y-1">
              {modeInfo.features.map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Current Permissions */}
          <div>
            <h4 className="font-medium text-foreground mb-2">Permisos actuales:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                {currentSettings.permissions.canReceiveDirectMessages ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">Mensajes directos</span>
              </div>

              <div className="flex items-center gap-2">
                {currentSettings.permissions.canShareRegistriesWithGroup ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">Compartir registros</span>
              </div>

              <div className="flex items-center gap-2">
                {currentSettings.permissions.canSendImages ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">Enviar imágenes</span>
              </div>

              <div className="flex items-center gap-2">
                {currentSettings.permissions.canUseVoiceNotes ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">Notas de voz</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mode Transition Notification */}
      {currentSettings.currentMode === "taller" && timeRemaining !== null && timeRemaining < 300 && (
        <Alert className="border-orange-200 bg-orange-50">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Aviso:</strong> La sesión de taller terminará pronto. Automáticamente cambiarás al modo individual
            cuando termine el tiempo.
          </AlertDescription>
        </Alert>
      )}

      {/* Privacy Notice */}
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg text-accent">🔒 Privacidad y Seguridad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Todos los mensajes y registros se guardan de forma pseudonimizada</p>
            <p>• Los facilitadores pueden ver las comunicaciones para tu seguridad</p>
            <p>• Puedes solicitar que ciertos registros no sean procesados por IA</p>
            <p>• Siempre puedes hablar en privado con el facilitador</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions based on mode */}
      {isParticipant && (
        <div className="flex gap-3">
          {currentSettings.currentMode === "individual" ? (
            <Button variant="outline" className="flex-1 bg-transparent" disabled>
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat no disponible
            </Button>
          ) : (
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              <MessageCircle className="w-4 h-4 mr-2" />
              Abrir Chat Grupal
            </Button>
          )}

          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
        </div>
      )}
    </div>
  )
}
