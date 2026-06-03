import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { showToast } from '../components/Toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const sendMessage = useMutation(api.messages.send)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await sendMessage({ name: form.name, phone: form.phone || undefined, email: form.email, message: form.message })
    showToast('success', 'Message sent! We\'ll get back to you soon.')
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  const fields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
  ] as const

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">Contact us</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500">
          Have a question about a listing or need a recommendation? Send us a message.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {fields.map(({ name, label, type }) => {
              const isActive = focused === name || !!form[name]
              return (
                <div key={name} className="relative">
                  <label
                    htmlFor={name}
                    className={`pointer-events-none absolute left-4 origin-left transition-all duration-200 ${
                      isActive
                        ? '-translate-y-3 scale-[0.75] text-black'
                        : 'translate-y-0 scale-100 text-neutral-400'
                    } ${type === 'textarea' ? 'top-3.5' : 'top-1/2 -translate-y-1/2'} ${
                      isActive && type !== 'textarea' ? 'top-3.5 -translate-y-0' : ''
                    }`}
                  >
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    onFocus={() => setFocused(name)}
                    onBlur={() => setFocused(null)}
                    required
                    className={`w-full rounded-xl border bg-white px-4 pt-5 pb-2 text-sm text-black shadow-sm transition-all duration-200 focus:outline-none ${
                      isActive
                        ? 'border-black ring-1 ring-black/10'
                        : 'border-neutral-300 hover:border-neutral-400'
                    }`}
                  />
                </div>
              )
            })}
          </div>

          <div className="relative">
            {(() => {
              const isActive = focused === 'phone' || !!form.phone
              return (
                <>
                  <label
                    htmlFor="phone"
                    className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 origin-left transition-all duration-200 ${
                      isActive
                        ? '-translate-y-3 scale-[0.75] text-black'
                        : 'translate-y-0 scale-100 text-neutral-400'
                    } ${isActive ? 'top-3.5 -translate-y-0' : ''}`}
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    onFocus={() => setFocused('phone')}
                    onBlur={() => setFocused(null)}
                    required
                    className={`w-full rounded-xl border bg-white px-4 pt-5 pb-2 text-sm text-black shadow-sm transition-all duration-200 focus:outline-none ${
                      isActive
                        ? 'border-black ring-1 ring-black/10'
                        : 'border-neutral-300 hover:border-neutral-400'
                    }`}
                  />
                </>
              )
            })()}
          </div>

          <div className="relative">
            {(() => {
              const isActive = focused === 'message' || !!form.message
              return (
                <>
                  <label
                    htmlFor="message"
                    className={`pointer-events-none absolute left-4 top-3.5 origin-left transition-all duration-200 ${
                      isActive
                        ? '-translate-y-3 scale-[0.75] text-black'
                        : 'translate-y-0 scale-100 text-neutral-400'
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    required
                    rows={5}
                    className={`w-full rounded-xl border bg-white px-4 pt-5 pb-2 text-sm text-black shadow-sm transition-all duration-200 focus:outline-none ${
                      isActive
                        ? 'border-black ring-1 ring-black/10'
                        : 'border-neutral-300 hover:border-neutral-400'
                    }`}
                  />
                </>
              )
            })()}
          </div>

          <button
            type="submit"
            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.97]"
          >
            Send message
          </button>
        </form>

        {/* Info */}
        <div className="space-y-5 text-sm">
          <div className="border-b border-neutral-200 pb-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-400">Email</p>
            <a href="mailto:info@kigalihomehub.rw" className="font-semibold text-black transition-colors hover:text-neutral-600">
              info@kigalihomehub.rw
            </a>
          </div>
          <div className="border-b border-neutral-200 pb-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-400">Phone</p>
            <a href="tel:+250784764923" className="font-semibold text-black transition-colors hover:text-neutral-600">
              +250 784 764 923
            </a>
          </div>
          <div className="border-b border-neutral-200 pb-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-400">Address</p>
            <p className="font-semibold text-black">Kigali, Rwanda</p>
          </div>
        </div>
      </div>
    </div>
  )
}
