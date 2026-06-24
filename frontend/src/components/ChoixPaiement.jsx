import { useState } from "react"

export default function ChoixPaiement({ onConfirme, onAnnuler, montant }) {
  const [modeSelectionne, setModeSelectionne] = useState(null)

  const modes = [
    { id: "mix_by_yas", nom: "Mix by Yas", couleur: "#FF6600" },
    { id: "moov_money", nom: "Moov Money", couleur: "#0066CC" },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 className="font-bold text-main text-lg mb-1">Choisir le mode de paiement</h3>
        <p className="text-muted text-sm mb-5">Montant : {montant} FCFA</p>

        <div className="space-y-3 mb-6">
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setModeSelectionne(mode.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                modeSelectionne === mode.id ? "border-primary bg-secondary" : "border-soft"
              }`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: mode.couleur }}>
                {mode.nom.charAt(0)}
              </div>
              <span className="font-semibold text-main text-sm">{mode.nom}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onAnnuler} className="flex-1 py-3 rounded-xl border border-soft text-muted text-sm font-semibold">
            Annuler
          </button>
          <button
            onClick={() => modeSelectionne && onConfirme(modeSelectionne)}
            disabled={!modeSelectionne}
            className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-40"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  )
}