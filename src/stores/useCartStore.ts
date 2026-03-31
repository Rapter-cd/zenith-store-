import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getCartForCheckout: () => { product_id: string; quantity: number }[]
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
      },
      
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
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
      },
      
      clearCart: () => {
        set({ items: [] })
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
    }),
    {
      name: 'cart-storage',
    }
  )
)
