import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Clock,
  Users,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface SessionReport {
  id: string
  sessionId: string
  participantId: string
  participantAlias: string
  startTime: Date
  endTime: Date
  emotionalRegistries: any[]
  summary: {
    dominantEmotion: string
    emotionalVariability: number
    engagementLevel: number
    significantChanges: string[]
    recommendations: string[]
  }
  generatedAt: Date
}

interface SessionReportsProps {
  sessions: any[]
  participants: any[]
  isTherapist?: boolean
}

export default function SessionReports({ sessions, participants, isTherapist = false }: SessionReportsProps) {
  const [reports, setReports] = useState<SessionReport[]>([])
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate micro-reports automatically after sessions
  useEffect(() => {
    const generateReports = () => {
      const newReports: SessionReport[] = []

      sessions.forEach(session => {
        session.participants.forEach((participant: any) => {
          // Mock emotional registries for demonstration
          const mockRegistries = [
            { emotion: "alegria", intensity: 4, timestamp: new Date(), mode: "quick" },
            { emotion: "ansiedad", intensity: 2, timestamp: new Date(), mode: "guided" },
            { emotion: "aceptado", intensity: 5, timestamp: new Date(), mode: "quick" },
          ]

          const report: SessionReport = {
            id: `report_${session.id}_${participant.id}`,
            sessionId: session.id,
            participantId: participant.id,
            participantAlias: participant.alias,
            startTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
            endTime: new Date(),
            emotionalRegistries: mockRegistries,
            summary: generateSummary(mockRegistries, participant),
            generatedAt: new Date(),
          }

          newReports.push(report)
        })
      })

      setReports(newReports)
    }

    if (sessions.length > 0) {
      generateReports()
    }
  }, [sessions])

  const generateSummary = (registries: any[], participant: any) => {
    const emotionCounts: Record<string, number> = {}
    let totalIntensity = 0

    registries.forEach(registry => {
      emotionCounts[registry.emotion] = (emotionCounts[registry.emotion] || 0) + 1
      totalIntensity += registry.intensity
    })

    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "neutral"

    const avgIntensity = totalIntensity / registries.length
    const emotionalVariability = Math.random() * 100 // Mock calculation

    const significantChanges = []
    const recommendations = []

    if (avgIntensity >= 4) {
      significantChanges.push("Alta intensidad emocional registrada")
      recommendations.push("Considerar técnicas de regulación emocional")
    }

    if (dominantEmotion === "ansiedad" || dominantEmotion === "miedo") {
      significantChanges.push(`Predominio de ${dominantEmotion}`)
      recommendations.push("Explorar factores desencadenantes de ansiedad")
    }

    if (registries.length >= 3) {
      significantChanges.push("Participación activa en registros")
      recommendations.push("Mantener frecuencia de registros")
    }

    return {
      dominantEmotion,
      emotionalVariability,
      engagementLevel: Math.min(100, (registries.length / 5) * 100),
      significantChanges,
      recommendations,
    }
  }

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  const handleExportPDF = (reportId: string) => {
    // Mock PDF export
    const report = reports.find(r => r.id === reportId)
    if (report) {
      console.log(`Exporting PDF for ${report.participantAlias}`)
      // In real implementation, this would generate and download a PDF
    }
  }

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      alegria: "#F2B035",
      ansiedad: "#E53E3E",
      aceptado: "#38A169",
      miedo: "#805AD5",
      frustracion: "#DD6B20",
      rabia: "#C53030",
      entretenimiento: "#3182CE",
      rechazo: "#718096",
    }
    return colors[emotion] || "#718096"
  }

  const selectedReportData = reports.find(r => r.id === selectedReport)

  if (selectedReportData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => setSelectedReport(null)}>
              ← Volver a reportes
            </Button>
            <h2 className="text-2xl font-bold mt-2">
              Reporte de Sesión - {selectedReportData.participantAlias}
            </h2>
            <p className="text-muted-foreground">
              {selectedReportData.startTime.toLocaleDateString('es-ES')} • 
              Duración: {Math.round((selectedReportData.endTime.getTime() - selectedReportData.startTime.getTime()) / (1000 * 60))} min
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleExportPDF(selectedReportData.id)}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Summary Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Emoción Dominante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getEmotionColor(selectedReportData.summary.dominantEmotion) }}
                />
                <span className="font-semibold capitalize">
                  {selectedReportData.summary.dominantEmotion}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Participación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Nivel de engagement</span>
                  <span className="font-semibold">{selectedReportData.summary.engagementLevel}%</span>
                </div>
                <Progress value={selectedReportData.summary.engagementLevel} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Registros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedReportData.emotionalRegistries.length}
                </div>
                <p className="text-sm text-muted-foreground">Emociones registradas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cambios Significativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedReportData.summary.significantChanges.map((change, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">{change}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedReportData.summary.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emotional Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Línea de Tiempo Emocional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedReportData.emotionalRegistries.map((registry, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    {registry.timestamp.toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getEmotionColor(registry.emotion) }}
                  />
                  <div className="flex-1">
                    <span className="font-medium capitalize">{registry.emotion}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      Intensidad: {registry.intensity}/5
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {registry.mode}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" style={{ color: "var(--opcion-orange)" }} />
            Reportes de Sesión
          </h2>
          <p className="text-muted-foreground">
            Micro-reportes automáticos generados después de cada sesión
          </p>
        </div>
        <Button 
          onClick={() => handleGenerateReport("all")}
          disabled={isGenerating}
          style={{ backgroundColor: "var(--opcion-orange)" }}
        >
          {isGenerating ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Generar Reportes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white">
          <TabsTrigger value="recent">Recientes</TabsTrigger>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="export">Exportar</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card 
                key={report.id}
                className="border-l-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                style={{ borderLeftColor: getEmotionColor(report.summary.dominantEmotion) }}
                onClick={() => setSelectedReport(report.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{report.participantAlias}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {report.startTime.toLocaleDateString('es-ES')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {Math.round((report.endTime.getTime() - report.startTime.getTime()) / (1000 * 60))} min
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          {report.emotionalRegistries.length} registros
                        </span>
                      </CardDescription>
                    </div>
                    <Badge 
                      style={{ 
                        backgroundColor: `${getEmotionColor(report.summary.dominantEmotion)}20`,
                        color: getEmotionColor(report.summary.dominantEmotion)
                      }}
                    >
                      {report.summary.dominantEmotion}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Engagement</p>
                      <div className="flex items-center gap-2">
                        <Progress value={report.summary.engagementLevel} className="h-2 flex-1" />
                        <span className="font-semibold">{report.summary.engagementLevel}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cambios</p>
                      <p className="font-semibold">{report.summary.significantChanges.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Recomendaciones</p>
                      <p className="font-semibold">{report.summary.recommendations.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Total Participantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {new Set(reports.map(r => r.participantId)).size}
                </div>
                <p className="text-sm text-muted-foreground">Con reportes generados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Reportes Totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" style={{ color: "var(--opcion-orange)" }}>
                  {reports.length}
                </div>
                <p className="text-sm text-muted-foreground">Generados automáticamente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Engagement Promedio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(reports.reduce((acc, r) => acc + r.summary.engagementLevel, 0) / reports.length || 0)}%
                </div>
                <p className="text-sm text-muted-foreground">Nivel de participación</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Exportación Individual</CardTitle>
                <CardDescription>Exportar reportes por participante</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from(new Set(reports.map(r => r.participantAlias))).map(alias => (
                  <div key={alias} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{alias}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => console.log(`Exporting for ${alias}`)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exportación Grupal</CardTitle>
                <CardDescription>Exportar reportes consolidados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" style={{ backgroundColor: "var(--opcion-orange)" }}>
                  <Download className="w-4 h-4 mr-2" />
                  Reporte Consolidado PDF
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Datos Excel
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Reporte de Egreso
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}