'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart, type CartItem } from '@/components/CartProvider'

type Props = {
  item: Omit<CartItem, 'quantity'>
  className?: string
  label?: string
}

export function AddToCartButton({ item, className, label = '장바구니 담기' }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleClick = () => {
    addItem(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <button
      onClick={handleClick}
      className={
        className ||
        'flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-black text-black transition-all hover:bg-blue-50 active:scale-95'
      }
    >
      {added ? (
        <>
          <Check className="h-5 w-5 text-emerald-600" />
          <span className="text-emerald-700">담겼습니다!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          {label}
        </>
      )}
    </button>
  )
}
