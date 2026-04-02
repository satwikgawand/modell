import { useState } from 'react'
import type { Model } from '../types/model'

interface LayerEntry {
  label: string
  sublabel: string
  color: string
  height: number
  inBlock?: boolean
  hasResidual?: boolean
}

type Segment =
  | { type: 'single'; layer: LayerEntry; idx: number }
  | { type: 'block'; items: Array<{ layer: LayerEntry; idx: number }> }

// Ordered top-to-bottom = data flow direction (input → output)
const LAYER_CONFIGS: Record<string, LayerEntry[]> = {
  'vanilla-transformer': [
    { label: 'embedding', sublabel: 'token + positional embeddings', color: '#8b5cf6', height: 1 },
    { label: 'layer norm', sublabel: 'pre-attention norm', color: '#475569', height: 0.6, inBlock: true },
    { label: 'attention block', sublabel: 'multi-head self-attention', color: '#3b82f6', height: 1.4, inBlock: true, hasResidual: true },
    { label: 'FFN layer', sublabel: 'feed-forward network', color: '#14b8a6', height: 1.2, inBlock: true, hasResidual: true },
    { label: 'layer norm', sublabel: 'final normalization', color: '#475569', height: 0.6 },
    { label: 'LM head', sublabel: 'output projection', color: '#22c55e', height: 1 },
  ],
  'instruction-tuned': [
    { label: 'embedding', sublabel: 'token + positional embeddings', color: '#8b5cf6', height: 1 },
    { label: 'layer norm', sublabel: 'pre-attention norm', color: '#475569', height: 0.6, inBlock: true },
    { label: 'attention block', sublabel: 'multi-head self-attention', color: '#3b82f6', height: 1.4, inBlock: true, hasResidual: true },
    { label: 'FFN layer', sublabel: 'feed-forward network', color: '#14b8a6', height: 1.2, inBlock: true, hasResidual: true },
    { label: 'layer norm', sublabel: 'final normalization', color: '#475569', height: 0.6 },
    { label: 'LM head', sublabel: 'output projection', color: '#22c55e', height: 1 },
    { label: 'RLHF alignment', sublabel: 'reward model + fine-tuning', color: '#f59e0b', height: 1.2 },
  ],
  moe: [
    { label: 'embedding', sublabel: 'token + positional embeddings', color: '#8b5cf6', height: 1 },
    { label: 'layer norm', sublabel: 'pre-attention norm', color: '#475569', height: 0.6, inBlock: true },
    { label: 'attention block', sublabel: 'multi-head latent attention', color: '#3b82f6', height: 1.4, inBlock: true, hasResidual: true },
    { label: 'MoE router', sublabel: 'token routing to experts', color: '#f59e0b', height: 1, inBlock: true },
    { label: 'expert block', sublabel: 'active experts per token', color: '#f97316', height: 1.2, inBlock: true, hasResidual: true },
    { label: 'inactive experts', sublabel: 'dormant experts (not firing)', color: '#334155', height: 0.8, inBlock: true },
    { label: 'layer norm', sublabel: 'final normalization', color: '#475569', height: 0.6 },
    { label: 'LM head', sublabel: 'output projection', color: '#22c55e', height: 1 },
  ],
}

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
  'RLHF alignment': {
    plain: 'Reinforcement Learning from Human Feedback fine-tunes the model to follow instructions and avoid harmful outputs.',
    brainrot: "the compliance department. technically not a single layer but represents the entire alignment pipeline.",
  },
  'MoE router': {
    plain: 'A learned routing network decides which experts should process each token. typically selects top-K experts from N total.',
    brainrot: "the delegator. looks at each token and decides which specialists handle it. management energy.",
  },
  'expert block': {
    plain: 'The active expert feed-forward networks. each expert specializes in different types of input patterns.',
    brainrot: "the specialists. only a few fire per token but they're really good at what they do. main character energy.",
  },
  'inactive experts': {
    plain: 'The dormant expert networks for a given token. they hold learned weights but their outputs are zero-gated for this input.',
    brainrot: "clocked out. not needed right now. the bench is deep and these experts are watching today.",
  },
}

function buildSegments(layers: LayerEntry[]): Segment[] {
  const segments: Segment[] = []
  let i = 0
  while (i < layers.length) {
    if (layers[i].inBlock) {
      const items: Array<{ layer: LayerEntry; idx: number }> = []
      while (i < layers.length && layers[i].inBlock) {
        items.push({ layer: layers[i], idx: i })
        i++
      }
      segments.push({ type: 'block', items })
    } else {
      segments.push({ type: 'single', layer: layers[i], idx: i })
      i++
    }
  }
  return segments
}

const FlowArrow = ({ faint = false }: { faint?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: faint ? '16px' : '20px' }}>
    <div style={{ width: '1px', flex: 1, background: faint ? '#16162a' : '#1e1e35' }} />
    <div style={{
      width: 0, height: 0,
      borderLeft: '3px solid transparent',
      borderRight: '3px solid transparent',
      borderTop: `4px solid ${faint ? '#16162a' : '#1e1e35'}`,
    }} />
  </div>
)

interface Props {
  model: Model
}

export default function ModelPagePlaceholder3D({ model }: Props) {
  const layers = LAYER_CONFIGS[model.visualTemplate] ?? LAYER_CONFIGS['vanilla-transformer']
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const segments = buildSegments(layers)

  const hoveredLayer = hoveredIdx !== null ? layers[hoveredIdx] : null
  const commentary = hoveredLayer ? (LAYER_COMMENTARY[hoveredLayer.label] ?? null) : null

  const renderLayer = (layer: LayerEntry, idx: number) => (
    <button
      key={idx}
      onMouseEnter={() => setHoveredIdx(idx)}
      onMouseLeave={() => setHoveredIdx(null)}
      className="w-full rounded-lg px-4 flex items-center justify-between text-left transition-all duration-150"
      style={{
        height: `${layer.height * 40}px`,
        background: hoveredIdx === idx ? `${layer.color}22` : '#16162a',
        border: `1px solid ${hoveredIdx === idx ? layer.color + '60' : '#1e1e35'}`,
        boxShadow: hoveredIdx === idx ? `0 0 12px ${layer.color}20` : 'none',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="rounded w-2.5 h-2.5 shrink-0"
          style={{ background: layer.color, opacity: hoveredIdx === idx ? 1 : 0.6 }}
        />
        <div>
          <span className="text-sm font-medium text-white block">{layer.label}</span>
          <span className="text-xs" style={{ color: '#475569' }}>{layer.sublabel}</span>
        </div>
      </div>
      {layer.hasResidual && (
        <span
          title="residual (skip) connection"
          style={{ fontSize: '13px', color: hoveredIdx === idx ? '#3d3d6b' : '#2d2d50', flexShrink: 0, lineHeight: 1 }}
        >
          ⊕
        </span>
      )}
    </button>
  )

  return (
    <div className="sticky top-20 rounded-xl overflow-hidden" style={{ border: '1px solid #1e1e35', background: '#0a0a16' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1e1e35', background: '#0f0f1a' }}>
        <span className="text-xs font-mono" style={{ color: '#64748b' }}>
          {model.visualTemplate} architecture
        </span>
        <span className="text-xs font-mono" style={{ color: '#2d2d50' }}>
          data flow ↓
        </span>
      </div>

      <div className="p-5">
        <div className="flex gap-5">
          {/* Architecture flow column */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Input endpoint */}
            <div className="flex justify-center mb-1">
              <span
                className="text-xs font-mono px-3 py-0.5 rounded-full"
                style={{ background: '#16162a', color: '#3d3d6b', border: '1px solid #1e1e35' }}
              >
                tokens in
              </span>
            </div>
            <FlowArrow />

            {segments.map((seg, si) => (
              <div key={si}>
                {si > 0 && <FlowArrow />}

                {seg.type === 'single' ? (
                  renderLayer(seg.layer, seg.idx)
                ) : (
                  /* Repeating transformer block */
                  <div style={{ position: 'relative', border: '1px dashed #252540', borderRadius: '10px', padding: '10px 10px 10px 10px' }}>
                    {/* Block count label */}
                    <div style={{
                      position: 'absolute', top: '-9px', left: '12px',
                      background: '#0a0a16', padding: '0 6px',
                    }}>
                      <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#3d3d6b' }}>
                        × {model.stats.layers} layers
                      </span>
                    </div>

                    {/* Residual bypass line */}
                    <div style={{
                      position: 'absolute', right: '10px', top: '20px', bottom: '20px',
                      width: '1px', background: '#1a1a2e',
                    }} />
                    <div style={{
                      position: 'absolute', right: '6px', top: '50%',
                      transform: 'translateY(-50%) rotate(90deg)',
                      fontSize: '8px', fontFamily: 'monospace', color: '#1e1e35',
                      whiteSpace: 'nowrap', letterSpacing: '0.05em',
                    }}>
                      skip
                    </div>

                    {/* Inner layers */}
                    <div style={{ paddingRight: '18px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {seg.items.map(({ layer, idx }, ii) => (
                        <div key={idx}>
                          {ii > 0 && <FlowArrow faint />}
                          {renderLayer(layer, idx)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <FlowArrow />
            {/* Output endpoint */}
            <div className="flex justify-center mt-1">
              <span
                className="text-xs font-mono px-3 py-0.5 rounded-full"
                style={{ background: '#16162a', color: '#3d3d6b', border: '1px solid #1e1e35' }}
              >
                logits out
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-24 shrink-0 pt-8">
            <p className="text-xs font-mono mb-3" style={{ color: '#2d2d50' }}>legend</p>
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
                  <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: color }} />
                  <span className="text-xs" style={{ color: '#3d3d6b' }}>{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <span style={{ fontSize: '11px', color: '#2d2d50' }}>⊕</span>
                <span className="text-xs" style={{ color: '#3d3d6b' }}>residual</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover annotation panel */}
        <div
          className="mt-4 rounded-lg p-4 transition-all duration-200"
          style={{ background: '#0d0d1a', border: '1px solid #1e1e35', minHeight: '88px' }}
        >
          {commentary ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: hoveredLayer?.color }} />
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
            <p className="text-xs font-mono" style={{ color: '#2d2d50' }}>
              hover a layer to see what's happening
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
