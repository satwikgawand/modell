import { useParams, Link } from 'react-router-dom'
import { useModel } from '../hooks/useModels'
import RatingBadge from '../components/RatingBadge'
import CategoryPill from '../components/CategoryPill'
import ModelPagePlaceholder3D from '../components/ModelPagePlaceholder3D'

export default function ModelPage() {
  const { slug } = useParams<{ slug: string }>()
  const { model, loading, error } = useModel(slug ?? '')

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded" style={{ background: '#0f0f1a' }} />
          <div className="h-4 w-32 rounded" style={{ background: '#0f0f1a' }} />
        </div>
      </div>
    )
  }

  if (error || !model) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <p className="font-mono text-sm mb-4" style={{ color: '#ef4444' }}>
          {error ?? 'model not found'}
        </p>
        <Link to="/" className="text-sm" style={{ color: '#3b82f6' }}>← back to gallery</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <Link
        to="/"
        className="text-xs font-mono mb-8 inline-block transition-colors"
        style={{ color: '#3d3d6b' }}
        onMouseEnter={e => { (e.target as HTMLElement).style.color = '#64748b' }}
        onMouseLeave={e => { (e.target as HTMLElement).style.color = '#3d3d6b' }}
      >
        ← gallery
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {/* Left panel — 40% */}
        <div className="lg:w-2/5 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{model.name}</h1>
            </div>
            <p className="text-base font-mono mb-3" style={{ color: '#3b82f6' }}>
              {model.brainrotTitle}
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <RatingBadge rating={model.brainrotRating} size="md" />
              <CategoryPill category={model.category} size="md" />
              <span className="text-sm font-mono" style={{ color: '#64748b' }}>
                {model.org} · {model.year}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              {model.brainrotSummary}
            </p>
          </div>

          {/* Stats table */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e1e35' }}>
            <div className="px-4 py-2.5" style={{ background: '#16162a', borderBottom: '1px solid #1e1e35' }}>
              <span className="text-xs font-mono font-semibold" style={{ color: '#64748b' }}>STATS</span>
            </div>
            <div className="divide-y" style={{ '--tw-divide-opacity': 1, borderColor: '#1e1e35' } as React.CSSProperties}>
              {[
                ['total params', model.stats.totalParams, model.brainrotStats.totalParams],
                ...(model.stats.activeParams
                  ? [['active params', model.stats.activeParams, model.brainrotStats.activeParams ?? '—']]
                  : []),
                ['context length', model.stats.contextLength, model.brainrotStats.contextLength],
                ['layers', String(model.stats.layers), model.brainrotStats.layers],
                ['attn heads', String(model.stats.attentionHeads), model.brainrotStats.attentionHeads],
                ['license', model.stats.license, model.brainrotStats.license],
              ].map(([label, real, brainrot]) => (
                <div key={label} className="px-4 py-3" style={{ background: '#0f0f1a' }}>
                  <span className="text-xs font-mono block mb-0.5" style={{ color: '#3d3d6b' }}>{label}</span>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm font-mono text-white">{real}</span>
                    <span className="text-xs font-mono" style={{ color: '#1e1e35' }}>·</span>
                    <span className="text-sm leading-snug" style={{ color: '#64748b' }}>{brainrot}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key innovations */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e1e35' }}>
            <div className="px-4 py-2.5" style={{ background: '#16162a', borderBottom: '1px solid #1e1e35' }}>
              <span className="text-xs font-mono font-semibold" style={{ color: '#64748b' }}>KEY INNOVATIONS</span>
            </div>
            <ul className="p-4 space-y-2" style={{ background: '#0f0f1a' }}>
              {model.keyInnovations.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                  <span className="font-mono mt-0.5 shrink-0" style={{ color: '#3b82f6' }}>→</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Architecture tag */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: '#3d3d6b' }}>architecture type:</span>
            <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: '#16162a', color: '#94a3b8', border: '1px solid #1e1e35' }}>
              {model.architectureType}
            </span>
          </div>

          {/* Compare CTA */}
          <Link
            to={`/compare?a=${model.slug}`}
            className="flex items-center gap-2 text-sm font-mono px-4 py-2.5 rounded-lg transition-colors w-fit"
            style={{ background: '#16162a', color: '#3b82f6', border: '1px solid #1e1e35' }}
          >
            compare with another model →
          </Link>
        </div>

        {/* Right panel — 60% — 3D placeholder for Phase 2 */}
        <div className="lg:w-3/5">
          <ModelPagePlaceholder3D model={model} />
        </div>
      </div>
    </div>
  )
}
