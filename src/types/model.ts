export type BrainrotRating = 'npc' | 'main character' | 'galaxy brain'
export type Category = 'vanilla-transformer' | 'instruction-tuned' | 'moe'
export type VisualTemplate = 'vanilla-transformer' | 'instruction-tuned' | 'moe'

export interface ModelStats {
  totalParams: string
  activeParams?: string
  contextLength: string
  layers: number
  attentionHeads: number
  license: string
}

export interface BrainrotStats {
  totalParams: string
  activeParams?: string
  contextLength: string
  layers: string
  attentionHeads: string
  license: string
}

export interface ModelComparisons {
  [slug: string]: string
}

export interface Model {
  slug: string
  name: string
  category: Category
  year: number
  org: string
  brainrotTitle: string
  brainrotOneliner: string
  stats: ModelStats
  brainrotStats: BrainrotStats
  architectureType: string
  keyInnovations: string[]
  brainrotSummary: string
  brainrotRating: BrainrotRating
  visualTemplate: VisualTemplate
  comparisons?: ModelComparisons
  source?: string
}

export interface ModelIndex {
  models: ModelIndexEntry[]
}

export interface ModelIndexEntry {
  slug: string
  name: string
  category: Category
  year: number
  org: string
  brainrotTitle: string
  brainrotOneliner: string
  brainrotRating: BrainrotRating
  visualTemplate: VisualTemplate
  totalParams: string
}
