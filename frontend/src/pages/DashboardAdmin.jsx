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

  useEffect(() => {
    if (!token) { navigate("/"); return }

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
          )}
        </div>

      </main>
    </div>
  )
}