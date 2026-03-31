'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const GIORNI = ['lunedì','martedì','mercoledì','giovedì','venerdì','sabato','domenica']

function getLunedi() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

export default function MenuPage() {
  const [menu, setMenu] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settimana, setSettimana] = useState(getLunedi())

  // Form stato: array di 7 righe, una per giorno
  const emptyRow = () => ({ colazione: '', pranzo_primo: '', pranzo_secondo: '', pranzo_contorno: '', cena_primo: '', cena_secondo: '', cena_contorno: '', note: '' })
  const [rows, setRows] = useState<any[]>(GIORNI.map(() => emptyRow()))

  useEffect(() => { loadMenu() }, [settimana])

  async function loadMenu() {
    setLoading(true)
    const { data } = await supabase.from('menu_settimanale').select('*').eq('settimana_inizio', settimana).order('giorno')
    setMenu(data ?? [])
    if (data && data.length > 0) {
      const newRows = GIORNI.map(g => {
        const r = data.find((d: any) => d.giorno === g)
        return r ? { colazione: r.colazione ?? '', pranzo_primo: r.pranzo_primo ?? '', pranzo_secondo: r.pranzo_secondo ?? '', pranzo_contorno: r.pranzo_contorno ?? '', cena_primo: r.cena_primo ?? '', cena_secondo: r.cena_secondo ?? '', cena_contorno: r.cena_contorno ?? '', note: r.note ?? '' } : emptyRow()
      })
      setRows(newRows)
    } else {
      setRows(GIORNI.map(() => emptyRow()))
    }
    setLoading(false)
  }

  async function salvaMenu() {
    setSaving(true)
    await supabase.from('menu_settimanale').delete().eq('settimana_inizio', settimana)
    const inserts = GIORNI.map((g, i) => ({ ...rows[i], giorno: g, settimana_inizio: settimana }))
    await supabase.from('menu_settimanale').insert(inserts)
    setSaving(false)
    setEditMode(false)
    loadMenu()
  }

  function updateRow(idx: number, field: string, val: string) {
    setRows(r => r.map((row, i) => i === idx ? { ...row, [field]: val } : row))
  }

  const formatData = (s: string) => new Date(s).toLocaleDateString('it', { day:'2-digit', month:'long', year:'numeric' })

  if (loading) return <div className="text-sm text-gray-400 mt-8">Caricamento...</div>

  return (
    <div>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="page-title">Menu settimanale</h1>
          <p className="page-subtitle">Settimana del {formatData(settimana)}</p>
        </div>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <button onClick={() => setEditMode(false)} className="btn-secondary">Annulla</button>
              <button onClick={salvaMenu} disabled={saving} className="btn-primary">{saving ? 'Salvo...' : 'Pubblica menu'}</button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="btn-primary">✏️ Modifica menu</button>
          )}
        </div>
      </div>

      {/* Selezione settimana */}
      <div className="flex items-center gap-3 mb-5">
        <label className="text-sm text-gray-500">Settimana:</label>
        <input type="date" className="form-input max-w-[180px]" value={settimana} onChange={e => setSettimana(e.target.value)} />
      </div>

      {/* Tabella menu */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-3 w-24">Giorno</th>
              <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-3">Colazione</th>
              <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-3">Pranzo</th>
              <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-3">Cena</th>
              <th className="text-left text-xs text-gray-400 font-medium pb-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {GIORNI.map((g, i) => (
              <tr key={g} className="border-b border-gray-50 last:border-0">
                <td className="py-3 pr-3 font-medium text-gray-800 capitalize">{g}</td>

                {/* Colazione */}
                <td className="py-3 pr-3">
                  {editMode ? (
                    <input className="form-input text-xs" value={rows[i].colazione} onChange={e => updateRow(i, 'colazione', e.target.value)} placeholder="es. Latte, fette biscottate" />
                  ) : (
                    <span className="text-gray-600">{rows[i].colazione || <span className="text-gray-300">—</span>}</span>
                  )}
                </td>

                {/* Pranzo */}
                <td className="py-3 pr-3">
                  {editMode ? (
                    <div className="space-y-1">
                      <input className="form-input text-xs" value={rows[i].pranzo_primo} onChange={e => updateRow(i, 'pranzo_primo', e.target.value)} placeholder="Primo" />
                      <input className="form-input text-xs" value={rows[i].pranzo_secondo} onChange={e => updateRow(i, 'pranzo_secondo', e.target.value)} placeholder="Secondo" />
                      <input className="form-input text-xs" value={rows[i].pranzo_contorno} onChange={e => updateRow(i, 'pranzo_contorno', e.target.value)} placeholder="Contorno" />
                    </div>
                  ) : (
                    <div className="text-gray-600 space-y-0.5">
                      {rows[i].pranzo_primo && <p>{rows[i].pranzo_primo}</p>}
                      {rows[i].pranzo_secondo && <p className="text-gray-400">{rows[i].pranzo_secondo}</p>}
                      {rows[i].pranzo_contorno && <p className="text-gray-400">{rows[i].pranzo_contorno}</p>}
                      {!rows[i].pranzo_primo && !rows[i].pranzo_secondo && <span className="text-gray-300">—</span>}
                    </div>
                  )}
                </td>

                {/* Cena */}
                <td className="py-3 pr-3">
                  {editMode ? (
                    <div className="space-y-1">
                      <input className="form-input text-xs" value={rows[i].cena_primo} onChange={e => updateRow(i, 'cena_primo', e.target.value)} placeholder="Primo" />
                      <input className="form-input text-xs" value={rows[i].cena_secondo} onChange={e => updateRow(i, 'cena_secondo', e.target.value)} placeholder="Secondo" />
                      <input className="form-input text-xs" value={rows[i].cena_contorno} onChange={e => updateRow(i, 'cena_contorno', e.target.value)} placeholder="Contorno" />
                    </div>
                  ) : (
                    <div className="text-gray-600 space-y-0.5">
                      {rows[i].cena_primo && <p>{rows[i].cena_primo}</p>}
                      {rows[i].cena_secondo && <p className="text-gray-400">{rows[i].cena_secondo}</p>}
                      {rows[i].cena_contorno && <p className="text-gray-400">{rows[i].cena_contorno}</p>}
                      {!rows[i].cena_primo && !rows[i].cena_secondo && <span className="text-gray-300">—</span>}
                    </div>
                  )}
                </td>

                {/* Note */}
                <td className="py-3">
                  {editMode ? (
                    <input className="form-input text-xs" value={rows[i].note} onChange={e => updateRow(i, 'note', e.target.value)} placeholder="Note dieta..." />
                  ) : (
                    <span className="text-gray-400 text-xs">{rows[i].note || ''}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
