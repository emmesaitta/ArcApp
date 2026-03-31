import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const GIORNI = ['lunedì','martedì','mercoledì','giovedì','venerdì','sabato','domenica']

function getLunedi() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

export default async function MenuPubblico() {
  const settimana = getLunedi()
  const { data: menu } = await supabase
    .from('menu_settimanale')
    .select('*')
    .eq('settimana_inizio', settimana)

  const giornoOggi = new Date().toLocaleDateString('it', { weekday: 'long' }).toLowerCase()

  const righe = GIORNI.map(g => {
    const r = menu?.find(m => m.giorno === g)
    return { giorno: g, ...r }
  })

  const formatData = (s: string) =>
    new Date(s).toLocaleDateString('it', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 px-5 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-teal-600">← ArcaCura</Link>
          <Link href="/portale" className="btn-primary !py-1.5 text-sm">Portale Parenti</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Menu della settimana</h1>
          <p className="text-sm text-gray-400 mt-1">
            {settimana ? `Settimana del ${formatData(settimana)}` : ''}
          </p>
        </div>

        {!menu || menu.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-gray-400">Il menu di questa settimana non è ancora stato pubblicato.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {righe.map(r => {
              const isOggi = r.giorno === giornoOggi
              return (
                <div key={r.giorno}
                  className={`card ${isOggi ? 'ring-2 ring-teal-500 ring-offset-1' : ''}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-sm font-semibold text-gray-800 capitalize">{r.giorno}</p>
                    {isOggi && <span className="badge-good text-xs">Oggi</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Colazione</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{(r as any).colazione || <span className="text-gray-300">—</span>}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Pranzo</p>
                      <div className="space-y-0.5">
                        {(r as any).pranzo_primo && <p className="text-xs text-gray-600">{(r as any).pranzo_primo}</p>}
                        {(r as any).pranzo_secondo && <p className="text-xs text-gray-500">{(r as any).pranzo_secondo}</p>}
                        {(r as any).pranzo_contorno && <p className="text-xs text-gray-400">{(r as any).pranzo_contorno}</p>}
                        {!(r as any).pranzo_primo && <span className="text-xs text-gray-300">—</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Cena</p>
                      <div className="space-y-0.5">
                        {(r as any).cena_primo && <p className="text-xs text-gray-600">{(r as any).cena_primo}</p>}
                        {(r as any).cena_secondo && <p className="text-xs text-gray-500">{(r as any).cena_secondo}</p>}
                        {(r as any).cena_contorno && <p className="text-xs text-gray-400">{(r as any).cena_contorno}</p>}
                        {!(r as any).cena_primo && <span className="text-xs text-gray-300">—</span>}
                      </div>
                    </div>
                  </div>
                  {(r as any).note && (
                    <p className="text-xs text-amber-600 mt-2 pt-2 border-t border-gray-100">📌 {(r as any).note}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
