"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Database,
  Download,
  FileText,
  Shield,
  Clock,
  Filter,
  Archive,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Users,
  Activity,
} from "lucide-react"

interface DataLog {
  id: string
  timestamp: string
  userId: string
  userAlias: string
  sessionId?: string
  action: string
  category: "emotional_registry" | "avatar_change" | "chat_message" | "session_join" | "facilitator_action"
  data: any
  metadata: {
    userAgent?: string
    ipAddress?: string
    duration?: number
    success: boolean
  }
}

interface ExportRequest {
  id: string
  type: "session_data" | "emotional_registries" | "user_progress" | "full_export"
  format: "json" | "csv" | "pdf" | "excel"
  dateRange: {
    start: string
    end: string
  }
  filters: {
    userIds?: string[]
    sessionIds?: string[]
    categories?: string[]
  }
  status: "pending" | "processing" | "completed" | "failed"
  createdAt: string
  completedAt?: string
  downloadUrl?: string
  fileSize?: number
}

interface DataLoggingProps {
  sessions: any[]
  participants: any[]
}

export default function DataLogging({ sessions, participants }: DataLoggingProps) {
  const [activeTab, setActiveTab] = useState("logs")
  const [selectedDateRange, setSelectedDateRange] = useState("week")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>([])
  const [dataLogs, setDataLogs] = useState<DataLog[]>([])
  const [isExporting, setIsExporting] = useState(false)

  // Mock data logs - in real app this would come from database
  useEffect(() => {
    const mockLogs: DataLog[] = [
      {
        id: "log1",
        timestamp: "2024-01-15T14:30:00Z",
        userId: "p1",
        userAlias: "Ana",
        sessionId: "session1",
        action: "emotional_registry_created",
        category: "emotional_registry",
        data: {
          emotion: "alegria",
          intensity: 4,
          sensoryTags: ["vision", "hearing"],
          mode: "quick",
        },
        metadata: {
          userAgent: "Mozilla/5.0...",
          ipAddress: "192.168.1.100",
          duration: 45000,
          success: true,
        },
      },
      {
        id: "log2",
        timestamp: "2024-01-15T14:25:00Z",
        userId: "p1",
        userAlias: "Ana",
        sessionId: "session1",
        action: "avatar_customized",
        category: "avatar_change",
        data: {
          changes: {
            hair: "brown",
            clothing: "casual",
          },
          previousState: {
            hair: "black",
            clothing: "formal",
          },
        },
        metadata: {
          userAgent: "Mozilla/5.0...",
          ipAddress: "192.168.1.100",
          duration: 120000,
          success: true,
        },
      },
      {
        id: "log3",
        timestamp: "2024-01-15T14:20:00Z",
        userId: "facilitator1",
        userAlias: "Dr. Martinez",
        sessionId: "session1",
        action: "session_started",
        category: "facilitator_action",
        data: {
          sessionType: "taller",
          duration: 60,
          participants: ["p1", "p2", "p3"],
        },
        metadata: {
          userAgent: "Mozilla/5.0...",
          ipAddress: "192.168.1.50",
          success: true,
        },
      },
    ]
    setDataLogs(mockLogs)

    const mockExportRequests: ExportRequest[] = [
      {
        id: "export1",
        type: "session_data",
        format: "pdf",
        dateRange: {
          start: "2024-01-08",
          end: "2024-01-15",
        },
        filters: {
          sessionIds: ["session1"],
        },
        status: "completed",
        createdAt: "2024-01-15T10:00:00Z",
        completedAt: "2024-01-15T10:05:00Z",
        downloadUrl: "/exports/session_data_20240115.pdf",
        fileSize: 2048576,
      },
      {
        id: "export2",
        type: "emotional_registries",
        format: "excel",
        dateRange: {
          start: "2024-01-01",
          end: "2024-01-15",
        },
        filters: {
          userIds: ["p1", "p2"],
        },
        status: "processing",
        createdAt: "2024-01-15T11:30:00Z",
      },
    ]
    setExportRequests(mockExportRequests)
  }, [])

  const handleCreateExport = async (type: string, format: string) => {
    setIsExporting(true)

    const newExport: ExportRequest = {
      id: `export_${Date.now()}`,
      type: type as any,
      format: format as any,
      dateRange: {
        start: getDateRangeStart(selectedDateRange),
        end: new Date().toISOString().split("T")[0],
      },
      filters: {
        categories: selectedCategory === "all" ? undefined : [selectedCategory],
      },
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    setExportRequests((prev) => [newExport, ...prev])

    // Simulate export processing
    setTimeout(() => {
      setExportRequests((prev) => prev.map((req) => (req.id === newExport.id ? { ...req, status: "processing" } : req)))
    }, 1000)

    setTimeout(() => {
      setExportRequests((prev) =>
        prev.map((req) =>
          req.id === newExport.id
            ? {
                ...req,
                status: "completed",
                completedAt: new Date().toISOString(),
                downloadUrl: `/exports/${type}_${Date.now()}.${format}`,
                fileSize: Math.floor(Math.random() * 5000000) + 1000000,
              }
            : req,
        ),
      )
      setIsExporting(false)
    }, 5000)
  }

  const getDateRangeStart = (range: string) => {
    const now = new Date()
    switch (range) {
      case "day":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      case "week":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      case "month":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "emotional_registry":
        return Activity
      case "avatar_change":
        return Users
      case "chat_message":
        return FileText
      case "session_join":
        return Calendar
      case "facilitator_action":
        return Shield
      default:
        return Database
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "emotional_registry":
        return "var(--opcion-pink)"
      case "avatar_change":
        return "var(--opcion-blue)"
      case "chat_message":
        return "var(--opcion-yellow)"
      case "session_join":
        return "var(--opcion-orange)"
      case "facilitator_action":
        return "var(--opcion-gray)"
      default:
        return "#6b7280"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#22c55e"
      case "processing":
        return "var(--opcion-blue)"
      case "pending":
        return "var(--opcion-yellow)"
      case "failed":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle
      case "processing":
        return Clock
      case "pending":
        return Clock
      case "failed":
        return AlertTriangle
      default:
        return Clock
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6" style={{ color: "var(--opcion-blue)" }} />
            Sistema de Logging y Exportación
          </h2>
          <p className="text-muted-foreground">Gestión completa de datos, logs de actividad y exportaciones</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
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
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white">
          <TabsTrigger value="logs">Logs de Actividad</TabsTrigger>
          <TabsTrigger value="exports">Exportaciones</TabsTrigger>
          <TabsTrigger value="privacy">Privacidad</TabsTrigger>
          <TabsTrigger value="retention">Retención</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="emotional_registry">Registros emocionales</SelectItem>
                <SelectItem value="avatar_change">Cambios de avatar</SelectItem>
                <SelectItem value="chat_message">Mensajes de chat</SelectItem>
                <SelectItem value="session_join">Unión a sesiones</SelectItem>
                <SelectItem value="facilitator_action">Acciones de facilitador</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avanzados
            </Button>
          </div>

          <div className="grid gap-4">
            {dataLogs
              .filter((log) => selectedCategory === "all" || log.category === selectedCategory)
              .map((log) => {
                const CategoryIcon = getCategoryIcon(log.category)
                return (
                  <Card
                    key={log.id}
                    className="border-l-4 hover:shadow-md transition-all duration-200"
                    style={{ borderLeftColor: getCategoryColor(log.category) }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className="p-2 rounded-full"
                            style={{ backgroundColor: `${getCategoryColor(log.category)}20` }}
                          >
                            <CategoryIcon className="w-5 h-5" style={{ color: getCategoryColor(log.category) }} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{log.action.replace(/_/g, " ")}</CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-1">
                              <span>Usuario: {log.userAlias}</span>
                              {log.sessionId && <span>Sesión: {log.sessionId}</span>}
                              <span>{new Date(log.timestamp).toLocaleString("es-ES")}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            style={{
                              backgroundColor: log.metadata.success ? "#22c55e" : "#ef4444",
                              color: "white",
                            }}
                          >
                            {log.metadata.success ? "Exitoso" : "Fallido"}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Categoría</p>
                          <p className="font-semibold capitalize">{log.category.replace(/_/g, " ")}</p>
                        </div>
                        {log.metadata.duration && (
                          <div>
                            <p className="text-muted-foreground">Duración</p>
                            <p className="font-semibold">{Math.round(log.metadata.duration / 1000)}s</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground">IP</p>
                          <p className="font-semibold">{log.metadata.ipAddress || "N/A"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card
              className="border-2 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleCreateExport("session_data", "pdf")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5" style={{ color: "var(--opcion-blue)" }} />
                  Datos de Sesión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Exportar datos completos de sesiones incluyendo participantes y actividades
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={isExporting}
                  style={{ backgroundColor: "var(--opcion-blue)" }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-2 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleCreateExport("emotional_registries", "excel")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-5 h-5" style={{ color: "var(--opcion-pink)" }} />
                  Registros Emocionales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Exportar todos los registros emocionales con análisis detallado
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={isExporting}
                  style={{ backgroundColor: "var(--opcion-pink)" }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Excel
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-2 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleCreateExport("user_progress", "json")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: "var(--opcion-orange)" }} />
                  Progreso de Usuarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Exportar datos de progreso y evolución de cada participante
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={isExporting}
                  style={{ backgroundColor: "var(--opcion-orange)" }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar JSON
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-2 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleCreateExport("full_export", "csv")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="w-5 h-5" style={{ color: "var(--opcion-yellow)" }} />
                  Exportación Completa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Exportar todos los datos disponibles en formato estructurado
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={isExporting}
                  style={{ backgroundColor: "var(--opcion-yellow)" }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Exportaciones</CardTitle>
              <CardDescription>Seguimiento de todas las exportaciones solicitadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exportRequests.map((request) => {
                  const StatusIcon = getStatusIcon(request.status)
                  return (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div
                          className="p-2 rounded-full"
                          style={{ backgroundColor: `${getStatusColor(request.status)}20` }}
                        >
                          <StatusIcon className="w-5 h-5" style={{ color: getStatusColor(request.status) }} />
                        </div>
                        <div>
                          <div className="font-medium capitalize">
                            {request.type.replace(/_/g, " ")} - {request.format.toUpperCase()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(request.createdAt).toLocaleString("es-ES")}
                            {request.fileSize && ` • ${formatFileSize(request.fileSize)}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          style={{
                            backgroundColor: getStatusColor(request.status),
                            color: "white",
                          }}
                        >
                          {request.status === "completed"
                            ? "Completado"
                            : request.status === "processing"
                              ? "Procesando"
                              : request.status === "pending"
                                ? "Pendiente"
                                : "Fallido"}
                        </Badge>
                        {request.status === "completed" && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Descargar
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" style={{ color: "var(--opcion-blue)" }} />
                Configuración de Privacidad
              </CardTitle>
              <CardDescription>Gestión de datos personales y cumplimiento normativo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Anonimización de Datos</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="anonymize-logs" defaultChecked />
                      <label htmlFor="anonymize-logs" className="text-sm">
                        Anonimizar logs después de 30 días
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="anonymize-exports" defaultChecked />
                      <label htmlFor="anonymize-exports" className="text-sm">
                        Anonimizar datos en exportaciones
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="encrypt-sensitive" defaultChecked />
                      <label htmlFor="encrypt-sensitive" className="text-sm">
                        Encriptar datos sensibles
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Derechos de los Usuarios</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Eye className="w-4 h-4 mr-2" />
                      Solicitar Datos Personales
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Datos del Usuario
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 bg-transparent">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar Datos del Usuario
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="w-5 h-5" style={{ color: "var(--opcion-orange)" }} />
                Políticas de Retención
              </CardTitle>
              <CardDescription>Configuración de almacenamiento y archivado de datos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Logs de Actividad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Retención activa:</span>
                        <span className="font-semibold">90 días</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Archivo:</span>
                        <span className="font-semibold">1 año</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Eliminación:</span>
                        <span className="font-semibold">3 años</span>
                      </div>
                    </div>
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-muted-foreground">65% del espacio utilizado</p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Registros Emocionales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Retención activa:</span>
                        <span className="font-semibold">2 años</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Archivo:</span>
                        <span className="font-semibold">5 años</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Eliminación:</span>
                        <span className="font-semibold">7 años</span>
                      </div>
                    </div>
                    <Progress value={42} className="h-2" />
                    <p className="text-xs text-muted-foreground">42% del espacio utilizado</p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Datos de Sesión</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Retención activa:</span>
                        <span className="font-semibold">1 año</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Archivo:</span>
                        <span className="font-semibold">3 años</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Eliminación:</span>
                        <span className="font-semibold">5 años</span>
                      </div>
                    </div>
                    <Progress value={78} className="h-2" />
                    <p className="text-xs text-muted-foreground">78% del espacio utilizado</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Archive className="w-4 h-4 mr-2" />
                  Archivar Datos Antiguos
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpiar Datos Expirados
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
