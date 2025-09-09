"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Download,
  RefreshCw,
  BarChart3,
  Users,
  Target,
  Lightbulb,
  FileText,
  Sparkles,
} from "lucide-react"

interface AIInsight {
  id: string
  type: "pattern" | "recommendation" | "alert" | "achievement"
  title: string
  description: string
  confidence: number
  priority: "high" | "medium" | "low"
  participantId?: string
  sessionId?: string
  timestamp: string
}

interface EmotionalTrend {
  emotion: string
  trend: "up" | "down" | "stable"
  change: number
  participants: number
}

interface AIReportingProps {
  sessions: any[]
  participants: any[]
}

export default function AIReporting({ sessions, participants }: AIReportingProps) {
  const [activeTab, setActiveTab] = useState("insights")
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [insights, setInsights] = useState<AIInsight[]>([])

  // Mock AI insights - in real app this would come from AI analysis
  useEffect(() => {
    const mockInsights: AIInsight[] = [
      {
        id: "1",
        type: "pattern",
        title: "Patrón de Mejora Emocional Detectado",
        description:
          "Ana muestra una tendencia positiva en sus registros emocionales, con un aumento del 40% en emociones positivas durante las últimas 3 sesiones.",
        confidence: 92,
        priority: "high",
        participantId: "p1",
        timestamp: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        type: "alert",
        title: "Atención Requerida",
        description:
          "María ha registrado emociones de tristeza con alta intensidad en las últimas 2 sesiones. Se recomienda seguimiento individual.",
        confidence: 87,
        priority: "high",
        participantId: "p4",
        timestamp: "2024-01-15T09:15:00Z",
      },
      {
        id: "3",
        type: "recommendation",
        title: "Optimización de Sesión Grupal",
        description:
          "El análisis sugiere que las sesiones grupales de 45 minutos generan mayor participación que las de 60 minutos para este grupo etario.",
        confidence: 78,
        priority: "medium",
        timestamp: "2024-01-15T08:00:00Z",
      },
      {
        id: "4",
        type: "achievement",
        title: "Hito Alcanzado",
        description:
          "Carlos ha completado 5 registros emocionales consecutivos con autoconocimiento mejorado, indicando progreso significativo.",
        confidence: 95,
        priority: "medium",
        participantId: "p2",
        timestamp: "2024-01-14T16:45:00Z",
      },
    ]
    setInsights(mockInsights)
  }, [])

  const emotionalTrends: EmotionalTrend[] = [
    { emotion: "alegria", trend: "up", change: 23, participants: 8 },
    { emotion: "calma", trend: "up", change: 15, participants: 12 },
    { emotion: "sorpresa", trend: "stable", change: 2, participants: 5 },
    { emotion: "tristeza", trend: "down", change: -18, participants: 3 },
    { emotion: "enojo", trend: "down", change: -12, participants: 2 },
    { emotion: "miedo", trend: "down", change: -8, participants: 1 },
  ]

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true)
    // Simulate AI report generation
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGeneratingReport(false)
    // TODO: Implement actual AI report generation
    console.log("Generating AI report for timeframe:", selectedTimeframe)
  }

  const handleExportReport = () => {
    // TODO: Implement report export functionality
    console.log("Exporting AI report")
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "pattern":
        return TrendingUp
      case "alert":
        return AlertCircle
      case "recommendation":
        return Lightbulb
      case "achievement":
        return CheckCircle
      default:
        return Brain
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "pattern":
        return "var(--opcion-blue)"
      case "alert":
        return "#ef4444"
      case "recommendation":
        return "var(--opcion-yellow)"
      case "achievement":
        return "#22c55e"
      default:
        return "var(--opcion-orange)"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "var(--opcion-pink)"
      case "medium":
        return "var(--opcion-orange)"
      case "low":
        return "var(--opcion-blue)"
      default:
        return "var(--opcion-gray)"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6" style={{ color: "var(--opcion-pink)" }} />
            Sistema de Reportes IA
          </h2>
          <p className="text-muted-foreground">
            Análisis inteligente de patrones emocionales y recomendaciones personalizadas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Último día</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            style={{ backgroundColor: "var(--opcion-pink)" }}
          >
            {isGeneratingReport ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {isGeneratingReport ? "Generando..." : "Generar Reporte"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white">
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="predictions">Predicciones</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4">
            {insights.map((insight) => {
              const IconComponent = getInsightIcon(insight.type)
              return (
                <Card
                  key={insight.id}
                  className="border-l-4 hover:shadow-lg transition-all duration-200"
                  style={{ borderLeftColor: getInsightColor(insight.type) }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className="p-2 rounded-full"
                          style={{ backgroundColor: `${getInsightColor(insight.type)}20` }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: getInsightColor(insight.type) }} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <CardDescription className="mt-2 text-sm leading-relaxed">
                            {insight.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge style={{ backgroundColor: getPriorityColor(insight.priority), color: "white" }}>
                          {insight.priority === "high" ? "Alta" : insight.priority === "medium" ? "Media" : "Baja"}
                        </Badge>
                        <div className="text-xs text-muted-foreground">Confianza: {insight.confidence}%</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {new Date(insight.timestamp).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <Progress value={insight.confidence} className="w-24 h-2" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" style={{ color: "var(--opcion-blue)" }} />
                  Tendencias Emocionales
                </CardTitle>
                <CardDescription>
                  Cambios en los patrones emocionales durante{" "}
                  {selectedTimeframe === "week" ? "la última semana" : "el período seleccionado"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {emotionalTrends.map((trend) => (
                  <div key={trend.emotion} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="capitalize font-medium">{trend.emotion}</div>
                      <Badge variant="outline" className="text-xs">
                        {trend.participants} participantes
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {trend.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : trend.trend === "down" ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gray-400" />
                      )}
                      <span
                        className={`font-semibold ${
                          trend.trend === "up"
                            ? "text-green-500"
                            : trend.trend === "down"
                              ? "text-red-500"
                              : "text-gray-500"
                        }`}
                      >
                        {trend.change > 0 ? "+" : ""}
                        {trend.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" style={{ color: "var(--opcion-orange)" }} />
                  Métricas de Participación
                </CardTitle>
                <CardDescription>Análisis de engagement y participación activa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Registros emocionales promedio</span>
                    <span className="font-semibold">3.2/día</span>
                  </div>
                  <Progress value={64} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tiempo promedio en sesión</span>
                    <span className="font-semibold">28 min</span>
                  </div>
                  <Progress value={78} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Participación en chat grupal</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completitud de avatares</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" style={{ color: "var(--opcion-yellow)" }} />
                  Reportes Automatizados
                </CardTitle>
                <CardDescription>Reportes generados automáticamente por el sistema de IA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-2 hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Reporte Semanal</CardTitle>
                      <CardDescription className="text-xs">Análisis completo de la semana</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Participantes:</span>
                          <span className="font-semibold">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sesiones:</span>
                          <span className="font-semibold">8</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Registros:</span>
                          <span className="font-semibold">156</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar PDF
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Reporte Individual</CardTitle>
                      <CardDescription className="text-xs">Progreso personalizado por NNA</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Disponibles:</span>
                          <span className="font-semibold">4</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Actualizados:</span>
                          <span className="font-semibold">Hoy</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Formato:</span>
                          <span className="font-semibold">PDF/Excel</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Ver Reportes
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Reporte de Tendencias</CardTitle>
                      <CardDescription className="text-xs">Análisis de patrones a largo plazo</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Período:</span>
                          <span className="font-semibold">3 meses</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Insights:</span>
                          <span className="font-semibold">23</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Precisión:</span>
                          <span className="font-semibold">94%</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Generar Reporte
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" style={{ color: "var(--opcion-pink)" }} />
                  Predicciones y Recomendaciones
                </CardTitle>
                <CardDescription>Proyecciones basadas en análisis de patrones históricos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Predicciones de Progreso</h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg border-l-4" style={{ borderLeftColor: "var(--opcion-blue)" }}>
                        <div className="font-medium">Ana - Progreso Emocional</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Probabilidad de mejora significativa en las próximas 2 semanas: <strong>87%</strong>
                        </div>
                        <div className="mt-2">
                          <Progress value={87} className="h-2" />
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border-l-4" style={{ borderLeftColor: "var(--opcion-orange)" }}>
                        <div className="font-medium">Carlos - Participación</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Tendencia a mayor participación en sesiones grupales: <strong>73%</strong>
                        </div>
                        <div className="mt-2">
                          <Progress value={73} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Recomendaciones Personalizadas</h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--opcion-gray)" }}>
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-5 h-5 mt-0.5" style={{ color: "var(--opcion-yellow)" }} />
                          <div>
                            <div className="font-medium">Optimización de Horarios</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Las sesiones entre 14:00-16:00 muestran 35% más participación activa
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--opcion-gray)" }}>
                        <div className="flex items-start gap-2">
                          <Users className="w-5 h-5 mt-0.5" style={{ color: "var(--opcion-blue)" }} />
                          <div>
                            <div className="font-medium">Composición de Grupos</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Grupos de 3-4 participantes generan mejor dinámica emocional
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
