import { useState } from "react"
import { CheckCircle2 } from "lucide-react"

const modes = [
  {
    id: "mix_by_yas",
    nom: "Mix by Yas",
    description: "Paiement mobile Togocel",
    logo: "/mix-by-yas.png",
    bg: "#FFF4ED",
  },
  {
    id: "moov_money",
    nom: "Moov Money",
    description: "Paiement mobile Moov Africa",
    logo: "/moov-money.png",
    bg: "#FFF4ED",
  },
]

export default function ChoixPaiement({ onConfirme, onAnnuler, montant }) {
  const [modeSelectionne, setModeSelectionne] = useState(null)

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">

        {/* Header */}
        <h3 className="font-bold text-main text-lg mb-1">Mode de paiement</h3>
        <p className="text-muted text-sm mb-5">
          Montant à payer :{" "}
          <span className="font-bold text-primary">
            {parseFloat(montant).toLocaleString("fr-FR")} FCFA
          </span>
        </p>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {modes.map(mode => {
            const selectionne = modeSelectionne === mode.id
            return (
              <button
                key={mode.id}
                onClick={() => setModeSelectionne(mode.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectionne
                    ? "border-primary bg-secondary"
                    : "border-soft hover:border-primary/40 bg-white"
                }`}
              >
                {/* Logo */}
                <div className="w-12 h-12 rounded-xl bg-white border border-soft flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
                  <img
                    src={mode.logo}
                    alt={mode.nom}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Texte */}
                <div className="flex-1">
                  <p className="font-semibold text-main text-sm">{mode.nom}</p>
                  <p className="text-xs text-muted mt-0.5">{mode.description}</p>
                </div>

                {/* Check */}
                {selectionne && (
                  <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            onClick={onAnnuler}
            className="flex-1 py-3 rounded-xl border border-soft text-muted text-sm font-semibold hover:bg-soft/30 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => modeSelectionne && onConfirme(modeSelectionne)}
            disabled={!modeSelectionne}
            className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-40 hover:bg-primary-dark transition-colors"
          >
            Continuer
          </button>
        </div>

      </div>
    </div>
  )
}