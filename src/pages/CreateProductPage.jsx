import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Upload, Plus, X, Save, CheckCircle, AlertCircle } from 'lucide-react'
import productService from '../services/productService'
import {
  saveDraft,
  loadDraft,
  deleteDraft,
  hasDraft,
  getDraftTimestamp,
  formatDraftTime,
} from '../utils/draftStorage'
import ConfirmModal from '../components/modals/ConfirmModal'

export default function CreateProductPage({ onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Skincare',
    skinType: 'All Skin Types',
    price: 120000,
    description: '',
    image_url: '/placeholder.svg',
  })

  const [ingredients, setIngredients] = useState([
    { name: 'Key Active', quantity: '' },
    { name: 'Volume / Netto', quantity: '' },
  ])
  const [steps, setSteps] = useState(['Aplikasikan secara merata pada wajah yang bersih.'])

  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [showDraftModal, setShowDraftModal] = useState(() => hasDraft('create'))
  const [draftTs] = useState(() => getDraftTimestamp('create'))

  const handleSaveDraft = useCallback(
    (notify = true) => {
      if (saveDraft({ formData, ingredients, steps }, 'create') && notify) {
        setSuccessMsg(`Draft tersimpan (${formatDraftTime(new Date().toISOString())})`)
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    },
    [formData, ingredients, steps]
  )

  useEffect(() => {
    const timer = setInterval(() => handleSaveDraft(false), 30000)
    return () => clearInterval(timer)
  }, [handleSaveDraft])

  const handleLoadDraft = () => {
    const draft = loadDraft('create')
    if (draft) {
      if (draft.formData) setFormData(draft.formData)
      if (draft.ingredients) setIngredients(draft.ingredients)
      if (draft.steps) setSteps(draft.steps)
      setShowDraftModal(false)
      setSuccessMsg('Draft berhasil dipulihkan.')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

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

    const cleanIngredients = ingredients
      .filter((i) => i.name.trim())
      .map((i) => ({ name: i.name.trim(), quantity: i.quantity.trim() || '-' }))

    const cleanSteps = steps.filter((s) => s.trim()).map((s) => s.trim())

    await productService.createProduct({
      ...formData,
      price: Number(formData.price) || 0,
      ingredients: cleanIngredients,
      steps: cleanSteps,
    })

    deleteDraft('create')
    onSuccess()
  }

  return (
    <div className="form-page">
      <div className="form-head">
        <button type="button" className="detail-back" onClick={onBack}>
          <ArrowLeft size={18} /> Kembali
        </button>
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={() => handleSaveDraft(true)}
        >
          <Save size={14} /> Simpan Draft
        </button>
      </div>

      <div className="form-title-group">
        <h1 className="display">Tambah Produk Baru</h1>
        <p className="lede">Tambahkan produk skincare atau makeup ke dalam katalog GlowVault.</p>
      </div>

      {error && (
        <div className="toast toast--error">
          <AlertCircle size={18} /> {error}
        </div>
      )}
      {successMsg && (
        <div className="toast toast--success">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="entry-form">
        <div className="selected-thumb-bar">
          <img src={formData.image_url} alt="Preview" className="thumb-small" />
          <div className="thumb-info">
            <span className="thumb-title">Foto Produk</span>
            <span className="thumb-sub">Format JPG/PNG/WebP (Maks 2MB)</span>
          </div>
          <label htmlFor="prod-img" className="btn btn--outline btn--sm">
            <Upload size={14} /> Pilih Gambar
            <input
              id="prod-img"
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
              placeholder="Contoh: Low pH Good Morning Gel Cleanser"
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
              placeholder="Contoh: COSRX, Wardah, Skintific"
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
              placeholder="All Skin Types / Oily / Dry"
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
            placeholder="Manfaat utama, tekstur, dan klaim produk..."
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
                  placeholder="Atribut (mis. Key Active)"
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
                  placeholder="Keterangan (mis. Niacinamide 5%)"
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
            Simpan ke Katalog
          </button>
        </div>
      </form>

      <ConfirmModal
        open={showDraftModal}
        title="Pulihkan Draft?"
        message={`Ditemukan draft yang belum selesai (${formatDraftTime(draftTs)}). Lanjutkan pengisian?`}
        confirmLabel="Muat Draft"
        cancelLabel="Buang"
        onConfirm={handleLoadDraft}
        onCancel={() => {
          deleteDraft('create')
          setShowDraftModal(false)
        }}
      />
    </div>
  )
}