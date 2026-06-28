import { useState, useEffect } from "react"

export default function CarrouselRoles() {
  const [slideActuel, setSlideActuel] = useState(0)

  const slides = [
    {
      icon: "👤",
      titre: "Pour les membres",
      texte: "Suivez votre épargne en temps réel, cotisez en un clic depuis votre téléphone.",
    },
    {
      icon: "✅",
      titre: "Pour les collecteurs",
      texte: "Validez les cotisations de votre tournée en un seul clic, plus de carnet papier.",
    },
    {
      icon: "📊",
      titre: "Pour les administrateurs",
      texte: "Pilotez votre micro-finance avec des statistiques en temps réel, où que vous soyez.",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideActuel((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      {/* Slide actuel avec transition fade */}
      <div className="bg-white/10 rounded-xl px-5 py-4 min-h-[100px] flex items-center gap-4 transition-opacity duration-500">
        <span className="text-2xl">{slides[slideActuel].icon}</span>
        <div>
          <p className="text-white font-semibold text-sm mb-1">{slides[slideActuel].titre}</p>
          <p className="text-primary-light/90 text-xs leading-relaxed">{slides[slideActuel].texte}</p>
        </div>
      </div>

      {/* Points de progression */}
      <div className="flex gap-2 mt-3 justify-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlideActuel(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === slideActuel ? "bg-white w-6" : "bg-white/30 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  )
}