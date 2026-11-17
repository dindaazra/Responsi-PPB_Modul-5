import { useState, useMemo } from 'react'
import { Plus, Loader, PackageOpen } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/product/ProductCard'
import ProductDetail from '../components/product/ProductDetail'
import AdvancedFilter from '../components/common/AdvancedFilter'
import ConfirmModal from '../components/modals/ConfirmModal'
import productService from '../services/productService'
import {
  matchesSearch,
  matchesCategory,
  sortItems,
  extractCategories,
} from '../utils/helpers'

export default function CatalogPage({ onNavigate }) {
  const { products, loading, refetch } = useProducts()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortKey, setSortKey] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const categories = useMemo(() => extractCategories(products), [products])

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(
      (p) => matchesSearch(p, search) && matchesCategory(p, activeCategory)
    )
    return sortItems(filtered, sortKey, sortOrder)
  }, [products, search, activeCategory, sortKey, sortOrder])

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    await productService.deleteProduct(deleteTarget.id)
    setDeleteTarget(null)
    refetch()
  }

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onEdit={(p) => onNavigate('Edit', p)}
        onDelete={(p) => {
          setSelectedProduct(null)
          setDeleteTarget(p)
        }}
      />
    )
  }

  return (
    <>
      <section className="masthead">
        <h1 className="display">Curated Skincare &amp; Makeup.</h1>
        <p className="lede">
          Eksplorasi koleksi perawatan kulit dan kosmetik pilihan lengkap dengan
          kandungan aktif, jenis kulit, dan panduan pemakaian.
        </p>
      </section>

      <section>
        <div className="list-head">
          <h2>Koleksi Produk</h2>
          <div className="list-head-right">
            <span className="count">{filteredProducts.length} produk</span>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => onNavigate('Create')}
            >
              <Plus size={16} /> Tambah
            </button>
          </div>
        </div>

        <AdvancedFilter
          search={search}
          onSearch={setSearch}
          categories={categories}
          activeCategory={activeCategory}
          onCategory={setActiveCategory}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={({ key, order }) => {
            setSortKey(key)
            setSortOrder(order)
          }}
        />

        {loading ? (
          <div className="state-box">
            <Loader size={28} className="spin" />
            <p>Memuat katalog…</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="state-box">
            <PackageOpen size={32} />
            <p>Tidak ada produk yang cocok dengan pencarian Anda.</p>
          </div>
        ) : (
          <ul className="stock">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
                onEdit={(p) => onNavigate('Edit', p)}
                onDelete={setDeleteTarget}
              />
            ))}
          </ul>
        )}
      </section>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Produk"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.name}" dari katalog?`}
        confirmLabel="Hapus"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}