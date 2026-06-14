// =============================================================
//  DashboardCollecteur.jsx — CotiPay
//  Rôle  : Interface du collecteur pour valider les cotisations
//  Stack : React + Tailwind CSS + React Router DOM
// =============================================================

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// -------------------------------------------------------------
// CONSTANTES
// -------------------------------------------------------------

// URL de base de l'API backend (Node.js / Express)
const API_BASE = "http://localhost:5000/api"

// Palette de couleurs Tailwind pour les avatars des membres.
// On tourne dessus avec l'index pour que chaque avatar
// ait une couleur différente, comme sur la maquette.
const AVATAR_COLORS = [
  "bg-purple-500",
  "bg-orange-400",
  "bg-teal-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
]

// -------------------------------------------------------------
// FONCTIONS UTILITAIRES
// -------------------------------------------------------------

/**
 * Génère les initiales d'un membre à partir de son nom et prénom.
 * Ex : "Adjoavi", "Koudolo" → "AK"
 */
function getInitials(nom, prenom) {
  const n = nom    ? nom[0].toUpperCase()    : ""
  const p = prenom ? prenom[0].toUpperCase() : ""
  return n + p
}

/**
 * Retourne une classe Tailwind de couleur selon la position
 * du membre dans la liste (modulo pour boucler sur la palette).
 */
function getAvatarColor(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

// -------------------------------------------------------------
// COMPOSANT PRINCIPAL
// -------------------------------------------------------------

export default function DashboardCollecteur() {

  // ── État local ──────────────────────────────────────────────
  const [membres, setMembres] = useState([])  // Liste des membres assignés au collecteur
  const [loading, setLoading] = useState(true) // Indicateur de chargement initial
  const [message, setMessage] = useState("")   // Message de confirmation après validation

  const navigate = useNavigate()

  // ── Données du collecteur connecté ─────────────────────────
  // Le token JWT est stocké dans le localStorage lors du login
  const token = localStorage.getItem("token")

  // Le nom du collecteur est aussi sauvegardé au login
  // pour afficher ses initiales dans l'avatar du header
  const collecteurNom = localStorage.getItem("collecteurNom") || "Collecteur"

  // On prend les 2 premières initiales du nom complet
  // Ex : "Kossi Amega" → "KA"
  const collecteurInitiales = collecteurNom
    .split(" ")
    .map((mot) => mot[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Date du jour affichée dans le titre de la liste
  // Ex : "02 juin" → affiché en majuscules "02 JUIN"
  const today = new Date().toLocaleDateString("fr-FR", {
    day:   "2-digit",
    month: "long",
  })

  // ── Chargement des membres ──────────────────────────────────

  /**
   * Appelle l'API pour récupérer la liste des membres
   * assignés à ce collecteur pour la journée.
   * En cas d'erreur (token invalide, réseau), redirige vers le login.
   */
  const chargerMembres = () => {
    fetch(`${API_BASE}/cotisations/mes-membres`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setMembres(data)
        setLoading(false)
      })
      .catch(() => navigate("/")) // Redirige vers la page de connexion si erreur
  }

  // Au montage du composant : vérifie le token puis charge les membres
  useEffect(() => {
    if (!token) {
      navigate("/") // Pas de token → retour au login
      return
    }
    chargerMembres()
  }, []) // [] = exécuté une seule fois au montage

  // ── Validation d'une cotisation ─────────────────────────────

  /**
   * Envoie une requête POST pour valider la cotisation d'un membre.
   * Après succès : affiche un message de confirmation 3 secondes,
   * puis recharge la liste pour mettre à jour les statuts.
   *
   * @param {number} membreId - L'identifiant du membre à valider
   */
  const validerCotisation = async (membreId) => {
    const res = await fetch(`${API_BASE}/cotisations/valider/${membreId}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    })
    const data = await res.json()

    setMessage(data.message)  // Affiche le message renvoyé par l'API
    chargerMembres()           // Recharge la liste pour mettre à jour le statut

    // Efface le message après 3 secondes
    setTimeout(() => setMessage(""), 3000)
  }

  // ── Déconnexion ─────────────────────────────────────────────

  /**
   * Vide le localStorage (token + infos collecteur)
   * et redirige vers la page de connexion.
   */
  const deconnexion = () => {
    localStorage.clear()
    navigate("/")
  }

  // ── Calculs des stats ───────────────────────────────────────

  // Nombre total de membres assignés à ce collecteur
  const totalMembres = membres.length

  // Nombre de membres ayant déjà cotisé aujourd'hui (statut "valide")
  const totalValides = membres.filter((m) => m.statut === "valide").length

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
          HEADER — Barre verte du haut
          Contient : logo, badge rôle, avatar collecteur
          ════════════════════════════════════════ */}
      <header className="bg-green-500 px-4 py-3 flex items-center justify-between">

        {/* Logo CotiPay */}
        <span className="text-white text-xl font-bold tracking-tight">
          Coti<span className="font-extrabold">Pay</span>
        </span>

        <div className="flex items-center gap-3">

          {/* Badge indiquant le rôle de l'utilisateur connecté */}
          <span className="bg-white text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
            Collecteur
          </span>

          {/* Avatar du collecteur (ses initiales).
              Un clic dessus déclenche la déconnexion. */}
          <button
            onClick={deconnexion}
            title="Se déconnecter"
            className="w-9 h-9 rounded-full bg-gray-800 text-white text-sm font-bold
                       flex items-center justify-center hover:bg-gray-700 transition"
          >
            {collecteurInitiales}
          </button>

        </div>
      </header>

      {/* ════════════════════════════════════════
          MESSAGE DE CONFIRMATION
          Affiché 3 secondes après une validation
          ════════════════════════════════════════ */}
      {message && (
        <div className="mx-4 mt-3 bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-lg text-sm">
          ✅ {message}
        </div>
      )}

      {/* ════════════════════════════════════════
          CORPS DE LA PAGE
          ════════════════════════════════════════ */}
      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* ── STATS — 2 cartes côte à côte ─────────────────── */}
        <div className="grid grid-cols-2 gap-3">

          {/* Carte 1 : Total des membres assignés */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">
              Membres
            </p>
            <p className="text-4xl font-extrabold text-gray-800">
              {totalMembres}
            </p>
            <p className="text-xs text-gray-400 mt-1">assignés</p>
          </div>

          {/* Carte 2 : Nombre de cotisations validées aujourd'hui */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">
              Validés
            </p>
            <p className="text-4xl font-extrabold text-gray-800">
              {totalValides}
            </p>
            <p className="text-xs text-gray-400 mt-1">aujourd'hui</p>
          </div>

        </div>

        {/* ── LISTE DES MEMBRES ────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* En-tête de la liste avec la date du jour */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <span className="text-gray-500 text-sm"></span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Liste des membres — {today.toUpperCase()}
            </span>
          </div>

          {/* Cas : aucun membre assigné */}
          {membres.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              Aucun membre assigné.
            </p>
          ) : (

            /* Liste des membres avec ligne de séparation */
            <ul className="divide-y divide-gray-50">
              {membres.map((m, i) => {

                // Détermine le statut de ce membre pour afficher
                // le bon badge ou le bouton VALIDER
                const estValide  = m.statut === "valide"  // Cotisation déjà validée
                const estAttente = m.statut === "attente" // En attente (non collecté)
                // Sinon → statut null ou absent → bouton VALIDER affiché

                return (
                  <li key={m.id ?? i} className="flex items-center gap-3 px-4 py-3">

                    {/* ── Avatar coloré avec les initiales du membre ── */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center
                                  text-white text-sm font-bold flex-shrink-0
                                  ${getAvatarColor(i)}`}
                    >
                      {getInitials(m.nom, m.prenom)}
                    </div>

                    {/* ── Nom et numéro de téléphone du membre ── */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {m.prenom} {m.nom}
                      </p>
                      {/* Affiche le téléphone ou un placeholder si absent */}
                      <p className="text-xs text-gray-400 truncate">
                        {m.telephone || "+228 00 00 00 00"}
                      </p>
                    </div>

                    {/* ── Zone statut / action (droite de la ligne) ── */}
                    <div className="flex-shrink-0">

                      {/* Badge vert : cotisation validée */}
                      {estValide && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold
                                         text-green-600 bg-green-50 border border-green-200
                                         px-3 py-1 rounded-lg">
                           Payé
                        </span>
                      )}

                      {/* Badge orange : en attente de collecte */}
                      {estAttente && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold
                                         text-amber-600 bg-amber-50 border border-amber-200
                                         px-3 py-1 rounded-lg">
                           Attente
                        </span>
                      )}

                      {/* Bouton VALIDER : affiché si le statut n'est ni "valide" ni "attente".
                          Un clic envoie la requête de validation à l'API. */}
                      {!estValide && !estAttente && (
                        <button
                          onClick={() => validerCotisation(m.id)}
                          className="bg-green-500 hover:bg-green-600 active:scale-95
                                     text-white text-xs font-bold px-4 py-2 rounded-lg
                                     transition-all"
                        >
                          VALIDER
                        </button>
                      )}

                    </div>
                  </li>
                )
              })}
            </ul>

          )}
        </div>
      </main>
    </div>
  )
}