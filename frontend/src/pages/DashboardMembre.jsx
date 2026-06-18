import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard, History, Banknote, User, LogOut, ChevronLeft, ChevronRight, Flame } from "lucide-react"

export default function DashboardMembre() {
  const [compte, setCompte] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOuverte, setSidebarOuverte] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) { navigate("/"); return }
    fetch("http://localhost:5000/api/membres/mon-compte", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => { setCompte(data); setLoading(false) })
    .catch(() => navigate("/"))
  }, [])

  const deconnexion = () => { localStorage.clear(); navigate("/") }

  const joursDuMois = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  }

  // Calcule la série consécutive ET détecte le jour de rupture (logique tontine stricte)
  const calculerSerie = () => {
    if (!compte) return { serie: 0, joursCotises: [], jourRupture: null }
    const now = new Date()
    const totalJours = joursDuMois()
    const joursValides = new Set(
      compte.cotisations
        .filter(c => c.statut === "valide" && new Date(c.date_cotisation).getMonth() === now.getMonth())
        .map(c => new Date(c.date_cotisation).getDate())
    )

    let serie = 0
    let jourRupture = null
    for (let i = 1; i <= now.getDate(); i++) {
      if (joursValides.has(i)) {
        serie++
      } else if (i < now.getDate()) {
        // jour passé non cotisé = rupture de série
        jourRupture = i
        break
      }
    }
    return { serie, joursValides, jourRupture, totalJours }
  }

  const { serie, joursValides, jourRupture, totalJours } = compte ? calculerSerie() : { serie: 0, joursValides: new Set(), jourRupture: null, totalJours: 30 }

  const genererCalendrier = () => {
    const now = new Date()
    const jours = []
    for (let i = 1; i <= totalJours; i++) {
      let etat = "futur"
      if (jourRupture && i >= jourRupture && i < now.getDate()) etat = "manque"
      else if (i === now.getDate()) etat = "aujourdhui"
      else if (joursValides.has(i)) etat = "paye"
      else if (i < now.getDate()) etat = "manque"
      jours.push({ jour: i, etat })
    }
    return jours
  }

  const navItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", actif: true },
    { icon: History, label: "Historique" },
    { icon: Banknote, label: "Retraits" },
    { icon: User, label: "Profil" },
  ]

  if (loading) return (
    <div className="min-h-screen bg-secondary flex items-center justify-center">
      <p className="text-muted">Chargement...</p>
    </div>
  )

  const couleurEtat = {
    paye: "bg-success-light text-success",
    aujourdhui: "bg-primary text-white font-bold",
    futur: "bg-soft/40 text-muted/50",
    manque: "bg-danger-light text-danger",
  }

  return (
    <div className="min-h-screen bg-secondary flex">

      {/* SIDEBAR */}
      <aside className={`bg-primary text-white flex flex-col justify-between transition-all duration-300 ${sidebarOuverte ? "w-56" : "w-20"}`}>
        <div>
          {/* Logo + toggle */}
          <div className="flex items-center justify-between px-4 py-5">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">C</span>
              </div>
              {sidebarOuverte && <span className="font-bold whitespace-nowrap">CotiPay</span>}
            </div>
          </div>

          <button
            onClick={() => setSidebarOuverte(!sidebarOuverte)}
            className="mx-4 mb-4 bg-primary-dark/60 hover:bg-primary-dark rounded-lg p-1.5 flex items-center justify-center transition-colors"
          >
            {sidebarOuverte ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          <div className="border-t border-white/10 mx-4 mb-3" />

          {/* Navigation */}
          <nav className="px-3 space-y-1">
            {navItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  item.actif ? "bg-white/15" : "hover:bg-white/5"
                }`}
              >
                <item.icon size={18} className={item.actif ? "text-white" : "text-white/60"} />
                {sidebarOuverte && (
                  <span className={`text-sm whitespace-nowrap ${item.actif ? "font-semibold text-white" : "text-white/60"}`}>
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* User footer */}
        <div className="border-t border-white/10 px-3 py-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-xs font-bold">
                {compte.membre.nom?.charAt(0)}{compte.membre.prenom?.charAt(0)}
              </span>
            </div>
            {sidebarOuverte && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{compte.membre.prenom} {compte.membre.nom}</p>
                <p className="text-xs text-white/50">Membre</p>
              </div>
            )}
            <button onClick={deconnexion} className="text-white/60 hover:text-white transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-main">
            Bonjour {compte.membre.prenom} 👋
          </h1>
          <p className="text-muted text-sm">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Bannière si série rompue */}
        {jourRupture && (
          <div className="bg-danger-light border border-danger/30 rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
            <p className="text-danger text-sm font-medium">
              ⚠️ Cotisation manquée le {jourRupture} — régularisez pour débloquer votre compte
            </p>
            <button className="bg-danger text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90">
              Régulariser
            </button>
          </div>
        )}

        {/* 3 cartes héro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {/* Carte solde */}
          <div className="md:col-span-1 bg-primary rounded-2xl p-6 text-white">
            <p className="text-primary-light/80 text-xs mb-1">SOLDE TOTAL</p>
            <p className="text-3xl font-bold mb-4">{compte.membre.solde} FCFA</p>
            <div className="bg-white/20 rounded-full h-1.5 mb-2">
              <div className="bg-success h-1.5 rounded-full" style={{ width: `${(serie / totalJours) * 100}%` }} />
            </div>
            <p className="text-primary-light/70 text-xs">Cotisation : {compte.membre.montant_cotisation} FCFA/jour</p>
          </div>

          {/* Carte statut du jour */}
          <div className="bg-white rounded-2xl p-6 border border-soft">
            <p className="text-muted text-xs mb-3">STATUT AUJOURD'HUI</p>
            {joursValides.has(new Date().getDate()) ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-success-light rounded-full flex items-center justify-center">
                    <span className="text-success font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-success text-sm">Cotisé</p>
                    <p className="text-muted text-xs">{compte.membre.montant_cotisation} FCFA validés</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning-light rounded-full flex items-center justify-center">
                  <span className="text-warning font-bold">⏳</span>
                </div>
                <div>
                  <p className="font-bold text-warning text-sm">En attente</p>
                  <p className="text-muted text-xs">Pas encore validé aujourd'hui</p>
                </div>
              </div>
            )}
          </div>

          {/* Carte régularité */}
          <div className="bg-white rounded-2xl p-6 border border-soft">
            <p className="text-muted text-xs mb-3">RÉGULARITÉ</p>
            <p className="text-2xl font-bold text-primary mb-1">
              {serie}<span className="text-muted text-sm font-normal">/{totalJours}</span>
            </p>
            <p className="text-muted text-xs mb-3">jours cotisés ce mois</p>
            <div className="flex items-center gap-1.5 text-warning text-xs font-semibold">
              <Flame size={14} />
              <span>Série de {serie} jours</span>
            </div>
          </div>
        </div>

        {/* Rangée basse : calendrier + historique */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Calendrier */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-soft">
            <p className="font-bold text-main text-sm mb-1">Calendrier de cotisation</p>
            <p className="text-muted text-xs mb-4">
              {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>

            <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted/60 mb-2">
              {["L","M","M","J","V","S","D"].map((j, i) => <span key={i}>{j}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {genererCalendrier().map((j, i) => (
                <div key={i} className={`text-xs rounded-lg text-center py-2.5 ${couleurEtat[j.etat]}`}>
                  {j.jour}
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-4 text-xs text-muted">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-success-light rounded inline-block" /> Payé</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary rounded inline-block" /> Aujourd'hui</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-danger-light rounded inline-block" /> Manqué</span>
            </div>
          </div>

          {/* Historique */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-soft">
            <p className="font-bold text-main text-sm mb-4">Activité récente</p>
            {compte.cotisations.length === 0 ? (
              <p className="text-muted text-xs">Aucune cotisation enregistrée.</p>
            ) : (
              <div className="space-y-3">
                {compte.cotisations.slice(0, 5).map((c, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-soft last:border-0 last:pb-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${c.statut === "valide" ? "bg-success" : "bg-warning"}`} />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-main">
                          {new Date(c.date_cotisation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </p>
                        <p className={`text-sm font-semibold ${c.statut === "valide" ? "text-success" : "text-warning"}`}>
                          {c.statut === "valide" ? `+${c.montant}` : "en attente"}
                        </p>
                      </div>
                      <p className="text-muted text-xs">
                        {c.statut === "valide" ? "Validé" : "Non traité"}
                        {c.heure_validation ? ` à ${new Date(c.heure_validation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  )
}