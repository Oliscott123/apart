import { Link } from 'react-router-dom'

const values = [
  {
    title: 'Our mission',
    heading: 'Make Kigali feel like home.',
    body: 'We connect people with quality properties across Kigali, backed by local expertise and a commitment to transparent, personal service.',
  },
  {
    title: 'What we offer',
    heading: 'Curated listings, expert guidance.',
    body: 'Handpicked rental and sale properties with accurate details, location support, and fast responses — so you find the right place without the hassle.',
  },
  {
    title: 'Why choose us',
    heading: 'Trusted, local, responsive.',
    body: 'A small Kigali-based team that knows the neighborhoods, vets every listing, and treats every client like a neighbor.',
  },
]

const stats = [
  { value: '50+', label: 'Properties listed' },
  { value: '24/7', label: 'Personal support' },
  { value: '100%', label: 'Client satisfaction' },
]

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="animate-fade-in-up text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">About Kigali Home Hub</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-black sm:text-5xl">
          Welcome to Kigali&apos;s trusted property platform
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 sm:text-lg">
          We combine local expertise with modern listings to help renters and buyers find their ideal home in
          Rwanda&apos;s capital. Quality properties, transparent support, and personalized service.
        </p>
      </section>

      {/* Mission / Values */}
      <div className="grid gap-5 lg:grid-cols-3">
        {values.map((v, i) => (
          <section
            key={v.title}
            className="animate-fade-in-up rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
            style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">{v.title}</p>
            <h2 className="mt-3 text-xl font-semibold text-black">{v.heading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">{v.body}</p>
          </section>
        ))}
      </div>

      {/* Stats */}
      <div className="animate-fade-in-up rounded-2xl border border-neutral-200 bg-white px-6 py-8 shadow-sm sm:px-10">
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="animate-fade-in text-center"
              style={{ animationDelay: `${300 + i * 200}ms`, animationFillMode: 'both' }}
            >
              <p className="text-3xl font-bold text-black">{s.value}</p>
              <p className="mt-1 text-sm text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Approach */}
      <section className="animate-fade-in-up grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">Our approach</p>
          <h2 className="mt-3 text-2xl font-semibold text-black">Simple, transparent, local</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            Every property on our platform is verified and accurately described. We cut the noise so you can focus on
            finding the right home. Our team is based in Kigali — we know the neighborhoods, the market, and what makes
            a great home.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            Whether you are renting for a month or buying for a lifetime, we provide the same attentive service and
            honest advice.
          </p>
        </div>
        <div className="animate-scale-in rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">Get started</p>
          <h2 className="mt-3 text-xl font-semibold text-black">Ready to discover your next home?</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Browse our listings or reach out — we are here to make your search simple.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/listings"
              className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.97]"
            >
              Browse listings
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:border-neutral-400 hover:bg-neutral-50 active:scale-[0.97]"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
