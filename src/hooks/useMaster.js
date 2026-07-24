import { useState } from 'react'

export function useMaster(storageKey, defaults = []) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : defaults
    } catch {
      return defaults
    }
  })

  function persist(next) {
    setItems(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
  }

  function add(item)         { persist([...items, { ...item, id: Date.now() }]) }
  function update(id, data)  { persist(items.map(i => i.id === id ? { ...i, ...data } : i)) }
  function remove(id)        { persist(items.filter(i => i.id !== id)) }
  function toggle(id, field) { persist(items.map(i => i.id === id ? { ...i, [field]: !i[field] } : i)) }

  return { items, add, update, remove, toggle }
}
