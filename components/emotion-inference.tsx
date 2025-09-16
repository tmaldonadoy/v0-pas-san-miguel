import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Eye,
  ThumbsUp,
  ThumbsDown
} from "lucide-react"

interface EmotionInference {
  id: string
  emotion: string
  confidence: number
  reasoning: string[]
  timestamp: Date
  validated?: boolean
  validatedBy?: string
  corrections?: string
}

interface EmotionPattern {
  emotion: string
  frequency: number
  trend: "increasing" | "decreasing" | "stable"
  triggers: string[]
  timePatterns: string[]
}

interface EmotionInferenceProps {
  emotionalRegistries: any[]
  userAlias: string
  isTherapist?: boolean
  onValidateInference?: (inferenceId: string, isValid: boolean, corrections?: string) => void
}

export default function EmotionInference({ 
  emotionalRegistries, 
  userAlias, 
  isTherapist = false,
  onValidateInference 
}: EmotionInferenceProps) {
  const [inferences, setInferences] = useState<EmotionInference[]>([])
  const [patterns, setPatterns] = useState<EmotionPattern[]>([])
  const [selectedInference, setSelectedInference] = useState<string | null>(null)

  // Simple emotion inference algorithm
  useEffect(() => {
    if (emotionalRegistries.length === 0) return

    const generateInferences = () => {
      const newInferences: EmotionInference[] = []
      const emotionCounts: Record<string, number> = {}
      const recentRegistries = emotionalRegistries.slice(-5) // Last 5 registries

      // Count emotion frequencies
      recentRegistries.forEach(registry => {
        emotionCounts[registry.emotion] = (emotionCounts[registry.emotion] || 0) + 1
      })

      // Generate pattern-based inferences
      const mostFrequent = Object.entries(emotionCounts)
        .sort(([,a], [,b]) => b - a)[0]

      if (mostFrequent && mostFrequent[1] >= 3) {
        const reasoning = [
          `${userAlias} ha registrado "${mostFrequent[0]}" ${mostFrequent[1]} veces en las últimas sesiones`,
          "Patrón consistente observado en los registros recientes",
          "Recomendación: Explorar factores desencadenantes"
        ]

        newInferences.push({
          id: `inf_${Date.now()}_pattern`,
          emotion: mostFrequent[0],
          confidence: Math.min(95, (mostFrequent[1] / recentRegistries.length) * 100),
          reasoning,
          timestamp: new Date(),
        })
      }

      // Intensity-based inference
      const highIntensityRegistries = recentRegistries.filter(r => r.intensity >= 4)
      if (highIntensityRegistries.length >= 2) {
        const reasoning = [
          `Se detectaron ${highIntensityRegistries.length} registros de alta intensidad`,
          "Posible necesidad de estrategias de regulación emocional",
          "Considerar intervención de apoyo"
        ]

        newInferences.push({
          id: `inf_${Date.now()}_intensity`,
          emotion: "alta_intensidad",
          confidence: 78,
          reasoning,
          timestamp: new Date(),
        })
      }

      // Time-based patterns
      const timePatterns = analyzeTimePatterns(recentRegistries)
      if (timePatterns.length > 0) {
        const reasoning = [
          "Patrón temporal identificado en los registros",
          `Tendencia observada: ${timePatterns[0]}`,
          "Considerar factores contextuales del horario"
        ]

        newInferences.push({
          id: `inf_${Date.now()}_time`,
          emotion: "patron_temporal",
          confidence: 65,
          reasoning,
          timestamp: new Date(),
        })
      }

      setInferences(newInferences)
    }

    generateInferences()
  }, [emotionalRegistries, userAlias])

  const analyzeTimePatterns = (registries: any[]) => {
    const patterns: string[] = []
    const hourCounts: Record<number, number> = {}

    registries.forEach(registry => {
      const hour = new Date(registry.timestamp).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    const peakHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]

    if (peakHour && peakHour[1] >= 2) {
      if (parseInt(peakHour[0]) < 12) {
        patterns.push("Registros más frecuentes en la mañana")
      } else if (parseInt(peakHour[0]) < 18) {
        patterns.push("Registros más frecuentes en la tarde")
      } else {
        patterns.push("Registros más frecuentes en la noche")
      }
    }

    return patterns
  }

  const handleValidation = (inferenceId: string, isValid: boolean) => {
    setInferences(prev => prev.map(inf => 
      inf.id === inferenceId 
        ? { ...inf, validated: isValid, validatedBy: "Terapeuta" }
        : inf
    ))
    
    if (onValidateInference) {
      onValidateInference(inferenceId, isValid)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return CheckCircle
    if (confidence >= 60) return AlertTriangle
    return XCircle
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6" style={{ color: "var(--opcion-pink)" }} />
            Inferencia de Emociones
          </h2>
          <p className="text-muted-foreground">
            Análisis automático de patrones emocionales para {userAlias}
          </p>
        </div>
        {isTherapist && (
          <Badge variant="outline" className="bg-blue-50">
            <Eye className="w-4 h-4 mr-1" />
            Vista Profesional
          </Badge>
        )}
      </div>

      {/* Disclaimer */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Importante:</strong> Estas son hipótesis generadas automáticamente, no diagnósticos. 
          Siempre requieren validación profesional.
        </AlertDescription>
      </Alert>

      {/* Inferences */}
      <div className="grid gap-4">
        {inferences.map((inference) => {
          const ConfidenceIcon = getConfidenceIcon(inference.confidence)
          return (
            <Card 
              key={inference.id}
              className={`border-l-4 transition-all duration-200 ${
                inference.validated === true ? 'border-l-green-500 bg-green-50' :
                inference.validated === false ? 'border-l-red-500 bg-red-50' :
                'border-l-blue-500'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg capitalize">
                        Hipótesis: {inference.emotion.replace(/_/g, ' ')}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <ConfidenceIcon className={`w-4 h-4 ${getConfidenceColor(inference.confidence)}`} />
                        Confianza: {inference.confidence}%
                        <span className="text-xs text-muted-foreground">
                          • {inference.timestamp.toLocaleString('es-ES')}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  
                  {inference.validated !== undefined && (
                    <Badge 
                      variant={inference.validated ? "default" : "destructive"}
                      className="ml-2"
                    >
                      {inference.validated ? "✓ Validada" : "✗ Rechazada"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Razonamiento del algoritmo:</h4>
                  <ul className="space-y-1">
                    {inference.reasoning.map((reason, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Nivel de confianza</span>
                    <span className={`text-sm font-semibold ${getConfidenceColor(inference.confidence)}`}>
                      {inference.confidence}%
                    </span>
                  </div>
                  <Progress value={inference.confidence} className="h-2" />
                </div>

                {/* Validation controls for therapists */}
                {isTherapist && inference.validated === undefined && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      onClick={() => handleValidation(inference.id, true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Validar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleValidation(inference.id, false)}
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      Rechazar
                    </Button>
                  </div>
                )}

                {inference.validated !== undefined && (
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    {inference.validated ? "✓" : "✗"} Validada por {inference.validatedBy} • 
                    {inference.timestamp.toLocaleString('es-ES')}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {inferences.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="text-center py-8">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Sin inferencias disponibles</h3>
            <p className="text-sm text-muted-foreground">
              Se necesitan más registros emocionales para generar hipótesis automáticas
            </p>
          </CardContent>
        </Card>
      )}

      {/* Algorithm explanation */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">¿Cómo funciona el algoritmo?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-2">
          <p>• <strong>Análisis de frecuencia:</strong> Identifica emociones registradas repetidamente</p>
          <p>• <strong>Análisis de intensidad:</strong> Detecta patrones de alta intensidad emocional</p>
          <p>• <strong>Análisis temporal:</strong> Busca patrones relacionados con horarios</p>
          <p>• <strong>Validación requerida:</strong> Todas las hipótesis deben ser revisadas por un profesional</p>
        </CardContent>
      </Card>
    </div>
  )
}