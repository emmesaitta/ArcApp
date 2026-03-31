'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const umoreEmoji: Record<number, string> = { 1:'😢', 2:'😕', 3:'😐', 4:'🙂', 5:'😊' }
const oggi = new Date().toISOString().split('T')[0]

export default function SchedaOspite() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [ospite, setOspite] = useState<any>(null)
  const [tab, setTab] = useState<'note'|'pasti'|'umore'|'foto'>('note')
  const [note, setNote] = useState<any[]>([])
  const [pasti, setPasti] = useState<any[]>([])
  const [umore, setUmore] = useState<any[]>([])
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [nota, setNota] = useState({ tipo: 'generale', contenuto: '', visibile_parenti: true })
  const [pasto, setPasto] = useState({ tipo: 'pranzo', cosa_ha_mangiato: '', quantita: 'tutto', note: '' })
  const [umoreForm, setUmoreForm] = useState({ valore: 3, nota: '' })
  const [saving, setSaving] = useState(false)
  const [fotoCaption, setFotoCaption] = useState('')

  useEffect(() => { loadAll() }, [id])

  async function loadAll() {
    const [ospRes, noteRes, pastiRes, umoreRes, mediaRes] = await Promise.all([
      supabase.from('ospiti').select('*').eq('id', id).single(),
      supabase.from('note').select('*').eq('ospite_id', id).order('created_at', { ascending: false }).limit(20),
      supabase.from('pasti').select('*').eq('ospite_id', id).order('data', { ascending: false }).limit(20),
      supabase.from('umore').select('*').eq('ospite_id', id).order('data', { ascending: false }).limit(14),
      supabase.from('media').select('*').eq('ospite_id', id).order('data', { ascending: false }).limit(20),
    ])
    setOspite(ospRes.data)
    setNote(noteRes.data ?? [])
    setPasti(pastiRes.data ?? [])
    setUmore(umoreRes.data ?? [])
    setMedia(mediaRes.data ?? [])
    setLoading(false)
  }

  async function salvaNota(e: React.FormEvent) {
    e.preventDefault()
    if (!nota.contenuto.trim()) return
    setSaving(true)
    await supabase.from('note').insert([{ ...nota, ospite_id: id, data: oggi }])
    setNota({ tipo: 'generale', contenuto: '', visibile_parenti: true })
    setSaving(false)
    loadAll()
  }

  async function salvaPasto(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('pasti').insert([{ ...pasto, ospite_id: id, data: oggi }])
    setPasto({ tipo: 'pranzo', cosa_ha_mangiato: '', quantita: 'tutto', note: '' })
    setSaving(false)
    loadAll()
  }

  async function salvaUmore(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('umore').insert([{ ...umoreForm, ospite_id: id, data: oggi }])
    setUmoreForm({ valore: 3, nota: '' })
    setSaving(false)
    loadAll()
  }

  async function uploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !ospite) return
    setSaving(true)
    const path = `${id}/${Date.now()}_${file.name}`
    const { data: upload } = await supabase.storage.from('media').upload(path, file)
    if (upload) {
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(path)
      await supabase.from('media').insert([{
        ospite_id: id, url: urlData.publicUrl,
        tipo: 'foto', didascalia: fotoCaption, data: oggi
      }])
      setFotoCaption('')
      loadAll()
    }
    setSaving(false)
  }

  function eta(data: string | null) {
    if (!data) return ''
    const anni = new Date().getFullYear() - new Date(data).getFullYear()
    return `${anni} anni`
  }

  const tipoClass: Record<string, string> = {
    clinica: 'badge-warn', generale: 'badge-good', comportamento: 'badge-bad'
  }

  const qBarFilled: Record<string, number> = { tutto: 4, 'metà': 2, poco: 1, niente: 0 }

  if (loading) return <div className="text-sm text-gray-400 mt-8">Caricamento...</div>
  if (!ospite) return <div className="text-sm text-gray-400 mt-8">Ospite non trovato.</div>

  return (
    <div>
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4">
        <ArrowLeft size={15} /> Torna alla lista
      </button>

      {/* Header ospite */}
      <div className="card mb-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-xl font-medium flex-shrink-0">
          {ospite.nome[0]}{ospite.cognome[0]}
        </div>
        <div>
          <h1 className="text-lg font-medium text-gray-900">{ospite.nome} {ospite.cognome}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {ospite.camera ? `Camera ${ospite.camera}` : ''}{ospite.camera && ospite.data_nascita ? ' · ' : ''}{eta(ospite.data_nascita)}
          </p>
          {ospite.note_generali && <p className="text-xs text-gray-400 mt-1">{ospite.note_generali}</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {(['note','pasti','umore','foto'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize border-b-2 transition-colors ${
              tab === t ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}>{t}</button>
        ))}
      </div>

      {/* NOTE */}
      {tab === 'note' && (
        <div className="card">
          <form onSubmit={salvaNota} className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800 mb-3">Aggiungi nota</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="form-label">Tipo</label>
                <select className="form-input" value={nota.tipo} onChange={e => setNota({...nota, tipo: e.target.value})}>
                  <option value="generale">Generale</option>
                  <option value="clinica">Clinica</option>
                  <option value="comportamento">Comportamento</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer mb-2">
                  <input type="checkbox" checked={nota.visibile_parenti} onChange={e => setNota({...nota, visibile_parenti: e.target.checked})} />
                  Visibile ai parenti
                </label>
              </div>
            </div>
            <textarea required className="form-input mb-3" rows={3} placeholder="Scrivi la nota..." value={nota.contenuto} onChange={e => setNota({...nota, contenuto: e.target.value})} />
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Salvo...' : 'Aggiungi nota'}</button>
          </form>
          <div className="space-y-3">
            {note.length === 0 && <p className="text-sm text-gray-400">Nessuna nota inserita.</p>}
            {note.map(n => (
              <div key={n.id} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={tipoClass[n.tipo] ?? 'badge-good'}>{n.tipo}</span>
                  <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleDateString('it', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</span>
                  {!n.visibile_parenti && <span className="text-xs text-gray-300 italic">· solo staff</span>}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{n.contenuto}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PASTI */}
      {tab === 'pasti' && (
        <div className="card">
          <form onSubmit={salvaPasto} className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800 mb-3">Registra pasto</p>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="form-label">Pasto</label>
                <select className="form-input" value={pasto.tipo} onChange={e => setPasto({...pasto, tipo: e.target.value})}>
                  <option value="colazione">Colazione</option>
                  <option value="pranzo">Pranzo</option>
                  <option value="cena">Cena</option>
                  <option value="spuntino">Spuntino</option>
                </select>
              </div>
              <div>
                <label className="form-label">Quantità mangiata</label>
                <select className="form-input" value={pasto.quantita} onChange={e => setPasto({...pasto, quantita: e.target.value})}>
                  <option value="tutto">Tutto</option>
                  <option value="metà">Metà</option>
                  <option value="poco">Poco</option>
                  <option value="niente">Niente</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Cosa ha mangiato</label>
              <input className="form-input" value={pasto.cosa_ha_mangiato} onChange={e => setPasto({...pasto, cosa_ha_mangiato: e.target.value})} placeholder="es. Pasta al pomodoro, pollo arrosto..." />
            </div>
            <div className="mb-3">
              <label className="form-label">Note aggiuntive</label>
              <input className="form-input" value={pasto.note} onChange={e => setPasto({...pasto, note: e.target.value})} placeholder="Difficoltà di deglutizione, rifiuto..." />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Salvo...' : 'Salva pasto'}</button>
          </form>
          <div className="space-y-3">
            {pasti.length === 0 && <p className="text-sm text-gray-400">Nessun pasto registrato.</p>}
            {pasti.map(p => (
              <div key={p.id} className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800 capitalize">{p.tipo} · {new Date(p.data).toLocaleDateString('it')}</p>
                  {p.cosa_ha_mangiato && <p className="text-xs text-gray-500 mt-0.5">{p.cosa_ha_mangiato}</p>}
                  {p.note && <p className="text-xs text-gray-400 mt-0.5 italic">{p.note}</p>}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(v => (
                      <div key={v} className={`w-3.5 h-1.5 rounded-sm ${v <= (qBarFilled[p.quantita ?? ''] ?? 0) ? 'bg-teal-600' : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 capitalize">{p.quantita}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UMORE */}
      {tab === 'umore' && (
        <div className="card">
          <form onSubmit={salvaUmore} className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800 mb-3">Registra umore</p>
            <div className="flex gap-2 mb-3">
              {[1,2,3,4,5].map(v => (
                <button key={v} type="button" onClick={() => setUmoreForm({...umoreForm, valore: v})}
                  className={`p-2 rounded-lg border text-xl transition-all ${umoreForm.valore === v ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white'}`}>
                  {umoreEmoji[v]}
                </button>
              ))}
            </div>
            <input className="form-input mb-3" value={umoreForm.nota} onChange={e => setUmoreForm({...umoreForm, nota: e.target.value})} placeholder="Nota opzionale..." />
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Salvo...' : 'Salva umore'}</button>
          </form>
          <div className="space-y-2">
            {umore.length === 0 && <p className="text-sm text-gray-400">Nessun umore registrato.</p>}
            {umore.map(u => (
              <div key={u.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <span className="text-2xl">{umoreEmoji[u.valore]}</span>
                <div className="flex-1">
                  {u.nota && <p className="text-sm text-gray-700">{u.nota}</p>}
                  <p className="text-xs text-gray-400">{new Date(u.data).toLocaleDateString('it', { weekday:'long', day:'2-digit', month:'long' })}</p>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(v => (
                    <div key={v} className={`w-2.5 h-2.5 rounded-full ${v <= u.valore ? 'bg-teal-600' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOTO */}
      {tab === 'foto' && (
        <div className="card">
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800 mb-3">Carica foto</p>
            <input className="form-input mb-2" placeholder="Didascalia (opzionale)" value={fotoCaption} onChange={e => setFotoCaption(e.target.value)} />
            <label className="btn-primary inline-block cursor-pointer">
              {saving ? 'Caricamento...' : '+ Seleziona foto'}
              <input type="file" accept="image/*" className="hidden" onChange={uploadFoto} />
            </label>
          </div>
          {media.length === 0 ? (
            <p className="text-sm text-gray-400">Nessuna foto caricata.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {media.map(m => (
                <div key={m.id}>
                  <img src={m.url} alt={m.didascalia ?? ''} className="w-full aspect-square object-cover rounded-lg" />
                  {m.didascalia && <p className="text-xs text-gray-400 mt-1 truncate">{m.didascalia}</p>}
                  <p className="text-xs text-gray-300">{new Date(m.data).toLocaleDateString('it')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
