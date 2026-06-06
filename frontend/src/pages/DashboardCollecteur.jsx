import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function DashboardCollecteur() {
  const [membres, setMembres] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  const chargerMembres = () => {
    fetch("http://localhost:5000/api/cotisations/mes-membres", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => { setMembres(data); setLoading(false) })
    .catch(() => navigate("/"))
  }

  useEffect(() => {
    if (!token) { navigate("/"); return }
    chargerMembres()
  }, [])

  const validerCotisation = async (membreId) => {
    const res = await fetch(`http://localhost:5000/api/cotisations/valider/${membreId}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token }
    })
    const data = await res.json()
    setMessage(data.message)
    chargerMembres()
    setTimeout(() => setMessage(""), 3000)
  }

  const deconnexion = () => {
    localStorage.clear()
    navigate("/")
  }

  if (loading) return <p className="p-6">Chargement...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Espace Collecteur — CotiPay</h1>
        <button onClick={deconnexion} className="bg-red-500 text-white px-4 py-2 rounded text-sm">
          Se déconnecter
        </button>
      </div>

      {/* Message de confirmation */}
      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
          ✅ {message}
        </div>
      )}

      {/* Liste des membres */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-bold text-lg mb-4">Membres de ma tournée</h2>
        {membres.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucun membre assigné.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Membre</th>
                <th className="p-2 text-left">Montant</th>
                <th className="p-2 text-left">Statut</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {membres.map((m, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{m.nom} {m.prenom}</td>
                  <td className="p-2">{m.montant_cotisation} FCFA</td>
                  <td className="p-2">
                    {m.statut === "valide"
                      ? <span className="text-green-600">✅ Validé</span>
                      : <span className="text-orange-500">⏳ En attente</span>
                    }
                  </td>
                  <td className="p-2">
                    {m.statut !== "valide" && (
                      <button
                        onClick={() => validerCotisation(m.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Valider
                      </button>
                    )}
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