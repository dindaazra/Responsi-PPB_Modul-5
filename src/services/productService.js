import { apiClient, IS_SUPABASE } from '../config/api'
import INITIAL_PRODUCTS from '../data/products'

const STORAGE_KEY = 'glowvault_products_v1'

const readStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS))
    return INITIAL_PRODUCTS
  } catch {
    return INITIAL_PRODUCTS
  }
}

const writeStore = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* ignore */
  }
}

class ProductService {
  async getProducts() {
    if (IS_SUPABASE) {
      try {
        const data = await apiClient.get('/rest/v1/products?select=*&order=created_at.desc')
        if (Array.isArray(data) && data.length > 0) {
          writeStore(data)
          return { success: true, data }
        }
      } catch {
        /* fallback to local */
      }
    }
    return { success: true, data: readStore() }
  }

  async getProductById(id) {
    const list = readStore()
    const found = list.find((p) => String(p.id) === String(id))
    if (!found) throw new Error('Produk tidak ditemukan.')
    return { success: true, data: found }
  }

  async createProduct(payload) {
    const newItem = {
      ...payload,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    if (IS_SUPABASE) {
      try {
        const res = await apiClient.post('/rest/v1/products', newItem, {
          headers: { Prefer: 'return=representation' },
        })
        const created = Array.isArray(res) ? res[0] : res
        const updatedList = [created, ...readStore()]
        writeStore(updatedList)
        return { success: true, data: created }
      } catch {
        /* fallback to local */
      }
    }
    const list = readStore()
    const updatedList = [newItem, ...list]
    writeStore(updatedList)
    return { success: true, data: newItem }
  }

  async updateProduct(id, payload) {
    if (IS_SUPABASE) {
      try {
        await apiClient.patch(`/rest/v1/products?id=eq.${id}`, payload)
      } catch {
        /* fallback to local */
      }
    }
    const list = readStore()
    const updatedList = list.map((item) =>
      String(item.id) === String(id) ? { ...item, ...payload, id } : item
    )
    writeStore(updatedList)
    const updatedItem = updatedList.find((item) => String(item.id) === String(id))
    return { success: true, data: updatedItem }
  }

  async deleteProduct(id) {
    if (IS_SUPABASE) {
      try {
        await apiClient.delete(`/rest/v1/products?id=eq.${id}`)
      } catch {
        /* fallback to local */
      }
    }
    const list = readStore()
    const filtered = list.filter((item) => String(item.id) !== String(id))
    writeStore(filtered)
    return { success: true }
  }
}

export default new ProductService()