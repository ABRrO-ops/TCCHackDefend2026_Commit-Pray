import { useState } from "react"
import { Download } from "lucide-react"

export default function SelecteurPeriode({ onExporter }) {
  const aujourdhui = new Date()
  const premierJourMois = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), 1)

  const formatDate = (date) => date.toISOString().split("T")[0]

  const [debut, setDebut] = useState(formatDate(premierJourMois))
  const [fin, setFin] = useState(formatDate(aujourdhui))

  return (
    <div className="bg-white rounded-2xl p-6 border border-soft mb-6">
      <p className="font-bold text-main text-sm mb-4">Exporter les cotisations</p>

      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-xs font-semibold text-muted">Du</label>
          <input
            type="date"
            value={debut}
            onChange={e => setDebut(e.target.value)}
            className="block border border-soft rounded-xl px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted">Au</label>
          <input
            type="date"
            value={fin}
            onChange={e => setFin(e.target.value)}
            className="block border border-soft rounded-xl px-3 py-2 mt-1 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <button
          onClick={() => onExporter(debut, fin)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Download size={16} />
          Exporter en CSV
        </button>
      </div>
    </div>
  )
}