import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import PhotoGallery from '../components/PhotoGallery'
import StorageImage from '../components/StorageImage'

const ADMIN_PHONE = '+250784764923'
const DEFAULT_WA_MESSAGE = (title: string) =>
  `Hello, I'm interested in the property "${title}". Could you please provide more details?`

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>()
  const home = useQuery(api.homes.getById, id ? { id: id as any } : 'skip')

  if (home === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
      </div>
    )
  }

  if (home === null) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
        <p className="text-lg font-semibold text-black">Property not found</p>
        <Link to="/listings" className="mt-3 inline-block text-sm text-neutral-500 underline underline-offset-2 hover:text-black">
          Back to listings
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ───── Hero Image ───── */}
      <div className="relative -mx-4 -mt-8 h-[40vh] overflow-hidden sm:-mx-6 sm:h-[50vh] lg:-mx-8 lg:h-[60vh]">
        {home.images[0] ? (
          <StorageImage storageId={home.images[0]} alt={home.title} className="h-full w-full object-cover" priority />
        ) : (
          <img src="/heroback/image1.png" alt="" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2">
                {home.propertyType && (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {home.propertyType}
                  </span>
                )}
                {home.listingType && (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {home.listingType}
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{home.title}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/70">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {home.location}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white sm:text-4xl">RWF {home.price.toLocaleString()}</p>
              <p className="text-sm text-white/60">{home.listingType === 'Rent' ? 'per month' : 'total price'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Content ───── */}
      <div className="space-y-8">
        {/* Photo Gallery */}
        {home.images.length > 1 && (
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">Photos</p>
            <PhotoGallery images={home.images} thumbnails={home.thumbnails} />
          </div>
        )}

        {/* Key Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Bedrooms', value: home.bedrooms, icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7l1.5-3h15L21 7M3 7h18" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 11h4v4H7zM13 11h4v4h-4z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )},
            { label: 'Bathrooms', value: home.bathrooms, icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 12h16M6 12v6a2 2 0 002 2h8a2 2 0 002-2v-6M8 5a3 3 0 013-3h2a3 3 0 013 3v3H8V5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )},
            { label: 'Type', value: home.propertyType || 'N/A', icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )},
            { label: 'Location', value: home.location, icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )},
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                  {s.icon}
                </div>
                <div>
                  <p className="text-xs text-neutral-500">{s.label}</p>
                  <p className="text-lg font-semibold text-black">{s.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">Description</p>
          <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">{home.description}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:border-neutral-400 hover:bg-neutral-50 active:scale-[0.97]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <button
            onClick={() => {
              const digits = ADMIN_PHONE.replace(/\D+/g, '')
              const message = DEFAULT_WA_MESSAGE(home.title)
              const url = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
              window.open(url, '_blank')
            }}
            className="flex items-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.97]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact on <span className="text-green-400">WhatsApp</span>
          </button>

        </div>
      </div>
    </div>
  )
}
