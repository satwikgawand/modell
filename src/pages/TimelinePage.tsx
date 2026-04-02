import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useModelIndex } from '../hooks/useModels'
import RatingBadge from '../components/RatingBadge'
import CategoryPill from '../components/CategoryPill'
import type { ModelIndexEntry } from '../types/model'

const CATEGORY_COLORS = {
  'vanilla-transformer': '#3b82f6',
  'instruction-tuned':   '#4ade80',
  moe:                   '#fb923c',
} as const

// Approximate release months — year-level granularity is all the JSON has
const RELEASE_DATES: Record<string, string> = {
  'gpt2':           'Feb 2019',
  'gpt3':           'Jun 2020',
  'gpt4':           'Mar 2023',
  'llama2':         'Jul 2023',
  'mixtral-8x7b':   'Dec 2023',
  'claude3':        'Mar 2024',
  'grok-1':         'Mar 2024',
  'llama3-instruct':'Apr 2024',
  'deepseek-v3':    'Dec 2024',
}

function InfoCardContent({
  model,
  onClose,
  onNavigate,
}: {
  model: ModelIndexEntry
  onClose: () => void
  onNavigate: () => void
}) {
  const releaseDate = RELEASE_DATES[model.slug]

  return (
    <>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '17px', lineHeight: 1.2 }}>{model.name}</h3>
            <RatingBadge rating={model.brainrotRating} />
          </div>
          <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#3b82f6', marginBottom: '6px' }}>
            {model.brainrotTitle}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <CategoryPill category={model.category} />
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b' }}>
              {model.org} · {releaseDate ?? model.year} · {model.totalParams}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ fontSize: '11px', fontFamily: 'monospace', color: '#3d3d6b', flexShrink: 0, paddingTop: '2px' }}
        >
          esc ×
        </button>
      </div>

      {/* One-liner */}
      <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '16px' }}>
        {model.brainrotOneliner}
      </p>

      {/* CTA */}
      <button
        onClick={onNavigate}
        style={{
          fontSize: '13px', fontFamily: 'monospace',
          padding: '8px 16px', borderRadius: '8px',
          background: '#16162a', color: '#3b82f6', border: '1px solid #1e1e35',
          cursor: 'pointer',
        }}
      >
        full breakdown →
      </button>
    </>
  )
}

export default function TimelinePage() {
  const { models, loading } = useModelIndex()
  const navigate = useNavigate()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [hoveredSlug, setHoveredSlug]   = useState<string | null>(null)

  const sorted = [...models].sort((a, b) => a.year - b.year || a.name.localeCompare(b.name))
  const selected = sorted.find(m => m.slug === selectedSlug) ?? null

  const years = [...new Set(sorted.map(m => m.year))].sort((a, b) => a - b)
  const byYear: Record<number, ModelIndexEntry[]> = {}
  for (const m of sorted) {
    if (!byYear[m.year]) byYear[m.year] = []
    byYear[m.year].push(m)
  }

  // Close popup on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSlug(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSelect = (slug: string) => setSelectedSlug(prev => (prev === slug ? null : slug))
  const handleNavigate = () => selected && navigate(`/model/${selected.slug}`)
  const handleClose = () => setSelectedSlug(null)

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-1">timeline</h1>
        <p className="text-sm" style={{ color: '#64748b' }}>architecture evolution, 2019 → 2024</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-10">
        {(Object.entries(CATEGORY_COLORS) as [keyof typeof CATEGORY_COLORS, string][]).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-2">
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b' }}>{cat}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg h-16" style={{ background: '#0f0f1a' }} />
          ))}
        </div>
      ) : (
        /* Timeline spine container */
        <div style={{ position: 'relative', paddingLeft: '44px' }}>
          {/* Vertical spine */}
          <div style={{
            position: 'absolute', left: '18px', top: '8px', bottom: '8px',
            width: '1px', background: '#1e1e35',
          }} />

          {years.map((year, yi) => (
            <div key={year} style={{ marginBottom: yi < years.length - 1 ? '36px' : 0 }}>
              {/* Year marker */}
              <div style={{ position: 'relative', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Diamond on spine */}
                <div style={{
                  position: 'absolute', left: '-26px', top: '50%',
                  transform: 'translateY(-50%) rotate(45deg)',
                  width: '7px', height: '7px',
                  background: '#0a0a16', border: '1px solid #2d2d50',
                }} />
                <span style={{
                  fontSize: '11px', fontFamily: 'monospace',
                  color: '#3d3d6b', fontWeight: 600, letterSpacing: '0.08em',
                }}>
                  {year}
                </span>
                <div style={{ flex: 1, height: '1px', background: '#1e1e35' }} />
              </div>

              {/* Models in this year */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {byYear[year].map(model => {
                  const color      = CATEGORY_COLORS[model.category]
                  const isSelected = selectedSlug === model.slug
                  const isHovered  = hoveredSlug  === model.slug
                  const releaseDate = RELEASE_DATES[model.slug]

                  return (
                    <button
                      key={model.slug}
                      onClick={() => handleSelect(model.slug)}
                      onMouseEnter={() => setHoveredSlug(model.slug)}
                      onMouseLeave={() => setHoveredSlug(null)}
                      style={{
                        position: 'relative',
                        textAlign: 'left',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: `1px solid ${isSelected ? '#2d2d50' : 'transparent'}`,
                        background: isSelected
                          ? '#0f0f1a'
                          : isHovered
                          ? '#0d0d1a'
                          : 'transparent',
                        transition: 'all 0.12s',
                        width: '100%',
                        cursor: 'pointer',
                      }}
                    >
                      {/* Dot on spine */}
                      <div style={{
                        position: 'absolute', left: '-32px', top: '50%',
                        transform: 'translateY(-50%)',
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: isSelected || isHovered ? color : '#0a0a16',
                        border: `2px solid ${color}`,
                        boxShadow: isSelected ? `0 0 8px ${color}80` : 'none',
                        transition: 'all 0.12s',
                        zIndex: 1,
                      }} />

                      {/* Connector line */}
                      <div style={{
                        position: 'absolute', left: '-20px', top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px', height: '1px',
                        background: isSelected || isHovered ? '#2d2d50' : '#1e1e35',
                        transition: 'background 0.12s',
                      }} />

                      {/* Content */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
                            <span style={{
                              fontWeight: 600, fontSize: '14px',
                              color: isSelected ? '#fff' : isHovered ? '#e2e8f0' : '#cbd5e1',
                              transition: 'color 0.12s',
                            }}>
                              {model.name}
                            </span>
                            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#475569' }}>
                              {model.org}
                            </span>
                            {releaseDate && (
                              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#2d2d50' }}>
                                · {releaseDate}
                              </span>
                            )}
                          </div>
                          <p style={{
                            fontSize: '12px', color: '#3d3d6b', lineHeight: '1.4',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            maxWidth: '340px',
                          }}>
                            {model.brainrotTitle}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#3d3d6b' }}>
                            {model.totalParams}
                          </span>
                          <RatingBadge rating={model.brainrotRating} />
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Info card popup ── */}
      {selected && (
        <>
          {/* Desktop: fixed bottom-right */}
          <div
            className="hidden lg:block fixed bottom-6 right-6 z-50 animate-fade-in-up"
            style={{
              width: '380px',
              borderRadius: '14px',
              padding: '20px',
              background: '#0c0c18',
              border: '1px solid #1e1e35',
              boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)',
            }}
          >
            <InfoCardContent model={selected} onClose={handleClose} onNavigate={handleNavigate} />
          </div>

          {/* Mobile: bottom sheet */}
          <div
            className="lg:hidden fixed inset-x-0 bottom-0 z-50 animate-slide-up"
            style={{
              borderRadius: '20px 20px 0 0',
              padding: '24px 20px 32px',
              background: '#0c0c18',
              border: '1px solid #1e1e35',
              borderBottom: 'none',
              boxShadow: '0 -16px 48px rgba(0,0,0,0.6)',
            }}
          >
            {/* Drag handle */}
            <div style={{ width: '36px', height: '3px', borderRadius: '2px', background: '#2d2d50', margin: '0 auto 20px' }} />
            <InfoCardContent model={selected} onClose={handleClose} onNavigate={handleNavigate} />
          </div>

          {/* Mobile backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={handleClose}
          />
        </>
      )}
    </div>
  )
}
