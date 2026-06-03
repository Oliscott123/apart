import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StorageImage from './StorageImage'
import type { Doc } from '../../convex/_generated/dataModel'

export default function HomeCard({ home }: { home: Doc<'homes'> }) {
  const images = home.thumbnails?.length ? home.thumbnails : home.images
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const interval = setInterval(() => {
      setImgIndex((i) => (i + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [images.length])

  const openWhatsApp = () => {
    const digits = '+250784764923'.replace(/\D+/g, '')
    const message = `Hello, I'm interested in the property "${home.title}". Could you please provide more details?`
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/property/${home._id}`} className="block p-2 pb-0">
        <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-100">
          {images.length > 0 ? (
            <>
              {images.slice(0, 6).map((id, i) => (
                <StorageImage
                  key={id}
                  storageId={id}
                  alt={home.title}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 group-hover:scale-[1.03] ${
                    i === imgIndex % Math.min(images.length, 6)
                      ? 'opacity-100'
                      : 'opacity-0'
                  }`}
                />
              ))}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300 text-sm">No image</div>
          )}
          <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
            home.listingType === 'Sale'
              ? 'bg-emerald-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            {home.listingType === 'Sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>
        <div className="px-1 pb-1 pt-1.5">
          <h3 className="text-lg font-bold leading-tight text-slate-900">{home.title}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {home.location}
          </p>
          <p className="mt-1 text-xl font-extrabold leading-none tracking-tight text-slate-900">
            RWF {home.price?.toLocaleString()}
            {home.listingType !== 'Sale' && <span className="text-sm font-normal text-slate-400">/mo</span>}
          </p>
          <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7" />
                <path d="M3 7l9-4 9 4" />
              </svg>
              {home.bedrooms} Beds
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 12h16" />
                <path d="M4 6h16" />
                <path d="M4 18h16" />
              </svg>
              {home.bathrooms} Baths
            </span>
          </div>
        </div>
      </Link>
      <div className="flex gap-2 px-3 pb-3">
        <Link
          to={`/property/${home._id}`}
          className="flex-1 rounded-xl border border-slate-200 py-2 text-center text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          View
        </Link>
        <button
          onClick={openWhatsApp}
          className="flex-1 rounded-xl bg-neutral-900 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Contact on <span className="text-green-400">WhatsApp</span>
        </button>
      </div>
    </div>
  )
}
