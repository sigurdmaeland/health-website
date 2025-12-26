'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { MapPin, Plus, Edit2, Trash2, ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'

interface Address {
  id: string
  address_type: 'shipping' | 'billing' | 'both'
  is_default: boolean
  first_name: string
  last_name: string
  company: string
  address_line1: string
  address_line2: string
  postal_code: string
  city: string
  country: string
  phone: string
}

export default function AdresserPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Address>>({
    address_type: 'both',
    is_default: false,
    first_name: '',
    last_name: '',
    company: '',
    address_line1: '',
    address_line2: '',
    postal_code: '',
    city: '',
    country: 'Norge',
    phone: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/konto')
      return
    }
    loadAddresses()
  }, [user, router])

  async function loadAddresses() {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setAddresses(data || [])
    } catch (error) {
      console.error('Error loading addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      if (editingId) {
        // Update existing address
        const { error } = await supabase
          .from('user_addresses')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        // Create new address
        const { error } = await supabase
          .from('user_addresses')
          .insert([{ ...formData, user_id: user?.id }])

        if (error) throw error
      }

      // Reset form and reload
      setShowForm(false)
      setEditingId(null)
      setFormData({
        address_type: 'both',
        is_default: false,
        first_name: '',
        last_name: '',
        company: '',
        address_line1: '',
        address_line2: '',
        postal_code: '',
        city: '',
        country: 'Norge',
        phone: ''
      })
      loadAddresses()
    } catch (error) {
      console.error('Error saving address:', error)
      alert('Noe gikk galt. Prøv igjen.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette denne adressen?')) return

    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadAddresses()
    } catch (error) {
      console.error('Error deleting address:', error)
      alert('Kunne ikke slette adressen. Prøv igjen.')
    }
  }

  async function handleSetDefault(id: string) {
    try {
      // First, unset all defaults
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id)

      // Then set the selected one as default
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', id)

      if (error) throw error
      loadAddresses()
    } catch (error) {
      console.error('Error setting default:', error)
    }
  }

  function startEdit(address: Address) {
    setFormData(address)
    setEditingId(address.id)
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/konto"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til Min konto
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mine adresser</h1>
              <p className="text-gray-600 mt-2">Administrer dine lagrede adresser</p>
            </div>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingId(null)
                setFormData({
                  address_type: 'both',
                  is_default: false,
                  first_name: '',
                  last_name: '',
                  company: '',
                  address_line1: '',
                  address_line2: '',
                  postal_code: '',
                  city: '',
                  country: 'Norge',
                  phone: ''
                })
              }}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ny adresse
            </button>
          </div>
        </div>

        {/* Address Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Rediger adresse' : 'Legg til ny adresse'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fornavn *</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Etternavn *</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firma (valgfritt)</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                <input
                  type="text"
                  required
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent mb-3"
                  placeholder="Gateadresse"
                />
                <input
                  type="text"
                  value={formData.address_line2}
                  onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Leilighet, suite, etc. (valgfritt)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postnummer *</label>
                  <input
                    type="text"
                    required
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">By *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adressetype</label>
                <select
                  value={formData.address_type}
                  onChange={(e) => setFormData({ ...formData, address_type: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="both">Både levering og fakturering</option>
                  <option value="shipping">Kun leveringsadresse</option>
                  <option value="billing">Kun fakturaadresse</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="is_default" className="text-sm font-medium text-gray-700">
                  Sett som standardadresse
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700"
                >
                  {editingId ? 'Oppdater adresse' : 'Lagre adresse'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        {addresses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingen adresser lagt til</h3>
            <p className="text-gray-600 mb-6">Legg til din første adresse for raskere utsjekkinger</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Legg til adresse
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-xl shadow-sm p-6 relative">
                {address.is_default && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                      Standard
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {address.first_name} {address.last_name}
                  </h3>
                  {address.company && (
                    <p className="text-sm text-gray-600">{address.company}</p>
                  )}
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p>{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  <p>{address.postal_code} {address.city}</p>
                  <p>{address.country}</p>
                  {address.phone && <p>Tlf: {address.phone}</p>}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="flex-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Sett som standard
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(address)}
                    className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
