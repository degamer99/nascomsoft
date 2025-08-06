// src/store/cartStore.ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/store/userStore'

// Types
export interface Product {
  id: string
  category: string
  name: string
  reviews: string
  price: string
  imageUrl: string
  quantity: number
}

interface CartItem {
  productId: string
  quantity: number
}

interface CartStore {
  products: Product[]
  cart: CartItem[]
  searchTerm: string

  // Product CRUD
  setProducts: (products: Product[]) => void
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id'>>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>

  // Cart actions
  addToCart: (productId: string, qty?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void

  // Search
  setSearchTerm: (term: string) => void

  // Selectors
  getFilteredProducts: () => Product[]
  getGroupedProducts: () => Record<string, Product[]>
  getCartItems: () => (Product & { quantity: number })[]
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => {
      const productsCol = collection(db, 'products')
      // Subscribe to Firestore products
      onSnapshot(productsCol, snapshot => {
        const prods: Product[] = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) }))
        set({ products: prods })
      })

      return {
        products: [],
        cart: [],
        searchTerm: '',

        setProducts: products => set({ products }),

        addProduct: async productData => {
          await addDoc(productsCol, productData)
        },

        updateProduct: async (id, updates) => {
          const docRef = doc(db, 'products', id)
          await updateDoc(docRef, updates)
        },

        deleteProduct: async id => {
          const docRef = doc(db, 'products', id)
          await deleteDoc(docRef)
          set(({ cart }) => ({ cart: cart.filter(i => i.productId !== id) }))
        },

        addToCart: (productId, qty = 1) =>
          set(({ cart }) => {
            const idx = cart.findIndex(i => i.productId === productId)
            if (idx > -1) {
              const updated = [...cart]
              updated[idx].quantity += qty
              return { cart: updated }
            }
            return { cart: [...cart, { productId, quantity: qty }] }
          }),

        removeFromCart: productId =>
          set(({ cart }) => ({ cart: cart.filter(i => i.productId !== productId) })),

        updateCartQuantity: (productId, quantity) => {
          if (quantity <= 0) return get().removeFromCart(productId)
          set(({ cart }) => ({
            cart: cart.map(i => (i.productId === productId ? { ...i, quantity } : i)),
          }))
        },

        clearCart: () => set({ cart: [] }),

        setSearchTerm: term => set({ searchTerm: term }),

        getFilteredProducts: () => {
          const { products, searchTerm } = get()
          return searchTerm
            ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            : products
        },

        getGroupedProducts: () =>
          get()
            .getFilteredProducts()
            .reduce((acc, p) => {
              (acc[p.category] ||= []).push(p)
              return acc
            }, {} as Record<string, Product[]>),

        getCartItems: () => {
          const { cart, products } = get()
          return cart
            .map(ci => {
              const p = products.find(x => x.id === ci.productId)
              return p ? { ...p, quantity: ci.quantity } : null
            })
            .filter((x): x is Product & { quantity: number } => Boolean(x))
        },
      }
    },
    { name: 'cart-storage' }
  )
)
