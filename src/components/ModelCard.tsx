import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import type { ModelIndexEntry } from '../types/model'
import RatingBadge from './RatingBadge'
import CategoryPill from './CategoryPill'

interface Props {
  model: ModelIndexEntry
}

export default function ModelCard({ model }: Props) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => navigate(`/model/${model.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-left w-full rounded-xl p-5 transition-all duration-200 group"
      style={{
        background: '#0f0f1a',
        border: `1px solid ${hovered ? '#2d2d50' : '#1e1e35'}`,
        transform: hovered ? 'perspective(800px) rotateX(1deg) rotateY(-1deg) translateY(-2px)' : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        boxShadow: hovered ? '0 8px 32px rgba(59,130,246,0.08), 0 4px 16px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white leading-tight">{model.name}</h3>
          <p className="text-xs mt-0.5" style={{ color: '#3b82f6' }}>{model.brainrotTitle}</p>
        </div>
        <RatingBadge rating={model.brainrotRating} />
      </div>

      {/* Org + year */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-mono" style={{ color: '#64748b' }}>{model.org}</span>
        <span style={{ color: '#1e1e35' }}>·</span>
        <span className="text-xs font-mono" style={{ color: '#64748b' }}>{model.year}</span>
        <span style={{ color: '#1e1e35' }}>·</span>
        <CategoryPill category={model.category} />
      </div>

      {/* One-liner */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
        {model.brainrotOneliner}
      </p>

      {/* Params */}
      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #1e1e35' }}>
        <div>
          <span className="text-xs font-mono" style={{ color: '#3d3d6b' }}>params</span>
          <p className="text-sm font-mono font-semibold text-white mt-0.5">{model.totalParams}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono" style={{ color: '#3d3d6b' }}>view →</span>
        </div>
      </div>
    </button>
  )
}
