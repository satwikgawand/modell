import { useState } from 'react'
import type { Model } from '../types/model'

// Layer config per visual template
const LAYER_CONFIGS = {
  'vanilla-transformer': [
    { label: 'LM head', sublabel: 'output projection', color: '#22c55e', height: 1 },
    { label: 'layer norm', sublabel: 'final normalization', color: '#475569', height: 0.6 },
    { label: 'attention block', sublabel: 'multi-head self-attention', color: '#3b82f6', height: 1.4, repeat: true },
    { label: 'FFN layer', sublabel: 'feed-forward network', color: '#14b8a6', height: 1.2, repeat: true },
    { label: 'layer norm', sublabel: 'pre-attention norm', color: '#475569', height: 0.6 },
    { label: 'embedding', sublabel: 'token + positional embeddings', color: '#8b5cf6', height: 1 },
  ],
  'instruction-tuned': [
    { label: 'RLHF alignment layer', sublabel: 'reward model + fine-tuning', color: '#f59e0b', height: 1.2 },
    { label: 'LM head', sublabel: 'output projection', color: '#22c55e', height: 1 },
    { label: 'layer norm', sublabel: 'final normalization', color: '#475569', height: 0.6 },
    { label: 'attention block', sublabel: 'multi-head self-attention', color: '#3b82f6', height: 1.4, repeat: true },
    { label: 'FFN layer', sublabel: 'feed-forward network', color: '#14b8a6', height: 1.2, repeat: true },
    { label: 'layer norm', sublabel: 'pre-attention norm', color: '#475569', height: 0.6 },
    { label: 'embedding', sublabel: 'token + positional embeddings', color: '#8b5cf6', height: 1 },
  ],
  moe: [
    { label: 'LM head', sublabel: 'output projection', color: '#22c55e', height: 1 },
    { label: 'layer norm', sublabel: 'final normalization', color: '#475569', height: 0.6 },
    { label: 'attention block', sublabel: 'multi-head latent attention', color: '#3b82f6', height: 1.4, repeat: true },
    { label: 'MoE router', sublabel: 'token routing to experts', color: '#f59e0b', height: 1 },
    { label: 'expert block ×N', sublabel: 'active experts per token', color: '#f97316', height: 1.2 },
    { label: 'inactive experts', sublabel: 'dormant experts (not firing)', color: '#334155', height: 0.8 },
    { label: 'layer norm', sublabel: 'pre-attention norm', color: '#475569', height: 0.6 },
    { label: 'embedding', sublabel: 'token + positional embeddings', color: '#8b5cf6', height: 1 },
  ],
} as const

const LAYER_COMMENTARY: Record<string, { plain: string; brainrot: string }> = {
  'LM head': {
    plain: 'Projects the final hidden state to a probability distribution over the vocabulary. this is what generates the next token.',
    brainrot: "the closer. takes all that thinking and commits to an answer. decisive king.",
  },
  'layer norm': {
    plain: 'Normalizes activations to stabilize training. prevents values from exploding or vanishing as depth increases.',
    brainrot: "the chill pill. keeps the vibes stable when 96 layers of attention would otherwise cause chaos.",
  },
  'attention block': {
    plain: 'Multi-head self-attention allows every token to attend to every other token. the core mechanism of transformer models.',
    brainrot: "the overthinker. literally looks at every other word before deciding anything. incredibly powerful, slightly exhausting.",
  },
  'FFN layer': {
    plain: 'Feed-forward network applies two linear transformations with a non-linearity. stores factual knowledge in weights.',
    brainrot: "the worker. less glamorous than attention but this is where the model actually stores facts. grind never stops.",
  },
  'embedding': {
    plain: 'Converts discrete token IDs to dense continuous vectors. gives the model a geometric space to reason in.',
    brainrot: "the vibe setter. turns words into vibes (vectors). everything else builds on this foundation.",
  },
  'RLHF alignment layer': {
    plain: 'Reinforcement Learning from Human Feedback fine-tunes the model to follow instructions and avoid harmful outputs.',
    brainrot: "the compliance department. technically not a single layer but represents the entire alignment pipeline.",
  },
  'MoE router': {
    plain: 'A learned routing network decides which experts should process each token. typically selects top-K experts from N total.',
    brainrot: "the delegator. looks at each token and decides which specialists handle it. management energy.",
  },
  'expert block ×N': {
    plain: 'The active expert feed-forward networks. each expert specializes in different types of input patterns.',
    brainrot: "the specialists. only a few fire per token but they're really good at what they do. main character energy.",
  },
  'inactive experts': {
    plain: 'The dormant expert networks for a given token. they hold learned weights but their outputs are zero-gated for this input.',
    brainrot: "clocked out. not needed right now. the bench is deep and these experts are watching today.",
  },
}

interface LayerEntry {
  label: string
  sublabel: string
  color: string
  height: number
  repeat?: boolean
}

interface Props {
  model: Model
}

export default function ModelPagePlaceholder3D({ model }: Props) {
  const layers = [...(LAYER_CONFIGS[model.visualTemplate] ?? LAYER_CONFIGS['vanilla-transformer'])] as LayerEntry[]
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const hoveredLayer = hoveredIdx !== null ? layers[hoveredIdx] : null
  const commentary = hoveredLayer ? (LAYER_COMMENTARY[hoveredLayer.label] ?? null) : null

  return (
    <div className="sticky top-20 rounded-xl overflow-hidden" style={{ border: '1px solid #1e1e35', background: '#0a0a16' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1e1e35', background: '#0f0f1a' }}>
        <span className="text-xs font-mono" style={{ color: '#64748b' }}>
          {model.visualTemplate} architecture
        </span>
        <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: '#16162a', color: '#3d3d6b', border: '1px solid #1e1e35' }}>
          3D viz — phase 2
        </span>
      </div>

      {/* Architecture stack */}
      <div className="p-6">
        <div className="flex gap-6">
          {/* Layer stack */}
          <div className="flex flex-col gap-2 flex-1">
            {layers.map((layer, i) => (
              <button
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="w-full rounded-lg px-4 flex items-center justify-between text-left transition-all duration-150"
                style={{
                  height: `${layer.height * 44}px`,
                  background: hoveredIdx === i ? `${layer.color}22` : '#16162a',
                  border: `1px solid ${hoveredIdx === i ? layer.color + '60' : '#1e1e35'}`,
                  boxShadow: hoveredIdx === i ? `0 0 12px ${layer.color}20` : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="rounded w-3 h-3 shrink-0"
                    style={{ background: layer.color, opacity: hoveredIdx === i ? 1 : 0.6 }}
                  />
                  <div>
                    <span className="text-sm font-medium text-white block">{layer.label}</span>
                    <span className="text-xs" style={{ color: '#475569' }}>{layer.sublabel}</span>
                  </div>
                </div>
                {layer.repeat && (
                  <span className="text-xs font-mono" style={{ color: '#3d3d6b' }}>
                    ×{model.stats.layers}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="w-28 shrink-0">
            <p className="text-xs font-mono mb-3" style={{ color: '#3d3d6b' }}>legend</p>
            <div className="space-y-2">
              {[
                { color: '#8b5cf6', label: 'embedding' },
                { color: '#3b82f6', label: 'attention' },
                { color: '#14b8a6', label: 'FFN' },
                { color: '#f59e0b', label: 'routing / align' },
                { color: '#f97316', label: 'experts' },
                { color: '#22c55e', label: 'LM head' },
                { color: '#475569', label: 'layer norm' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color }} />
                  <span className="text-xs" style={{ color: '#475569' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hover annotation panel */}
        <div
          className="mt-4 rounded-lg p-4 transition-all duration-200"
          style={{ background: '#16162a', border: '1px solid #1e1e35', minHeight: '96px' }}
        >
          {commentary ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-sm" style={{ background: hoveredLayer?.color }} />
                <span className="text-xs font-mono font-semibold text-white">{hoveredLayer?.label}</span>
              </div>
              <p className="text-sm leading-relaxed mb-2" style={{ color: '#94a3b8' }}>
                {commentary.plain}
              </p>
              <p className="text-xs leading-relaxed font-mono" style={{ color: '#3b82f6' }}>
                "{commentary.brainrot}"
              </p>
            </>
          ) : (
            <p className="text-sm" style={{ color: '#3d3d6b' }}>
              hover a layer to see what's happening
            </p>
          )}
        </div>

        <p className="text-xs font-mono mt-3 text-center" style={{ color: '#1e1e35' }}>
          interactive 3D scene coming in phase 2 · react three fiber
        </p>
      </div>
    </div>
  )
}
