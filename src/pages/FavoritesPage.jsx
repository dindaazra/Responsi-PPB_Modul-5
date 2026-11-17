import { useMemo } from 'react'
import { Heart, ArrowRight } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/product/ProductCard'

export default function FavoritesPage({ onSelectProduct, onNavigateCatalog }) {
  const { favorites } = useFavorites()
  const { products } = useProducts()

  const favoriteItems = useMemo(
    () => products.filter((p) => favorites.includes(p.id)),
    [products, favorites]
  )

  return (
    <div>
      <section className="masthead">
        <h1 className="display">Beauty Wishlist</h1>
        <p className="lede">
          Daftar produk skincare dan makeup favorit yang Anda simpan secara offline.
        </p>
      </section>

      <section>
        <div className="list-head">
          <h2>Produk Tersimpan</h2>
          <span className="count">{favoriteItems.length} item</span>
        </div>

        {favoriteItems.length === 0 ? (
          <div className="state-box">
            <Heart size={36} stroke="var(--accent)" />
            <h3>Wishlist masih kosong</h3>
            <p>Klik ikon hati pada produk di katalog untuk menyimpannya di sini.</p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={onNavigateCatalog}
            >
              Jelajahi Katalog <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <ul className="stock">
            {favoriteItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}