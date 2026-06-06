import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function DashboardMembre() {
  const [compte, setCompte] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/"); return }

    fetch("http://localhost:5000/api/membres/mon-compte", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => { setCompte(data); setLoading(false) })
    .catch(() => { navigate("/") })
  }, [])

  const deconnexion = () => {
    localStorage.clear()
    navigate("/")
  }

  if (loading) return <p className="p-6">Chargement...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Mon Espace — CotiPay</h1>
        <button onClick={deconnexion} className="bg-red-500 text-white px-4 py-2 rounded text-sm">
          Se déconnecter
        </button>
      </div>

      {/* Solde */}
      <div className="bg-white rounded shadow p-6 mb-6 border-l-4 border-green-500">
        <p className="text-gray-500 text-sm">Mon solde actuel</p>
        <p className="text-4xl font-bold text-green-700">{compte.membre.solde} FCFA</p>
        <p className="text-gray-400 text-sm mt-1">
          Cotisation journalière : {compte.membre.montant_cotisation} FCFA
        </p>
      </div>

      {/* Historique */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-bold text-lg mb-4">Historique des cotisations</h2>
        {compte.cotisations.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune cotisation enregistrée.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Montant</th>
                <th className="p-2 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {compte.cotisations.map((c, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{c.date_cotisation}</td>
                  <td className="p-2">{c.montant} FCFA</td>
                  <td className="p-2">
                    {c.statut === "valide"
                      ? <span className="text-green-600">✅ Validé</span>
                      : <span className="text-orange-500">⏳ En attente</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}