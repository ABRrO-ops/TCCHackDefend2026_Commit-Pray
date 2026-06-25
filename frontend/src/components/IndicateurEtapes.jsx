export default function IndicateurEtapes({ etapeActuelle, totalEtapes }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: totalEtapes }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i + 1 <= etapeActuelle ? "bg-primary" : "bg-soft"
          }`}
        />
      ))}
    </div>
  )
}