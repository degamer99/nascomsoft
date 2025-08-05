// stores/useCartStore.ts
import create from "zustand"
import { persist } from "zustand/middleware"

interface CartItem { id: string; name: string; price: number; qty: number }
interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartState>(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items
        const idx   = items.findIndex((i) => i.id === item.id)
        if (idx > -1) {
          items[idx].qty += item.qty
          set({ items: [...items] })
        } else {
          set({ items: [...items, item] })
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: "cart-storage", // localStorage key
      getStorage: () => localStorage,
    }
  )
)
