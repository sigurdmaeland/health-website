'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { ArrowLeft, Lock, AlertTriangle, Check } from 'lucide-react'

export default function SikkerhetPage() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  function checkPasswordStrength(password: string) {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    })
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Validation
    if (passwords.new.length < 8) {
      setMessage({ type: 'error', text: 'Passordet må være minst 8 tegn langt' })
      setLoading(false)
      return
    }

    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'Passordene matcher ikke' })
      setLoading(false)
      return
    }

    try {
      // In production, verify current password first
      await updateProfile({ password: passwords.new })
      
      setMessage({ type: 'success', text: 'Passordet ditt er oppdatert!' })
      setPasswords({ current: '', new: '', confirm: '' })
      
      setTimeout(() => {
        router.push('/konto')
      }, 2000)
    } catch (error: any) {
      console.error('Error changing password:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Kunne ikke endre passord. Prøv igjen.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const isPasswordStrong = Object.values(passwordStrength).filter(Boolean).length >= 4

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/konto/innstillinger"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til Innstillinger
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Sikkerhet</h1>
          <p className="text-gray-600 mt-2">Administrer passordet og sikkerhetsfunksjonene dine</p>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Endre passord</h2>
              <p className="text-sm text-gray-600">Oppdater passordet ditt regelmessig for bedre sikkerhet</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nåværende passord
              </label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nytt passord
              </label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => {
                  setPasswords({ ...passwords, new: e.target.value })
                  checkPasswordStrength(e.target.value)
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
              
              {/* Password Strength Indicator */}
              {passwords.new && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">Passordstyrke:</p>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 text-sm ${passwordStrength.length ? 'text-emerald-600' : 'text-gray-400'}`}>
                      <Check className={`w-4 h-4 ${passwordStrength.length ? 'opacity-100' : 'opacity-30'}`} />
                      Minst 8 tegn
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${passwordStrength.uppercase ? 'text-emerald-600' : 'text-gray-400'}`}>
                      <Check className={`w-4 h-4 ${passwordStrength.uppercase ? 'opacity-100' : 'opacity-30'}`} />
                      En stor bokstav (A-Z)
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${passwordStrength.lowercase ? 'text-emerald-600' : 'text-gray-400'}`}>
                      <Check className={`w-4 h-4 ${passwordStrength.lowercase ? 'opacity-100' : 'opacity-30'}`} />
                      En liten bokstav (a-z)
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${passwordStrength.number ? 'text-emerald-600' : 'text-gray-400'}`}>
                      <Check className={`w-4 h-4 ${passwordStrength.number ? 'opacity-100' : 'opacity-30'}`} />
                      Et tall (0-9)
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${passwordStrength.special ? 'text-emerald-600' : 'text-gray-400'}`}>
                      <Check className={`w-4 h-4 ${passwordStrength.special ? 'opacity-100' : 'opacity-30'}`} />
                      Et spesialtegn (!@#$%)
                    </div>
                  </div>
                  
                  {passwords.new && !isPasswordStrong && (
                    <div className="mt-3 flex items-start gap-2 text-yellow-700 text-sm">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>Passordet ditt bør oppfylle minst 4 av kriteriene ovenfor</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bekreft nytt passord
              </label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg flex items-start gap-3 ${
                message.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <p>{message.text}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || !isPasswordStrong}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Oppdaterer...' : 'Oppdater passord'}
              </button>
              <Link
                href="/konto/innstillinger"
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Avbryt
              </Link>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Sikkerhetstips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Bruk et unikt passord som du ikke bruker på andre nettsteder</li>
                <li>• Endre passordet ditt regelmessig, minst hver 6. måned</li>
                <li>• Ikke del passordet ditt med andre</li>
                <li>• Aktiver tofaktorautentisering når det blir tilgjengelig</li>
                <li>• Bruk en passordbehandler for å lagre passordene dine trygt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
