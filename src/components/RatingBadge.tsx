import type { BrainrotRating } from '../types/model'

const config: Record<BrainrotRating, { label: string; style: React.CSSProperties }> = {
  npc: {
    label: 'NPC',
    style: { background: '#1a1a2e', color: '#94a3b8', border: '1px solid #2d2d50' },
  },
  'main character': {
    label: 'main character',
    style: { background: '#1a1400', color: '#fbbf24', border: '1px solid #3d3000' },
  },
  'galaxy brain': {
    label: 'galaxy brain',
    style: { background: '#1a0030', color: '#c084fc', border: '1px solid #3d0070' },
  },
}

interface Props {
  rating: BrainrotRating
  size?: 'sm' | 'md'
}

export default function RatingBadge({ rating, size = 'sm' }: Props) {
  const { label, style } = config[rating]
  const px = size === 'md' ? 'px-3 py-1' : 'px-2 py-0.5'
  const text = size === 'md' ? 'text-sm' : 'text-xs'
  return (
    <span className={`${px} ${text} font-mono rounded-full font-medium`} style={style}>
      {label}
    </span>
  )
}
