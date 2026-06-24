import { useState } from "react"

export default function ChoixMontant({ onConfirme, onAnnuler }) {
  const [montant, setMontant] = useState("")

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 className="font-bold text-main text-lg mb-1">Nouveau mois 🎉</h3>
        <p className="text-muted text-sm mb-5">
          Combien souhaitez-vous cotiser chaque jour ce mois-ci ?
          Ce montant restera fixe jusqu'au mois prochain.
        </p>

        <input
          type="number"
          placeholder="Ex: 2000"
          value={montant}
          onChange={e => setMontant(e.target.value)}
          className="w-full border border-soft rounded-xl px-4 py-3 mb-6 text-sm focus:outline-none focus:border-primary"
        />

        <div className="flex gap-3">
          <button onClick={onAnnuler} className="flex-1 py-3 rounded-xl border border-soft text-muted text-sm font-semibold">
            Annuler
          </button>
          <button
            onClick={() => montant > 0 && onConfirme(parseInt(montant))}
            disabled={!montant || montant <= 0}
            className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-40"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}