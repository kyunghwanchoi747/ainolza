import { sanityFetch } from '@/sanity/lib/fetch'
import { defineQuery } from 'next-sanity'
import { PostCard } from '@/components/blog/post-card'

const POSTS_QUERY = defineQuery(`*[_type == "post"] | order(publishedAt desc)`)

export default async function TrendsPage() {
  const posts = await sanityFetch({ query: POSTS_QUERY })

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Latest <span className="text-primary">AI Trends</span>
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          매일 쏟아지는 AI 뉴스 속에서 꼭 알아야 할 것들만 골라드립니다.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border rounded-xl bg-secondary/20">
          <p className="text-muted-foreground">
            아직 등록된 콘텐츠가 없습니다. Studio에서 첫 글을 작성해보세요!
          </p>
        </div>
      )}
    </div>
  )
}
