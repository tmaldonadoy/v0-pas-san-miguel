"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import AIReporting from "@/components/ai-reporting"
import DataLogging from "@/components/data-logging"
import {
  Users,
  Settings,
  BarChart3,
  MessageSquare,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  Upload,
  Sparkles,
  Heart,
  Frown,
  Angry,
  Zap,
  Smile,
  Meh,
} from "lucide-react"

interface Participant {
  id: string
  alias: string
  avatar: any
  status: "online" | "offline" | "typing" | "hand-raised"
  currentEmotion: string
  emotionIntensity: number
  lastActivity: string
  sessionTime: number
  emotionalRegistries: number
}

interface Session {
  id: string
  name: string
  participants: Participant[]
  startTime: string
  duration: number
  mode: "individual" | "taller"
  status: "active" | "scheduled" | "completed"
}

interface FacilitatorDashboardProps {
  facilitatorName: string
  onLogout: () => void
  onBack: () => void
}

const emotionIcons = {
  ansiedad: AlertTriangle,
  rechazo: Frown,
  frustracion: Angry,
  rabia: Angry,
  miedo: AlertTriangle,
  entretenimiento: Zap,
  alegria: Smile,
  aceptado: Smile,
}

const emotionColors = {
  ansiedad: "text-red-500",
  rechazo: "text-gray-500",
  frustracion: "text-orange-500",
  rabia: "text-red-600",
  miedo: "text-purple-500",
  entretenimiento: "text-blue-500",
  alegria: "text-yellow-500",
  aceptado: "text-green-500",
}

export default function FacilitatorDashboard({ facilitatorName, onLogout, onBack }: FacilitatorDashboardProps) {
  const [activeTab, setActiveTab] = useState("sessions")
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  // Mock data - in real app this would come from API
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "session1",
      name: "Taller de Emociones - Grupo A",
      participants: [
        {
          id: "p1",
          alias: "Ana",
          avatar: { skin: "light", hair: "brown", clothing: "casual" },
          status: "online",
          currentEmotion: "alegria",
          emotionIntensity: 4,
          lastActivity: "Hace 2 min",
          sessionTime: 25,
          emotionalRegistries: 3,
        },
        {
          id: "p2",
          alias: "Carlos",
          avatar: { skin: "medium", hair: "black", clothing: "formal" },
          status: "hand-raised",
          currentEmotion: "entretenimiento",
          emotionIntensity: 3,
          lastActivity: "Hace 1 min",
          sessionTime: 25,
          emotionalRegistries: 2,
        },
        {
          id: "p3",
          alias: "Sofia",
          avatar: { skin: "dark", hair: "curly", clothing: "colorful" },
          status: "typing",
          currentEmotion: "aceptado",
          emotionIntensity: 2,
          lastActivity: "Ahora",
          sessionTime: 20,
          emotionalRegistries: 4,
        },
      ],
      startTime: "14:30",
      duration: 60,
      mode: "taller",
      status: "active",
    },
    {
      id: "session2",
      name: "Sesión Individual - María",
      participants: [
        {
          id: "p4",
          alias: "María",
          avatar: { skin: "light", hair: "blonde", clothing: "casual" },
          status: "online",
          currentEmotion: "rechazo",
          emotionIntensity: 3,
          lastActivity: "Hace 5 min",
          sessionTime: 15,
          emotionalRegistries: 1,
        },
      ],
      startTime: "15:30",
      duration: 45,
      mode: "individual",
      status: "scheduled",
    },
  ])

  const handleExportAvatar = (participantId: string) => {
    // TODO: Implement avatar export functionality
    console.log("Exporting avatar for participant:", participantId)
  }

  const handleImportAvatar = (participantId: string) => {
    // TODO: Implement avatar import functionality
    console.log("Importing avatar for participant:", participantId)
  }

  const handleGenerateAIAvatar = (participantId: string) => {
    // TODO: Implement AI avatar generation
    console.log("Generating AI avatar for participant:", participantId)
  }

  const renderParticipantCard = (participant: Participant) => {
    const EmotionIcon = emotionIcons[participant.currentEmotion as keyof typeof emotionIcons] || Meh
    const emotionColor = emotionColors[participant.currentEmotion as keyof typeof emotionColors] || "text-gray-500"

    return (
      <Card key={participant.id} className="border-2 hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                  <AvatarImage
                    src={`/generic-fantasy-character.png?height=48&width=48&query=avatar-${participant.avatar?.skin}-${participant.avatar?.hair}`}
                  />
                  <AvatarFallback style={{ backgroundColor: "var(--opcion-blue)" }} className="text-white font-bold">
                    {participant.alias[0]}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    participant.status === "online"
                      ? "bg-green-500"
                      : participant.status === "typing"
                        ? "bg-blue-500"
                        : participant.status === "hand-raised"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                  }`}
                />
              </div>
              <div>
                <CardTitle className="text-lg">{participant.alias}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <EmotionIcon className={`w-4 h-4 ${emotionColor}`} />
                  {participant.currentEmotion} (Intensidad: {participant.emotionIntensity}/5)
                </CardDescription>
              </div>
            </div>
            <Badge variant={participant.status === "online" ? "default" : "secondary"}>
              {participant.status === "online"
                ? "En línea"
                : participant.status === "typing"
                  ? "Escribiendo"
                  : participant.status === "hand-raised"
                    ? "Mano alzada"
                    : "Desconectado"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Tiempo en sesión</p>
              <p className="font-semibold">{participant.sessionTime} min</p>
            </div>
            <div>
              <p className="text-muted-foreground">Registros emocionales</p>
              <p className="font-semibold">{participant.emotionalRegistries}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Estado emocional</p>
            <Progress
              value={participant.emotionIntensity * 20}
              className="h-2"
              style={{
                backgroundColor: "var(--opcion-gray)",
              }}
            />
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleExportAvatar(participant.id)} className="flex-1">
              <Download className="w-4 h-4 mr-1" />
              Exportar
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleImportAvatar(participant.id)} className="flex-1">
              <Upload className="w-4 h-4 mr-1" />
              Importar
            </Button>
            <Button
              size="sm"
              onClick={() => handleGenerateAIAvatar(participant.id)}
              className="flex-1"
              style={{ backgroundColor: "var(--opcion-pink)", color: "white" }}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              IA
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--opcion-gray)" }}>
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                <img 
                  src="/new_logo.png" 
                  alt="Inner World Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Panel Facilitador</h1>
                <p className="text-muted-foreground">Bienvenido, {facilitatorName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onBack}>
                Volver
              </Button>
              <Button variant="outline" onClick={onLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white">
            <TabsTrigger value="sessions">Sesiones</TabsTrigger>
            <TabsTrigger value="participants">Participantes</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            <TabsTrigger value="ai-reports">IA Reportes</TabsTrigger>
            <TabsTrigger value="data-logging">Datos</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Sesiones Activas
                  </CardTitle>
                  <CardDescription>Gestiona y monitorea las sesiones en curso</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {sessions.map((session) => (
                      <Card
                        key={session.id}
                        className="border-l-4"
                        style={{
                          borderLeftColor: session.status === "active" ? "var(--opcion-blue)" : "var(--opcion-yellow)",
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{session.name}</CardTitle>
                              <CardDescription className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {session.startTime} - {session.duration} min
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {session.participants.length} participantes
                                </span>
                              </CardDescription>
                            </div>
                            <Badge
                              variant={session.status === "active" ? "default" : "secondary"}
                              style={{
                                backgroundColor:
                                  session.status === "active" ? "var(--opcion-blue)" : "var(--opcion-yellow)",
                                color: "white",
                              }}
                            >
                              {session.status === "active"
                                ? "Activa"
                                : session.status === "scheduled"
                                  ? "Programada"
                                  : "Completada"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {session.participants.map(renderParticipantCard)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Participantes</CardTitle>
                <CardDescription>Vista general de todos los NNA en tus sesiones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sessions.flatMap((session) => session.participants).map(renderParticipantCard)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Registros Totales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" style={{ color: "var(--opcion-blue)" }}>
                    {sessions.flatMap((s) => s.participants).reduce((acc, p) => acc + p.emotionalRegistries, 0)}
                  </div>
                  <p className="text-muted-foreground">Esta semana</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Participantes Activos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" style={{ color: "var(--opcion-orange)" }}>
                    {sessions.flatMap((s) => s.participants).filter((p) => p.status === "online").length}
                  </div>
                  <p className="text-muted-foreground">En línea ahora</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Sesiones Activas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" style={{ color: "var(--opcion-pink)" }}>
                    {sessions.filter((s) => s.status === "active").length}
                  </div>
                  <p className="text-muted-foreground">En curso</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-reports" className="space-y-6">
            <AIReporting sessions={sessions} participants={sessions.flatMap((s) => s.participants)} />
          </TabsContent>

          <TabsContent value="data-logging" className="space-y-6">
            <DataLogging sessions={sessions} participants={sessions.flatMap((s) => s.participants)} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración de Sesiones
                </CardTitle>
                <CardDescription>Ajusta los parámetros de las sesiones y avatares</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Gestión de Avatares</h3>
                    <div className="space-y-2">
                      <Button className="w-full" style={{ backgroundColor: "var(--opcion-pink)" }}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generar Avatares con IA
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Todos los Avatares
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Upload className="w-4 h-4 mr-2" />
                        Importar Avatares
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Configuración de Sesión</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full bg-transparent">
                        <Clock className="w-4 h-4 mr-2" />
                        Programar Sesiones
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Eye className="w-4 h-4 mr-2" />
                        Configurar Permisos
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
