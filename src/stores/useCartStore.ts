import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem } from '@/types'
import { fetchAPI } from '@/lib/api'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getCartForCheckout: () => { product_id: string; quantity: number }[]
  syncWithBackend: () => Promise<void>
  loadFromBackend: () => Promise<void>
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          )
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + 1, product.stock_quantity) }
                  : item
              ),
            }
          } else {
            return {
              items: [...state.items, { product, quantity: 1 }],
            }
          }
        })
        get().syncWithBackend()
      },
      
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
        get().syncWithBackend()
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(quantity, item.product.stock_quantity) }
              : item
          ),
        }))
        get().syncWithBackend()
      },
      
      clearCart: () => {
        set({ items: [] })
        get().syncWithBackend()
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },
      
      getCartForCheckout: () => {
        return get().items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        }))
      },
      
      syncWithBackend: async () => {
        try {
          // If not logged in, fetchAPI will likely fail with 401, we just ignore it
          // as we want unauthenticated users to use local storage only
          await fetchAPI('/cart', {
            method: 'PUT',
            body: JSON.stringify({ cart_items: get().getCartForCheckout() })
          })
        } catch (e) {
          // Silent fail for guests
        }
      },

      loadFromBackend: async () => {
        try {
          const data = await fetchAPI('/cart')
          if (data && data.cart_items) {
            const mappedItems = data.cart_items.map((ci: any) => ({
              product: { ...ci.product_id, id: ci.product_id._id },
              quantity: ci.quantity
            }))
            set({ items: mappedItems })
          }
        } catch (e) {
          // Silent fail
        }
      }
    }),
    {
      name: 'cart-storage',
    }
  )
)
