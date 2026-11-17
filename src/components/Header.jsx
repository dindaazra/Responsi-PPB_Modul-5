import { Plus, Sparkles } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

const NAV_ITEMS = [
  { id: 'Catalog', label: 'Katalog' },
  { id: 'Favorites', label: 'Wishlist', hasBadge: true },
  { id: 'Profile', label: 'Profil' },
]

export default function Header({ tab, onTab, onNavigateCreate }) {
  const { favorites } = useFavorites()

  return (
    <header className="header">
      <div className="header-brand-wrap" onClick={() => onTab('Catalog')}>
        <div className="header-logo-badge">
          <Sparkles size={18} color="#fff" />
        </div>
        <span className="brand display">GlowVault</span>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? 'nav-link active' : 'nav-link'}
            onClick={() => onTab(item.id)}
          >
            {item.label}
            {item.hasBadge && favorites.length > 0 && (
              <span className="nav-badge">{favorites.length}</span>
            )}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className="btn btn--primary btn--sm"
        onClick={onNavigateCreate}
      >
        <Plus size={15} /> Tambah Produk
      </button>
    </header>
  )
}