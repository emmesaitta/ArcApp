'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const oggi = new Date().toISOString().split('T')[0]
const qBarFilled: Record<string, number> = { tutto: 4, 'metà': 2, poco: 1, niente: 0 }
const qBadge: Record<string, string> = { tutto: 'badge-good', 'metà': 'badge-warn', poco: 'badge-bad', niente: 'badge-bad' }

export default function PastiPage() {
  const [pasti, setPasti] = useState<any[]>([])
  const [ospiti, setOspiti] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState('pranzo')
  const [form, setForm] = useState({ ospite_id: '', tipo: 'pranzo', cosa_ha_mangiato: '', quantita: 'tutto', note: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [pastiRes, ospitiRes] = await Promise.all([
      supabase.from('pasti').select('*, ospite:ospiti(id,nome,cognome)').eq('data', oggi).order('created_at', { ascending: false }),
      supabase.from('ospiti').select('id,nome,cognome').eq('attivo', true).order('cognome'),
    ])
    setPasti(pastiRes.data ?? [])
    setOspiti(ospitiRes.data ?? [])
    setLoading(false)
  }

  async function salvaPasto(e: React.FormEvent) {
    e.preventDefault()
    if (!form.ospite_id) return
    setSaving(true)
    await supabase.from('pasti').insert([{ ...form, data: oggi }])
    setForm({ ospite_id: '', tipo: 'pranzo', cosa_ha_mangiato: '', quantita: 'tutto', note: '' })
    setSaving(false)
    loadAll()
  }

  const pastiFiltrati = pasti.filter(p => !filtroTipo || p.tipo === filtroTipo)

  if (loading) return <div className="text-sm text-gray-400 mt-8">Caricamento...</div>

  return (
    <div>
      <div className="mb-5">
        <h1 className="page-title">Pasti</h1>
        <p className="page-subtitle">{new Date().toLocaleDateString('it', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })}</p>
      </div>

      {/* Form */}
      <div className="card mb-5">
        <p className="text-sm font-medium text-gray-800 mb-3">Registra pasto</p>
        <form onSubmit={salvaPasto}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="form-label">Ospite *</label>
              <select required className="form-input" value={form.ospite_id} onChange={e => setForm({...form, ospite_id: e.target.value})}>
                <option value="">Seleziona...</option>
                {ospiti.map(o => <option key={o.id} value={o.id}>{o.nome} {o.cognome}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Pasto</label>
              <select className="form-input" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                <option value="colazione">Colazione</option>
                <option value="pranzo">Pranzo</option>
                <option value="cena">Cena</option>
                <option value="spuntino">Spuntino</option>
              </select>
            </div>
            <div>
              <label className="form-label">Quantità</label>
              <select className="form-input" value={form.quantita} onChange={e => setForm({...form, quantita: e.target.value})}>
                <option value="tutto">Tutto</option>
                <option value="metà">Metà</option>
                <option value="poco">Poco</option>
                <option value="niente">Niente</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="form-label">Cosa ha mangiato</label>
              <input className="form-input" value={form.cosa_ha_mangiato} onChange={e => setForm({...form, cosa_ha_mangiato: e.target.value})} placeholder="es. Pasta al pomodoro, pollo..." />
            </div>
            <div>
              <label className="form-label">Note</label>
              <input className="form-input" value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Difficoltà, rifiuto, altro..." />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Salvo...' : 'Salva pasto'}</button>
        </form>
      </div>

      {/* Filtro */}
      <div className="flex gap-2 mb-4">
        {['colazione','pranzo','cena','spuntino'].map(t => (
          <button key={t} onClick={() => setFiltroTipo(filtroTipo === t ? '' : t)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${filtroTipo === t ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t}
          </button>
        ))}
        <button onClick={() => setFiltroTipo('')} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${!filtroTipo ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          Tutti
        </button>
      </div>

      {/* Tabella */}
      <div className="card">
        {pastiFiltrati.length === 0 ? (
          <p className="text-sm text-gray-400">Nessun pasto registrato.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium pb-2 pr-4">Ospite</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2 pr-4">Pasto</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2 pr-4">Cosa ha mangiato</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2 pr-4">Quantità</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Ora</th>
              </tr>
            </thead>
            <tbody>
              {pastiFiltrati.map(p => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 pr-4">
                    <Link href={`/ospiti/${p.ospite_id}`} className="hover:text-teal-600 font-medium">
                      {p.ospite?.nome} {p.ospite?.cognome}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 capitalize text-gray-600">{p.tipo}</td>
                  <td className="py-2.5 pr-4 text-gray-500 max-w-xs truncate">{p.cosa_ha_mangiato || '—'}</td>
                  <td className="py-2.5 pr-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-0.5">
                        {[1,2,3,4].map(v => (
                          <div key={v} className={`w-3 h-1.5 rounded-sm ${v <= (qBarFilled[p.quantita] ?? 0) ? 'bg-teal-600' : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <span className={qBadge[p.quantita] ?? 'badge-good'}>{p.quantita}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-gray-400 text-xs">{new Date(p.created_at).toLocaleTimeString('it',{hour:'2-digit',minute:'2-digit'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
