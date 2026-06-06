import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function DashboardAdmin() {
  const [stats, setStats] = useState({ totalMembres: 0, cotisationsAujourdhui: 0, totalCollecte: 0 })
  const [cotisations, setCotisations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) { navigate("/"); return }

    fetch("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => setStats(data))

    fetch("http://localhost:5000/api/admin/cotisations/today", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => { setCotisations(data); setLoading(false) })
  }, [])

  const deconnexion = () => { localStorage.clear(); navigate("/") }

  if (loading) return <p className="p-6">Chargement...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Dashboard Admin — CotiPay</h1>
        <button onClick={deconnexion} className="bg-red-500 text-white px-4 py-2 rounded text-sm">
          Se déconnecter
        </button>
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Membres</p>
          <p className="text-3xl font-bold text-blue-700">{stats.totalMembres}</p>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Cotisations aujourd'hui</p>
          <p className="text-3xl font-bold text-green-700">{stats.cotisationsAujourdhui}</p>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm">Total collecté (FCFA)</p>
          <p className="text-3xl font-bold text-orange-700">{stats.totalCollecte}</p>
        </div>
      </div>

      {/* Tableau cotisations */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-bold text-lg mb-4">Cotisations du jour</h2>
        {cotisations.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune cotisation aujourd'hui.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Membre</th>
                <th className="p-2 text-left">Montant</th>
                <th className="p-2 text-left">Statut</th>
                <th className="p-2 text-left">Heure</th>
              </tr>
            </thead>
            <tbody>
              {cotisations.map((c, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{c.nom} {c.prenom}</td>
                  <td className="p-2">{c.montant} FCFA</td>
                  <td className="p-2">
                    {c.statut === "valide"
                      ? <span className="text-green-600">✅ Validé</span>
                      : <span className="text-orange-500">⏳ En attente</span>
                    }
                  </td>
                  <td className="p-2">{c.heure_validation ? new Date(c.heure_validation).toLocaleTimeString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}