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
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
          CotiPay
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Connectez-vous à votre espace
        </p>
        {erreur && (
          <p className="text-red-500 text-sm text-center mb-4">{erreur}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border p-3 rounded mb-3 text-sm"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={e => setMotDePasse(e.target.value)}
          className="w-full border p-3 rounded mb-4 text-sm"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700"
        >
          Se connecter
        </button>
      </div>
    </div>
  )
}