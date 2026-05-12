export default function ProductInsightBadges({
  useCases = [],
  feelTraits = [],
  productionNotes = [],
}) {
  const sections = [
    ...useCases.map((label) => ({
      label,
      tone: "bg-blue-50 text-blue-700 border-blue-100",
    })),
    ...feelTraits.map((label) => ({
      label,
      tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
    })),
    ...productionNotes.map((label) => ({
      label,
      tone: "bg-amber-50 text-amber-700 border-amber-100",
    })),
  ]

  if (!sections.length) {
    return null
  }

  const visibleSections = sections.slice(0, 3)

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {visibleSections.map(({ label, tone }) => (
        <span
          key={label}
          className={
            "rounded-full border px-2.5 py-1 text-[11px] font-medium " + tone
          }
        >
          {label}
        </span>
      ))}
    </div>
  )
}
