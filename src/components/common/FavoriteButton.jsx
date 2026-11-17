import { Heart } from 'lucide-react'
import { useFavorites } from '../../hooks/useFavorites'

export default function FavoriteButton({ productId }) {
  const { isFavorited, toggleFavorite } = useFavorites()
  const active = isFavorited(productId)

  return (
    <button
      type="button"
      className={`fav-btn${active ? ' fav-btn--active' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        toggleFavorite(productId)
      }}
      title={active ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
    >
      <Heart
        size={17}
        fill={active ? 'var(--accent)' : 'none'}
        stroke={active ? 'var(--accent)' : 'var(--muted)'}
      />
    </button>
  )
}