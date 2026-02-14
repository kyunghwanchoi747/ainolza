import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { Search, SlidersHorizontal, ShoppingCart } from 'lucide-react'
import type { Category, Course, Program } from '@/payload-types'

export default async function ShopPage() {
  try {
    const payload = await getPayload({ config })

    // Fetch categories specifically for the shop
    const { docs: categoryDocs } = await payload.find({
      collection: 'categories',
      where: {
        type: { equals: 'shop' },
      },
    })

    const { docs: courseDocs } = await payload.find({ collection: 'courses' })
    const { docs: programDocs } = await payload.find({ collection: 'programs' })

    type Product = (Course & { productType: 'course' }) | (Program & { productType: 'program' })
    const allProducts: Product[] = [
      ...courseDocs.map((d) => ({ ...d, productType: 'course' as const })),
      ...programDocs.map((d) => ({ ...d, productType: 'program' as const })),
    ]

    return (
      <div className="min-h-screen bg-black pt-20">
        {/* Header & Filter Section */}
        <section className="border-b border-white/10 bg-white/5 py-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-white">AI 놀자 스토어</h1>
                <p className="mt-2 text-gray-400">
                  당신의 성장을 도울 선별된 강의와 도구를 만나보세요.
                </p>
              </div>
              <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-white/10 bg-black/50 px-4 py-2">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="어떤 지식을 찾으시나요?"
                  className="w-full bg-transparent py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                전체
              </button>
              {categoryDocs.map((cat: Category) => (
                <button
                  key={cat.id}
                  className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/20"
                >
                  {cat.title}
                </button>
              ))}
              <button className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10">
                <SlidersHorizontal className="h-4 w-4" />
                필터
              </button>
            </div>
          </div>
        </section>

        {/* Product List Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allProducts.length > 0 ? (
              allProducts.map((product: Product) => (
                <Link
                  key={product.id}
                  href={
                    product.productType === 'course'
                      ? `/courses/${product.id}`
                      : `/products/${product.id}`
                  }
                  className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 transition-all hover:border-blue-500/50 hover:bg-white/10"
                >
                  {/* Badges */}
                  <div className="absolute left-4 top-4 z-10 flex gap-2">
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-white">
                      BEST
                    </span>
                    {product.price === 0 && (
                      <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-white">
                        FREE
                      </span>
                    )}
                  </div>

                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 transition-transform duration-500 group-hover:scale-110" />
                  </div>

                  <div className="flex flex-1 flex-col p-6 text-white">
                    <span className="text-xs font-bold text-blue-400">
                      {product.productType === 'course' ? 'ONLINE COURSE' : 'PROGRAM & BOOK'}
                    </span>
                    <h2 className="mt-2 text-xl font-bold leading-tight group-hover:text-blue-400 transition-colors">
                      {product.title}
                    </h2>
                    <p className="mt-3 line-clamp-2 text-sm text-gray-400">{product.description}</p>

                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 line-through">
                          {product.price > 0 && `${(product.price * 1.2).toLocaleString()}원`}
                        </span>
                        <span className="text-xl font-black text-white">
                          {product.price === 0 ? '무료' : `${product.price.toLocaleString()}원`}
                        </span>
                      </div>
                      <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black transition-all hover:scale-110 hover:bg-blue-600 hover:text-white group-active:scale-95">
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5">
                  <Search className="h-8 w-8 text-gray-600" />
                </div>
                <p className="mt-6 text-xl font-bold text-gray-500 uppercase tracking-widest">
                  No products found
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error loading shop products:', error)
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-2">스토어 로드 실패</h1>
            <p className="text-gray-400">상품을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    )
  }
}
