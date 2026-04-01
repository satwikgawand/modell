import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useModelIndex } from '../hooks/useModels'
import RatingBadge from '../components/RatingBadge'
import CategoryPill from '../components/CategoryPill'
import type { ModelIndexEntry } from '../types/model'

const CATEGORY_COLORS = {
  'vanilla-transformer': '#3b82f6',
  'instruction-tuned': '#4ade80',
  moe: '#fb923c',
} as const


export default function TimelinePage() {
  const { models, loading } = useModelIndex()
  const navigate = useNavigate()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const sorted = [...models].sort((a, b) => a.year - b.year || a.name.localeCompare(b.name))
  const selected = sorted.find(m => m.slug === selectedSlug) ?? null

  const minYear = sorted[0]?.year ?? 2019
  const maxYear = sorted[sorted.length - 1]?.year ?? 2024

  function xPercent(year: number): number {
    return ((year - minYear) / Math.max(maxYear - minYear, 1)) * 88 + 4
  }

  // Group by year
  const byYear: Record<number, ModelIndexEntry[]> = {}
  for (const m of sorted) {
    if (!byYear[m.year]) byYear[m.year] = []
    byYear[m.year].push(m)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-1">timeline</h1>
        <p className="text-sm" style={{ color: '#64748b' }}>architecture evolution, 2019 → 2024</p>
      </div>

      {loading ? (
        <div className="h-48 animate-pulse rounded-xl" style={{ background: '#0f0f1a' }} />
      ) : (
        <>
          {/* Timeline track */}
          <div
            className="relative rounded-xl overflow-x-auto"
            style={{ background: '#0f0f1a', border: '1px solid #1e1e35', minHeight: '180px', padding: '32px 0' }}
          >
            {/* Year labels */}
            {Object.keys(byYear).map(y => {
              const year = Number(y)
              return (
                <div
                  key={year}
                  className="absolute top-3"
                  style={{ left: `${xPercent(year)}%`, transform: 'translateX(-50%)' }}
                >
                  <span className="text-xs font-mono" style={{ color: '#3d3d6b' }}>{year}</span>
                </div>
              )
            })}

            {/* Track line */}
            <div
              className="absolute"
              style={{ top: '50%', left: '4%', right: '4%', height: '1px', background: '#1e1e35' }}
            />

            {/* Model nodes */}
            {sorted.map((model, i) => {
              const isSelected = selectedSlug === model.slug
              const color = CATEGORY_COLORS[model.category]
              // Stagger multiple models in same year vertically
              const yearGroup = byYear[model.year]
              const posInYear = yearGroup.indexOf(model)
              const yOffset = posInYear === 0 ? 0 : posInYear % 2 === 1 ? -28 : 28

              return (
                <button
                  key={model.slug}
                  onClick={() => setSelectedSlug(isSelected ? null : model.slug)}
                  className="absolute transition-all duration-200"
                  style={{
                    left: `${xPercent(model.year)}%`,
                    top: `50%`,
                    transform: `translate(-50%, calc(-50% + ${yOffset}px))`,
                    zIndex: isSelected ? 10 : i + 1,
                  }}
                  title={model.name}
                >
                  <div
                    className="w-4 h-4 rounded-full transition-all duration-200"
                    style={{
                      background: color,
                      border: `2px solid ${isSelected ? '#fff' : color}`,
                      boxShadow: isSelected ? `0 0 12px ${color}` : `0 0 4px ${color}60`,
                      transform: isSelected ? 'scale(1.5)' : 'scale(1)',
                    }}
                  />
                  <span
                    className="absolute text-xs font-mono whitespace-nowrap"
                    style={{
                      color: isSelected ? '#e2e8f0' : '#64748b',
                      top: yOffset < 0 ? '-22px' : '20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {model.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4">
            {(Object.entries(CATEGORY_COLORS) as [keyof typeof CATEGORY_COLORS, string][]).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                <span className="text-xs font-mono" style={{ color: '#64748b' }}>{cat}</span>
              </div>
            ))}
          </div>

          {/* Selected model card */}
          {selected && (
            <div
              className="mt-6 rounded-xl p-6 transition-all duration-200"
              style={{ background: '#0f0f1a', border: '1px solid #1e1e35' }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                    <RatingBadge rating={selected.brainrotRating} />
                  </div>
                  <p className="text-sm font-mono mb-2" style={{ color: '#3b82f6' }}>{selected.brainrotTitle}</p>
                  <div className="flex items-center gap-2">
                    <CategoryPill category={selected.category} />
                    <span className="text-xs font-mono" style={{ color: '#64748b' }}>{selected.org} · {selected.year}</span>
                    <span className="text-xs font-mono" style={{ color: '#64748b' }}>· {selected.totalParams}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSlug(null)}
                  className="text-xs font-mono"
                  style={{ color: '#3d3d6b' }}
                >
                  close ×
                </button>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
                {selected.brainrotOneliner}
              </p>
              <button
                onClick={() => navigate(`/model/${selected.slug}`)}
                className="text-sm font-mono px-4 py-2 rounded-lg transition-colors"
                style={{ background: '#16162a', color: '#3b82f6', border: '1px solid #1e1e35' }}
              >
                full breakdown →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
