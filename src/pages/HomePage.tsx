import { useQuery } from 'convex/react'
import { Link } from 'react-router-dom'
import { api } from '../../convex/_generated/api'
import HomeCard from '../components/HomeCard'
import { useEffect, useRef, useCallback } from 'react'

const reviews = [
  { name: 'Alice M.', role: 'Renter, Kacyiru', text: 'Found my apartment in under a week. The team was responsive and made the whole process effortless.' },
  { name: 'David N.', role: 'Buyer, Nyarutarama', text: 'Professional from start to finish. They helped me navigate the purchase and found exactly what I needed.' },
  { name: 'Grace U.', role: 'Investor, Kimihurura', text: 'Reliable listings and honest advice. I trust them for all my property investments in Kigali.' },
  { name: 'James K.', role: 'Renter, Remera', text: 'The photos matched the actual property perfectly. No surprises, just a smooth move-in experience.' },
  { name: 'Sarah W.', role: 'Buyer, Kicukiro', text: 'They handled everything from viewing to closing. Could not have asked for a better experience.' },
  { name: 'Aisha D.', role: 'Buyer, Remera', text: 'Transparent process and clear communication. Made buying my first home a breeze.' },
]

const areas = [
  { name: 'Kacyiru', desc: 'Apartments, houses, offices', count: '43' },
  { name: 'Nyarutarama', desc: 'Premium homes, villas', count: '28' },
  { name: 'Kimihurura', desc: 'Modern apartments, shops', count: '35' },
  { name: 'Remera', desc: 'Houses, student housing', count: '31' },
  { name: 'Kicukiro', desc: 'Affordable homes, land', count: '22' },
  { name: 'Kibagabaga', desc: 'Family homes, compounds', count: '18' },
]


function ReviewCard({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <div className="w-72 shrink-0 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:w-80">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">&ldquo;{text}&rdquo;</p>
      <div className="mt-4 flex items-center gap-3 border-t border-neutral-100 pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-black">{name}</p>
          <p className="text-xs text-neutral-400">{role}</p>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const homes = useQuery(api.homes.list, {}) ?? []
  const scrollRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const phrases = ['apartment for rent', 'house for sale', 'apartment for sale', 'house for rent']

  useEffect(() => {
    let i = 0, j = 0, dir = 1, timer: ReturnType<typeof setTimeout>
    const el = searchInputRef.current
    if (!el) return
    const tick = () => {
      const p = phrases[i]
      el.placeholder = p.slice(0, j) + (j < p.length ? '|' : ' ')
      j += dir
      if (j > p.length) { dir = -1; timer = setTimeout(tick, 1800); return }
      if (j < 0) { dir = 1; i = (i + 1) % phrases.length; timer = setTimeout(tick, 400); return }
      timer = setTimeout(tick, dir > 0 ? 90 : 40)
    }
    tick()
    return () => clearTimeout(timer)
  }, [])

  const ioRef = useRef<IntersectionObserver | null>(null)
  const sectionRef = useCallback((el: HTMLElement | null) => {
    if (!el) return
    if (!ioRef.current) {
      ioRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('opacity-100', 'translate-y-0')
              entry.target.classList.remove('opacity-0', 'translate-y-6')
              ioRef.current?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1 }
      )
    }
    ioRef.current.observe(el)
  }, [])

  // auto-scroll carousel
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const step = 1
    let id: number
    const scroll = () => {
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0
      } else {
        el.scrollLeft += step
      }
      id = requestAnimationFrame(scroll)
    }
    id = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="space-y-20">
      {/* ───── 1. Hero ───── */}
      <section className="relative -mx-4 -mt-8 flex min-h-[70vh] items-center justify-center overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="absolute inset-0">
          <img src="/heroback/image1.png" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/60">Kigali Home Hub</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Find Verified Homes & Apartments in Kigali
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
            Rent, buy, or invest with confidence. Every property is reviewed before listing, and our local team helps you find the right home faster.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/60">
            {['Verified Listings', 'Local Kigali Experts', 'Fast Viewings', 'Transparent Pricing'].map((b) => (
              <span key={b} className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {b}
              </span>
            ))}
          </div>

          {/* ───── Typewriter Search ───── */}
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 pr-2 shadow-sm backdrop-blur-md transition-all focus-within:border-white/40 focus-within:ring-1 focus-within:ring-white/40">
            <svg className="h-5 w-5 shrink-0 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={searchInputRef}
              className="flex-1 border-none bg-transparent py-1 text-sm text-white outline-none placeholder:text-white/50"
            />
            <Link
              to="/listings"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition-all hover:bg-neutral-100 active:scale-[0.97]"
            >
              Search
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/listings"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition-all hover:bg-neutral-100 active:scale-[0.97]"
            >
              Browse Properties
            </Link>
            <a
              href="https://wa.me/250784764923"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.97]"
            >
              Contact on <span className="text-green-400">WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ───── 2. Featured Properties ───── */}
      <section ref={sectionRef} className="opacity-0 translate-y-6 transition-all duration-700 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">Featured</p>
            <h2 className="mt-1 text-3xl font-bold text-black">Popular listings</h2>
          </div>
          <Link
            to="/listings"
            className="hidden rounded-xl border border-neutral-300 px-5 py-2 text-sm font-semibold text-black transition-all hover:border-neutral-400 hover:bg-neutral-50 sm:inline-block"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {homes.slice(0, 3).map((home, i) => (
            <div key={home._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <HomeCard home={home} />
            </div>
          ))}
        </div>
        {homes.length > 3 && (
          <div className="text-center">
            <Link
              to="/listings"
              className="inline-flex items-center gap-1 rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:border-neutral-400 hover:bg-neutral-50 active:scale-[0.97]"
            >
              See more listings &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* ───── 3. Popular Kigali Areas ───── */}
      <section ref={sectionRef} className="opacity-0 translate-y-6 transition-all duration-700 space-y-8">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">Areas</p>
          <h2 className="mt-1 text-3xl font-bold text-black">Popular Kigali Neighborhoods</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">Explore properties in Kigali's most sought-after areas.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a) => (
            <Link
              key={a.name}
              to={`/listings?location=${a.name}`}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-lg font-semibold text-black">{a.name}</p>
              <p className="mt-1 text-sm text-neutral-500">{a.desc}</p>
              <p className="mt-3 text-xs font-medium text-neutral-400">{a.count} properties &rarr;</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ───── 4. How It Works ───── */}
      <section ref={sectionRef} className="opacity-0 translate-y-6 transition-all duration-700 space-y-10">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">Process</p>
          <h2 className="mt-1 text-3xl font-bold text-black">How It Works</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">Three simple steps to find your perfect property.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { num: '01', title: 'Browse', desc: 'Explore verified listings with photos, prices, and detailed information.' },
            { num: '02', title: 'Connect', desc: 'Contact us for viewings, questions, or personalized recommendations.' },
            { num: '03', title: 'Move In', desc: 'We guide you through the process from viewing to move-in day.' },
          ].map((item, i) => (
            <div key={item.num} className="animate-fade-in-up text-center" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-xl font-bold text-neutral-900">
                {item.num}
              </div>
              <p className="mt-5 text-base font-semibold text-black">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── 5. Statistics ───── */}
      <section ref={sectionRef} className="opacity-0 translate-y-6 transition-all duration-700">
        <div className="rounded-3xl bg-neutral-900 px-8 py-16">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {[
              { value: '200+', label: 'Properties Listed' },
              { value: '50+', label: 'Happy Clients' },
              { value: '15+', label: 'Neighborhoods' },
            ].map((s, i) => (
              <div key={s.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <p className="text-5xl font-black tracking-tight text-white">{s.value}</p>
                <p className="mt-2 text-sm font-medium text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 6. Testimonials ───── */}
      <section ref={sectionRef} className="opacity-0 translate-y-6 transition-all duration-700 space-y-8">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">Testimonials</p>
          <h2 className="mt-1 text-3xl font-bold text-black">What Our Clients Say</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">Hear from people who found their home through us.</p>
        </div>
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
          {[...reviews, ...reviews].map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </div>
      </section>

      {/* ───── 7. About ───── */}
      <section ref={sectionRef} className="opacity-0 translate-y-6 transition-all duration-700 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">About</p>
          <h2 className="mt-2 text-4xl font-light italic leading-snug tracking-tight text-black">
            Trusted Local Property Partner
          </h2>
          <div className="mx-auto mt-8 h-px w-16 bg-neutral-300" />
          <p className="mt-8 text-sm leading-relaxed text-neutral-500 sm:text-base">
            Kigali Home Hub is a Rwandan-owned property platform dedicated to helping people find verified homes and
            investment opportunities in Kigali. Our team knows the city inside out, and we personally review every
            listing to ensure accuracy and quality. Whether you are looking for a modern apartment in Kacyiru, a family
            house in Remera, or a commercial space in Kimihurura, we connect you with genuine listings and guide you
            through every step of the process. We believe in transparent transactions, honest advice, and making your
            property journey as smooth as possible. From first-time renters to seasoned investors, our goal is to help
            you find the perfect space that fits your lifestyle and budget in Rwanda's vibrant capital.
          </p>
        </div>
      </section>

      {/* ───── 8. Call to Action ───── */}
      <section ref={sectionRef} className="opacity-0 translate-y-6 transition-all duration-700 rounded-3xl bg-neutral-900 px-8 py-14 text-center shadow-sm">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Find Your Next Home?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
          Browse verified listings or speak directly with our team.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/listings"
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition-all hover:bg-neutral-100 active:scale-[0.97]"
          >
            Browse Properties
          </Link>
          <a
            href="https://wa.me/250784764923"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.97]"
          >
            Contact on <span className="text-green-400">WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  )
}
