import { useState } from "react"
import { X, CheckCircle2 } from "lucide-react"

export default function AjouterUtilisateur({ type, onFermer, onSucces, listeCollecteurs }) {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [collecteurId, setCollecteurId] = useState("")
  const [resultat, setResultat] = useState(null)
  const token = localStorage.getItem("token")

  const titre = type === "collecteur" ? "Ajouter un collecteur" : "Ajouter un membre"
  const route = type === "collecteur" ? "collecteurs" : "membres"

  const creer = async () => {
    const body = type === "collecteur"
      ? { nom, prenom }
      : { nom, prenom, collecteur_id: collecteurId }

    const res = await fetch(`http://localhost:5000/api/admin/${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify(body)
    })
    const data = await res.json()

    if (res.ok) {
      setResultat(data)
      onSucces()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">

        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-main text-lg">{titre}</h3>
          <button onClick={onFermer}><X size={18} className="text-muted" /></button>
        </div>

        {!resultat ? (
          <>
            <label className="text-sm font-semibold text-main">Prénom</label>
            <input
              value={prenom}
              onChange={e => setPrenom(e.target.value)}
              className="w-full border border-soft rounded-xl px-4 py-3 mt-1 mb-4 text-sm focus:outline-none focus:border-primary"
            />

            <label className="text-sm font-semibold text-main">Nom</label>
            <input
              value={nom}
              onChange={e => setNom(e.target.value)}
              className="w-full border border-soft rounded-xl px-4 py-3 mt-1 mb-4 text-sm focus:outline-none focus:border-primary"
            />

            {type === "membre" && (
              <>
                <label className="text-sm font-semibold text-main">Collecteur assigné</label>
                <select
                  value={collecteurId}
                  onChange={e => setCollecteurId(e.target.value)}
                  className="w-full border border-soft rounded-xl px-4 py-3 mt-1 mb-6 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Choisir un collecteur</option>
                  {listeCollecteurs?.map(c => (
                    <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>
                  ))}
                </select>
              </>
            )}

            <button
              onClick={creer}
              disabled={!nom || !prenom || (type === "membre" && !collecteurId)}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm disabled:opacity-40"
            >
              Créer
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="text-success mx-auto mb-3" />
            <p className="font-semibold text-main text-sm mb-3">Compte créé avec succès</p>
            <div className="bg-secondary rounded-xl p-4 text-left text-sm space-y-1 mb-4">
              <p><span className="text-muted">Email :</span> <span className="font-semibold text-main">{resultat.email}</span></p>
              <p><span className="text-muted">Mot de passe temporaire :</span> <span className="font-semibold text-main">{resultat.motDePasseTemp}</span></p>
            </div>
            <p className="text-muted text-xs mb-4">Communiquez ces identifiants à la personne concernée.</p>
            <button onClick={onFermer} className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm">
              Terminer
            </button>
          </div>
        )}

      </div>
    </div>
  )
}