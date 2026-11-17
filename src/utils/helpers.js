export const formatPrice = (price) => {
  const num = Number(price)
  if (Number.isNaN(num)) return 'Rp 0'
  return `Rp ${num.toLocaleString('id-ID')}`
}

export const matchesSearch = (item, query) => {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    (item.name || '').toLowerCase().includes(q) ||
    (item.brand || '').toLowerCase().includes(q) ||
    (item.description || '').toLowerCase().includes(q)
  )
}

export const matchesCategory = (item, category) => {
  if (!category || category === 'All') return true
  return (item.category || '').toLowerCase() === category.toLowerCase()
}

export const sortItems = (items, key = 'name', order = 'asc') => {
  const sorted = [...items].sort((a, b) => {
    if (key === 'price') return (Number(a.price) || 0) - (Number(b.price) || 0)
    return String(a[key] || '').localeCompare(String(b[key] || ''))
  })
  return order === 'desc' ? sorted.reverse() : sorted
}

export const truncate = (str, max = 85) => {
  if (!str || str.length <= max) return str || ''
  return str.slice(0, max).trimEnd() + '…'
}

export const extractCategories = (items) => {
  const set = new Set(['Skincare', 'Makeup', 'Serum', 'Lip Product'])
  items.forEach((i) => {
    if (i.category) set.add(i.category)
  })
  return ['All', ...Array.from(set)]
}