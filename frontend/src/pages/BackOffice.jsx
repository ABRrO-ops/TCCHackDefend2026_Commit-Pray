import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, CheckCircle2, XCircle, Building2 } from "lucide-react"

export default function BackOffice() {
  const [demandes, setDemandes] = useState([])
  const [loading, setLoading] = useState(true)
  const [resultatValidation, setResultatValidation] = useState(null)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const chargerDemandes = () => {
    fetch("http://localhost:5000/api/inscription/demandes", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => { setDemandes(data); setLoading(false) })
  }

  useEffect(() => {
    if (!token) { navigate("/"); return }
    chargerDemandes()
  }, [])

  const deconnexion = () => { localStorage.clear(); navigate("/") }

  const valider = async (id) => {
    const res = await fetch(`http://localhost:5000/api/inscription/valider/${id}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token }
    })
    const data = await res.json()
    setResultatValidation(data)
    chargerDemandes()
  }

  const rejeter = async (id) => {
    await fetch(`http://localhost:5000/api/inscription/rejeter/${id}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token }
    })
    chargerDemandes()
  }

  if (loading) return (
    <div className="min-h-screen bg-secondary flex items-center justify-center">
      <p className="text-muted">Chargement...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-secondary p-8">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-main">Back-office CotiPay</h1>
          <p className="text-muted text-sm">Demandes d'inscription en attente</p>
        </div>
        <button onClick={deconnexion} className="flex items-center gap-2 bg-danger text-white px-4 py-2 rounded-lg text-sm font-semibold">
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      {resultatValidation && (
        <div className="bg-success-light border border-success/30 rounded-xl p-5 mb-6">
          <p className="font-bold text-success text-sm mb-2">✓ Micro-finance activée</p>
          <div className="bg-white rounded-lg p-3 text-sm space-y-1">
            <p><span className="text-muted">Email admin généré :</span> <span className="font-semibold text-main">{resultatValidation.emailGenere}</span></p>
            <p><span className="text-muted">Mot de passe temporaire :</span> <span className="font-semibold text-main">{resultatValidation.motDePasseTemp}</span></p>
            <p><span className="text-muted">À envoyer à :</span> <span className="font-semibold text-main">{resultatValidation.emailContact}</span></p>
          </div>
          <button onClick={() => setResultatValidation(null)} className="text-xs text-muted underline mt-2">
            Fermer
          </button>
        </div>
      )}

      {demandes.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-soft text-center">
          <p className="text-muted text-sm">Aucune demande en attente.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {demandes.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl p-5 border border-soft">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <Building2 size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-main text-sm">{d.nom_microfinance}</p>
                    <p className="text-muted text-xs">{d.ville} • {d.telephone}</p>
                  </div>
                </div>
                <span className="bg-warning-light text-warning text-xs font-semibold px-3 py-1 rounded-full">
                  Plan {d.plan_choisi}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <p><span className="text-muted">Directeur :</span> <span className="font-semibold text-main">{d.prenom_directeur} {d.nom_directeur}</span></p>
                <p><span className="text-muted">Email :</span> <span className="font-semibold text-main">{d.email_directeur}</span></p>
                <p><span className="text-muted">N° agrément :</span> <span className="font-semibold text-main">{d.numero_agrement || "Non fourni"}</span></p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => rejeter(d.id)}
                  className="flex items-center gap-2 border border-soft text-muted text-sm font-semibold px-4 py-2 rounded-lg"
                >
                  <XCircle size={16} /> Rejeter
                </button>
                <button
                  onClick={() => valider(d.id)}
                  className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg"
                >
                  <CheckCircle2 size={16} /> Valider
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}