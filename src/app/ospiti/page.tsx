'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Ospite } from '@/lib/types'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

export default function OspitiPage() {
  const [ospiti, setOspiti] = useState<Ospite[]>([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome: '', cognome: '', camera: '', data_nascita: '', note_generali: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadOspiti() }, [])

  async function loadOspiti() {
    const { data } = await supabase.from('ospiti').select('*').eq('attivo', true).order('cognome')
    setOspiti(data ?? [])
    setLoading(false)
  }

  async function salvaOspite(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('ospiti').insert([{ ...form, attivo: true }])
    setForm({ nome: '', cognome: '', camera: '', data_nascita: '', note_generali: '' })
    setShowForm(false)
    setSaving(false)
    loadOspiti()
  }

  const filtrati = ospiti.filter(o =>
    `${o.nome} ${o.cognome} ${o.camera}`.toLowerCase().includes(filtro.toLowerCase())
  )

  function iniziali(o: Ospite) { return (o.nome[0] + o.cognome[0]).toUpperCase() }

  function eta(data: string | null) {
    if (!data) return '—'
    return new Date().getFullYear() - new Date(data).getFullYear() + ' anni'
  }

  if (loading) return <div className="text-sm text-gray-400 mt-8">Caricamento...</div>

  return (
    <div>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="page-title">Ospiti</h1>
          <p className="page-subtitle">{ospiti.length} residenti attivi</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Nuovo ospite
        </button>
      </div>

      {/* Form nuovo ospite */}
      {showForm && (
        <div className="card mb-5">
          <p className="text-sm font-medium text-gray-800 mb-3">Nuovo ospite</p>
          <form onSubmit={salvaOspite} className="grid grid-cols-2 gap-3">
            <div><label className="form-label">Nome *</label><input required className="form-input" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} /></div>
            <div><label className="form-label">Cognome *</label><input required className="form-input" value={form.cognome} onChange={e => setForm({...form, cognome: e.target.value})} /></div>
            <div><label className="form-label">Camera</label><input className="form-input" value={form.camera} onChange={e => setForm({...form, camera: e.target.value})} placeholder="es. 101" /></div>
            <div><label className="form-label">Data di nascita</label><input type="date" className="form-input" value={form.data_nascita} onChange={e => setForm({...form, data_nascita: e.target.value})} /></div>
            <div className="col-span-2"><label className="form-label">Note generali</label><textarea className="form-input" rows={2} value={form.note_generali} onChange={e => setForm({...form, note_generali: e.target.value})} placeholder="Allergie, esigenze particolari..." /></div>
            <div className="col-span-2 flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annulla</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Salvo...' : 'Salva ospite'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Ricerca */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="form-input pl-8"
          placeholder="Cerca per nome o camera..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
        />
      </div>

      {/* Griglia ospiti */}
      {filtrati.length === 0 ? (
        <p className="text-sm text-gray-400">Nessun ospite trovato.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtrati.map(o => (
            <Link key={o.id} href={`/ospiti/${o.id}`} className="card hover:border-teal-500 hover:shadow-sm transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-sm font-medium mb-2">
                {iniziali(o)}
              </div>
              <p className="text-sm font-medium text-gray-900">{o.nome} {o.cognome}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {o.camera ? `Camera ${o.camera}` : 'Camera n.d.'} · {eta(o.data_nascita)}
              </p>
              {o.note_generali && (
                <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{o.note_generali}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
