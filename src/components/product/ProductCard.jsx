import { Pencil, Trash2 } from 'lucide-react'
import FavoriteButton from '../common/FavoriteButton'
import { formatPrice, truncate } from '../../utils/helpers'

export default function ProductCard({ product, onSelect, onEdit, onDelete }) {
  return (
    <li className="card">
      <button type="button" className="card-btn" onClick={() => onSelect(product)}>
        <img
          className="card-img"
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          loading="lazy"
        />
        <span className="badge-brand">{product.brand || 'Beauty'}</span>
        <span className="name display">{product.name}</span>
        <span className="type">
          {product.category}
          {product.skinType ? ` · ${product.skinType}` : ''}
        </span>
        {product.description && (
          <span className="card-desc">{truncate(product.description, 75)}</span>
        )}
        <span className="price">{formatPrice(product.price)}</span>
      </button>

      <div className="card-actions">
        <FavoriteButton productId={product.id} />
        {onEdit && (
          <button
            type="button"
            className="card-act-btn"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(product)
            }}
            title="Edit Produk"
          >
            <Pencil size={14} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="card-act-btn card-act-btn--danger"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(product)
            }}
            title="Hapus Produk"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </li>
  )
}