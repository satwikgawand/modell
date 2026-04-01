import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useModelIndex, useModel } from '../hooks/useModels'
import RatingBadge from '../components/RatingBadge'
import CategoryPill from '../components/CategoryPill'
import ModelPagePlaceholder3D from '../components/ModelPagePlaceholder3D'

function ModelSelector({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { slug: string; name: string }[]
  onChange: (slug: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono" style={{ color: '#64748b' }}>{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm font-mono px-3 py-1.5 rounded outline-none"
        style={{ background: '#0f0f1a', color: '#e2e8f0', border: '1px solid #1e1e35' }}
      >
        {options.map(o => (
          <option key={o.slug} value={o.slug}>{o.name}</option>
        ))}
      </select>
    </div>
  )
}

function ModelPanel({ slug }: { slug: string }) {
  const { model, loading } = useModel(slug)

  if (loading) {
    return <div className="animate-pulse rounded-xl h-64" style={{ background: '#0f0f1a' }} />
  }
  if (!model) return null

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-bold text-white">{model.name}</h2>
          <RatingBadge rating={model.brainrotRating} />
        </div>
        <p className="text-sm font-mono mb-2" style={{ color: '#3b82f6' }}>{model.brainrotTitle}</p>
        <div className="flex items-center gap-2">
          <CategoryPill category={model.category} />
          <span className="text-xs font-mono" style={{ color: '#64748b' }}>{model.org} · {model.year}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e1e35' }}>
        <div className="divide-y" style={{ borderColor: '#1e1e35' }}>
          {[
            ['params', model.stats.totalParams, model.brainrotStats.totalParams],
            ...(model.stats.activeParams ? [['active params', model.stats.activeParams, model.brainrotStats.activeParams ?? '—']] : []),
            ['context', model.stats.contextLength, model.brainrotStats.contextLength],
            ['layers', String(model.stats.layers), model.brainrotStats.layers],
            ['attn heads', String(model.stats.attentionHeads), model.brainrotStats.attentionHeads],
          ].map(([label, real, brainrot]) => (
            <div key={label} className="grid grid-cols-2 gap-3 px-4 py-2.5" style={{ background: '#0f0f1a' }}>
              <div>
                <span className="text-xs font-mono block" style={{ color: '#3d3d6b' }}>{label}</span>
                <span className="text-sm font-mono text-white">{real}</span>
              </div>
              <div>
                <span className="text-xs font-mono block" style={{ color: '#3d3d6b' }}>brainrot</span>
                <span className="text-xs" style={{ color: '#64748b' }}>{brainrot}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModelPagePlaceholder3D model={model} />
    </div>
  )
}

export default function ComparePage() {
  const { models } = useModelIndex()
  const [searchParams, setSearchParams] = useSearchParams()
  const [modelA, setModelA] = useState(searchParams.get('a') ?? 'gpt2')
  const [modelB, setModelB] = useState(searchParams.get('b') ?? 'deepseek-v3')

  const { model: mA } = useModel(modelA)
  const { model: mB } = useModel(modelB)

  useEffect(() => {
    setSearchParams({ a: modelA, b: modelB }, { replace: true })
  }, [modelA, modelB, setSearchParams])

  const verdict = mA?.comparisons?.[modelB] ?? mB?.comparisons?.[modelA] ?? null

  const options = models.map(m => ({ slug: m.slug, name: m.name }))

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <Link to="/" className="text-xs font-mono" style={{ color: '#3d3d6b' }}>← gallery</Link>
        <h1 className="text-2xl font-bold text-white mt-3 mb-1">compare</h1>
        <p className="text-sm" style={{ color: '#64748b' }}>two models, side by side</p>
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-4 mb-8 pb-6" style={{ borderBottom: '1px solid #1e1e35' }}>
        {options.length > 0 && (
          <>
            <ModelSelector label="model a" value={modelA} options={options} onChange={setModelA} />
            <span className="text-sm font-mono" style={{ color: '#3d3d6b' }}>vs</span>
            <ModelSelector label="model b" value={modelB} options={options} onChange={setModelB} />
          </>
        )}
      </div>

      {/* Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ModelPanel slug={modelA} />
        <ModelPanel slug={modelB} />
      </div>

      {/* Verdict */}
      {verdict && (
        <div className="mt-10 rounded-xl p-6" style={{ background: '#0f0f1a', border: '1px solid #1e1e35' }}>
          <span className="text-xs font-mono block mb-2" style={{ color: '#3d3d6b' }}>verdict</span>
          <p className="text-base leading-relaxed" style={{ color: '#94a3b8' }}>{verdict}</p>
        </div>
      )}
    </div>
  )
}
