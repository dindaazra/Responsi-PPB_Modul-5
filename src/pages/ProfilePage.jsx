import { useState } from 'react'
import { User, Save, Check, Camera, Heart } from 'lucide-react'
import userService from '../services/userService'
import { useFavorites } from '../hooks/useFavorites'

export default function ProfilePage() {
  const [profile, setProfile] = useState(() => userService.getUserProfile())
  const [nama, setNama] = useState(profile.nama)
  const [nim, setNim] = useState(profile.nim)
  const [kelompok, setKelompok] = useState(profile.kelompok)
  const [skinType, setSkinType] = useState(profile.skinType || 'Combination')
  const [avatar, setAvatar] = useState(profile.avatar || null)
  const [savedToast, setSavedToast] = useState(false)

  const { favorites } = useFavorites()

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setAvatar(reader.result)
      userService.saveUserProfile({ avatar: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const res = userService.saveUserProfile({
      nama: nama.trim(),
      nim: nim.trim(),
      kelompok: kelompok.trim(),
      skinType,
      avatar,
    })
    if (res.success) {
      setProfile(res.data)
      setSavedToast(true)
      setTimeout(() => setSavedToast(false), 3000)
    }
  }

  return (
    <div className="profile-page">
      <section className="masthead">
        <h1 className="display">Profil Praktikan</h1>
        <p className="lede">
          Identitas mahasiswa pengembang aplikasi PWA Katalog Skincare &amp; Makeup.
        </p>
      </section>

      {savedToast && (
        <div className="toast toast--success">
          <Check size={18} /> Data profil berhasil diperbarui!
        </div>
      )}

      <div className="profile-card">
        <div className="profile-card-top">
          <div className="avatar-wrap">
            {avatar ? (
              <img src={avatar} alt={profile.nama} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                <User size={36} stroke="var(--accent)" />
              </div>
            )}
            <label htmlFor="prof-avatar" className="avatar-upload-btn" title="Ganti Foto">
              <Camera size={14} />
              <input
                id="prof-avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden-file-input"
              />
            </label>
          </div>

          <div className="profile-identity">
            <h2 className="display">{profile.nama}</h2>
            <div className="profile-meta-pills">
              <span className="mono-badge">NIM: {profile.nim}</span>
              <span className="mono-badge">{profile.kelompok}</span>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <Heart size={18} stroke="var(--accent)" />
            <div className="stat-val">{favorites.length}</div>
            <div className="stat-label">Produk di Wishlist</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">{profile.skinType}</div>
            <div className="stat-label">Profil Jenis Kulit</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <h3 className="section-title">Edit Identitas Praktikan</h3>

        <div className="form-group">
          <label className="form-label">Nama Lengkap</label>
          <input
            type="text"
            className="form-input"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">NIM</label>
            <input
              type="text"
              className="form-input"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Kelompok</label>
            <input
              type="text"
              className="form-input"
              value={kelompok}
              onChange={(e) => setKelompok(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Jenis Kulit</label>
          <select
            className="form-select"
            value={skinType}
            onChange={(e) => setSkinType(e.target.value)}
          >
            <option value="Normal">Normal</option>
            <option value="Oily">Oily</option>
            <option value="Dry">Dry</option>
            <option value="Combination">Combination</option>
            <option value="Sensitive">Sensitive</option>
          </select>
        </div>

        <button type="submit" className="btn btn--primary">
          <Save size={16} /> Simpan Profil
        </button>
      </form>
    </div>
  )
}