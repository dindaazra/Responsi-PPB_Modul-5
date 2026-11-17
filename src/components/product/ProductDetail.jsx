import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import FavoriteButton from '../common/FavoriteButton'
import { formatPrice } from '../../utils/helpers'

export default function ProductDetail({ product, onBack, onEdit, onDelete }) {
  return (
    <div className="detail">
      <button type="button" className="detail-back" onClick={onBack}>
        <ArrowLeft size={18} /> Kembali ke Katalog
      </button>

      <div className="detail-hero">
        <img
          className="detail-img"
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
        />
        <div className="detail-info">
          <span className="badge-brand">{product.brand}</span>
          <h1 className="display">{product.name}</h1>
          <p className="type">
            {product.category} · {product.skinType}
          </p>
          <p className="price detail-price">{formatPrice(product.price)}</p>

          <div className="detail-actions">
            <FavoriteButton productId={product.id} />
            {onEdit && (
              <button type="button" className="btn btn--outline" onClick={() => onEdit(product)}>
                <Pencil size={15} /> Edit
              </button>
            )}
            {onDelete && (
              <button type="button" className="btn btn--danger" onClick={() => onDelete(product)}>
                <Trash2 size={15} /> Hapus
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="detail-section">
        <h2>Deskripsi Produk</h2>
        <p>{product.description || 'Tidak ada deskripsi produk.'}</p>
      </section>

      {product.ingredients && product.ingredients.length > 0 && (
        <section className="detail-section">
          <h2>Kandungan Utama & Spesifikasi</h2>
          <ul className="detail-specs">
            {product.ingredients.map((ing, i) => (
              <li key={i}>
                <strong>{ing.name}</strong>: {ing.quantity}
              </li>
            ))}
          </ul>
        </section>
      )}

      {product.steps && product.steps.length > 0 && (
        <section className="detail-section">
          <h2>Cara Pemakaian</h2>
          <ol className="detail-steps">
            {product.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}