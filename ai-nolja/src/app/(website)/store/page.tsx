import { sanityFetch } from '@/sanity/lib/fetch'
import { defineQuery } from 'next-sanity'

const PRODUCTS_QUERY = defineQuery(`*[_type == "product"] | order(_createdAt desc)`)

export default async function StorePage() {
  const products = await sanityFetch({ query: PRODUCTS_QUERY })

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          AI 놀자 <span className="text-primary">Store</span>
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          당신의 생산성을 높여줄 AI 솔루션과 강의 자료를 만나보세요.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product: any) => (
            <div key={product._id} className="border rounded-lg p-6 bg-card">
              <h3 className="font-bold text-xl mb-2">{product.name}</h3>
              <p className="text-primary font-bold">{product.price}원</p>
              <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border rounded-xl bg-secondary/20">
          <p className="text-muted-foreground">스토어에 상품이 준비 중입니다.</p>
        </div>
      )}
    </div>
  )
}
