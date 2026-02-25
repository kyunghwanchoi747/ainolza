import { sanityFetch } from '@/sanity/lib/fetch'
import { defineQuery } from 'next-sanity'

const GEMINI_POSTS_QUERY = defineQuery(
  `*[_type == "post" && (category == "Gemini" || "gemini" in tags)] | order(publishedAt desc)`,
)

export default async function GeminiPage() {
  const posts = await sanityFetch({ query: GEMINI_POSTS_QUERY })

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Gemini <span className="text-primary">Tutorials</span>
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          구글의 강력한 멀티모달 AI, Gemini를 100% 활용하는 방법을 배웁니다.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <div key={post._id} className="border rounded-lg p-4">
              {post.title}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border rounded-xl bg-secondary/20">
          <p className="text-muted-foreground">Gemini 튜토리얼이 준비 중입니다.</p>
        </div>
      )}
    </div>
  )
}
