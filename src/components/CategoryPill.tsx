import type { Category } from '../types/model'

const config: Record<Category, { label: string; style: React.CSSProperties }> = {
  'vanilla-transformer': {
    label: 'vanilla transformer',
    style: { background: '#0a1628', color: '#60a5fa', border: '1px solid #1e3a6e' },
  },
  'instruction-tuned': {
    label: 'instruction-tuned',
    style: { background: '#0d1f0d', color: '#4ade80', border: '1px solid #1e4a1e' },
  },
  moe: {
    label: 'MoE',
    style: { background: '#1a1200', color: '#fb923c', border: '1px solid #3d2d00' },
  },
}

interface Props {
  category: Category
  size?: 'sm' | 'md'
}

export default function CategoryPill({ category, size = 'sm' }: Props) {
  const { label, style } = config[category]
  const px = size === 'md' ? 'px-3 py-1' : 'px-2 py-0.5'
  const text = size === 'md' ? 'text-sm' : 'text-xs'
  return (
    <span className={`${px} ${text} font-mono rounded font-medium`} style={style}>
      {label}
    </span>
  )
}
