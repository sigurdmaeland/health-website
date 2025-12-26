'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { ArrowLeft, Bell, Globe, Mail, Shield, Save } from 'lucide-react'

export default function InnstillingerPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [settings, setSettings] = useState({
    emailNotifications: {
      orderUpdates: true,
      promotions: true,
      newsletter: false,
      productRecommendations: true
    },
    language: 'no',
    currency: 'NOK'
  })

  useEffect(() => {
    if (!user) {
      router.push('/konto')
      return
    }
    // Load settings from localStorage or API
    loadSettings()
  }, [user, router])

  function loadSettings() {
    const saved = localStorage.getItem(`settings_${user?.id}`)
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      // Save to localStorage (in production, save to database)
      localStorage.setItem(`settings_${user?.id}`, JSON.stringify(settings))
      
      setMessage({ type: 'success', text: 'Innstillingene er lagret!' })
      
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Noe gikk galt. Prøv igjen.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/konto"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til Min konto
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Innstillinger</h1>
          <p className="text-gray-600 mt-2">Tilpass din brukeropplevelse</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Email Notifications */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-emerald-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">E-postvarsler</h2>
                <p className="text-sm text-gray-600">Velg hvilke varsler du vil motta</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Ordreoppdateringer</p>
                  <p className="text-sm text-gray-600">Få varsler om ordrestatus og leveringer</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications.orderUpdates}
                  onChange={(e) => setSettings({
                    ...settings,
                    emailNotifications: {
                      ...settings.emailNotifications,
                      orderUpdates: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Kampanjer og tilbud</p>
                  <p className="text-sm text-gray-600">Motta informasjon om salg og spesialtilbud</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications.promotions}
                  onChange={(e) => setSettings({
                    ...settings,
                    emailNotifications: {
                      ...settings.emailNotifications,
                      promotions: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Nyhetsbrev</p>
                  <p className="text-sm text-gray-600">Ukentlig nyhetsbrev med tips og nyheter</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications.newsletter}
                  onChange={(e) => setSettings({
                    ...settings,
                    emailNotifications: {
                      ...settings.emailNotifications,
                      newsletter: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Produktanbefalinger</p>
                  <p className="text-sm text-gray-600">Personaliserte produktforslag basert på dine interesser</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications.productRecommendations}
                  onChange={(e) => setSettings({
                    ...settings,
                    emailNotifications: {
                      ...settings.emailNotifications,
                      productRecommendations: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-emerald-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Språk og region</h2>
                <p className="text-sm text-gray-600">Velg ditt foretrukne språk og valuta</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Språk</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="no">Norsk</option>
                  <option value="en">English</option>
                  <option value="sv">Svenska</option>
                  <option value="da">Dansk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valuta</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="NOK">NOK - Norske kroner</option>
                  <option value="SEK">SEK - Svenska kronor</option>
                  <option value="DKK">DKK - Danske kroner</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - US Dollar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-emerald-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Personvern og sikkerhet</h2>
                <p className="text-sm text-gray-600">Administrer dine personverninnstillinger</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/konto/sikkerhet"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Endre passord</p>
                    <p className="text-sm text-gray-600">Oppdater ditt passord</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Tofaktorautentisering (2FA)</p>
                    <p className="text-sm text-gray-600 mb-3">
                      Legg til et ekstra sikkerhetslag til kontoen din
                    </p>
                    <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Kommer snart
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Lagrer...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Lagre innstillinger
                </>
              )}
            </button>
            <Link
              href="/konto"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Avbryt
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
