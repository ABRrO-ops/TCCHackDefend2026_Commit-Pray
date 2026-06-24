import { useState } from "react"

export default function SimulationUSSD({ mode, montant, onConfirme, onAnnuler }) {
  const [code, setCode] = useState(["", "", "", ""])
  const [enCours, setEnCours] = useState(false)
  const codeAffiche = "1234" // OTP visible pour la démo, évite tout blocage en live

  const nomMode = mode === "mix_by_yas" ? "Mix by Yas" : "Moov Money"

  const handleSaisie = (index, valeur) => {
    if (!/^\d?$/.test(valeur)) return
    const nouveauCode = [...code]
    nouveauCode[index] = valeur
    setCode(nouveauCode)

    if (valeur && index < 3) {
      document.getElementById(`code-${index + 1}`)?.focus()
    }
  }

  const handleValider = () => {
    setEnCours(true)
    setTimeout(() => {
      onConfirme()
    }, 1800)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">

        {!enCours ? (
          <>
            <p className="text-muted text-xs mb-1">{nomMode}</p>
            <p className="font-bold text-main text-lg mb-1">Confirmer le paiement</p>
            <p className="text-muted text-sm mb-5">{montant} FCFA</p>

            <div className="bg-secondary rounded-xl p-3 mb-5">
              <p className="text-xs text-muted mb-1">Code de confirmation (démo)</p>
              <p className="font-bold text-primary text-lg tracking-widest">{codeAffiche}</p>
            </div>

            <p className="text-xs text-muted mb-3">Entrez le code reçu par SMS</p>
            <div className="flex justify-center gap-3 mb-6">
              {code.map((val, i) => (
                <input
                  key={i}
                  id={`code-${i}`}
                  value={val}
                  onChange={e => handleSaisie(i, e.target.value)}
                  maxLength={1}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-soft rounded-lg focus:border-primary outline-none"
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={onAnnuler} className="flex-1 py-3 rounded-xl border border-soft text-muted text-sm font-semibold">
                Annuler
              </button>
              <button
                onClick={handleValider}
                disabled={code.join("") !== codeAffiche}
                className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-40"
              >
                Valider
              </button>
            </div>
          </>
        ) : (
          <div className="py-8">
            <div className="w-12 h-12 border-4 border-soft border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-main font-semibold text-sm">Traitement en cours...</p>
          </div>
        )}

      </div>
    </div>
  )
}