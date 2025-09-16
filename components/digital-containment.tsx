import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Heart, 
  Waves, 
  Gamepad2, 
  Palette, 
  Music, 
  ArrowLeft, 
  Play, 
  Pause,
  RotateCcw,
  Volume2,
  VolumeX
} from "lucide-react"

interface DigitalContainmentProps {
  onBack: () => void
  userAlias: string
}

export default function DigitalContainment({ onBack, userAlias }: DigitalContainmentProps) {
  const [activeActivity, setActiveActivity] = useState<string | null>(null)
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [breathingCount, setBreathingCount] = useState(0)
  const [isBreathingActive, setIsBreathingActive] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [currentColor, setCurrentColor] = useState("#05C7F2")

  // Breathing exercise timer
  useEffect(() => {
    if (!isBreathingActive) return

    const phases = {
      inhale: 4000,
      hold: 4000,
      exhale: 4000
    }

    const timer = setTimeout(() => {
      if (breathingPhase === "inhale") {
        setBreathingPhase("hold")
      } else if (breathingPhase === "hold") {
        setBreathingPhase("exhale")
      } else {
        setBreathingPhase("inhale")
        setBreathingCount(prev => prev + 1)
      }
    }, phases[breathingPhase])

    return () => clearTimeout(timer)
  }, [breathingPhase, isBreathingActive])

  const activities = [
    {
      id: "breathing",
      name: "Respiración Consciente",
      description: "Ejercicios guiados de respiración para calmarte",
      icon: Waves,
      color: "var(--opcion-blue)",
      bgColor: "bg-blue-50"
    },
    {
      id: "coloring",
      name: "Colorear Digital",
      description: "Actividad creativa para relajarte",
      icon: Palette,
      color: "var(--opcion-pink)",
      bgColor: "bg-pink-50"
    },
    {
      id: "sounds",
      name: "Sonidos Relajantes",
      description: "Escucha sonidos de la naturaleza",
      icon: Music,
      color: "var(--opcion-yellow)",
      bgColor: "bg-yellow-50"
    },
    {
      id: "minigame",
      name: "Juego Tranquilo",
      description: "Mini-juego simple para distraerte",
      icon: Gamepad2,
      color: "var(--opcion-orange)",
      bgColor: "bg-orange-50"
    }
  ]

  const renderBreathingExercise = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Respiración 4-4-4</h3>
        <p className="text-muted-foreground">Sigue el círculo y respira conmigo</p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-48 h-48">
          <div 
            className={`w-full h-full rounded-full border-4 transition-all duration-1000 ${
              breathingPhase === "inhale" ? "scale-110 bg-blue-100" :
              breathingPhase === "hold" ? "scale-110 bg-yellow-100" :
              "scale-90 bg-green-100"
            }`}
            style={{ borderColor: "var(--opcion-blue)" }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {breathingPhase === "inhale" ? "⬆️" : 
                   breathingPhase === "hold" ? "⏸️" : "⬇️"}
                </div>
                <div className="text-lg font-semibold capitalize">
                  {breathingPhase === "inhale" ? "Inhala" :
                   breathingPhase === "hold" ? "Mantén" : "Exhala"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Ciclos completados: {breathingCount}
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setIsBreathingActive(!isBreathingActive)
                if (!isBreathingActive) {
                  setBreathingPhase("inhale")
                }
              }}
              style={{ backgroundColor: "var(--opcion-blue)" }}
            >
              {isBreathingActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isBreathingActive ? "Pausar" : "Comenzar"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsBreathingActive(false)
                setBreathingCount(0)
                setBreathingPhase("inhale")
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderColoringActivity = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Colorear Digital</h3>
        <p className="text-muted-foreground">Toca las formas para colorearlas</p>
      </div>

      <div className="grid grid-cols-6 gap-2 mb-4">
        {["#F27B35", "#F2B035", "#05C7F2", "#F21BA7", "#38A169", "#805AD5"].map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 ${currentColor === color ? 'border-gray-800' : 'border-gray-300'}`}
            style={{ backgroundColor: color }}
            onClick={() => setCurrentColor(color)}
          />
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 min-h-64">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <circle cx="100" cy="100" r="40" fill="transparent" stroke="#ccc" strokeWidth="2" className="cursor-pointer hover:fill-current" style={{ color: currentColor }} onClick={(e) => (e.target as SVGElement).style.fill = currentColor} />
          <rect x="200" y="60" width="80" height="80" fill="transparent" stroke="#ccc" strokeWidth="2" className="cursor-pointer hover:fill-current" style={{ color: currentColor }} onClick={(e) => (e.target as SVGElement).style.fill = currentColor} />
          <polygon points="320,140 360,60 400,140" fill="transparent" stroke="#ccc" strokeWidth="2" className="cursor-pointer hover:fill-current" style={{ color: currentColor }} onClick={(e) => (e.target as SVGElement).style.fill = currentColor} />
          <path d="M50 200 Q 100 160 150 200 T 250 200" fill="transparent" stroke="#ccc" strokeWidth="3" className="cursor-pointer hover:stroke-current" style={{ color: currentColor }} onClick={(e) => (e.target as SVGElement).style.stroke = currentColor} />
        </svg>
      </div>
    </div>
  )

  const renderSoundsActivity = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Sonidos Relajantes</h3>
        <p className="text-muted-foreground">Elige un sonido que te tranquilice</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { name: "Lluvia", emoji: "🌧️", description: "Sonido suave de lluvia" },
          { name: "Océano", emoji: "🌊", description: "Olas del mar" },
          { name: "Bosque", emoji: "🌲", description: "Sonidos del bosque" },
          { name: "Viento", emoji: "💨", description: "Brisa suave" }
        ].map((sound) => (
          <Card key={sound.name} className="cursor-pointer hover:shadow-md transition-all">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{sound.emoji}</div>
              <h4 className="font-semibold">{sound.name}</h4>
              <p className="text-xs text-muted-foreground">{sound.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-2"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          {soundEnabled ? "Silenciar" : "Activar sonido"}
        </Button>
      </div>
    </div>
  )

  const renderMiniGame = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Encuentra las Parejas</h3>
        <p className="text-muted-foreground">Juego simple de memoria</p>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border-2 border-blue-300 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center text-2xl"
          >
            ?
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">Toca las cartas para voltearlas</p>
      </div>
    </div>
  )

  if (activeActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <header className="w-full p-6 border-b border-border/50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setActiveActivity(null)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Espacio de Calma</h1>
                <p className="text-sm text-muted-foreground">Hola, {userAlias}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6">
          {activeActivity === "breathing" && renderBreathingExercise()}
          {activeActivity === "coloring" && renderColoringActivity()}
          {activeActivity === "sounds" && renderSoundsActivity()}
          {activeActivity === "minigame" && renderMiniGame()}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="w-full p-6 border-b border-border/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Espacio de Calma</h1>
              <p className="text-sm text-muted-foreground">Hola, {userAlias}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg mx-auto mb-4">
            <img 
              src="/new_logo.png" 
              alt="Inner World Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Tu Espacio Seguro</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aquí puedes tomar un descanso y hacer actividades que te ayuden a sentirte mejor
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <Card
                key={activity.id}
                className={`cursor-pointer border-2 hover:shadow-lg transition-all duration-200 hover:scale-105 ${activity.bgColor}`}
                onClick={() => setActiveActivity(activity.id)}
              >
                <CardHeader className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${activity.color}20` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: activity.color }} />
                  </div>
                  <CardTitle className="text-xl">{activity.name}</CardTitle>
                  <CardDescription className="text-center">
                    {activity.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: activity.color }}
                  >
                    Comenzar
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="font-semibold mb-2">Consejo del día</h3>
              <p className="text-sm text-muted-foreground">
                Recuerda que está bien sentir diferentes emociones. 
                Tómate el tiempo que necesites aquí.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}