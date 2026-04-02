'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GestionalePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errore, setErrore] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrore('')

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      router.push('/ospiti')
    } else {
      setErrore('Email o password non corretti.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🏥</div>
          <h1 className="text-xl font-semibold text-gray-900">Accesso Staff</h1>
          <p className="text-sm text-gray-400 mt-1">Elisir · ArcaCura</p>
        </div>
        <div className="card">
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="form-label">Email</label>
              <input required type="email" className="form-input" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="la-tua@email.it" />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input required type="password" className="form-input" value={password}
                onChange={e => setPassword(e.target.value)} />
            </div>
            {errore && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errore}</p>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full !py-2.5">
              {loading ? 'Accesso...' : 'Accedi al gestionale'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-300 mt-4">Area riservata al personale autorizzato</p>
      </div>
    </div>
  )
}
