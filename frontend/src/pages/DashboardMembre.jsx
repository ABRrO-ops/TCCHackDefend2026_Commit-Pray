import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function DashboardMembre() {
  const [compte, setCompte] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const chargerCompte = () => {
    fetch("http://localhost:5000/api/membres/mon-compte", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => { setCompte(data); setLoading(false) })
    .catch(() => navigate("/"))
  }

  useEffect(() => {
    if (!token) { navigate("/"); return }
    chargerCompte()
  }, [])

  const deconnexion = () => { localStorage.clear(); navigate("/") }

  // Calcul jours cotisés ce mois
  const joursDuMois = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  }

  const joursCotises = () => {
    if (!compte) return 0
    const now = new Date()
    return compte.cotisations.filter(c => {
      const d = new Date(c.date_cotisation)
      return d.getMonth() === now.getMonth() && c.statut === "valide"
    }).length
  }

  // Générer le calendrier du mois
  const genererCalendrier = () => {
    if (!compte) return []
    const now = new Date()
    const totalJours = joursDuMois()
    const jours = []
    for (let i = 1; i <= totalJours; i++) {
      const date = new Date(now.getFullYear(), now.getMonth(), i)
      const dateStr = date.toISOString().split("T")[0]
      const cotise = compte.cotisations.find(c =>
        c.date_cotisation && c.date_cotisation.startsWith(dateStr) && c.statut === "valide"
      )
      jours.push({ jour: i, cotise: !!cotise, aujourd_hui: i === now.getDate() })
    }
    return jours
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Chargement...</p>
    </div>
  )

  const total = joursDuMois()
  const cotises = joursCotises()
  const progression = Math.round((cotises / total) * 100)

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <span className="text-xl font-bold text-blue-700">CotiPay</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Membre</span>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {compte.membre.nom?.charAt(0)}{compte.membre.prenom?.charAt(0)}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto">

        {/* Message */}
        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm text-center">
            {message}
          </div>
        )}

        {/* Carte solde */}
        <div className="bg-blue-600 rounded-2xl p-6 mb-6 text-white">
          <p className="text-blue-200 text-sm mb-1"> MON SOLDE TOTAL</p>
          <p className="text-4xl font-bold mb-3">{compte.membre.solde} FCFA</p>

          {/* Barre de progression */}
          <div className="bg-blue-500 rounded-full h-2 mb-2">
            <div
              className="bg-white rounded-full h-2 transition-all"
              style={{ width: progression + "%" }}
            />
          </div>
          <div className="flex justify-between text-blue-200 text-xs">
            <span>{cotises}/{total} jours cotisés</span>
            <span>{new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">

          {/* Calendrier */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <p className="font-bold text-sm mb-3"> CALENDRIER</p>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
              {["L","M","M","J","V","S","D"].map((j,i) => <span key={i}>{j}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">s
              {genererCalendrier().map((j, i) => (
                <div
                  key={i}
                  className={`text-xs rounded text-center py-1 font-medium
                    ${j.cotise ? "bg-green-500 text-white" : ""}
                    ${j.aujourd_hui && !j.cotise ? "bg-blue-500 text-white" : ""}
                    ${!j.cotise && !j.aujourd_hui ? "text-gray-400" : ""}
                  `}
                >
                  {j.jour}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded inline-block"/> Payé</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded inline-block"/> Auj.</span>
            </div>
          </div>

          {/* Historique */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <p className="font-bold text-sm mb-3"> HISTORIQUE</p>
            {compte.cotisations.length === 0 ? (
              <p className="text-gray-400 text-xs">Aucune cotisation.</p>
            ) : (
              <div className="space-y-2">
                {compte.cotisations.slice(0, 5).map((c, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      {new Date(c.date_cotisation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-green-500"></span>
                    <span className="font-bold">{c.montant} FCFA</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bouton déconnexion */}
        <button
          onClick={deconnexion}
          className="w-full bg-red-500 text-white py-3 rounded-xl font-bold"
        >
          Se déconnecter
        </button>

      </div>
    </div>
  )
}