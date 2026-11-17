const USER_PROFILE_KEY = 'glowvault_user_profile'

export const getUserProfile = () => {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return {
    nama: 'Massea Kresna Aravena Putra Febrianto',
    nim: '21120124120027',
    kelompok: 'Kelompok 12',
    skinType: 'Combination',
    bio: 'Praktikan Pemrograman Perangkat Bergerak — Teknik Komputer Undip',
    avatar: null,
  }
}

export const saveUserProfile = (profile) => {
  try {
    const data = {
      ...getUserProfile(),
      ...profile,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data))
    return { success: true, data }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export default { getUserProfile, saveUserProfile }