import { useState } from 'react'
import { ArrowLeft, Upload, Plus, X, AlertCircle } from 'lucide-react'
import productService from '../services/productService'

export default function EditProductPage({ product, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    category: product?.category || 'Skincare',
    skinType: product?.skinType || 'All Skin Types',
    price: product?.price || 0,
    description: product?.description || '',
    image_url: product?.image_url || '/placeholder.svg',
  })

  const [ingredients, setIngredients] = useState(
    product?.ingredients?.length
      ? product.ingredients
      : [{ name: 'Key Active', quantity: '' }]
  )
  const [steps, setSteps] = useState(
    product?.steps?.length ? product.steps : ['Gunakan sesuai petunjuk kemasan.']
  )
  const [error, setError] = useState('')

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 2MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image_url: reader.result }))
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.brand.trim()) {
      setError('Nama produk dan brand wajib diisi.')
      return
    }

    await productService.updateProduct(product.id, {
      ...formData,
      price: Number(formData.price) || 0,
      ingredients: ingredients.filter((i) => i.name.trim()),
      steps: steps.filter((s) => s.trim()),
    })

    onSuccess()
  }

  return (
    <div className="form-page">
      <div className="form-head">
        <button type="button" className="detail-back" onClick={onBack}>
          <ArrowLeft size={18} /> Kembali
        </button>
      </div>

      <div className="form-title-group">
        <h1 className="display">Edit Data Produk</h1>
        <p className="lede">Memperbarui informasi untuk {product?.name}</p>
      </div>

      {error && (
        <div className="toast toast--error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="entry-form">
        <div className="selected-thumb-bar">
          <img src={formData.image_url} alt="Preview" className="thumb-small" />
          <div className="thumb-info">
            <span className="thumb-title">Foto Produk</span>
            <span className="thumb-sub">Klik tombol untuk mengganti foto</span>
          </div>
          <label htmlFor="edit-prod-img" className="btn btn--outline btn--sm">
            <Upload size={14} /> Ganti Gambar
            <input
              id="edit-prod-img"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden-file-input"
            />
          </label>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Nama Produk *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Brand *</label>
            <input
              type="text"
              className="form-input"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-grid form-grid--3">
          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Skincare">Skincare</option>
              <option value="Makeup">Makeup</option>
              <option value="Serum">Serum</option>
              <option value="Lip Product">Lip Product</option>
              <option value="Sunscreen">Sunscreen</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Jenis Kulit</label>
            <input
              type="text"
              className="form-input"
              value={formData.skinType}
              onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Harga (Rp)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Deskripsi Produk</label>
          <textarea
            rows={3}
            className="form-textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-fieldset">
          <div className="fieldset-header">
            <label className="form-label">Kandungan &amp; Spesifikasi</label>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => setIngredients([...ingredients, { name: '', quantity: '' }])}
            >
              <Plus size={14} /> Tambah Spec
            </button>
          </div>
          <div className="multi-rows">
            {ingredients.map((item, idx) => (
              <div key={idx} className="multi-row">
                <input
                  type="text"
                  className="form-input"
                  value={item.name}
                  onChange={(e) => {
                    const next = [...ingredients]
                    next[idx].name = e.target.value
                    setIngredients(next)
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  value={item.quantity}
                  onChange={(e) => {
                    const next = [...ingredients]
                    next[idx].quantity = e.target.value
                    setIngredients(next)
                  }}
                />
                <button
                  type="button"
                  className="btn btn--danger-ghost"
                  onClick={() =>
                    ingredients.length > 1 &&
                    setIngredients(ingredients.filter((_, i) => i !== idx))
                  }
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-fieldset">
          <div className="fieldset-header">
            <label className="form-label">Cara Pemakaian</label>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => setSteps([...steps, ''])}
            >
              <Plus size={14} /> Tambah Langkah
            </button>
          </div>
          <div className="multi-rows">
            {steps.map((st, idx) => (
              <div key={idx} className="step-row">
                <span className="step-num">{idx + 1}</span>
                <input
                  type="text"
                  className="form-input"
                  value={st}
                  onChange={(e) => {
                    const next = [...steps]
                    next[idx] = e.target.value
                    setSteps(next)
                  }}
                />
                <button
                  type="button"
                  className="btn btn--danger-ghost"
                  onClick={() =>
                    steps.length > 1 && setSteps(steps.filter((_, i) => i !== idx))
                  }
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions-bar">
          <button type="button" className="btn btn--outline" onClick={onBack}>
            Batal
          </button>
          <button type="submit" className="btn btn--primary">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  )
}