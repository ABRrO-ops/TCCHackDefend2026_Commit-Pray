import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard, History, User, LogOut, ChevronLeft, ChevronRight, CheckCircle2, Clock, Wallet, Users } from "lucide-react"

export default function DashboardCollecteur() {
  const [membres, setMembres] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOuverte, setSidebarOuverte] = useState(true)
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

  const deconnexion = () => { localStorage.clear(); navigate("/") }

  const navItems = [
    { icon: LayoutDashboard, label: "Ma tournée", actif: true },
    { icon: History, label: "Historique" },
    { icon: User, label: "Profil" },
  ]

  if (loading) return (
    <div className="min-h-screen bg-secondary flex items-center justify-center">
      <p className="text-muted">Chargement...</p>
    </div>
  )

  const aValider = membres.filter(m => m.statut !== "valide")
  const valides = membres.filter(m => m.statut === "valide")
  const totalCollecte = valides.reduce((sum, m) => sum + parseFloat(m.montant_cotisation), 0)
  const progression = membres.length > 0 ? Math.round((valides.length / membres.length) * 100) : 0

  return (
    <div className="min-h-screen bg-secondary flex">

      {/* SIDEBAR */}
      <aside className={`bg-primary text-white flex flex-col justify-between transition-all duration-300 ${sidebarOuverte ? "w-56" : "w-20"}`}>
        <div>
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

        <div className="border-t border-white/10 px-3 py-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-xs font-bold">AK</span>
            </div>
            {sidebarOuverte && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">Ali Kofri</p>
                <p className="text-xs text-white/50">Collecteur</p>
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
          <h1 className="text-2xl font-bold text-main">Dashboard</h1>
          <p className="text-muted text-sm">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {message && (
          <div className="bg-success-light text-success text-sm px-4 py-3 rounded-xl mb-5 font-medium">
            ✓ {message}
          </div>
        )}

        {/* 3 cartes objectif/performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {/* Progression tournée */}
          <div className="bg-primary rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Users size={14} className="text-primary-light/80" />
              <p className="text-primary-light/80 text-xs">PROGRESSION TOURNÉE</p>
            </div>
            <p className="text-3xl font-bold mb-3">{valides.length}<span className="text-lg text-primary-light/70">/{membres.length}</span></p>
            <div className="bg-white/20 rounded-full h-1.5 mb-2">
              <div className="bg-success h-1.5 rounded-full transition-all" style={{ width: `${progression}%` }} />
            </div>
            <p className="text-primary-light/70 text-xs">{progression}% de la tournée complétée</p>
          </div>

          {/* Montant collecté */}
          <div className="bg-white rounded-2xl p-6 border border-soft">
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={14} className="text-muted" />
              <p className="text-muted text-xs">COLLECTÉ AUJOURD'HUI</p>
            </div>
            <p className="text-2xl font-bold text-success">{totalCollecte.toLocaleString('fr-FR')} FCFA</p>
            <p className="text-muted text-xs mt-1">Sur {membres.reduce((s, m) => s + parseFloat(m.montant_cotisation), 0).toLocaleString('fr-FR')} FCFA attendus</p>
          </div>

          {/* Restants */}
          <div className="bg-white rounded-2xl p-6 border border-soft">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-warning" />
              <p className="text-muted text-xs">RESTANTS À VOIR</p>
            </div>
            <p className="text-2xl font-bold text-warning">{aValider.length}</p>
            <p className="text-muted text-xs mt-1">
              {aValider.length === 0 ? "Tournée terminée 🎉" : "membres à visiter encore"}
            </p>
          </div>
        </div>

        {/* 2 colonnes : à valider / validés */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* À VALIDER */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-warning" />
              <h2 className="font-bold text-main text-sm">À valider ({aValider.length})</h2>
            </div>

            {aValider.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-soft text-center">
                <p className="text-muted text-sm">Tous les membres ont été visités aujourd'hui 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aValider.map((m, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-soft flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xs font-bold">
                          {m.nom?.charAt(0)}{m.prenom?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-main">{m.nom} {m.prenom}</p>
                        <p className="text-xs text-muted">{m.montant_cotisation} FCFA/jour</p>
                        {m.initiee_par === "membre" && (
                          <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-primary bg-secondary px-2 py-0.5 rounded-full">
                            ● Initié par le membre
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => validerCotisation(m.id)}
                      className="bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      Valider
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DÉJÀ VALIDÉS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-success" />
              <h2 className="font-bold text-main text-sm">Déjà validés ({valides.length})</h2>
            </div>

            {valides.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-soft text-center">
                <p className="text-muted text-sm">Aucune validation pour l'instant</p>
              </div>
            ) : (
              <div className="space-y-3">
                {valides.map((m, i) => (
                  <div key={i} className="bg-success-light/40 rounded-2xl p-4 border border-success/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-success text-xs font-bold">
                          {m.nom?.charAt(0)}{m.prenom?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-main">{m.nom} {m.prenom}</p>
                        <p className="text-xs text-muted">
                          {m.heure_validation
                            ? `Validé à ${new Date(m.heure_validation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                            : "Validé"}
                        </p>
                      </div>
                    </div>
                    <span className="text-success text-sm font-bold">+{m.montant_cotisation}</span>
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