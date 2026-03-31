'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const today = new Date().toISOString().split('T')[0]

export default function Dashboard() {
  const [stats, setStats] = useState({ ospiti: 0, note: 0, pasti: 0, parenti: 0 })
  const [note, setNote] = useState<any[]>([])
  const [umore, setUmore] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [ospRes, noteRes, pastiRes, parentiRes, umoreRes] = await Promise.all([
        supabase.from('ospiti').select('id', { count: 'exact' }).eq('attivo', true),
        supabase.from('note').select('id, tipo, contenuto, data, ospite:ospiti(nome,cognome)').eq('data', today).order('created_at', { ascending: false }).limit(5),
        supabase.from('pasti').select('id', { count: 'exact' }).eq('data', today),
        supabase.from('parenti').select('id', { count: 'exact' }).eq('approvato', false),
        supabase.from('umore').select('valore, nota, ospite:ospiti(nome,cognome)').eq('data', today).order('created_at', { ascending: false }).limit(6),
      ])
      setStats({
        ospiti: ospRes.count ?? 0,
        note: noteRes.data?.length ?? 0,
        pasti: pastiRes.count ?? 0,
        parenti: parentiRes.count ?? 0,
      })
      setNote(noteRes.data ?? [])
      setUmore(umoreRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const giorni = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato']
  const dataOggi = new Date()
  const dataLabel = `${giorni[dataOggi.getDay()]} ${dataOggi.getDate()} ${dataOggi.toLocaleString('it',{month:'long'})} ${dataOggi.getFullYear()}`

  const umoreEmoji: Record<number, string> = { 1:'😢', 2:'😕', 3:'😐', 4:'🙂', 5:'😊' }
  const tipoClass: Record<string, string> = {
    clinica: 'badge-warn', generale: 'badge-good', comportamento: 'badge-bad'
  }

  if (loading) return <div className="text-sm text-gray-400 mt-8">Caricamento...</div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Buongiorno</h1>
        <p className="page-subtitle capitalize">{dataLabel}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Ospiti presenti', value: stats.ospiti, sub: 'residenti attivi', link: '/ospiti' },
          { label: 'Note oggi', value: stats.note, sub: 'inserite oggi', link: '/note' },
          { label: 'Pasti registrati', value: stats.pasti, sub: 'di oggi', link: '/pasti' },
          { label: 'Parenti in attesa', value: stats.parenti, sub: 'da approvare', link: '/parenti' },
        ].map(s => (
          <Link key={s.label} href={s.link} className="card hover:shadow-sm transition-shadow">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-3xl font-medium text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Note recenti */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-800">Note di oggi</p>
            <Link href="/note" className="text-xs text-teal-600 hover:underline">Vedi tutte</Link>
          </div>
          {note.length === 0 ? (
            <p className="text-sm text-gray-400">Nessuna nota inserita oggi.</p>
          ) : (
            <div className="space-y-3">
              {note.map((n: any) => (
                <div key={n.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-700">
                      {n.ospite?.nome} {n.ospite?.cognome}
                    </span>
                    <span className={tipoClass[n.tipo] ?? 'badge-good'}>{n.tipo}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{n.contenuto}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Umore */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-800">Umore odierno</p>
          </div>
          {umore.length === 0 ? (
            <p className="text-sm text-gray-400">Nessun umore registrato oggi.</p>
          ) : (
            <div className="space-y-2">
              {umore.map((u: any, i: number) => (
                <div key={i} className="flex items-center gap-3 py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-xl">{umoreEmoji[u.valore]}</span>
                  <span className="flex-1 text-sm text-gray-700">
                    {u.ospite?.nome} {u.ospite?.cognome}
                  </span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(v => (
                      <div key={v} className={`w-2.5 h-2.5 rounded-full ${v <= u.valore ? 'bg-teal-600' : 'bg-gray-200'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
