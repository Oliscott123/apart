import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Doc, Id } from '../../../convex/_generated/dataModel'
import StorageImage from '../../components/StorageImage'
import { showToast } from '../../components/Toast'
import { resizeImage } from '../../utils/resizeImage'

const emptyForm = {
  title: '',
  description: '',
  location: '',
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  propertyType: 'Apartment',
  listingType: 'Rent',
}

export default function AdminProperties() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string | number>>({})
  const homes = useQuery(api.homes.list, filters) ?? []
  const createHome = useMutation(api.homes.create)
  const updateHome = useMutation(api.homes.update)
  const deleteHome = useMutation(api.homes.remove)
  const generateUploadUrl = useMutation(api.homes.generateUploadUrl)
  const addImage = useMutation(api.homes.addImage)
  const removeImage = useMutation(api.homes.removeImage)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [selectedHome, setSelectedHome] = useState<Doc<'homes'> | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Id<'homes'> | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const openAddDrawer = () => {
    setSelectedHome(null)
    setForm(emptyForm)
    setImageFiles([])
    setDrawerOpen(true)
  }

  const openEditDrawer = (home: Doc<'homes'>) => {
    setSelectedHome(home)
    setForm({
      title: home.title,
      description: home.description,
      location: home.location,
      price: home.price,
      bedrooms: home.bedrooms,
      bathrooms: home.bathrooms,
      propertyType: home.propertyType,
      listingType: home.listingType || 'Rent',
    })
    setImageFiles([])
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setSelectedHome(null)
    setForm(emptyForm)
    setImageFiles([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let homeId: Id<'homes'>

      if (selectedHome) {
        const updates: Record<string, unknown> = { id: selectedHome._id }
        if (form.title) updates.title = form.title
        if (form.description) updates.description = form.description
        if (form.location) updates.location = form.location
        const price = Number(form.price)
        if (!Number.isNaN(price)) updates.price = price
        const bedrooms = Number(form.bedrooms)
        if (!Number.isNaN(bedrooms)) updates.bedrooms = bedrooms
        const bathrooms = Number(form.bathrooms)
        if (!Number.isNaN(bathrooms)) updates.bathrooms = bathrooms
        if (form.propertyType) updates.propertyType = form.propertyType
        if (form.listingType) updates.listingType = form.listingType
        await updateHome(updates as Parameters<typeof updateHome>[0])
        homeId = selectedHome._id
      } else {
        homeId = await createHome({
          title: form.title,
          description: form.description,
          location: form.location,
          price: Number(form.price),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          propertyType: form.propertyType,
          listingType: form.listingType,
        })
      }

      for (const file of imageFiles) {
        const uploadUrl = await generateUploadUrl()
        const result = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        })
        if (!result.ok) {
          throw new Error(`Upload failed: ${result.status} ${result.statusText}`)
        }
        const { storageId } = await result.json()

        let thumbId: string | undefined
        try {
          const thumbBlob = await resizeImage(file, 400)
          const thumbUrl = await generateUploadUrl()
          const thumbResult = await fetch(thumbUrl, {
            method: 'POST',
            headers: { 'Content-Type': thumbBlob.type },
            body: thumbBlob,
          })
          if (thumbResult.ok) {
            const data = await thumbResult.json()
            thumbId = data.storageId
          }
        } catch {
          // thumbnail generation failed silently — full image still works
        }

        await addImage({ homeId, storageId, thumbId: thumbId as Id<'_storage'> | undefined })
      }

      closeDrawer()
      showToast('success', selectedHome ? 'Property updated' : 'Property created')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteHome({ id: deleteTarget })
      if (selectedHome?._id === deleteTarget) closeDrawer()
      showToast('success', 'Property deleted')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Properties</h1>
          <p className="text-sm text-slate-500">{homes.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => {
                const v = e.target.value
                setSearch(v)
                setFilters((prev) => {
                  const next = { ...prev }
                  if (v.trim()) {
                    next.search = v.trim()
                  } else {
                    delete next.search
                  }
                  return next
                })
              }}
              placeholder="Search..."
              className="w-44 rounded-xl border border-slate-300/60 bg-white/70 py-1.5 pl-9 pr-3 text-sm placeholder-slate-400 shadow-sm backdrop-blur-sm transition-all focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>
          <button
            onClick={openAddDrawer}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-slate-200 transition-all hover:bg-slate-800 active:scale-[0.97]"
          >
            + Add
          </button>
        </div>
      </div>

      {homes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300/60 bg-white/50 p-10 text-center backdrop-blur-sm">
          <p className="text-sm text-slate-400">No properties yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {homes.map((home) => (
            <div
              key={home._id}
              className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm shadow-slate-200/50 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <StorageImage
                  storageId={home.images?.[0]}
                  alt={home.title}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-900">{home.title}</h3>
                    <p className="truncate text-xs text-slate-500">{home.location}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEditDrawer(home)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.97]"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(home._id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition-all hover:bg-red-100 hover:shadow-md active:scale-[0.97]"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                  <span className="font-medium text-slate-900">RWF {home.price.toLocaleString()}</span>
                  <span>{home.bedrooms}bd</span>
                  <span>{home.bathrooms}ba</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
          <div
            className="mx-4 w-full max-w-xs overflow-hidden rounded-2xl bg-white/95 shadow-2xl shadow-slate-900/20 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-6 pb-3 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 9v4M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-900">Delete Property?</p>
              <p className="mt-1 text-xs text-slate-500">This action cannot be undone.</p>
            </div>
            <div className="border-t border-slate-200/60">
              <button
                onClick={confirmDelete}
                className="w-full px-6 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 active:bg-red-100"
              >
                Delete
              </button>
              <div className="border-t border-slate-200/60" />
              <button
                onClick={() => setDeleteTarget(null)}
                className="w-full px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-white/20 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl transition-transform duration-300 sm:max-w-md ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200/60 px-5 py-3.5">
          <h2 className="text-base font-semibold text-slate-900">
            {selectedHome ? 'Edit Property' : 'New Property'}
          </h2>
          <button
            onClick={closeDrawer}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Modern Apartment in Kacyiru"
              className="w-full rounded-xl border border-slate-300/60 bg-white/70 px-3.5 py-2.5 text-sm placeholder-slate-400 shadow-sm backdrop-blur-sm transition-all focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="e.g. Kacyiru, Kigali"
              className="w-full rounded-xl border border-slate-300/60 bg-white/70 px-3.5 py-2.5 text-sm placeholder-slate-400 shadow-sm backdrop-blur-sm transition-all focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Property Type</label>
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300/60 bg-white/70 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm backdrop-blur-sm transition-all focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Listing Type</label>
              <select
                name="listingType"
                value={form.listingType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300/60 bg-white/70 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm backdrop-blur-sm transition-all focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="Rent">For Rent</option>
                <option value="Sale">For Sale</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Price</label>
              <input
                name="price"
                value={form.price || ''}
                onChange={handleChange}
                required
                type="number"
                placeholder="0"
                className="w-full rounded-xl border border-slate-300/60 bg-white/70 px-3.5 py-2.5 text-sm placeholder-slate-400 shadow-sm backdrop-blur-sm transition-all focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Bedrooms</label>
              <input
                name="bedrooms"
                value={form.bedrooms || ''}
                onChange={handleChange}
                required
                type="number"
                placeholder="0"
                className="w-full rounded-xl border border-slate-300/60 bg-white/70 px-3.5 py-2.5 text-sm placeholder-slate-400 shadow-sm backdrop-blur-sm transition-all focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Bathrooms</label>
              <input
                name="bathrooms"
                value={form.bathrooms || ''}
                onChange={handleChange}
                required
                type="number"
                placeholder="0"
                className="w-full rounded-xl border border-slate-300/60 bg-white/70 px-3.5 py-2.5 text-sm placeholder-slate-400 shadow-sm backdrop-blur-sm transition-all focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe the property..."
              className="w-full rounded-xl border border-slate-300/60 bg-white/70 px-3.5 py-2.5 text-sm placeholder-slate-400 shadow-sm backdrop-blur-sm transition-all focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Photos</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
              className="w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100/80 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 file:shadow-sm file:backdrop-blur-sm hover:file:bg-slate-200/80"
            />
            {imageFiles.length > 0 && (
              <div className="mt-1.5 grid grid-cols-6 gap-1.5">
                {imageFiles.map((f, idx) => (
                  <div key={idx} className="overflow-hidden rounded-xl border border-slate-200/60 bg-slate-50/50">
                    <img src={URL.createObjectURL(f)} alt={f.name} className="h-10 w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedHome && selectedHome.images.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-600">Existing Photos</p>
              <div className="grid grid-cols-5 gap-1.5">
                {selectedHome.images.map((storageId, idx) => (
                  <div key={idx} className="group relative overflow-hidden rounded-xl border border-slate-200/60 bg-white/50">
                    <StorageImage storageId={storageId} alt={`Photo ${idx + 1}`} className="h-12 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage({ homeId: selectedHome._id, storageId })}
                      className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 text-[10px] text-white opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 border-t border-slate-200/60 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {saving ? 'Saving…' : selectedHome ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-full border border-slate-300/60 bg-white/50 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white active:scale-[0.97]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
