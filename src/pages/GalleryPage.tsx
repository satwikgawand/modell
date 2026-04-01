import { useState, useMemo } from 'react'
import { useModelIndex } from '../hooks/useModels'
import ModelCard from '../components/ModelCard'
import type { BrainrotRating, Category } from '../types/model'

type SortKey = 'newest' | 'oldest' | 'most-params' | 'least-params'

const PARAM_ORDER = [
  '~1.8T (est.)', '671B', '405B', '314B', '175B', '~130B (est.)', '70B', '46.7B', '1.5B'
]

function paramRank(p: string): number {
  const idx = PARAM_ORDER.indexOf(p)
  return idx === -1 ? 99 : idx
}

export default function GalleryPage() {
  const { models, loading, error } = useModelIndex()
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')
  const [ratingFilter, setRatingFilter] = useState<BrainrotRating | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('newest')

  const filtered = useMemo(() => {
    let list = [...models]

    if (categoryFilter !== 'all') {
      list = list.filter(m => m.category === categoryFilter)
    }
    if (ratingFilter !== 'all') {
      list = list.filter(m => m.brainrotRating === ratingFilter)
    }

    list.sort((a, b) => {
      switch (sort) {
        case 'newest': return b.year - a.year
        case 'oldest': return a.year - b.year
        case 'most-params': return paramRank(a.totalParams) - paramRank(b.totalParams)
        case 'least-params': return paramRank(b.totalParams) - paramRank(a.totalParams)
      }
    })

    return list
  }, [models, categoryFilter, ratingFilter, sort])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">modell</h1>
        <p className="text-lg" style={{ color: '#64748b' }}>
          LLM architectures, ranked by how unhinged they are.
        </p>
        {!loading && (
          <p className="text-sm font-mono mt-2" style={{ color: '#3d3d6b' }}>
            {models.length} models · 3 categories
          </p>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8 pb-6" style={{ borderBottom: '1px solid #1e1e35' }}>
        {/* Category filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {(
            [
              { value: 'all', label: 'all' },
              { value: 'vanilla-transformer', label: 'vanilla transformer' },
              { value: 'instruction-tuned', label: 'instruction-tuned' },
              { value: 'moe', label: 'MoE' },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCategoryFilter(value)}
              className="px-3 py-1.5 text-xs font-mono rounded transition-colors"
              style={
                categoryFilter === value
                  ? { background: '#16162a', color: '#e2e8f0', border: '1px solid #2d2d50' }
                  : { background: 'transparent', color: '#64748b', border: '1px solid #1e1e35' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        <div className="w-px h-5" style={{ background: '#1e1e35' }} />

        {/* Rating filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {(
            [
              { value: 'all', label: 'all ratings' },
              { value: 'npc', label: 'NPC' },
              { value: 'main character', label: 'main character' },
              { value: 'galaxy brain', label: 'galaxy brain' },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setRatingFilter(value)}
              className="px-3 py-1.5 text-xs font-mono rounded transition-colors"
              style={
                ratingFilter === value
                  ? { background: '#16162a', color: '#e2e8f0', border: '1px solid #2d2d50' }
                  : { background: 'transparent', color: '#64748b', border: '1px solid #1e1e35' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="text-xs font-mono px-3 py-1.5 rounded outline-none"
            style={{
              background: '#0f0f1a',
              color: '#94a3b8',
              border: '1px solid #1e1e35',
            }}
          >
            <option value="newest">newest first</option>
            <option value="oldest">oldest first</option>
            <option value="most-params">most parameters</option>
            <option value="least-params">least parameters</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-5 animate-pulse"
              style={{ background: '#0f0f1a', border: '1px solid #1e1e35', height: '200px' }}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16">
          <p className="font-mono text-sm" style={{ color: '#ef4444' }}>{error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="font-mono text-sm" style={{ color: '#64748b' }}>no models match this filter. the void stares back.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(model => (
            <ModelCard key={model.slug} model={model} />
          ))}
        </div>
      )}
    </div>
  )
}
