import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Baseline as Timeline, Calendar, TrendingUp, TrendingDown, Filter, Download, BarChart3 } from "lucide-react"

interface EmotionalEntry {
  id: string
  emotion: string
  intensity: number
  timestamp: Date
  sessionId: string
  mode: string
  notes?: string
}

interface EmotionalTimelineProps {
  participantId: string
  participantAlias: string
  emotionalRegistries: EmotionalEntry[]
  isTherapist?: boolean
}

export default function EmotionalTimeline({ 
  participantId, 
  participantAlias, 
  emotionalRegistries,
  isTherapist = false 
}: EmotionalTimelineProps) {
  const [filteredEntries, setFilteredEntries] = useState<EmotionalEntry[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState("all")
  const [selectedEmotion, setSelectedEmotion] = useState("all")
  const [viewMode, setViewMode] = useState<"timeline" | "chart">("timeline")

  useEffect(() => {
    let filtered = [...emotionalRegistries]

    // Filter by timeframe
    if (selectedTimeframe !== "all") {
      const now = new Date()
      const days = selectedTimeframe === "week" ? 7 : selectedTimeframe === "month" ? 30 : 90
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(entry => entry.timestamp >= cutoff)
    }

    // Filter by emotion
    if (selectedEmotion !== "all") {
      filtered = filtered.filter(entry => entry.emotion === selectedEmotion)
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    setFilteredEntries(filtered)
  }, [emotionalRegistries, selectedTimeframe, selectedEmotion])

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

  const getEmotionEmoji = (emotion: string) => {
    const emojis: Record<string, string> = {
      alegria: "😊",
      ansiedad: "😰",
      aceptado: "🤗", 
      miedo: "😨",
      frustracion: "😤",
      rabia: "😡",
      entretenimiento: "🎉",
      rechazo: "😔",
    }
    return emojis[emotion] || "😐"
  }

  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 1) return "Muy baja"
    if (intensity <= 2) return "Baja"
    if (intensity <= 3) return "Media"
    if (intensity <= 4) return "Alta"
    return "Muy alta"
  }

  const calculateTrends = () => {
    if (filteredEntries.length < 2) return null

    const recent = filteredEntries.slice(0, Math.ceil(filteredEntries.length / 2))
    const older = filteredEntries.slice(Math.ceil(filteredEntries.length / 2))

    const recentAvg = recent.reduce((sum, entry) => sum + entry.intensity, 0) / recent.length
    const olderAvg = older.reduce((sum, entry) => sum + entry.intensity, 0) / older.length

    const trend = recentAvg > olderAvg ? "increasing" : recentAvg < olderAvg ? "decreasing" : "stable"
    const change = Math.abs(recentAvg - olderAvg)

    return { trend, change: Math.round(change * 100) / 100 }
  }

  const trends = calculateTrends()
  const uniqueEmotions = Array.from(new Set(emotionalRegistries.map(e => e.emotion)))

  const renderTimelineView = () => (
    <div className="space-y-4">
      {filteredEntries.map((entry, index) => {
        const isFirstOfDay = index === 0 || 
          entry.timestamp.toDateString() !== filteredEntries[index - 1].timestamp.toDateString()
        
        return (
          <div key={entry.id}>
            {isFirstOfDay && (
              <div className="flex items-center gap-4 my-6">
                <div className="h-px bg-border flex-1" />
                <Badge variant="outline" className="bg-muted">
                  {entry.timestamp.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Badge>
                <div className="h-px bg-border flex-1" />
              </div>
            )}
            
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: getEmotionColor(entry.emotion) }}
                />
                {index < filteredEntries.length - 1 && (
                  <div className="w-px h-16 bg-border mt-2" />
                )}
              </div>
              
              <Card className="flex-1 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getEmotionEmoji(entry.emotion)}</span>
                      <div>
                        <h4 className="font-semibold capitalize">{entry.emotion}</h4>
                        <p className="text-sm text-muted-foreground">
                          {entry.timestamp.toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge 
                        variant="outline"
                        style={{ 
                          backgroundColor: `${getEmotionColor(entry.emotion)}20`,
                          borderColor: getEmotionColor(entry.emotion)
                        }}
                      >
                        {getIntensityLabel(entry.intensity)} ({entry.intensity}/5)
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.mode}
                      </p>
                    </div>
                  </div>
                  
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      "{entry.notes}"
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )
      })}
    </div>
  )

  const renderChartView = () => {
    const emotionCounts = filteredEntries.reduce((acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const maxCount = Math.max(...Object.values(emotionCounts))

    return (
      <div className="space-y-4">
        {Object.entries(emotionCounts).map(([emotion, count]) => (
          <div key={emotion} className="flex items-center gap-4">
            <div className="w-24 text-sm font-medium capitalize">{emotion}</div>
            <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${(count / maxCount) * 100}%`,
                  backgroundColor: getEmotionColor(emotion)
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                {count} registros
              </div>
            </div>
            <span className="text-2xl">{getEmotionEmoji(emotion)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Timeline className="w-6 h-6" style={{ color: "var(--opcion-blue)" }} />
            Línea de Tiempo Emocional
          </h2>
          <p className="text-muted-foreground">
            Historial de registros emocionales para {participantAlias}
          </p>
        </div>
        
        {isTherapist && (
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Timeline
          </Button>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo el tiempo</SelectItem>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mes</SelectItem>
            <SelectItem value="quarter">Último trimestre</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las emociones</SelectItem>
            {uniqueEmotions.map(emotion => (
              <SelectItem key={emotion} value={emotion}>
                <div className="flex items-center gap-2">
                  <span>{getEmotionEmoji(emotion)}</span>
                  <span className="capitalize">{emotion}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === "timeline" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("timeline")}
          >
            <Timeline className="w-4 h-4 mr-2" />
            Timeline
          </Button>
          <Button
            variant={viewMode === "chart" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("chart")}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Gráfico
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{filteredEntries.length}</div>
            <p className="text-sm text-muted-foreground">Total registros</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold" style={{ color: "var(--opcion-orange)" }}>
              {uniqueEmotions.length}
            </div>
            <p className="text-sm text-muted-foreground">Emociones diferentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold" style={{ color: "var(--opcion-pink)" }}>
              {filteredEntries.length > 0 ? 
                Math.round((filteredEntries.reduce((sum, e) => sum + e.intensity, 0) / filteredEntries.length) * 10) / 10 
                : 0}
            </div>
            <p className="text-sm text-muted-foreground">Intensidad promedio</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {trends ? (
                <>
                  {trends.trend === "increasing" ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : trends.trend === "decreasing" ? (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-400" />
                  )}
                  <div>
                    <div className="font-bold text-sm">
                      {trends.trend === "increasing" ? "↗ Subiendo" : 
                       trends.trend === "decreasing" ? "↘ Bajando" : "→ Estable"}
                    </div>
                    <p className="text-xs text-muted-foreground">Tendencia</p>
                  </div>
                </>
              ) : (
                <div>
                  <div className="font-bold text-sm">-</div>
                  <p className="text-xs text-muted-foreground">Sin datos</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {viewMode === "timeline" ? (
              <Timeline className="w-5 h-5" />
            ) : (
              <BarChart3 className="w-5 h-5" />
            )}
            {viewMode === "timeline" ? "Vista de Timeline" : "Vista de Gráfico"}
          </CardTitle>
          <CardDescription>
            {filteredEntries.length} registros encontrados
            {selectedTimeframe !== "all" && ` en ${selectedTimeframe === "week" ? "la última semana" : selectedTimeframe === "month" ? "el último mes" : "el último trimestre"}`}
            {selectedEmotion !== "all" && ` para la emoción "${selectedEmotion}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEntries.length > 0 ? (
            viewMode === "timeline" ? renderTimelineView() : renderChartView()
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No hay registros</h3>
              <p className="text-sm text-muted-foreground">
                No se encontraron registros emocionales con los filtros seleccionados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}