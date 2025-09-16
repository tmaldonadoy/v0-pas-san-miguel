"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, MessageSquare, Camera, Mic, Shield, Bell, Palette } from "lucide-react"
import { useSyncContext, useNNAProfile } from "@/components/sync-provider"

interface NNASettingsProps {
  userAlias: string
  onBack: () => void
  currentUser?: { alias?: string; role?: "nna" | "facilitator" }
  avatarConfig?: any
  emotionalRegistries?: any[]
}

// Emociones sincronizadas
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

export default function NNASettings({ userAlias, onBack, currentUser, avatarConfig, emotionalRegistries = [] }: NNASettingsProps) {
  const { state } = useSyncContext()
  const { profile, updateProfile, canUpgradeLevel } = useNNAProfile()
  
  // Datos del perfil NNA desde el contexto de sincronización
  const nnaData = {
    level: profile?.level || avatarConfig?.level || 1,
    registriesCount: emotionalRegistries.length,
    joinDate: "15 de enero, 2024",
    permissions: profile?.permissions || {
      canUpgradeLevel: false,
      canChangeSettings: true,
      maxRegistriesPerDay: 10
    }
  }
  const [settings, setSettings] = useState({
    // Privacy Settings
    shareRegistriesWithGroup: false,
    allowPeerMessages: true,
    
    // Communication Preferences
    canSendImages: true,
    canUseVoiceNotes: true,
    autoSaveRegistries: true,
    
    // Notification Settings
    dailyReminders: true,
    sessionNotifications: true,
    achievementNotifications: true,
    
    // Accessibility
    largeText: false,
    highContrast: false,
    reducedAnimations: false
  })

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const saveSettings = () => {
    // Guardar configuración usando el sistema de sincronización
    if (updateProfile) {
      updateProfile({
        settings: settings,
        lastUpdated: new Date().toISOString()
      })
    }
    
    // Aplicar configuraciones de accesibilidad
    if (settings.largeText) {
      document.documentElement.style.fontSize = '1.1em'
    } else {
      document.documentElement.style.fontSize = ''
    }
    
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
    
    if (settings.reducedAnimations) {
      document.documentElement.style.setProperty('--animation-duration', '0s')
    } else {
      document.documentElement.style.removeProperty('--animation-duration')
    }
    
    console.log("Configuración guardada:", settings)
  }
  
  // Cargar configuración del perfil al montar el componente
  useEffect(() => {
    if (profile?.settings) {
      setSettings(prev => ({ ...prev, ...profile.settings }))
    }
  }, [profile])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <header className="w-full p-6 border-b border-border/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Configuración</h1>
              <p className="text-sm text-muted-foreground">Hola, {userAlias}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacidad y Seguridad
              </CardTitle>
              <CardDescription>
                Controla quién puede ver tu información y cómo se comparte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="share-registries">Compartir registros emocionales en talleres</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que otros participantes vean tus registros durante sesiones grupales
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="share-registries"
                  checked={settings.shareRegistriesWithGroup}
                  onChange={() => handleSettingChange('shareRegistriesWithGroup')}
                  className="rounded border border-input"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="peer-messages">Permitir mensajes de otros participantes</Label>
                  <p className="text-sm text-muted-foreground">
                    Otros niños del grupo podrán enviarte mensajes directos
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="peer-messages"
                  checked={settings.allowPeerMessages}
                  onChange={() => handleSettingChange('allowPeerMessages')}
                  className="rounded border border-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Communication Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Comunicación
              </CardTitle>
              <CardDescription>
                Configura cómo quieres comunicarte en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="send-images">Enviar imágenes</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite subir fotos en tus registros y chats
                  </p>
                </div>
                <input
                  id="send-images"
                  checked={settings.canSendImages}
                  onChange={() => handleSettingChange('canSendImages')}
                  className="rounded border border-input"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="voice-notes">Notas de voz</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite grabar mensajes de voz para expresarte mejor
                  </p>
                </div>
                <input
                  id="voice-notes"
                  checked={settings.canUseVoiceNotes}
                  onChange={() => handleSettingChange('canUseVoiceNotes')}
                  className="rounded border border-input"
                  type="checkbox"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-save">Guardar registros automáticamente</Label>
                  <p className="text-sm text-muted-foreground">
                    Guarda tus registros emocionales sin necesidad de confirmar
                  </p>
                </div>
                <input
                  id="auto-save"
                  checked={settings.autoSaveRegistries}
                  onChange={() => handleSettingChange('autoSaveRegistries')}
                  className="rounded border border-input"
                  type="checkbox"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notificaciones
              </CardTitle>
              <CardDescription>
                Decide qué notificaciones quieres recibir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="daily-reminders">Recordatorios diarios</Label>
                  <p className="text-sm text-muted-foreground">
                    Te recordamos registrar tus emociones cada día
                  </p>
                </div>
                <input
                  id="daily-reminders"
                  checked={settings.dailyReminders}
                  onChange={() => handleSettingChange('dailyReminders')}
                  className="rounded border border-input"
                  type="checkbox"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="session-notifications">Notificaciones de sesión</Label>
                  <p className="text-sm text-muted-foreground">
                    Te avisamos cuando empiecen las sesiones grupales
                  </p>
                </div>
                <input
                  id="session-notifications"
                  checked={settings.sessionNotifications}
                  onChange={() => handleSettingChange('sessionNotifications')}
                  className="rounded border border-input"
                  type="checkbox"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="achievement-notifications">Logros y recompensas</Label>
                  <p className="text-sm text-muted-foreground">
                    Te felicitamos cuando desbloquees nuevos elementos
                  </p>
                </div>
                <input
                  id="achievement-notifications"
                  checked={settings.achievementNotifications}
                  onChange={() => handleSettingChange('achievementNotifications')}
                  className="rounded border border-input"
                  type="checkbox"
                />
              </div>
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Accesibilidad
              </CardTitle>
              <CardDescription>
                Ajustes para hacer la plataforma más fácil de usar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="large-text">Texto más grande</Label>
                  <p className="text-sm text-muted-foreground">
                    Aumenta el tamaño del texto para leer mejor
                  </p>
                </div>
                <input
                  id="large-text"
                  checked={settings.largeText}
                  onChange={() => handleSettingChange('largeText')}
                  className="rounded border border-input"
                  type="checkbox"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="high-contrast">Alto contraste</Label>
                  <p className="text-sm text-muted-foreground">
                    Colores más fuertes para ver mejor las diferencias
                  </p>
                </div>
                <input
                  id="high-contrast"
                  checked={settings.highContrast}
                  onChange={() => handleSettingChange('highContrast')}
                  className="rounded border border-input"
                  type="checkbox"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="reduced-animations">Menos animaciones</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce los movimientos en pantalla si te marean
                  </p>
                </div>
                <input
                  id="reduced-animations"
                  checked={settings.reducedAnimations}
                  onChange={() => handleSettingChange('reducedAnimations')}
                  className="rounded border border-input"
                  type="checkbox"
                />
              </div>
            </CardContent>
          </Card>

          {/* Avatar Emotion State */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Estado Emocional del Avatar
              </CardTitle>
              <CardDescription>
                Configura cómo quieres que tu avatar refleje tus emociones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {EMOTIONS.map((emotion) => {
                  const isSelected = avatarConfig?.emotion === emotion.id
                  return (
                    <div
                      key={emotion.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                        isSelected 
                          ? 'border-primary bg-primary/10' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        if (updateProfile) {
                          updateProfile({ 
                            avatar: { ...avatarConfig, emotion: emotion.id },
                            lastUpdated: new Date().toISOString()
                          })
                        }
                      }}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{emotion.emoji}</div>
                        <div className="text-xs font-medium capitalize">{emotion.name}</div>
                        {isSelected && (
                          <div className="text-xs text-primary mt-1 font-semibold">Actual</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Consejo:</strong> Tu avatar cambiará su expresión según la emoción que selecciones. 
                  También puedes cambiarla cuando hagas registros emocionales.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la cuenta</CardTitle>
              <CardDescription>
                Detalles de tu perfil (solo el facilitador puede cambiar algunos datos)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Alias</Label>
                  <p className="text-sm text-muted-foreground">{userAlias}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nivel actual</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Nivel {nnaData.level}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {canUpgradeLevel 
                        ? "(Puedes subir de nivel)"
                        : "(Solo el facilitador puede cambiar tu nivel)"}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Registros totales</Label>
                  <p className="text-sm text-muted-foreground">{nnaData.registriesCount} emociones registradas</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha de registro</Label>
                  <p className="text-sm text-muted-foreground">{nnaData.joinDate}</p>
                </div>
              </div>
              
              {/* Connection Status */}
              <div className={`mt-4 p-3 rounded-lg ${
                state.isOnline 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    state.isOnline ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    state.isOnline ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {state.isOnline ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                {state.pendingChanges.length > 0 && (
                  <p className="text-xs text-yellow-700 mt-1">
                    Tienes {state.pendingChanges.length} cambios pendientes de sincronizar
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={saveSettings} className="bg-primary hover:bg-primary/90">
              Guardar configuración
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}