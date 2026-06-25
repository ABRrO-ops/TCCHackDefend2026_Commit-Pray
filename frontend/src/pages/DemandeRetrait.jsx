import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import ChoixPaiement from "../components/ChoixPaiement"
import SimulationUSSD from "../components/SimulationUSSD"

export default function DemandeRetrait() {
  const [peutRetirer, setPeutRetirer] = useState(null)
  const [solde, setSolde] = useState(0)
  const [montant, setMontant] = useState("")
  const [etape, setEtape] = useState(null)
  const [modeChoisi, setModeChoisi] = useState(null)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetch("http://localhost:5000/api/membres/peut-retirer", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => { setPeutRetirer(data.peutRetirer); setSolde(data.solde) })
  }, [])

  const demarrerRetrait = () => {
    if (!montant || montant <= 0 || montant > solde) {
      setMessage("Montant invalide")
      return
    }
    setEtape("choix-paiement")
  }

  const handleChoixPaiement = (mode) => {
    setModeChoisi(mode)
    setEtape("ussd")
  }

  const handleConfirmeUSSD = async () => {
    setEtape(null)
    const res = await fetch("http://localhost:5000/api/membres/demande-retrait", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ montant: parseInt(montant), mode_paiement: modeChoisi })
    })
    const data = await res.json()
    setMessage(data.message || data.error)
  }

  if (peutRetirer === null) return (
    <div className="min-h-screen bg-secondary flex items-center justify-center">
      <p className="text-muted text-sm">Chargement...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-secondary p-8">
      <button
        onClick={() => navigate("/membre")}
        className="flex items-center gap-2 text-muted text-sm mb-6 hover:text-main transition-colors"
      >
        <ArrowLeft size={16} /> Retour au dashboard
      </button>

      <div className="max-w-md mx-auto bg-white rounded-2xl p-6 border border-soft">
        <h1 className="text-xl font-bold text-main mb-1">Demander un retrait</h1>
        <p className="text-muted text-sm mb-6">
          Solde disponible : <span className="font-semibold text-main">{parseFloat(solde).toLocaleString('fr-FR')} FCFA</span>
        </p>

        {message && (
          <div className={`text-sm px-4 py-3 rounded-xl mb-4 font-medium ${
            message.includes("attente") ? "bg-secondary text-primary" : "bg-danger-light text-danger"
          }`}>
            {message}
          </div>
        )}

        {!peutRetirer ? (
          <div className="bg-danger-light text-danger text-sm px-4 py-3 rounded-xl">
            ⚠️ Vous devez compléter toutes vos cotisations de ce mois avant de pouvoir retirer.
          </div>
        ) : (
          <>
            <label className="text-sm font-semibold text-main block mb-1">
              Montant à retirer
            </label>
            <input
              type="number"
              value={montant}
              onChange={e => setMontant(e.target.value)}
              placeholder="Ex: 5000"
              className="w-full border border-soft rounded-xl px-4 py-3 mt-1 mb-2 text-sm focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-muted mb-5">Maximum : {parseFloat(solde).toLocaleString('fr-FR')} FCFA</p>
            <button
              onClick={demarrerRetrait}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold text-sm transition-colors"
            >
              Confirmer le retrait
            </button>
          </>
        )}
      </div>

      {etape === "choix-paiement" && (
        <ChoixPaiement
          montant={montant}
          onConfirme={handleChoixPaiement}
          onAnnuler={() => setEtape(null)}
        />
      )}
      {etape === "ussd" && (
        <SimulationUSSD
          mode={modeChoisi}
          montant={montant}
          onConfirme={handleConfirmeUSSD}
          onAnnuler={() => setEtape(null)}
        />
      )}
    </div>
  )
}