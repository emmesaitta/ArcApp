'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

export default function ParentiPage() {
  const [parenti, setParenti] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'tutti' | 'attesa' | 'approvati'>('tutti')

  useEffect(() => { loadParenti() }, [])

  async function loadParenti() {
    const { data } = await supabase
      .from('parenti')
      .select(`*, parenti_ospiti(ospite:ospiti(id, nome, cognome))`)
      .order('created_at', { ascending: false })
    setParenti(data ?? [])
    setLoading(false)
  }

  async function approva(id: string) {
    await supabase.from('parenti').update({ approvato: true }).eq('id', id)
    loadParenti()
  }

  async function revoca(id: string) {
    await supabase.from('parenti').update({ approvato: false }).eq('id', id)
    loadParenti()
  }

  const filtrati = parenti.filter(p => {
    if (filtro === 'attesa') return !p.approvato
    if (filtro === 'approvati') return p.approvato
    return true
  })

  const inAttesa = parenti.filter(p => !p.approvato).length

  if (loading) return <div className="text-sm text-gray-400 mt-8">Caricamento...</div>

  return (
    <div>
      <div className="mb-5">
        <h1 className="page-title">Parenti</h1>
        <p className="page-subtitle">Gestione accessi al portale</p>
      </div>

      {/* Stats */}
      {inAttesa > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-sm text-amber-700">
          <Clock size={15} />
          <strong>{inAttesa}</strong> {inAttesa === 1 ? 'parente in attesa' : 'parenti in attesa'} di approvazione
        </div>
      )}

      {/* Filtri */}
      <div className="flex gap-2 mb-4">
        {(['tutti','attesa','approvati'] as const).map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${filtro === f ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f === 'attesa' ? 'In attesa' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="card">
        {filtrati.length === 0 ? (
          <p className="text-sm text-gray-400">Nessun parente trovato.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtrati.map(p => {
              const ospiti = p.parenti_ospiti?.map((po: any) => po.ospite) ?? []
              return (
                <div key={p.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {p.nome[0]}{p.cognome[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-800">{p.nome} {p.cognome}</p>
                      {p.approvato ? (
                        <span className="badge-good flex items-center gap-1"><CheckCircle size={10} />Approvato</span>
                      ) : (
                        <span className="badge-warn flex items-center gap-1"><Clock size={10} />In attesa</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      {p.telefono && <span className="text-xs text-gray-400">{p.telefono}</span>}
                      {p.relazione && <span className="text-xs text-gray-400">{p.relazione}</span>}
                    </div>
                    {ospiti.length > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Segue: {ospiti.map((o: any) => `${o.nome} ${o.cognome}`).join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Azioni */}
                  <div className="flex gap-2 flex-shrink-0">
                    {!p.approvato ? (
                      <button onClick={() => approva(p.id)} className="btn-primary text-xs py-1.5 flex items-center gap-1">
                        <CheckCircle size={13} /> Approva
                      </button>
                    ) : (
                      <button onClick={() => revoca(p.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1">
                        <XCircle size={13} /> Revoca
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-1">Come funziona il portale parenti?</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          I parenti si registrano autonomamente sul sito web della struttura, inserendo il codice ospite del loro caro.
          La richiesta appare qui in attesa di approvazione. Una volta approvati, possono accedere al portale
          e vedere note (quelle contrassegnate come "visibili ai parenti"), pasti, umore e foto.
        </p>
      </div>
    </div>
  )
}
