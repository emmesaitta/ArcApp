'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PortalePage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'err', testo: string } | null>(null)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({
    email: '', password: '', conferma: '',
    nome: '', cognome: '', telefono: '', relazione: '',
    codice_ospite: ''
  })

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    })
    if (error) {
      setMsg({ tipo: 'err', testo: 'Email o password non corretti.' })
    } else {
      router.push('/portale/dashboard')
    }
    setLoading(false)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    if (regForm.password !== regForm.conferma) {
      setMsg({ tipo: 'err', testo: 'Le password non coincidono.' })
      setLoading(false)
      return
    }
    if (regForm.password.length < 6) {
      setMsg({ tipo: 'err', testo: 'La password deve avere almeno 6 caratteri.' })
      setLoading(false)
      return
    }

    // Verifica che il codice ospite esista
    const { data: ospite } = await supabase
      .from('ospiti')
      .select('id, nome, cognome')
      .eq('id', regForm.codice_ospite.trim())
      .eq('attivo', true)
      .single()

    if (!ospite) {
      setMsg({ tipo: 'err', testo: 'Codice ospite non valido. Contatta la struttura per ottenerlo.' })
      setLoading(false)
      return
    }

    // Crea account Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: regForm.email,
      password: regForm.password,
      options: { data: { nome: regForm.nome, cognome: regForm.cognome } }
    })

    if (authError || !authData.user) {
      setMsg({ tipo: 'err', testo: authError?.message ?? 'Errore durante la registrazione.' })
      setLoading(false)
      return
    }

    // Crea profilo parente
    const { data: parente } = await supabase.from('parenti').insert([{
      user_id: authData.user.id,
      nome: regForm.nome,
      cognome: regForm.cognome,
      telefono: regForm.telefono,
      relazione: regForm.relazione,
      approvato: false,
    }]).select().single()

    if (parente) {
      // Collega parente all'ospite
      await supabase.from('parenti_ospiti').insert([{
        parente_id: parente.id,
        ospite_id: ospite.id,
      }])
    }

    setMsg({
      tipo: 'ok',
      testo: `Registrazione completata! La tua richiesta di accesso per ${ospite.nome} ${ospite.cognome} è in attesa di approvazione da parte dello staff. Riceverai una conferma appena possibile.`
    })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 px-5 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-teal-600">← ArcaCura</Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🏠</div>
            <h1 className="text-xl font-semibold text-gray-900">Portale Parenti</h1>
            <p className="text-sm text-gray-400 mt-1">ArcaCura · Casa di Riposo</p>
          </div>

          {/* Toggle login/registra */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
            <button onClick={() => { setMode('login'); setMsg(null) }}
              className={`flex-1 py-2 text-sm rounded-lg transition-all ${mode === 'login' ? 'bg-white text-gray-800 shadow-sm font-medium' : 'text-gray-400'}`}>
              Accedi
            </button>
            <button onClick={() => { setMode('register'); setMsg(null) }}
              className={`flex-1 py-2 text-sm rounded-lg transition-all ${mode === 'register' ? 'bg-white text-gray-800 shadow-sm font-medium' : 'text-gray-400'}`}>
              Registrati
            </button>
          </div>

          {/* Messaggi */}
          {msg && (
            <div className={`mb-4 p-3 rounded-xl text-sm leading-relaxed ${msg.tipo === 'ok' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {msg.testo}
            </div>
          )}

          <div className="card">

            {/* LOGIN */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="form-label">Email</label>
                  <input required type="email" className="form-input" value={loginForm.email}
                    onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="la-tua@email.it" />
                </div>
                <div>
                  <label className="form-label">Password</label>
                  <input required type="password" className="form-input" value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full !py-2.5 mt-1">
                  {loading ? 'Accesso in corso...' : 'Accedi al portale'}
                </button>
              </form>
            )}

            {/* REGISTRAZIONE */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Nome *</label>
                    <input required className="form-input" value={regForm.nome} onChange={e => setRegForm({ ...regForm, nome: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Cognome *</label>
                    <input required className="form-input" value={regForm.cognome} onChange={e => setRegForm({ ...regForm, cognome: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input required type="email" className="form-input" value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} placeholder="la-tua@email.it" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Password *</label>
                    <input required type="password" className="form-input" value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Conferma password *</label>
                    <input required type="password" className="form-input" value={regForm.conferma} onChange={e => setRegForm({ ...regForm, conferma: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Telefono</label>
                    <input type="tel" className="form-input" value={regForm.telefono} onChange={e => setRegForm({ ...regForm, telefono: e.target.value })} placeholder="es. 333 1234567" />
                  </div>
                  <div>
                    <label className="form-label">Relazione con l'ospite</label>
                    <select className="form-input" value={regForm.relazione} onChange={e => setRegForm({ ...regForm, relazione: e.target.value })}>
                      <option value="">Seleziona...</option>
                      <option>Figlio/a</option>
                      <option>Coniuge</option>
                      <option>Fratello/Sorella</option>
                      <option>Nipote</option>
                      <option>Altro</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Codice ospite * <span className="text-gray-300 font-normal">(fornito dalla struttura)</span></label>
                  <input required className="form-input font-mono" value={regForm.codice_ospite}
                    onChange={e => setRegForm({ ...regForm, codice_ospite: e.target.value })}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                  <p className="text-xs text-gray-400 mt-1">Contattaci al 091 123 4567 per ricevere il codice del tuo caro.</p>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full !py-2.5 mt-1">
                  {loading ? 'Registrazione...' : 'Invia richiesta di accesso'}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
