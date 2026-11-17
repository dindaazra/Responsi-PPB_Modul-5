import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import PWABadge from './components/PWABadge'
import CatalogPage from './pages/CatalogPage'
import FavoritesPage from './pages/FavoritesPage'
import ProfilePage from './pages/ProfilePage'
import CreateProductPage from './pages/CreateProductPage'
import EditProductPage from './pages/EditProductPage'
import ProductDetail from './components/product/ProductDetail'
import ConfirmModal from './components/modals/ConfirmModal'
import productService from './services/productService'
import './App.css'

export default function App() {
  const [tab, setTab] = useState('Catalog')
  const [mode, setMode] = useState('list') // 'list' | 'create' | 'edit' | 'detail'
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleNavigate = (target, payload = null) => {
    if (target === 'Create') {
      setMode('create')
    } else if (target === 'Edit') {
      setEditingProduct(payload)
      setMode('edit')
    } else if (target === 'Detail') {
      setSelectedProduct(payload)
      setMode('detail')
    } else {
      setTab(target)
      setMode('list')
      setSelectedProduct(null)
      setEditingProduct(null)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="shell">
      <Header
        tab={mode === 'list' ? tab : ''}
        onTab={(t) => handleNavigate(t)}
        onNavigateCreate={() => handleNavigate('Create')}
      />

      <main className="main">
        {mode === 'create' && (
          <CreateProductPage
            onBack={() => handleNavigate('Catalog')}
            onSuccess={() => handleNavigate('Catalog')}
          />
        )}

        {mode === 'edit' && (
          <EditProductPage
            product={editingProduct}
            onBack={() => handleNavigate('Catalog')}
            onSuccess={() => handleNavigate('Catalog')}
          />
        )}

        {mode === 'detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={() => handleNavigate('Catalog')}
            onEdit={(p) => handleNavigate('Edit', p)}
            onDelete={(p) => setDeleteTarget(p)}
          />
        )}

        {mode === 'list' && (
          <>
            {tab === 'Catalog' && <CatalogPage onNavigate={handleNavigate} />}
            {tab === 'Favorites' && (
              <FavoritesPage
                onSelectProduct={(p) => handleNavigate('Detail', p)}
                onNavigateCatalog={() => handleNavigate('Catalog')}
              />
            )}
            {tab === 'Profile' && <ProfilePage />}
          </>
        )}
      </main>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Produk"
        message={`Yakin ingin menghapus "${deleteTarget?.name}"?`}
        confirmLabel="Hapus"
        danger
        onConfirm={async () => {
          await productService.deleteProduct(deleteTarget.id)
          setDeleteTarget(null)
          handleNavigate('Catalog')
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      <PWABadge />
      <Footer />
    </div>
  )
}