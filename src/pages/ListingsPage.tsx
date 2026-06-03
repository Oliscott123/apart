import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import HomeCard from '../components/HomeCard'

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || '')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '')
  const [sort, setSort] = useState('newest')
  const [filters, setFilters] = useState<Record<string, string | number>>({})

  const rawHomes = useQuery(api.homes.list, filters) ?? []

  // apply URL params on mount
  useEffect(() => {
    const f: Record<string, string | number> = {}
    const pType = searchParams.get('propertyType')
    const beds = searchParams.get('bedrooms')
    const budget = searchParams.get('budget')
    if (pType) f.propertyType = pType
    if (beds) f.bedroomsMin = Number(beds)
    if (budget) {
      const [min, max] = budget.split('-')
      if (min) f.priceMin = Number(min)
      if (max) f.priceMax = Number(max)
    }
    setFilters(f)
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const f: Record<string, string | number> = {}
    if (propertyType) f.propertyType = propertyType
    if (priceMin) f.priceMin = Number(priceMin)
    if (priceMax) f.priceMax = Number(priceMax)
    if (bedrooms) f.bedroomsMin = Number(bedrooms)
    setFilters(f)
  }

  const handleClear = () => {
    setPropertyType('')
    setPriceMin('')
    setPriceMax('')
    setBedrooms('')
    setSort('newest')
    setFilters({})
    setSearchParams({})
  }

  const hasFilters = Object.keys(filters).length > 0

  // sorting
  const homes = useMemo(() => {
    const arr = [...rawHomes]
    switch (sort) {
      case 'price-asc': return arr.sort((a, b) => a.price - b.price)
      case 'price-desc': return arr.sort((a, b) => b.price - a.price)
      case 'newest': return arr
      default: return arr
    }
  }, [rawHomes, sort])

  const summaryParts: string[] = []
  if (filters.propertyType) summaryParts.push(String(filters.propertyType).toLowerCase() + 's')
  if (filters.bedroomsMin) summaryParts.push(`${filters.bedroomsMin}+ bedrooms`)
  if (filters.priceMin || filters.priceMax) {
    const min = filters.priceMin ? `RWF ${Number(filters.priceMin).toLocaleString()}` : ''
    const max = filters.priceMax ? `RWF ${Number(filters.priceMax).toLocaleString()}` : ''
    summaryParts.push(min && max ? `${min} - ${max}` : min || max)
  }

  return (
    <div className="space-y-8">
      {/* ───── Header ───── */}
      <div className="relative -mx-4 -mt-8 flex min-h-[30vh] items-center justify-center overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="absolute inset-0">
          <img src="/heroback/image1.png" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Browse Properties in Kigali</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
            Find verified apartments, houses, and investment opportunities across Kigali.
          </p>
        </div>
      </div>

      {/* ───── Filters ───── */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-neutral-500">Looking For</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none transition-all focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
            >
              <option value="">All</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-neutral-500">Rooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none transition-all focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-neutral-500">Min Price</label>
            <input
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              type="number"
              placeholder="0"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none transition-all focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-neutral-500">Max Price</label>
            <input
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              type="number"
              placeholder="9999999"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none transition-all focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
            />
          </div>
          <div className="flex items-end gap-1.5 sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded-xl bg-black px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.97]"
            >
              Search
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-50 active:scale-[0.97]"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ───── Results Summary + Sorting ───── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-black">{homes.length} Properties Found</p>
          {summaryParts.length > 0 && (
            <p className="text-sm text-neutral-500">Showing {summaryParts.join(' ')}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500">Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-sm text-black outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price Low → High</option>
            <option value="price-desc">Price High → Low</option>
          </select>
        </div>
      </div>

      {/* ───── Results ───── */}
      {homes.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homes.map((home) => (
            <HomeCard key={home._id} home={home} />
          ))}
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/50 p-12 text-center">
          <p className="text-base font-semibold text-black">No properties found</p>
          <p className="mt-2 text-sm text-neutral-500">
            Try adjusting your filters or contact us for personalized assistance.
          </p>
          <a
            href="https://wa.me/250784764923"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-800"
          >
            Contact on <span className="text-green-400">WhatsApp</span>
          </a>
        </div>
      )}
    </div>
  )
}
