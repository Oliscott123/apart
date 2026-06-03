import { useState } from 'react'
import StorageImage from './StorageImage'
import type { Id } from '../../convex/_generated/dataModel'

export default function PhotoGallery({
  images,
  thumbnails,
}: {
  images: Id<'_storage'>[]
  thumbnails?: Id<'_storage'>[]
}) {
  const imgs = images.slice(0, 5)
  const thumbs = thumbnails?.length ? thumbnails.slice(0, 5) : imgs
  const [index, setIndex] = useState(0)

  if (!imgs.length) {
    return <div className="rounded-3xl bg-slate-100 p-16 text-center text-slate-500">No images available</div>
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl">
        <StorageImage storageId={imgs[index]} alt={`image-${index}`} className="h-96 w-full object-cover" priority={index === 0} />
        <button
          onClick={() => setIndex((i) => (i - 1 + imgs.length) % imgs.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow"
          aria-label="Previous"
        >
          &lsaquo;
        </button>
        <button
          onClick={() => setIndex((i) => (i + 1) % imgs.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow"
          aria-label="Next"
        >
          &rsaquo;
        </button>
      </div>

      <div className="mt-4 flex gap-3">
        {imgs.map((storageId, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-20 w-28 overflow-hidden rounded-lg ${i === index ? 'ring-2 ring-cyan-400' : ''}`}
          >
            <StorageImage storageId={thumbs[i]} alt={`thumb-${i}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
