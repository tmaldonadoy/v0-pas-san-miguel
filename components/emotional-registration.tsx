"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  ArrowLeft,
  Zap,
  Eye,
  Ear,
  Hand,
  Mouse as Nose,
  Coffee,
  Mic,
  MicOff,
  ImageIcon,
  Send,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

interface EmotionalRegistration {
  emotion: string
  intensity: number
  sensoryTags: string[]
  mode: "quick" | "guided" | "free"
  guidedResponses?: {
    whatPerceived: string
    whatHappenedBefore: string
  }
  freeText?: string
  voiceTranscription?: string
  images?: File[]
  timestamp: Date
  sessionId: string
}

interface EmotionalRegistrationProps {
  userAlias: string
  onBack: () => void
  onSave: (registration: EmotionalRegistration) => void
}

const EMOTIONS = [
  { id: "alegria", name: "Alegría", emoji: "😊", color: "bg-yellow-400" },
  { id: "tristeza", name: "Tristeza", emoji: "😢", color: "bg-blue-400" },
  { id: "enojo", name: "Enojo", emoji: "😠", color: "bg-red-400" },
  { id: "miedo", name: "Miedo", emoji: "😨", color: "bg-purple-400" },
  { id: "calma", name: "Calma", emoji: "😌", color: "bg-green-400" },
  { id: "sorpresa", name: "Sorpresa", emoji: "😲", color: "bg-orange-400" },
]

const SENSORY_TAGS = [
  { id: "vision", name: "Vista", icon: Eye, examples: ["luz intensa", "colores brillantes", "movimiento"] },
  { id: "audicion", name: "Oído", icon: Ear, examples: ["ruido fuerte", "música suave", "silencio"] },
  { id: "tacto", name: "Tacto", icon: Hand, examples: ["textura áspera", "temperatura", "hormigueo"] },
  { id: "olfato", name: "Olfato", icon: Nose, examples: ["aroma dulce", "olor fuerte", "aire fresco"] },
  { id: "gusto", name: "Gusto", icon: Coffee, examples: ["sabor amargo", "dulce", "salado"] },
]

const SELF_CARE_SUGGESTIONS = {
  high_intensity: ["Respira profundo 3 veces", "Busca un lugar tranquilo", "Habla con alguien de confianza"],
  negative_emotions: [
    "Recuerda que es normal sentirse así",
    "Tómate un momento para ti",
    "Considera pedir ayuda si lo necesitas",
  ],
}

export default function EmotionalRegistration({ userAlias, onBack, onSave }: EmotionalRegistrationProps) {
  const [currentStep, setCurrentStep] = useState<"mode" | "emotion" | "sensory" | "details" | "confirmation">("mode")
  const [selectedMode, setSelectedMode] = useState<"quick" | "guided" | "free">("quick")
  const [registration, setRegistration] = useState<Partial<EmotionalRegistration>>({
    sensoryTags: [],
    intensity: 3,
  })

  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showSelfCare, setShowSelfCare] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateRegistration = (updates: Partial<EmotionalRegistration>) => {
    setRegistration((prev) => ({ ...prev, ...updates }))
  }

  const toggleSensoryTag = (tagId: string) => {
    const currentTags = registration.sensoryTags || []
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId)
      : currentTags.length < 3
        ? [...currentTags, tagId]
        : currentTags

    updateRegistration({ sensoryTags: newTags })
  }

  const handleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      setRecordingTime(0)
      // TODO: Implement actual voice recording and transcription
      updateRegistration({ voiceTranscription: "Transcripción de ejemplo de la nota de voz" })
    } else {
      // Start recording
      setIsRecording(true)
      // TODO: Implement actual voice recording
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files
      .filter((file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024)
      .slice(0, 2)

    updateRegistration({ images: validFiles })
  }

  const checkForSelfCareNeeds = () => {
    const intensity = registration.intensity || 3
    const emotion = registration.emotion

    if (intensity >= 4 || ["tristeza", "enojo", "miedo"].includes(emotion || "")) {
      setShowSelfCare(true)
    }
  }

  const handleSave = () => {
    const completeRegistration: EmotionalRegistration = {
      emotion: registration.emotion!,
      intensity: registration.intensity!,
      sensoryTags: registration.sensoryTags!,
      mode: selectedMode,
      guidedResponses: registration.guidedResponses,
      freeText: registration.freeText,
      voiceTranscription: registration.voiceTranscription,
      images: registration.images,
      timestamp: new Date(),
      sessionId: `session_${Date.now()}`,
    }

    onSave(completeRegistration)
  }

  const renderModeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">¿Cómo quieres registrar tu emoción?</h2>
        <p className="text-muted-foreground">Elige la forma que más te guste</p>
      </div>

      <div className="grid gap-4">
        <Card
          className={`cursor-pointer border-2 transition-colors ${
            selectedMode === "quick" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
          onClick={() => setSelectedMode("quick")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Registro Rápido
            </CardTitle>
            <CardDescription>Solo selecciona tu emoción y una sensación. ¡Súper fácil!</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer border-2 transition-colors ${
            selectedMode === "guided" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
          }`}
          onClick={() => setSelectedMode("guided")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              Registro Guiado
            </CardTitle>
            <CardDescription>Te ayudamos con preguntas para explorar mejor tus emociones</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer border-2 transition-colors ${
            selectedMode === "free" ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/50"
          }`}
          onClick={() => setSelectedMode("free")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-secondary" />
              Registro Libre
            </CardTitle>
            <CardDescription>Escribe, dibuja o graba lo que quieras expresar</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Button
        onClick={() => setCurrentStep("emotion")}
        className="w-full bg-primary hover:bg-primary/90"
        disabled={!selectedMode}
      >
        Continuar
      </Button>
    </div>
  )

  const renderEmotionSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">¿Cómo te sientes?</h2>
        <p className="text-muted-foreground">Selecciona la emoción que mejor describe cómo te sientes ahora</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {EMOTIONS.map((emotion) => (
          <Card
            key={emotion.id}
            className={`cursor-pointer border-2 transition-all hover:scale-105 ${
              registration.emotion === emotion.id
                ? "border-primary bg-primary/10 shadow-lg"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => updateRegistration({ emotion: emotion.id })}
          >
            <CardContent className="flex flex-col items-center p-6 space-y-3">
              <div className="text-4xl">{emotion.emoji}</div>
              <div className="text-center">
                <p className="font-medium text-foreground">{emotion.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep("mode")} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Atrás
        </Button>
        <Button
          onClick={() => setCurrentStep("sensory")}
          className="flex-1 bg-primary hover:bg-primary/90"
          disabled={!registration.emotion}
        >
          Continuar
        </Button>
      </div>
    </div>
  )

  const renderSensorySelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">¿Qué percibiste?</h2>
        <p className="text-muted-foreground">Selecciona hasta 3 sensaciones que acompañan tu emoción</p>
      </div>

      <div className="grid gap-4">
        {SENSORY_TAGS.map((tag) => {
          const Icon = tag.icon
          const isSelected = registration.sensoryTags?.includes(tag.id)
          const isDisabled = !isSelected && (registration.sensoryTags?.length || 0) >= 3

          return (
            <Card
              key={tag.id}
              className={`cursor-pointer border-2 transition-colors ${
                isSelected
                  ? "border-accent bg-accent/10"
                  : isDisabled
                    ? "border-muted bg-muted/50 opacity-50"
                    : "border-border hover:border-accent/50"
              }`}
              onClick={() => !isDisabled && toggleSensoryTag(tag.id)}
            >
              <CardContent className="flex items-center p-4 space-x-4">
                <Icon className={`w-6 h-6 ${isSelected ? "text-accent" : "text-muted-foreground"}`} />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{tag.name}</p>
                  <p className="text-sm text-muted-foreground">Ej: {tag.examples.join(", ")}</p>
                </div>
                {isSelected && <CheckCircle className="w-5 h-5 text-accent" />}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep("emotion")} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Atrás
        </Button>
        <Button
          onClick={() => setCurrentStep("details")}
          className="flex-1 bg-primary hover:bg-primary/90"
          disabled={!registration.sensoryTags?.length}
        >
          Continuar
        </Button>
      </div>
    </div>
  )

  const renderDetails = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Cuéntanos más</h2>
        <p className="text-muted-foreground">
          {selectedMode === "quick" && "Solo ajusta la intensidad"}
          {selectedMode === "guided" && "Responde estas preguntas para ayudarnos a entender mejor"}
          {selectedMode === "free" && "Expresa lo que sientes de la forma que prefieras"}
        </p>
      </div>

      {/* Intensity Slider - Always shown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Intensidad</CardTitle>
          <CardDescription>¿Qué tan fuerte sientes esta emoción?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={[registration.intensity || 3]}
            onValueChange={(value) => updateRegistration({ intensity: value[0] })}
            max={5}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Muy poco</span>
            <span className="font-medium text-foreground">{registration.intensity}/5</span>
            <span>Muy fuerte</span>
          </div>
        </CardContent>
      </Card>

      {/* Guided Mode Questions */}
      {selectedMode === "guided" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">¿Qué percibiste exactamente?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe lo que viste, escuchaste, sentiste..."
                value={registration.guidedResponses?.whatPerceived || ""}
                onChange={(e) =>
                  updateRegistration({
                    guidedResponses: {
                      ...registration.guidedResponses,
                      whatPerceived: e.target.value,
                    },
                  })
                }
                className="min-h-20"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">¿Qué pasó antes?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Cuéntanos qué estaba pasando antes de sentir esta emoción..."
                value={registration.guidedResponses?.whatHappenedBefore || ""}
                onChange={(e) =>
                  updateRegistration({
                    guidedResponses: {
                      ...registration.guidedResponses,
                      whatHappenedBefore: e.target.value,
                    },
                  })
                }
                className="min-h-20"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Free Mode */}
      {selectedMode === "free" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expresión Libre</CardTitle>
              <CardDescription>Escribe, graba o sube imágenes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Escribe todo lo que quieras expresar... (máximo 2000 caracteres)"
                value={registration.freeText || ""}
                onChange={(e) => updateRegistration({ freeText: e.target.value })}
                maxLength={2000}
                className="min-h-32"
              />
              <div className="text-xs text-muted-foreground text-right">
                {(registration.freeText || "").length}/2000 caracteres
              </div>

              {/* Voice Recording */}
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleVoiceRecording}
                  className="flex items-center gap-2"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isRecording ? `Detener (${recordingTime}s)` : "Grabar nota de voz"}
                </Button>
                {registration.voiceTranscription && <Badge variant="secondary">Nota de voz grabada</Badge>}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Subir imágenes (máx 2, 5MB c/u)
                </Button>
                {registration.images && registration.images.length > 0 && (
                  <div className="flex gap-2">
                    {registration.images.map((file, index) => (
                      <Badge key={index} variant="secondary">
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Self-care suggestions */}
      {showSelfCare && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Sugerencias de autocuidado:</p>
              <ul className="text-sm space-y-1">
                {(registration.intensity || 0) >= 4 &&
                  SELF_CARE_SUGGESTIONS.high_intensity.map((suggestion, index) => <li key={index}>• {suggestion}</li>)}
                {["tristeza", "enojo", "miedo"].includes(registration.emotion || "") &&
                  SELF_CARE_SUGGESTIONS.negative_emotions.map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep("sensory")} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Atrás
        </Button>
        <Button
          onClick={() => {
            checkForSelfCareNeeds()
            setCurrentStep("confirmation")
          }}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          Revisar
        </Button>
      </div>
    </div>
  )

  const renderConfirmation = () => {
    const selectedEmotion = EMOTIONS.find((e) => e.id === registration.emotion)
    const selectedSensory = SENSORY_TAGS.filter((tag) => registration.sensoryTags?.includes(tag.id))

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Confirma tu registro</h2>
          <p className="text-muted-foreground">Revisa que todo esté correcto antes de guardar</p>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Resumen de tu registro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{selectedEmotion?.emoji}</div>
              <div>
                <p className="font-medium text-foreground">{selectedEmotion?.name}</p>
                <p className="text-sm text-muted-foreground">Intensidad: {registration.intensity}/5</p>
              </div>
            </div>

            <div>
              <p className="font-medium text-foreground mb-2">Sensaciones:</p>
              <div className="flex flex-wrap gap-2">
                {selectedSensory.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedMode === "guided" && registration.guidedResponses && (
              <div className="space-y-2">
                {registration.guidedResponses.whatPerceived && (
                  <div>
                    <p className="font-medium text-foreground text-sm">Lo que percibiste:</p>
                    <p className="text-sm text-muted-foreground">{registration.guidedResponses.whatPerceived}</p>
                  </div>
                )}
                {registration.guidedResponses.whatHappenedBefore && (
                  <div>
                    <p className="font-medium text-foreground text-sm">Qué pasó antes:</p>
                    <p className="text-sm text-muted-foreground">{registration.guidedResponses.whatHappenedBefore}</p>
                  </div>
                )}
              </div>
            )}

            {selectedMode === "free" && (
              <div className="space-y-2">
                {registration.freeText && (
                  <div>
                    <p className="font-medium text-foreground text-sm">Tu expresión:</p>
                    <p className="text-sm text-muted-foreground">{registration.freeText}</p>
                  </div>
                )}
                {registration.voiceTranscription && <Badge variant="outline">Incluye nota de voz</Badge>}
                {registration.images && registration.images.length > 0 && (
                  <Badge variant="outline">{registration.images.length} imagen(es)</Badge>
                )}
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Registrado el {registration.timestamp?.toLocaleString("es-ES")}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCurrentStep("details")} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4 mr-2" />
            Guardar Registro
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Header */}
      <header className="w-full p-6 border-b border-border/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Registro Emocional</h1>
              <p className="text-sm text-muted-foreground">Hola, {userAlias}</p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {["mode", "emotion", "sensory", "details", "confirmation"].map((step, index) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  ["mode", "emotion", "sensory", "details", "confirmation"].indexOf(currentStep) >= index
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {currentStep === "mode" && renderModeSelection()}
        {currentStep === "emotion" && renderEmotionSelection()}
        {currentStep === "sensory" && renderSensorySelection()}
        {currentStep === "details" && renderDetails()}
        {currentStep === "confirmation" && renderConfirmation()}
      </main>
    </div>
  )
}
