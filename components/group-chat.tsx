"use client"

import { Label } from "@/components/ui/label"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Send, Hand, Mic, MicOff, Users, MessageCircle, AlertTriangle, CheckCircle } from "lucide-react"

interface Participant {
  id: string
  alias: string
  avatar: any
  status: "online" | "typing" | "hand-raised" | "offline"
  emotion: string
}

interface Message {
  id: string
  senderId: string
  senderAlias: string
  content: string
  recipient: "all" | "facilitator" | "subgroup" | "platform"
  recipientId?: string
  timestamp: Date
  type: "text" | "voice" | "system"
  isPrivate: boolean
}

interface GroupChatProps {
  userAlias: string
  userId: string
  participants: Participant[]
  facilitatorId: string
  onBack: () => void
  onSendMessage: (message: Omit<Message, "id" | "timestamp">) => void
  onRequestTurn: () => void
  onSendToFacilitator: (content: string) => void
}

const RECIPIENT_OPTIONS = [
  { value: "all", label: "Todos", icon: Users, description: "Mensaje visible para todo el grupo" },
  { value: "facilitator", label: "Facilitador", icon: MessageCircle, description: "Mensaje privado al facilitador" },
  { value: "platform", label: "Plataforma", icon: CheckCircle, description: "Solicitar ayuda del sistema" },
]

export default function GroupChat({
  userAlias,
  userId,
  participants,
  facilitatorId,
  onBack,
  onSendMessage,
  onRequestTurn,
  onSendToFacilitator,
}: GroupChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "system",
      senderAlias: "Sistema",
      content: "Bienvenidos al chat grupal. Recuerden ser respetuosos y pedir turno para hablar.",
      recipient: "all",
      timestamp: new Date(),
      type: "system",
      isPrivate: false,
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [selectedRecipient, setSelectedRecipient] = useState<"all" | "facilitator" | "platform">("all")
  const [isTyping, setIsTyping] = useState(false)
  const [hasHandRaised, setHasHandRaised] = useState(false)
  const [canSendMessage, setCanSendMessage] = useState(true)
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const MESSAGE_COOLDOWN = 20000 // 20 seconds between messages

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Check message cooldown
    if (lastMessageTime) {
      const timeSinceLastMessage = Date.now() - lastMessageTime.getTime()
      if (timeSinceLastMessage < MESSAGE_COOLDOWN) {
        setCanSendMessage(false)
        const timeout = setTimeout(() => {
          setCanSendMessage(true)
        }, MESSAGE_COOLDOWN - timeSinceLastMessage)
        return () => clearTimeout(timeout)
      }
    }
  }, [lastMessageTime])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !canSendMessage) return

    const messageLength = selectedRecipient === "facilitator" ? 600 : 140
    if (newMessage.length > messageLength) return

    const message: Omit<Message, "id" | "timestamp"> = {
      senderId: userId,
      senderAlias: userAlias,
      content: newMessage,
      recipient: selectedRecipient,
      type: "text",
      isPrivate: selectedRecipient !== "all",
    }

    onSendMessage(message)

    // Add to local messages for immediate feedback
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date(),
      },
    ])

    setNewMessage("")
    setLastMessageTime(new Date())
    setIsTyping(false)
  }

  const handleRequestTurn = () => {
    if (!hasHandRaised) {
      setHasHandRaised(true)
      onRequestTurn()

      // Add system message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          senderId: "system",
          senderAlias: "Sistema",
          content: `${userAlias} ha solicitado turno para hablar`,
          recipient: "all",
          timestamp: new Date(),
          type: "system",
          isPrivate: false,
        },
      ])
    }
  }

  const handleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      // TODO: Implement voice recording stop and transcription
    } else {
      setIsRecording(true)
      // TODO: Implement voice recording start
    }
  }

  const getParticipantStatus = (participant: Participant) => {
    switch (participant.status) {
      case "online":
        return { color: "bg-green-400", label: "En línea" }
      case "typing":
        return { color: "bg-blue-400", label: "Escribiendo..." }
      case "hand-raised":
        return { color: "bg-yellow-400", label: "Mano alzada" }
      default:
        return { color: "bg-gray-400", label: "Desconectado" }
    }
  }

  const getEmotionEmoji = (emotion: string) => {
    const emotions: Record<string, string> = {
      alegria: "😊",
      tristeza: "😢",
      enojo: "😠",
      miedo: "😨",
      calma: "😌",
      sorpresa: "😲",
    }
    return emotions[emotion] || "😊"
  }

  const remainingCooldown = lastMessageTime
    ? Math.max(0, MESSAGE_COOLDOWN - (Date.now() - lastMessageTime.getTime())) / 1000
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Header */}
      <header className="w-full p-6 border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Chat Grupal</h1>
              <p className="text-sm text-muted-foreground">Modo Taller • {participants.length} participantes</p>
            </div>
          </div>

          <Badge variant="secondary" className="bg-accent/10 text-accent">
            Sesión Activa
          </Badge>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Participants Grid */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-primary" />
                Participantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {participants.map((participant) => {
                const status = getParticipantStatus(participant)
                return (
                  <div key={participant.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-lg">{getEmotionEmoji(participant.emotion)}</span>
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 ${status.color} rounded-full border-2 border-background`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {participant.alias}
                        {participant.id === userId && " (Tú)"}
                      </p>
                      <p className="text-xs text-muted-foreground">{status.label}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="lg:col-span-3 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="w-5 h-5 text-accent" />
                Conversación
              </CardTitle>
              <CardDescription>Selecciona a quién dirigir tu mensaje antes de enviarlo</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-96">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === "system"
                          ? "bg-muted text-muted-foreground text-center text-sm"
                          : message.senderId === userId
                            ? "bg-primary text-primary-foreground"
                            : message.isPrivate
                              ? "bg-accent/20 text-foreground border border-accent/30"
                              : "bg-muted text-foreground"
                      }`}
                    >
                      {message.type !== "system" && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">{message.senderAlias}</span>
                          {message.isPrivate && (
                            <Badge variant="outline" className="text-xs">
                              Privado
                            </Badge>
                          )}
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Area */}
              <div className="space-y-3 border-t border-border pt-4">
                {/* Recipient Selection */}
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium">Enviar a:</Label>
                  <Select value={selectedRecipient} onValueChange={(value: any) => setSelectedRecipient(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RECIPIENT_OPTIONS.map((option) => {
                        const Icon = option.icon
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value)
                        setIsTyping(e.target.value.length > 0)
                      }}
                      placeholder={
                        selectedRecipient === "facilitator"
                          ? "Mensaje privado al facilitador (máx 600 caracteres)..."
                          : "Escribe tu mensaje (máx 140 caracteres)..."
                      }
                      maxLength={selectedRecipient === "facilitator" ? 600 : 140}
                      disabled={!canSendMessage}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">
                        {newMessage.length}/{selectedRecipient === "facilitator" ? 600 : 140}
                      </span>
                      {!canSendMessage && remainingCooldown > 0 && (
                        <span className="text-xs text-muted-foreground">Espera {Math.ceil(remainingCooldown)}s</span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !canSendMessage}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRequestTurn}
                    disabled={hasHandRaised}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Hand className="w-4 h-4" />
                    {hasHandRaised ? "Turno Solicitado" : "Pedir Turno"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVoiceRecording}
                    className={`flex items-center gap-2 ${isRecording ? "bg-red-100 text-red-700" : ""}`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecording ? "Detener" : "Nota de Voz"}
                  </Button>
                </div>

                {/* Guidelines */}
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Recuerda:</strong> Sé respetuoso, pide turno para mensajes largos, y usa mensajes privados
                    al facilitador si necesitas ayuda personal.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
