'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const oggi = new Date().toISOString().split('T')[0]

const tipoClass: Record<string, string> = {
  clinica: 'badge-warn', generale: 'badge-good', comportamento: 'badge-bad'
}

export default function NotePage() {
  const [note, setNote] = useState<any[]>([])
  const [ospiti, setOspiti] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroOspite, setFiltroOspite] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [form, setForm] = useState({ ospite_id: '', tipo: 'generale', contenuto: '', visibile_parenti: true })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [noteRes, ospitiRes] = await Promise.all([
      supabase.from('note').select('*, ospite:ospiti(id,nome,cognome)').eq('data', oggi).order('created_at', { ascending: false }),
      supabase.from('ospiti').select('id,nome,cognome').eq('attivo', true).order('cognome'),
    ])
    setNote(noteRes.data ?? [])
    setOspiti(ospitiRes.data ?? [])
    setLoading(false)
  }

  async function salvaNota(e: React.FormEvent) {
    e.preventDefault()
    if (!form.ospite_id || !form.contenuto.trim()) return
    setSaving(true)
    await supabase.from('note').insert([{ ...form, data: oggi }])
    setForm({ ospite_id: '', tipo: 'generale', contenuto: '', visibile_parenti: true })
    setSaving(false)
    loadAll()
  }

  const noteFiltrate = note.filter(n => {
    const ospiteMatch = !filtroOspite || n.ospite_id === filtroOspite
    const tipoMatch = !filtroTipo || n.tipo === filtroTipo
    return ospiteMatch && tipoMatch
  })

  if (loading) return <div className="text-sm text-gray-400 mt-8">Caricamento...</div>

  return (
    <div>
      <div className="mb-5">
        <h1 className="page-title">Note del giorno</h1>
        <p className="page-subtitle">{new Date().toLocaleDateString('it', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })}</p>
      </div>

      {/* Form */}
      <div className="card mb-5">
        <p className="text-sm font-medium text-gray-800 mb-3">Nuova nota</p>
        <form onSubmit={salvaNota}>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="form-label">Ospite *</label>
              <select required className="form-input" value={form.ospite_id} onChange={e => setForm({...form, ospite_id: e.target.value})}>
                <option value="">Seleziona ospite...</option>
                {ospiti.map(o => <option key={o.id} value={o.id}>{o.nome} {o.cognome}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Tipo</label>
              <select className="form-input" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                <option value="generale">Generale</option>
                <option value="clinica">Clinica</option>
                <option value="comportamento">Comportamento</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-500 mb-2 cursor-pointer">
                <input type="checkbox" checked={form.visibile_parenti} onChange={e => setForm({...form, visibile_parenti: e.target.checked})} />
                Visibile parenti
              </label>
            </div>
          </div>
          <textarea required className="form-input mb-3" rows={3} placeholder="Scrivi la nota..." value={form.contenuto} onChange={e => setForm({...form, contenuto: e.target.value})} />
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Salvo...' : 'Aggiungi nota'}</button>
        </form>
      </div>

      {/* Filtri */}
      <div className="flex gap-3 mb-4">
        <select className="form-input max-w-[200px]" value={filtroOspite} onChange={e => setFiltroOspite(e.target.value)}>
          <option value="">Tutti gli ospiti</option>
          {ospiti.map(o => <option key={o.id} value={o.id}>{o.nome} {o.cognome}</option>)}
        </select>
        <select className="form-input max-w-[160px]" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
          <option value="">Tutti i tipi</option>
          <option value="generale">Generale</option>
          <option value="clinica">Clinica</option>
          <option value="comportamento">Comportamento</option>
        </select>
      </div>

      {/* Note */}
      <div className="card">
        {noteFiltrate.length === 0 ? (
          <p className="text-sm text-gray-400">Nessuna nota per oggi.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {noteFiltrate.map(n => (
              <div key={n.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/ospiti/${n.ospite_id}`} className="text-sm font-medium text-gray-800 hover:text-teal-600">
                    {n.ospite?.nome} {n.ospite?.cognome}
                  </Link>
                  <span className={tipoClass[n.tipo] ?? 'badge-good'}>{n.tipo}</span>
                  <span className="text-xs text-gray-400 ml-auto">{new Date(n.created_at).toLocaleTimeString('it', { hour:'2-digit', minute:'2-digit' })}</span>
                  {!n.visibile_parenti && <span className="text-xs text-gray-300 italic">solo staff</span>}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{n.contenuto}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
