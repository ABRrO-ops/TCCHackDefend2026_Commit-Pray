import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, History, Settings, LogOut, ChevronLeft, ChevronRight, Wallet, TrendingUp, CheckCircle2 } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import AjouterUtilisateur from "../components/AjouterUtilisateur"

export default function DashboardAdmin() {
  const [stats, setStats] = useState({ totalMembres: 0, cotisationsAujourdhui: 0, totalCollecte: 0 })
  const [cotisations, setCotisations] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOuverte, setSidebarOuverte] = useState(true)
  const [modaleOuverte, setModaleOuverte] = useState(null) // null | "collecteur" | "membre"
  const [collecteurs, setCollecteurs] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  // Données mockées pour le graphique en attendant la vraie route API
  const [tendance7jours] = useState([
    { jour: "Lun", montant: 18000 },
    { jour: "Mar", montant: 22000 },
    { jour: "Mer", montant: 19000 },
    { jour: "Jeu", montant: 26000 },
    { jour: "Ven", montant: 31000 },
    { jour: "Sam", montant: 14000 },
    { jour: "Dim", montant: 8000 },
  ])

  // Données mockées performance collecteur en attendant la vraie route
  const [perfCollecteurs] = useState([
    { nom: "Ali Kofri", valides: 2, total: 3, montant: 9000 },
  ])

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

    fetch("http://localhost:5000/api/admin/collecteurs", {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => setCollecteurs(data))
  }, [])

  const deconnexion = () => { localStorage.clear(); navigate("/") }

 const navItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", actif: true },
  { icon: Users, label: "Membres", actif: false, onClick: () => setModaleOuverte("membre") },
  { icon: History, label: "Historique" },
  { icon: Settings, label: "Paramètres" },
]

  if (loading) return (
    <div className="min-h-screen bg-secondary flex items-center justify-center">
      <p className="text-muted">Chargement...</p>
    </div>
  )

  const tauxReussite = stats.totalMembres > 0
    ? Math.round((stats.cotisationsAujourdhui / stats.totalMembres) * 100)
    : 0

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
                  onClick={item.onClick}
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
              <span className="text-primary text-xs font-bold">CF</span>
            </div>
            {sidebarOuverte && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">CECAV Fraternité</p>
                <p className="text-xs text-white/50">Admin</p>
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
          <h1 className="text-2xl font-bold text-main">Tableau de bord</h1>
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setModaleOuverte("collecteur")}
              className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              + Ajouter un collecteur
            </button>
            <button
              onClick={() => setModaleOuverte("membre")}
              className="bg-white border border-soft text-main text-sm font-semibold px-4 py-2 rounded-lg"
            >
              + Ajouter un membre
            </button>
          </div>
          <p className="text-muted text-sm">CECAV Fraternité — Vue d'ensemble</p>
        </div>

        {/* 4 cartes KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-primary rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Users size={14} className="text-primary-light/80" />
              <p className="text-primary-light/80 text-xs">TOTAL MEMBRES</p>
            </div>
            <p className="text-2xl font-bold">{stats.totalMembres}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-soft">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={14} className="text-success" />
              <p className="text-muted text-xs">VALIDÉES AUJOURD'HUI</p>
            </div>
            <p className="text-2xl font-bold text-success">{stats.cotisationsAujourdhui}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-soft">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={14} className="text-muted" />
              <p className="text-muted text-xs">COLLECTÉ AUJOURD'HUI</p>
            </div>
            <p className="text-2xl font-bold text-main">{stats.totalCollecte.toLocaleString('fr-FR')} F</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-soft">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-primary" />
              <p className="text-muted text-xs">TAUX DE RÉUSSITE</p>
            </div>
            <p className="text-2xl font-bold text-primary">{tauxReussite}%</p>
          </div>
        </div>

        {/* Graphique tendance */}
        <div className="bg-white rounded-2xl p-6 border border-soft mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-bold text-main text-sm">Tendance des cotisations</p>
              <p className="text-muted text-xs">7 derniers jours</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={tendance7jours}>
              <defs>
                <linearGradient id="colorMontant" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3F418D" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3F418D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E0EC" vertical={false} />
              <XAxis dataKey="jour" tick={{ fontSize: 12, fill: '#6B6D9E' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6D9E' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`${value.toLocaleString('fr-FR')} FCFA`, "Collecté"]}
                contentStyle={{ borderRadius: 12, border: '1px solid #E4E0EC', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="montant" stroke="#3F418D" strokeWidth={2.5} fill="url(#colorMontant)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Performance par collecteur */}
        <div className="bg-white rounded-2xl p-6 border border-soft mb-6">
          <p className="font-bold text-main text-sm mb-4">Performance par collecteur</p>
          <div className="space-y-3">
            {perfCollecteurs.map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xs font-bold">{c.nom.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-main">{c.nom}</p>
                    <p className="text-xs text-muted">{c.valides}/{c.total} membres</p>
                  </div>
                  <div className="bg-soft rounded-full h-1.5">
                    <div className="bg-success h-1.5 rounded-full" style={{ width: `${(c.valides / c.total) * 100}%` }} />
                  </div>
                </div>
                <p className="text-sm font-bold text-success w-20 text-right">{c.montant.toLocaleString('fr-FR')} F</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tableau détaillé */}
        <div className="bg-white rounded-2xl p-6 border border-soft">
          <p className="font-bold text-main text-sm mb-4">Cotisations du jour</p>
          {cotisations.length === 0 ? (
            <p className="text-muted text-sm">Aucune cotisation aujourd'hui.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted text-xs border-b border-soft">
                  <th className="pb-3 font-medium">Membre</th>
                  <th className="pb-3 font-medium">Montant</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium">Heure</th>
                </tr>
              </thead>
              <tbody>
                {cotisations.map((c, i) => (
                  <tr key={i} className="border-b border-soft last:border-0">
                    <td className="py-3 text-main font-medium">{c.nom} {c.prenom}</td>
                    <td className="py-3 text-main">{c.montant} FCFA</td>
                    <td className="py-3">
                      {c.statut === "valide"
                        ? <span className="bg-success-light text-success text-xs font-semibold px-2.5 py-1 rounded-full">Validé</span>
                        : <span className="bg-warning-light text-warning text-xs font-semibold px-2.5 py-1 rounded-full">En attente</span>
                      }
                    </td>
                    <td className="py-3 text-muted text-xs">
                      {c.heure_validation ? new Date(c.heure_validation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {modaleOuverte && (
          <AjouterUtilisateur
            type={modaleOuverte}
            listeCollecteurs={collecteurs}
            onFermer={() => setModaleOuverte(null)}
            onSucces={() => {}}
          />
        )}
      </main>
    </div>
  )
}