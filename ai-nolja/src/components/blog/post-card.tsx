import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

export function PostCard({ post }: { post: any }) {
  return (
    <Link
      href={`/trends/${post.slug?.current || post._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden">
        {post.coverImage ? (
          <Image
            src={urlFor(post.coverImage).url()}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 mb-2">
          {post.category && (
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
              {post.category}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
          </span>
        </div>
        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}
