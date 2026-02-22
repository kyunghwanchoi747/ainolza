'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type CartItem = {
  id: string
  productType: 'products' | 'programs' | 'courses'
  title: string
  price: number
  quantity: number
  image?: string
}

export type CartUser = {
  id: string
  email: string
  nickname?: string
}

type CartContextType = {
  items: CartItem[]
  user: CartUser | null
  isLoadingUser: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  total: number
  count: number
  refreshUser: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)
const CART_KEY = 'ai-nolja-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [user, setUser] = useState<CartUser | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
  }, [])

  // Persist cart on change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const refreshUser = useCallback(async () => {
    setIsLoadingUser(true)
    try {
      const res = await fetch('/api/users/me', { credentials: 'include' })
      if (res.ok) {
        const data = (await res.json()) as {
          user?: { id: string; email: string; nickname?: string }
        }
        setUser(
          data.user
            ? { id: data.user.id, email: data.user.email, nickname: data.user.nickname }
            : null,
        )
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoadingUser(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id))
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)))
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        user,
        isLoadingUser,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        total,
        count,
        refreshUser,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
