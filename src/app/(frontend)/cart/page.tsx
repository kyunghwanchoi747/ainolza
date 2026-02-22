'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/CartProvider'

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-6 py-24 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white/5">
            <ShoppingBag className="h-10 w-10 text-gray-600" />
          </div>
          <h1 className="mt-6 text-2xl font-black text-white">장바구니가 비어있습니다</h1>
          <p className="mt-2 text-sm text-gray-500">원하는 상품을 담아보세요</p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-black hover:bg-blue-50 transition-colors"
          >
            스토어 둘러보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-black text-white">장바구니</h1>
          <button
            onClick={clearCart}
            className="text-xs font-bold text-gray-500 hover:text-red-400 transition-colors"
          >
            전체 삭제
          </button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20"
              >
                {/* Thumbnail */}
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">
                    {item.productType === 'courses'
                      ? 'ONLINE COURSE'
                      : item.productType === 'programs'
                        ? 'PROGRAM & BOOK'
                        : 'PRODUCT'}
                  </p>
                  <h3 className="font-bold text-white truncate">{item.title}</h3>
                  <p className="mt-1 text-lg font-black text-white">
                    {item.price === 0 ? '무료' : `${(item.price * item.quantity).toLocaleString()}원`}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 p-1">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-gray-600 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="w-full lg:w-96 shrink-0">
            <div className="sticky top-24 rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <h2 className="text-lg font-black text-white mb-6">주문 요약</h2>

              <div className="space-y-3 border-b border-white/10 pb-6 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-400 truncate mr-2 flex-1">{item.title}</span>
                    <span className="font-bold text-white shrink-0">
                      {item.price === 0 ? '무료' : `${(item.price * item.quantity).toLocaleString()}원`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-white">합계</span>
                <span className="text-2xl font-black text-white">
                  {total === 0 ? '무료' : `${total.toLocaleString()}원`}
                </span>
              </div>

              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-black text-black hover:bg-blue-50 transition-colors shadow-xl"
              >
                결제하기
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/shop"
                className="mt-3 flex w-full items-center justify-center rounded-2xl border border-white/10 py-3 text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                쇼핑 계속하기
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
