"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Users, Shield, Sparkles } from "lucide-react"
import AvatarEditor from "@/components/avatar-editor"
import NNADashboard from "@/components/nna-dashboard"
import EmotionalRegistration from "@/components/emotional-registration"
import GroupChat from "@/components/group-chat"
import FacilitatorDashboard from "@/components/facilitator-dashboard"
import DigitalContainment from "@/components/digital-containment"

type AppState =
  | "login"
  | "nna-dashboard"
  | "avatar-editor"
  | "emotional-registration"
  | "group-chat"
  | "facilitator-dashboard"
  | "digital-containment"

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("login")
  const [currentUser, setCurrentUser] = useState<{ alias?: string; role?: "nna" | "facilitator" }>({})
  const [avatarConfig, setAvatarConfig] = useState<any>(null)
  const [emotionalRegistries, setEmotionalRegistries] = useState<any[]>([])

  const [loginForm, setLoginForm] = useState({
    alias: "",
    pin: "",
    facilitatorEmail: "",
    facilitatorPassword: "",
  })

  const mockParticipants = [
    {
      id: "user1",
      alias: currentUser.alias || "Usuario",
      avatar: avatarConfig,
      status: "online" as const,
      emotion: "alegria",
    },
    { id: "user2", alias: "Ana", avatar: null, status: "typing" as const, emotion: "calma" },
    { id: "user3", alias: "Carlos", avatar: null, status: "hand-raised" as const, emotion: "sorpresa" },
    { id: "facilitator", alias: "Facilitador", avatar: null, status: "online" as const, emotion: "calma" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleNNALogin = () => {
    if (loginForm.alias && loginForm.pin.length === 4) {
      setCurrentUser({ alias: loginForm.alias, role: "nna" })
      setAppState("nna-dashboard")
    }
  }

  const handleFacilitatorLogin = () => {
    if (loginForm.facilitatorEmail && loginForm.facilitatorPassword) {
      setCurrentUser({ alias: "Dr. " + loginForm.facilitatorEmail.split("@")[0], role: "facilitator" })
      setAppState("facilitator-dashboard")
    }
  }

  const handleEditAvatar = () => {
    setAppState("avatar-editor")
  }

  const handleSaveAvatar = (config: any) => {
    setAvatarConfig(config)
    setAppState("nna-dashboard")
  }

  const handleStartEmotionalRegistry = () => {
    setAppState("emotional-registration")
  }

  const handleSaveEmotionalRegistry = (registration: any) => {
    setEmotionalRegistries((prev) => [...prev, registration])
    setAppState("nna-dashboard")
    // Show success message and update dashboard data
  }

  const handleOpenChat = () => {
    setAppState("group-chat")
  }

  const handleSendMessage = (message: any) => {
    // Implement message sending logic
    console.log("Sending message:", message)
  }

  const handleRequestTurn = () => {
    // Implement turn request logic
    console.log("Requesting turn to speak")
  }

  const handleSendToFacilitator = (content: string) => {
    // Implement private message to facilitator
    console.log("Sending to facilitator:", content)
  }

  const handleLogout = () => {
    setCurrentUser({})
    setAppState("login")
    setLoginForm({ alias: "", pin: "", facilitatorEmail: "", facilitatorPassword: "" })
  }

  const handleOpenContainment = () => {
    setAppState("digital-containment")
  }

  if (appState === "group-chat") {
    return (
      <GroupChat
        userAlias={currentUser.alias || ""}
        userId="user1"
        participants={mockParticipants}
        facilitatorId="facilitator"
        onBack={() => setAppState("nna-dashboard")}
        onSendMessage={handleSendMessage}
        onRequestTurn={handleRequestTurn}
        onSendToFacilitator={handleSendToFacilitator}
      />
    )
  }

  if (appState === "digital-containment") {
    return (
      <DigitalContainment
        userAlias={currentUser.alias || ""}
        onBack={() => setAppState("nna-dashboard")}
      />
    )
  }

  if (appState === "emotional-registration") {
    return (
      <EmotionalRegistration
        userAlias={currentUser.alias || ""}
        onBack={() => setAppState("nna-dashboard")}
        onSave={handleSaveEmotionalRegistry}
      />
    )
  }

  if (appState === "avatar-editor") {
    return <AvatarEditor onSave={handleSaveAvatar} initialConfig={avatarConfig} />
  }

  if (appState === "nna-dashboard") {
    return (
      <NNADashboard
        userAlias={currentUser.alias || ""}
        avatarConfig={avatarConfig}
        onEditAvatar={handleEditAvatar}
        onStartEmotionalRegistry={handleStartEmotionalRegistry}
        onOpenChat={handleOpenChat}
        onOpenContainment={handleOpenContainment}
        onLogout={handleLogout}
      />
    )
  }

  if (appState === "facilitator-dashboard") {
    return (
      <FacilitatorDashboard
        facilitatorName={currentUser.alias || "Facilitador"}
        onLogout={handleLogout}
        onBack={() => setAppState("login")}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Header with new logo */}
      <header className="w-full p-6">
        <div className="max-w-4xl mx-auto flex justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
            <img 
              src="/new_logo.png" 
              alt="Inner World Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 pb-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Un espacio seguro para expresar emociones
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Plataforma diseñada para niñas, niños y adolescentes neurodivergentes, donde pueden registrar sus estados
            emocionales de forma autónoma en un entorno gamificado.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 hover:shadow-lg transition-all duration-200" style={{ borderColor: "var(--opcion-orange)" }}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--opcion-orange)20" }}>
                <Sparkles className="w-6 h-6" style={{ color: "var(--opcion-orange)" }} />
              </div>
              <CardTitle className="text-lg">Avatar Personalizable</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Crea y personaliza tu avatar con opciones de piel, cabello, ropa y accesorios
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all duration-200" style={{ borderColor: "var(--opcion-pink)" }}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--opcion-pink)20" }}>
                <Heart className="w-6 h-6" style={{ color: "var(--opcion-pink)" }} />
              </div>
              <CardTitle className="text-lg">Registro Emocional</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Registra tus emociones y percepciones sensoriales de forma rápida y guiada
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all duration-200" style={{ borderColor: "var(--opcion-blue)" }}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--opcion-blue)20" }}>
                <Users className="w-6 h-6" style={{ color: "var(--opcion-blue)" }} />
              </div>
              <CardTitle className="text-lg">Modos Individual y Grupal</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Participa en sesiones individuales o talleres grupales según tus necesidades
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Authentication section */}
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 justify-center">
              <Shield className="w-5 h-5 text-primary" />
              Acceso Seguro
            </CardTitle>
            <CardDescription>Ingresa con tu rol correspondiente</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="nna" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="nna">NNA</TabsTrigger>
                <TabsTrigger value="facilitator">Facilitador</TabsTrigger>
              </TabsList>

              <TabsContent value="nna" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alias">Alias</Label>
                  <Input
                    id="alias"
                    placeholder="Tu nombre de usuario"
                    value={loginForm.alias}
                    onChange={(e) => handleInputChange("alias", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pin">PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Tu PIN de 4 dígitos"
                    maxLength={4}
                    value={loginForm.pin}
                    onChange={(e) => handleInputChange("pin", e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleNNALogin}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!loginForm.alias || loginForm.pin.length !== 4}
                >
                  Ingresar como NNA
                </Button>
              </TabsContent>

              <TabsContent value="facilitator" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facilitator-email">Email</Label>
                  <Input
                    id="facilitator-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={loginForm.facilitatorEmail}
                    onChange={(e) => handleInputChange("facilitatorEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilitator-password">Contraseña</Label>
                  <Input
                    id="facilitator-password"
                    type="password"
                    placeholder="Tu contraseña segura"
                    value={loginForm.facilitatorPassword}
                    onChange={(e) => handleInputChange("facilitatorPassword", e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleFacilitatorLogin}
                  className="w-full bg-accent hover:bg-accent/90"
                  disabled={!loginForm.facilitatorEmail || !loginForm.facilitatorPassword}
                >
                  Ingresar como Facilitador
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
