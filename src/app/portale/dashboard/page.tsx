'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

const umoreEmoji: Record<number, string> = { 1: '😢', 2: '😕', 3: '😐', 4: '🙂', 5: '😊' }
const umoreLabel: Record<number, string> = { 1: 'Triste', 2: 'Non bene', 3: 'Nella norma', 4: 'Di buon umore', 5: 'Molto felice' }
const qLabel: Record<string, string> = { tutto: '✅ Ha mangiato tutto', 'metà': '🟡 Ha mangiato metà', poco: '🟠 Ha mangiato poco', niente: '🔴 Non ha mangiato' }

function getLunedi() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

export default function DashboardParenti() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [parente, setParente] = useState<any>(null)
  const [ospite, setOspite] = useState<any>(null)
  const [note, setNote] = useState<any[]>([])
  const [pasti, setPasti] = useState<any[]>([])
  const [umore, setUmore] = useState<any[]>([])
  const [media, setMedia] = useState<any[]>([])
  const [menu, setMenu] = useState<any[]>([])
  const [tab, setTab] = useState<'diario' | 'pasti' | 'foto' | 'menu'>('diario')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/portale'); return }
      setUser(user)

      // Carica profilo parente
      const { data: parente } = await supabase
        .from('parenti')
        .select('*, parenti_ospiti(ospite:ospiti(*))')
        .eq('user_id', user.id)
        .single()

      if (!parente) { router.push('/portale'); return }
      setParente(parente)

      if (!parente.approvato) { setLoading(false); return }

      const ospiteData = parente.parenti_ospiti?.[0]?.ospite
      if (!ospiteData) { setLoading(false); return }
      setOspite(ospiteData)

      const oggi = new Date().toISOString().split('T')[0]
      const settimana = getLunedi()

      const [noteRes, pastiRes, umoreRes, mediaRes, menuRes] = await Promise.all([
        supabase.from('note').select('*').eq('ospite_id', ospiteData.id).eq('visibile_parenti', true).order('created_at', { ascending: false }).limit(10),
        supabase.from('pasti').select('*').eq('ospite_id', ospiteData.id).eq('data', oggi).order('tipo'),
        supabase.from('umore').select('*').eq('ospite_id', ospiteData.id).order('data', { ascending: false }).limit(7),
        supabase.from('media').select('*').eq('ospite_id', ospiteData.id).order('data', { ascending: false }).limit(12),
        supabase.from('menu_settimanale').select('*').eq('settimana_inizio', settimana),
      ])

      setNote(noteRes.data ?? [])
      setPasti(pastiRes.data ?? [])
      setUmore(umoreRes.data ?? [])
      setMedia(mediaRes.data ?? [])
      setMenu(menuRes.data ?? [])
      setLoading(false)
    }
    init()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/portale')
  }

  const tipoClass: Record<string, string> = {
    clinica: 'badge-warn', generale: 'badge-good', comportamento: 'badge-bad'
  }

  const GIORNI = ['lunedì','martedì','mercoledì','giovedì','venerdì','sabato','domenica']
  const giornoOggi = new Date().toLocaleDateString('it', { weekday: 'long' }).toLowerCase()
  const menuOggi = menu.find(m => m.giorno === giornoOggi)

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-sm text-gray-400">Caricamento...</p>
    </div>
  )

  // NON APPROVATO
  if (parente && !parente.approvato) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-5">
      <div className="card max-w-sm w-full text-center py-10">
        <span className="text-4xl block mb-4">⏳</span>
        <h2 className="text-lg font-medium text-gray-800 mb-2">Richiesta in attesa</h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-5">
          La tua richiesta di accesso è stata ricevuta e sarà approvata dallo staff della struttura al più presto.
          Riceverai una notifica non appena avrai accesso.
        </p>
        <button onClick={logout} className="btn-secondary w-full">Esci</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 px-5 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">Portale Parenti</p>
            <p className="text-xs text-gray-400">ArcaCura</p>
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700">
            <LogOut size={14} /> Esci
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-6">

        {/* CARD OSPITE */}
        {ospite && (
          <div className="card mb-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-xl font-medium flex-shrink-0">
              {ospite.nome[0]}{ospite.cognome[0]}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{ospite.nome} {ospite.cognome}</p>
              {ospite.camera && <p className="text-sm text-gray-400">Camera {ospite.camera}</p>}
              <p className="text-xs text-gray-400 mt-0.5">
                Aggiornato al {new Date().toLocaleDateString('it', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            {/* Umore di oggi */}
            {umore[0] && new Date(umore[0].data).toDateString() === new Date().toDateString() && (
              <div className="text-center flex-shrink-0">
                <span className="text-3xl">{umoreEmoji[umore[0].valore]}</span>
                <p className="text-xs text-gray-400 mt-0.5">{umoreLabel[umore[0].valore]}</p>
              </div>
            )}
          </div>
        )}

        {/* PASTI OGGI (card riepilogativa in cima) */}
        {pasti.length > 0 && (
          <div className="card mb-5 bg-teal-50 border-teal-100">
            <p className="text-xs font-medium text-teal-700 mb-2">🍽️ Pasti di oggi</p>
            <div className="flex flex-wrap gap-3">
              {pasti.map(p => (
                <div key={p.id} className="flex-1 min-w-[120px]">
                  <p className="text-xs text-teal-600 font-medium capitalize">{p.tipo}</p>
                  <p className="text-xs text-teal-700">{qLabel[p.quantita] ?? p.quantita}</p>
                  {p.cosa_ha_mangiato && <p className="text-xs text-teal-500 mt-0.5">{p.cosa_ha_mangiato}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="flex border-b border-gray-200 mb-5">
          {([
            { k: 'diario',  label: 'Diario' },
            { k: 'pasti',   label: 'Pasti' },
            { k: 'foto',    label: 'Foto' },
            { k: 'menu',    label: 'Menu sett.' },
          ] as const).map(({ k, label }) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-2 text-sm border-b-2 transition-colors ${tab === k ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* DIARIO */}
        {tab === 'diario' && (
          <div className="space-y-3">
            {note.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Nessuna nota disponibile.</p>
            ) : note.map(n => (
              <div key={n.id} className="card">
                <div className="flex items-center gap-2 mb-2">
                  <span className={tipoClass[n.tipo] ?? 'badge-good'}>{n.tipo}</span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(n.created_at).toLocaleDateString('it', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{n.contenuto}</p>
              </div>
            ))}
          </div>
        )}

        {/* PASTI */}
        {tab === 'pasti' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 mb-1">Storico pasti degli ultimi giorni</p>
            {pasti.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Nessun pasto registrato oggi.</p>
            ) : pasti.map(p => (
              <div key={p.id} className="card">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-800 capitalize">{p.tipo}</p>
                  <p className="text-xs text-gray-400">{new Date(p.data).toLocaleDateString('it')}</p>
                </div>
                <p className="text-sm text-gray-600">{qLabel[p.quantita] ?? p.quantita}</p>
                {p.cosa_ha_mangiato && <p className="text-xs text-gray-400 mt-1">{p.cosa_ha_mangiato}</p>}
                {p.note && <p className="text-xs text-amber-600 mt-1">📌 {p.note}</p>}
              </div>
            ))}
          </div>
        )}

        {/* FOTO */}
        {tab === 'foto' && (
          <div>
            {media.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Nessuna foto disponibile.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {media.map(m => (
                  <div key={m.id}>
                    <img src={m.url} alt={m.didascalia ?? ''} className="w-full aspect-square object-cover rounded-xl" />
                    {m.didascalia && <p className="text-xs text-gray-400 mt-1 truncate">{m.didascalia}</p>}
                    <p className="text-xs text-gray-300">{new Date(m.data).toLocaleDateString('it')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MENU */}
        {tab === 'menu' && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 mb-3">Menu della settimana corrente</p>
            {menu.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Menu non ancora pubblicato.</p>
            ) : GIORNI.map(g => {
              const r = menu.find(m => m.giorno === g)
              const isOggi = g === giornoOggi
              return (
                <div key={g} className={`card ${isOggi ? 'ring-2 ring-teal-500' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-medium text-gray-800 capitalize">{g}</p>
                    {isOggi && <span className="badge-good">Oggi</span>}
                  </div>
                  {r ? (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><p className="text-gray-400 mb-1">Colazione</p><p className="text-gray-600">{r.colazione || '—'}</p></div>
                      <div>
                        <p className="text-gray-400 mb-1">Pranzo</p>
                        <p className="text-gray-600">{r.pranzo_primo || '—'}</p>
                        {r.pranzo_secondo && <p className="text-gray-500">{r.pranzo_secondo}</p>}
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Cena</p>
                        <p className="text-gray-600">{r.cena_primo || '—'}</p>
                        {r.cena_secondo && <p className="text-gray-500">{r.cena_secondo}</p>}
                      </div>
                    </div>
                  ) : <p className="text-xs text-gray-300">Non disponibile</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
