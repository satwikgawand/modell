import { useState, useEffect } from 'react'
import type { ModelIndexEntry, Model } from '../types/model'

export function useModelIndex() {
  const [models, setModels] = useState<ModelIndexEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/models/index.json')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load model index')
        return r.json()
      })
      .then(data => {
        setModels(data.models)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { models, loading, error }
}

export function useModel(slug: string) {
  const [model, setModel] = useState<Model | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    // Try each category folder
    const categories = ['vanilla-transformer', 'instruction-tuned', 'moe']

    const tryFetch = async () => {
      for (const cat of categories) {
        try {
          const r = await fetch(`/models/${cat}/${slug}.json`)
          if (r.ok) {
            const data = await r.json()
            setModel(data)
            setLoading(false)
            return
          }
        } catch {
          // try next
        }
      }
      setError('Model not found')
      setLoading(false)
    }

    tryFetch()
  }, [slug])

  return { model, loading, error }
}
