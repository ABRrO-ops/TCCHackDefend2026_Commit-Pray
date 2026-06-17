import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mot_de_passe: motDePasse })
      })
      const data = await res.json()
      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("role", data.role)
        if (data.role === "admin") navigate("/admin")
        else if (data.role === "collecteur") navigate("/collecteur")
        else navigate("/membre")
      } else {
        setErreur(data.message)
      }
    } catch (err) {
      setErreur("Erreur de connexion au serveur")
    }
  }

  return (
    <div className="min-h-screen flex bg-secondary">

      {/* Côté gauche - branding */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12">

        {/* Formes décoratives */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-light/30 rounded-full"/>
        <div className="absolute bottom-0 -left-10 w-48 h-48 bg-primary-dark/40 rounded-full"/>

        {/* Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-11 h-11 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-lg">C</span>
          </div>
          <span className="text-white font-bold text-xl">CotiPay</span>
        </div>

        {/* Accroche */}
        <div className="z-10">
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            La tontine,<br/>enfin digitale.
          </h1>
          <p className="text-primary-light/90 text-sm mb-8">
            Suivez vos cotisations, vos membres et votre épargne en temps réel.
          </p>

          {/* Mini carte aperçu */}
          <div className="bg-white/95 rounded-2xl p-5 max-w-xs">
            <p className="text-muted text-xs mb-1">SOLDE TOTAL</p>
            <p className="text-primary text-2xl font-bold mb-3">24 000 FCFA</p>
            <div className="bg-soft rounded-full h-1.5 mb-2">
              <div className="bg-success h-1.5 rounded-full" style={{width: "70%"}}/>
            </div>
            <p className="text-muted text-xs">22/30 jours cotisés ce mois</p>
          </div>
        </div>

        {/* Badge */}
        <div className="z-10">
          <span className="bg-primary-dark text-secondary text-xs px-4 py-2 rounded-full">
            🇹🇬 Fait pour le Togo
          </span>
        </div>
      </div>

      {/* Côté droit - formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          <h2 className="text-2xl font-bold text-main mb-2">Bon retour 👋</h2>
          <p className="text-muted text-sm mb-8">Connectez-vous à votre espace CotiPay</p>

          {erreur && (
            <p className="text-danger text-sm mb-4 bg-danger-light px-4 py-2 rounded-lg">{erreur}</p>
          )}

          <label className="text-sm font-semibold text-main">Adresse email</label>
          <input
            type="email"
            placeholder="vous@cotipay.tg"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-soft rounded-xl px-4 py-3 mt-1 mb-5 text-sm focus:outline-none focus:border-primary"
          />

          <label className="text-sm font-semibold text-main">Mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={motDePasse}
            onChange={e => setMotDePasse(e.target.value)}
            className="w-full border border-soft rounded-xl px-4 py-3 mt-1 mb-2 text-sm focus:outline-none focus:border-primary"
          />

          <div className="text-right mb-6">
            <span className="text-primary text-xs underline cursor-pointer">Mot de passe oublié ?</span>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold text-sm transition-colors"
          >
            Se connecter
          </button>

          <p className="text-center text-xs text-muted mt-8">
            Pas encore de compte ? <span className="text-primary font-semibold">Contactez votre micro-finance</span>
          </p>

          <p className="text-center text-xs text-muted/60 mt-4">© 2026 CotiPay — Commit & Pray</p>
        </div>
      </div>

    </div>
  )
}