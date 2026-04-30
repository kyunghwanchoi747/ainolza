import LandingPage from '@/components/landing/landing-page'
import { listProductsForStore } from '@/lib/products-db'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await listProductsForStore()
  return <LandingPage products={products} />
}
