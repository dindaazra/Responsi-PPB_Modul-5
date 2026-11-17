import { useState, useEffect, useCallback } from 'react'

const FAV_KEY = 'glowvault_favorites_v1'
const FAV_EVENT = 'glowvault_favorites_changed'

const readFavs = () => {
  try {
    const raw = localStorage.getItem(FAV_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(readFavs)

  const sync = useCallback(() => {
    setFavorites(readFavs())
  }, [])

  useEffect(() => {
    window.addEventListener(FAV_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(FAV_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [sync])

  const toggleFavorite = (productId) => {
    const current = readFavs()
    const exists = current.includes(productId)
    const next = exists
      ? current.filter((id) => id !== productId)
      : [...current, productId]
    localStorage.setItem(FAV_KEY, JSON.stringify(next))
    setFavorites(next)
    window.dispatchEvent(new Event(FAV_EVENT))
  }

  return {
    favorites,
    isFavorited: (id) => favorites.includes(id),
    toggleFavorite,
  }
}