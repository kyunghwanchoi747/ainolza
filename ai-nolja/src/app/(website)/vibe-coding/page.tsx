import { sanityFetch } from '@/sanity/lib/fetch'
import { defineQuery } from 'next-sanity'

const VIBE_POSTS_QUERY = defineQuery(
  `*[_type == "post" && (category == "Vibe Coding" || "vibe-coding" in tags)] | order(publishedAt desc)`,
)

export default async function VibeCodingPage() {
  const posts = await sanityFetch({ query: VIBE_POSTS_QUERY })

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Vibe <span className="text-primary">Coding</span>
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          코딩을 넘어 '지시'하는 기술. AI와 대화하며 나만의 앱을 만드는 여정입니다.
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
          <p className="text-muted-foreground">바이브 코딩 콘텐츠가 준비 중입니다.</p>
        </div>
      )}
    </div>
  )
}
