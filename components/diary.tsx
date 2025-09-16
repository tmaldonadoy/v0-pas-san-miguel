"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DiaryEntry {
  id: string
  date: string
  emotion: string
  intensity: number
  mode: "quick" | "guided" | "free"
  content: string
  tags: string[]
}

interface DiaryProps {
  userAlias: string
  onBack: () => void
  emotionalRegistries: DiaryEntry[]
}

const EMOTION_EMOJIS: Record<string, string> = {
  ansiedad: "😰",
  rechazo: "😔",
  frustracion: "😤",
  rabia: "😡",
  miedo: "😨",
  entretenimiento: "🎉",
  alegria: "😊",
  aceptado: "🤗",
}

export default function Diary({ userAlias, onBack, emotionalRegistries }: DiaryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEmotion, setFilterEmotion] = useState<string | null>(null)

  // Mock data for demonstration
  const mockEntries: DiaryEntry[] = [
    {
      id: "1",
      date: new Date().toISOString(),
      emotion: "alegria",
      intensity: 4,
      mode: "quick",
      content: "Hoy fue un día muy bueno en el colegio. Me divertí jugando con mis amigos en el recreo.",
      tags: ["colegio", "amigos", "recreo"]
    },
    {
      id: "2", 
      date: new Date(Date.now() - 86400000).toISOString(),
      emotion: "frustracion",
      intensity: 3,
      mode: "guided",
      content: "No pude terminar mi tarea de matemáticas. Las fracciones son muy difíciles para mí.",
      tags: ["tarea", "matemáticas", "dificultad"]
    },
    {
      id: "3",
      date: new Date(Date.now() - 172800000).toISOString(), 
      emotion: "aceptado",
      intensity: 5,
      mode: "free",
      content: "Mi hermana me ayudó con mi proyecto. Me sentí muy querido y apoyado por mi familia.",
      tags: ["familia", "apoyo", "proyecto"]
    }
  ]

  const entries = emotionalRegistries.length > 0 ? emotionalRegistries : mockEntries
  
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesEmotion = !filterEmotion || entry.emotion === filterEmotion
    return matchesSearch && matchesEmotion
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric", 
      month: "long",
      day: "numeric"
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

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
              <h1 className="text-xl font-bold text-foreground">Mi Diario</h1>
              <p className="text-sm text-muted-foreground">Hola, {userAlias}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Buscar en mi diario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Buscar por contenido o etiquetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterEmotion === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterEmotion(null)}
                >
                  Todas las emociones
                </Button>
                {Object.entries(EMOTION_EMOJIS).map(([emotion, emoji]) => (
                  <Button
                    key={emotion}
                    variant={filterEmotion === emotion ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterEmotion(emotion)}
                  >
                    {emoji} {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Diary Entries */}
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No se encontraron registros</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Intenta cambiar los filtros o realiza nuevos registros emocionales
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredEntries.map((entry) => (
                <Card key={entry.id} className="border-l-4" style={{ 
                  borderLeftColor: 
                    entry.emotion === "alegria" ? "#D69E2E" :
                    entry.emotion === "ansiedad" ? "#E53E3E" :
                    entry.emotion === "frustracion" ? "#DD6B20" :
                    entry.emotion === "rabia" ? "#C53030" :
                    entry.emotion === "miedo" ? "#805AD5" :
                    entry.emotion === "entretenimiento" ? "#3182CE" :
                    entry.emotion === "aceptado" ? "#38A169" :
                    entry.emotion === "rechazo" ? "#718096" : "#718096"
                }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">
                          {EMOTION_EMOJIS[entry.emotion] || "😐"}
                        </div>
                        <div>
                          <CardTitle className="text-lg capitalize">
                            {entry.emotion}
                          </CardTitle>
                          <CardDescription>
                            {formatDate(entry.date)} • {formatTime(entry.date)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Intensidad {entry.intensity}/5
                        </Badge>
                        <Badge variant="secondary">
                          {entry.mode === "quick" ? "Rápido" : 
                           entry.mode === "guided" ? "Guiado" : "Libre"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-3">{entry.content}</p>
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Resumen de este mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{entries.length}</div>
                  <div className="text-sm text-muted-foreground">Total registros</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {entries.filter(e => ["alegria", "aceptado", "entretenimiento"].includes(e.emotion)).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Emociones positivas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length || 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Intensidad promedio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">
                    {(() => {
                      if (entries.length === 0) return "😐"
                      // Encontrar la emoción más frecuente
                      const emotionCounts = entries.reduce((acc, entry) => {
                        acc[entry.emotion] = (acc[entry.emotion] || 0) + 1
                        return acc
                      }, {} as Record<string, number>)
                      const mostFrequent = Object.entries(emotionCounts).sort(([,a], [,b]) => b - a)[0][0]
                      return EMOTION_EMOJIS[mostFrequent] || "😐"
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground">Emoción más frecuente</div>
                </div>
              </div>
              
              {/* Desglose por emociones */}
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4 text-center">Desglose por emociones registradas</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(EMOTION_EMOJIS).map(([emotion, emoji]) => {
                    const count = entries.filter(e => e.emotion === emotion).length
                    const percentage = entries.length > 0 ? ((count / entries.length) * 100).toFixed(0) : 0
                    const avgIntensity = count > 0 
                      ? (entries.filter(e => e.emotion === emotion).reduce((sum, e) => sum + e.intensity, 0) / count).toFixed(1)
                      : "0.0"
                    
                    return (
                      <div key={emotion} className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl mb-1">{emoji}</div>
                        <div className="font-semibold text-sm capitalize">{emotion}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {count} registros ({percentage}%)
                        </div>
                        {count > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Intensidad: {avgIntensity}/5
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Tendencias semanales */}
              {entries.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h4 className="font-semibold mb-4 text-center">Tendencia de la última semana</h4>
                  <div className="text-center">
                    {(() => {
                      const lastWeek = entries.filter(e => {
                        const entryDate = new Date(e.date)
                        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        return entryDate >= weekAgo
                      })
                      
                      if (lastWeek.length === 0) {
                        return <p className="text-muted-foreground">No hay registros de esta semana</p>
                      }
                      
                      const positiveEmotions = lastWeek.filter(e => ["alegria", "aceptado", "entretenimiento"].includes(e.emotion)).length
                      const totalWeek = lastWeek.length
                      const positivePercentage = ((positiveEmotions / totalWeek) * 100).toFixed(0)
                      
                      return (
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">{totalWeek}</span> registros esta semana
                          </p>
                          <p className="text-sm">
                            <span className={`font-medium ${
                              parseInt(positivePercentage) >= 60 ? 'text-green-600' : 
                              parseInt(positivePercentage) >= 40 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {positivePercentage}%
                            </span> emociones positivas
                          </p>
                          {parseInt(positivePercentage) >= 60 && (
                            <p className="text-xs text-green-600">¡Excelente semana emocional! 🌟</p>
                          )}
                          {parseInt(positivePercentage) >= 40 && parseInt(positivePercentage) < 60 && (
                            <p className="text-xs text-yellow-600">Semana equilibrada 💛</p>
                          )}
                          {parseInt(positivePercentage) < 40 && (
                            <p className="text-xs text-blue-600">Recuerda usar el espacio de calma 💙</p>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}