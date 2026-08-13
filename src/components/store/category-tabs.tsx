'use client'

const TABS: { value: string; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'class', label: '강의' },
  { value: 'ebook', label: '전자책' },
  { value: 'publishing', label: '출판' },
]

export function CategoryTabs({
  active,
  onChange,
}: {
  active: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {TABS.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
            active === t.value
              ? 'bg-ink text-white border-ink'
              : 'bg-white text-sub border-line hover:border-ink/40'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
