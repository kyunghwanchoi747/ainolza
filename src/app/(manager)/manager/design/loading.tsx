export default function DesignListLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 w-36 bg-muted animate-pulse rounded" />
          <div className="h-5 w-56 bg-muted animate-pulse rounded mt-2" />
        </div>
        <div className="h-10 w-28 bg-muted animate-pulse rounded" />
      </div>

      <div className="flex items-center gap-4">
        <div className="h-10 w-80 bg-muted animate-pulse rounded" />
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
      </div>

      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 p-3 flex gap-4">
          {['w-32', 'w-24', 'w-16', 'w-28', 'w-8'].map((w, i) => (
            <div key={i} className={`h-4 ${w} bg-muted animate-pulse rounded`} />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="border-b last:border-b-0 p-3 flex items-center gap-4">
            <div className="h-5 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
