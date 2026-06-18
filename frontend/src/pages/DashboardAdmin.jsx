<<<<<<< HEAD
// =============================================================
//  DashboardAdmin.jsx — CotiPay
//  Rôle  : Vue du patron / administrateur de la micro-finance
//          → Statistiques globales + tableau des cotisations du jour
//  Stack : React + Tailwind CSS + React Router DOM
// =============================================================

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// -------------------------------------------------------------
// CONSTANTES
// -------------------------------------------------------------

const API_BASE = "http://localhost:5000/api"

// -------------------------------------------------------------
// FONCTIONS UTILITAIRES
// -------------------------------------------------------------

/**
 * Formate un grand nombre en version courte lisible.
 * Ex : 188000 → "188K" | 1200000 → "1.2M"
 */
function formatMontant(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M"
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(".0", "") + "K"
  return String(n)
}

/**
 * Formate une date ISO en heure HH:MM.
 * Ex : "2026-06-07T08:12:00.000Z" → "08:12"
 */
function formatHeure(dateISO) {
  if (!dateISO) return "—"
  const d = new Date(dateISO)
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}`
}

/**
 * Formate le nom en version abrégée "Prénom N."
 * Ex : nom="Koudolo", prenom="Adjoavi" → "Adjoavi K."
 */
function formatNomCourt(nom, prenom) {
  const initiale = nom ? nom[0].toUpperCase() + "." : ""
  return `${prenom || ""} ${initiale}`.trim()
}

// -------------------------------------------------------------
// COMPOSANT PRINCIPAL
// -------------------------------------------------------------

export default function DashboardAdmin() {

  // ── État local ──────────────────────────────────────────────
  const [stats, setStats] = useState({
    totalMembres:          0,
    cotisationsAujourdhui: 0,
    totalCollecte:         0,
  })
  const [cotisations, setCotisations] = useState([])
  const [loading, setLoading]         = useState(true)

  const navigate = useNavigate()
  const token    = localStorage.getItem("token")

  // Initiales de l'admin pour l'avatar du header
  const adminNom = localStorage.getItem("adminNom") || "Admin"
  const adminInitiales = adminNom
    .split(" ")
    .map((mot) => mot[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // ── Chargement des données au montage ──────────────────────
=======
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, History, Settings, LogOut, ChevronLeft, ChevronRight, Wallet, TrendingUp, CheckCircle2 } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

export default function DashboardAdmin() {
  const [stats, setStats] = useState({ totalMembres: 0, cotisationsAujourdhui: 0, totalCollecte: 0 })
  const [cotisations, setCotisations] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOuverte, setSidebarOuverte] = useState(true)
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
>>>>>>> frontend

  useEffect(() => {
    if (!token) { navigate("/"); return }

<<<<<<< HEAD
    const headers = { Authorization: "Bearer " + token }

    // Fetch 1 : Statistiques globales
    fetch(`${API_BASE}/admin/stats`, { headers })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => navigate("/"))

    // Fetch 2 : Liste des cotisations du jour
    fetch(`${API_BASE}/admin/cotisations/today`, { headers })
      .then((res) => res.json())
      .then((data) => { setCotisations(data); setLoading(false) })
      .catch(() => navigate("/"))

  }, [])

  // ── Déconnexion ─────────────────────────────────────────────
  const deconnexion = () => { localStorage.clear(); navigate("/") }

  // Cotisations non affichées (au-delà des 5 premières)
  const autresCotisations = cotisations.length > 5 ? cotisations.length - 5 : 0

  // ── Écran de chargement ─────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Chargement...</p>
      </div>
    )
  }

  // ── Rendu principal ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ════════════════════════════════════════
          HEADER — Même style que le Collecteur
          Fond vert, logo blanc, badge + avatar
          ════════════════════════════════════════ */}
      <header className="bg-green-500 px-4 py-3 flex items-center justify-between">

        {/* Logo CotiPay */}
        <span className="text-white text-xl font-bold tracking-tight">
          Coti<span className="font-extrabold">Pay</span>
        </span>

        <div className="flex items-center gap-3">

          {/* Badge rôle */}
          <span className="bg-white text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
            Admin
          </span>

          {/* Avatar admin — clic pour se déconnecter */}
          <button
            onClick={deconnexion}
            title="Se déconnecter"
            className="w-9 h-9 rounded-full bg-gray-800 text-white text-sm font-bold
                       flex items-center justify-center hover:bg-gray-700 transition"
          >
            {adminInitiales}
          </button>

        </div>
      </header>

      {/* ════════════════════════════════════════
          CORPS DE LA PAGE
          ════════════════════════════════════════ */}
      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* ── STATS — 3 cartes colorées ─────────────────────── */}
        <div className="grid grid-cols-3 gap-3">

          {/* Carte 1 — Bleue : Total membres */}
          <div className="bg-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center text-white">
            <span className="text-2xl mb-1"></span>
            <p className="text-3xl font-extrabold leading-none">
              {stats.totalMembres}
            </p>
            <p className="text-xs font-semibold mt-1 uppercase tracking-widest opacity-90">
              Membres
            </p>
          </div>

          {/* Carte 2 — Verte : Cotisations du jour */}
          <div className="bg-green-500 rounded-2xl p-4 flex flex-col items-center justify-center text-white">
            <span className="text-2xl mb-1"></span>
            <p className="text-3xl font-extrabold leading-none">
              {stats.cotisationsAujourdhui}
            </p>
            <p className="text-xs font-semibold mt-1 uppercase tracking-widest opacity-90">
              Cotis. / jour
            </p>
          </div>

          {/* Carte 3 — Orange : Total collecté en FCFA */}
          <div className="bg-orange-500 rounded-2xl p-4 flex flex-col items-center justify-center text-white">
            <span className="text-2xl mb-1"></span>
            {/* formatMontant : 188000 → "188K" */}
            <p className="text-3xl font-extrabold leading-none">
              {formatMontant(stats.totalCollecte)}
            </p>
            <p className="text-xs font-semibold mt-1 uppercase tracking-widest opacity-90">
              FCFA total
            </p>
          </div>

        </div>

        {/* ── TABLEAU DES COTISATIONS DU JOUR ──────────────── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* En-tête avec compteur */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm"></span>
              <span className="text-sm font-bold text-gray-800">
                Cotisations du jour
              </span>
            </div>
            <span className="text-xs font-semibold text-blue-500">
              {stats.cotisationsAujourdhui} entrées
            </span>
          </div>

          {/* Cas : aucune cotisation */}
          {cotisations.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              Aucune cotisation aujourd'hui.
            </p>
          ) : (
            <>
              {/* En-têtes des colonnes */}
              <div className="grid grid-cols-3 px-4 py-2 bg-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Membre
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                  Heure
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest text-right">
                  Montant
                </span>
              </div>

              {/* 5 premières lignes seulement */}
              <ul className="divide-y divide-gray-50">
                {cotisations.slice(0, 5).map((c, i) => (
                  <li key={i} className="grid grid-cols-3 items-center px-4 py-3">

                    {/* Nom abrégé : "Adjoavi K." */}
                    <span className="text-sm font-medium text-gray-800">
                      {formatNomCourt(c.nom, c.prenom)}
                    </span>

                    {/* Heure de validation : "08:12" */}
                    <span className="text-sm text-gray-400 text-center">
                      {formatHeure(c.heure_validation)}
                    </span>

                    {/* Montant en vert */}
                    <span className="text-sm font-bold text-green-500 text-right">
                      {c.montant?.toLocaleString("fr-FR")} F
                    </span>

                  </li>
                ))}
              </ul>

              {/* Lien "voir plus" si > 5 cotisations */}
              {autresCotisations > 0 && (
                <div className="px-4 py-3 border-t border-gray-100 text-center">
                  <span className="text-xs text-gray-400">
                    + {autresCotisations} autres cotisations...
                  </span>
                </div>
              )}
            </>
=======
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

  const navItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", actif: true },
    { icon: Users, label: "Membres" },
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
>>>>>>> frontend
          )}
        </div>

      </main>
    </div>
  )
}