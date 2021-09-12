import { useEffect, useState } from 'react'

function idToLabel(id: string): string {
  return id.replaceAll('_', ' ')
}

export interface Filter {
  id: string
  label: string
  count: number
  selected: boolean
  select: () => void
}

export default function useFilters<T, K extends keyof T>(
  items: T[],
  key: K
): [Filter[], T[]] {
  const [filters, setFilters] = useState<Filter[]>([])
  const [selected, setSelected] = useState<string>('')
  const [results, setResults] = useState<T[]>([])
  const [collections, setCollections] = useState<Record<string, T[]>>({})

  useEffect(() => {
    if (items?.length) {
      const newFilters: Filter[] = []
      const newCollection: Record<string, T[]> = items.reduce(
        (result: Record<string, T[]>, item: T): Record<string, T[]> => {
          const cat: string = String(item[key])
          const existingFilter: Filter | undefined = newFilters.find(
            filter => filter.id === cat
          )

          result[cat] = result[cat] || []
          result[cat].push(item)

          if (existingFilter) {
            existingFilter.count = result[cat].length
          } else {
            newFilters.push({
              id: cat,
              label: idToLabel(cat),
              count: 1,
              selected: false,
              select: () => setSelected(cat),
            })
          }

          return result
        },
        {}
      )

      setCollections(newCollection)
      setResults(newCollection[selected] || [])
      setFilters(newFilters)

      if (selected === '') {
        setSelected(newFilters[0].id)
      }
    }
  }, [items, key])

  useEffect(() => {
    const newFilters: Filter[] = filters.map(filter => ({
      ...filter,
      selected: filter.id === selected,
    }))
    setResults(collections[selected] || [])
    setFilters(newFilters)
  }, [selected])

  return [filters, results]
}
