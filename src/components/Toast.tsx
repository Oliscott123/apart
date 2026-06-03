import { useEffect, useState } from 'react'

export type ToastData = {
  id: number
  type: 'success' | 'error'
  message: string
}

let nextId = 0
let addToastFn: ((t: ToastData) => void) | null = null

export function showToast(type: 'success' | 'error', message: string) {
  addToastFn?.({ id: nextId++, type, message })
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  useEffect(() => {
    addToastFn = (t) => {
      setToasts((prev) => [...prev, t])
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id))
      }, 4000)
    }
    return () => { addToastFn = null }
  }, [])

  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2 sm:right-6 sm:top-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-slide-in flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur-xl ${
            t.type === 'success'
              ? 'border-emerald-200/60 bg-emerald-50/90 text-emerald-800'
              : 'border-red-200/60 bg-red-50/90 text-red-800'
          }`}
        >
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            className="flex h-5 w-5 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
