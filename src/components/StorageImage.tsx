import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

export default function StorageImage({
  storageId,
  alt,
  className,
  priority,
}: {
  storageId: Id<'_storage'> | undefined
  alt: string
  className?: string
  priority?: boolean
}) {
  const url = useQuery(api.homes.getImageUrl, storageId ? { storageId } : 'skip')

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className ?? ''}`}>
        No image
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading={priority ? undefined : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      decoding="async"
    />
  )
}
