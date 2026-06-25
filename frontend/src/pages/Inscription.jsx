import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import IndicateurEtapes from "../components/IndicateurEtapes"

export default function Inscription() {
  const [etape, setEtape] = useState(1)
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState("")
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nom_microfinance: "",
    ville: "",
    telephone: "",
    numero_agrement: "",
    plan_choisi: "",
    nom_directeur: "",
    prenom_directeur: "",
    email_directeur: "",
  })

  const majChamp = (champ, valeur) => {
    setFormData({ ...formData, [champ]: valeur })
  }

  const suivant = () => setEtape(etape + 1)
  const precedent = () => setEtape(etape - 1)

  const envoyerDemande = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/inscription/demande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (res.ok) {
        setEnvoye(true)
      } else {
        setErreur(data.error || "Une erreur est survenue")
      }
    } catch (err) {
      setErreur("Erreur de connexion au serveur")
    }
  }

  const plans = [
    { id: "starter", nom: "🚀 Starter", prix: "100 000 FCFA/mois" },
    { id: "standard", nom: "⚡ Standard", prix: "150 000 FCFA/mois" },
    { id: "premium", nom: "💎 Premium", prix: "300 000 FCFA/mois" },
  ]

  if (envoye) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-success" />
          </div>
          <h2 className="text-xl font-bold text-main mb-2">Demande envoyée !</h2>
          <p className="text-muted text-sm mb-6">
            Notre équipe va vérifier votre dossier. Vous recevrez un email de confirmation sous 48h.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full">

        <Link to="/" className="flex items-center gap-2 text-muted text-sm mb-6">
          <ArrowLeft size={16} /> Retour à la connexion
        </Link>

        <IndicateurEtapes etapeActuelle={etape} totalEtapes={4} />

        {erreur && (
          <p className="text-danger text-sm mb-4 bg-danger-light px-4 py-2 rounded-lg">{erreur}</p>
        )}

        {/* ÉTAPE 1 — Micro-finance */}
        {etape === 1 && (
          <>
            <h2 className="text-xl font-bold text-main mb-1">Parlez-nous de votre micro-finance</h2>
            <p className="text-muted text-sm mb-6">Ces informations nous aident à vérifier votre dossier.</p>

            <label className="text-sm font-semibold text-main">Nom de la micro-finance</label>
            <input
              value={formData.nom_microfinance}
              onChange={e => majChamp("nom_microfinance", e.target.value)}
              className="w-full border border-soft rounded-xl px-4 py-3 mt-1 mb-4 text-sm focus:outline-none focus:border-primary"
              placeholder="Ex: CECAV Fraternité"
            />

            <label className="text-sm font-semibold text-main">Ville</label>
            <input
              value={formData.ville}
              onChange={e => majChamp("ville", e.target.value)}
              className="w-full border border-soft rounded-xl px-4 py-3 mt-1 mb-4 text-sm focus:outline-none focus:border-primary"
              placeholder="Ex: Lomé"
            />

            <label className="text-sm font-semibold text-main">Téléphone</label>
            <input
              value={formData.telephone}
              onChange={e => majChamp("telephone", e.target.value)}
              className="w-full border border-soft rounded-xl px-4 py-3 mt-1 mb-4 text-sm focus:outline-none focus:border-primary"
              placeholder="Ex: 90000000"
            />

            <label className="text-sm font-semibold text-main">Numéro d'agrément</label>
            <input
              value={formData.numero_agrement}
              onChange={e => majChamp("numero_agrement", e.target.value)}
              className="w-full border border-soft rounded-xl px-4 py-3 mt-1 mb-6 text-sm focus:outline-none focus:border-primary"
              placeholder="Ex: AG-2024-0123"
            />

            <button
              onClick={suivant}
              disabled={!formData.nom_microfinance || !formData.ville || !formData.telephone}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm disabled:opacity-40"
            >
              Suivant →
            </button>
          </>
        )}

        {/* ÉTAPE 2 — Choix du plan */}
        {etape === 2 && (
          <>
            <h2 className="text-xl font-bold text-main mb-1">Choisissez votre formule</h2>
            <p className="text-muted text-sm mb-6">Vous pourrez changer de plan à tout moment.</p>

            <div className="space-y-3 mb-6">
              {plans.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => majChamp("plan_choisi", plan.id)}
                  className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition-colors ${
                    formData.plan_choisi === plan.id ? "border-primary bg-secondary" : "border-soft"
                  }`}
                >
                  <span className="font-semibold text-main text-sm">{plan.nom}</span>
                  <span className="text-muted text-xs">{plan.prix}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={precedent} className="flex-1 py-3 rounded-xl border border-soft text-muted text-sm font-semibold">
                Retour
              </button>
              <button
                onClick={suivant}
                disabled={!formData.plan_choisi}
                className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40"
              >
                Suivant →
              </button>
            </div>
          </>
        )}

        {/* ÉTAPE 3 — Infos directeur */}
        {etape === 3 && (
          <>
            <h2 className="text-xl font-bold text-main mb-1">Vos informations</h2>
            <p className="text-muted text-sm mb-6">En tant que directeur de la micro-finance.</p>

            <label className="text-sm font-semibold text-main">Prénom</label>
            <input
              value={formData.prenom_directeur}
              onChange={e => majChamp("prenom_directeur", e.target.value)}
              className="w-full border border-soft rounded-xl px-4 py-3 mt-1 mb-4 text-sm focus:outline-none focus:border-primary"
            />

            <label className="text-sm font-semibold text-main">Nom</label>
            <input
              value={formData.nom_directeur}
              onChange={e => majChamp("nom_directeur", e.target.value)}
              className="w-full border border-soft rounded-xl px-4 py-3 mt-1 mb-4 text-sm focus:outline-none focus:border-primary"
            />

            <label className="text-sm font-semibold text-main">Email</label>
            <input
              type="email"
              value={formData.email_directeur}
              onChange={e => majChamp("email_directeur", e.target.value)}
              className="w-full border border-soft rounded-xl px-4 py-3 mt-1 mb-6 text-sm focus:outline-none focus:border-primary"
              placeholder="vous@gmail.com"
            />

            <div className="flex gap-3">
              <button onClick={precedent} className="flex-1 py-3 rounded-xl border border-soft text-muted text-sm font-semibold">
                Retour
              </button>
              <button
                onClick={suivant}
                disabled={!formData.prenom_directeur || !formData.nom_directeur || !formData.email_directeur}
                className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40"
              >
                Suivant →
              </button>
            </div>
          </>
        )}

        {/* ÉTAPE 4 — Récapitulatif */}
        {etape === 4 && (
          <>
            <h2 className="text-xl font-bold text-main mb-1">Vérifiez vos informations</h2>
            <p className="text-muted text-sm mb-6">Tout est correct avant l'envoi ?</p>

            <div className="bg-secondary rounded-xl p-4 mb-6 space-y-2 text-sm">
              <p><span className="text-muted">Micro-finance :</span> <span className="font-semibold text-main">{formData.nom_microfinance}</span></p>
              <p><span className="text-muted">Ville :</span> <span className="font-semibold text-main">{formData.ville}</span></p>
              <p><span className="text-muted">Téléphone :</span> <span className="font-semibold text-main">{formData.telephone}</span></p>
              <p><span className="text-muted">Plan :</span> <span className="font-semibold text-main">{plans.find(p => p.id === formData.plan_choisi)?.nom}</span></p>
              <p><span className="text-muted">Directeur :</span> <span className="font-semibold text-main">{formData.prenom_directeur} {formData.nom_directeur}</span></p>
              <p><span className="text-muted">Email :</span> <span className="font-semibold text-main">{formData.email_directeur}</span></p>
            </div>

            <div className="flex gap-3">
              <button onClick={precedent} className="flex-1 py-3 rounded-xl border border-soft text-muted text-sm font-semibold">
                Retour
              </button>
              <button
                onClick={envoyerDemande}
                className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold"
              >
                Envoyer ma demande
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}