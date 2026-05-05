import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Georgia', serif" }}>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="font-bold text-gray-900 text-xl tracking-wide">ELISIR</span>
              <span className="text-gray-300 mx-2">·</span>
              <span className="font-bold text-gray-900 text-xl tracking-wide">STRAUSS</span>
            </div>
            <span className="text-xs text-gray-400 hidden md:inline border-l border-gray-200 pl-4">Case di Riposo · Cooperativa ARCA · Palermo</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="#servizi" className="text-sm text-gray-500 hover:text-gray-800 hidden sm:block font-medium">Servizi</Link>
            <Link href="#contatti" className="text-sm text-gray-500 hover:text-gray-800 hidden sm:block font-medium">Contatti</Link>
            <Link href="/portale" className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">Portale Parenti</Link>
            <Link href="/accesso-staff" className="text-sm text-gray-500 hover:text-gray-800 hidden sm:block border-2 border-gray-200 hover:border-gray-400 font-semibold px-4 py-2 rounded-xl transition-colors">Accesso Staff</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #f0f9ff 100%)' }}>
        <div className="max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-800 text-sm font-semibold rounded-full mb-8 border border-teal-200">
            🌿 Palermo · Dal 2013 · Cooperativa ARCA
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
            Cura, rispetto e<br />
            <span style={{ color: '#0d9488' }}>serenità ogni giorno</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            Elisir e Strauss sono case di riposo a conduzione familiare nel cuore di Palermo,
            dove ogni ospite è trattato con attenzione, affetto e dignità.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/portale" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:shadow-lg hover:-translate-y-0.5">
              Accedi al portale parenti →
            </Link>
            <Link href="#contatti" className="bg-white hover:bg-gray-50 text-gray-700 font-bold px-8 py-4 rounded-2xl text-lg border-2 border-gray-200 transition-all hover:border-gray-300">
              Contattaci
            </Link>
          </div>
        </div>
      </section>

      {/* NUMERI */}
      <section className="py-14 border-y border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { n: '20', label: 'posti totali', sub: '10 per struttura' },
            { n: '13+', label: 'anni di esperienza', sub: 'Dal 2013' },
            { n: '24h', label: 'assistenza continua', sub: '365 giorni l\'anno' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-teal-600 mb-1">{s.n}</p>
              <p className="text-base font-semibold text-gray-700">{s.label}</p>
              <p className="text-sm text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LE NOSTRE STRUTTURE */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Le nostre strutture</h2>
          <p className="text-gray-500 text-center mb-12 text-lg">Due case, una sola filosofia di cura</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                nome: 'ELISIR',
                emoji: '🌿',
                indirizzo: 'Via Umberto Giordano 51, Palermo',
                desc: 'La nostra prima struttura, un ambiente caldo e familiare dove ogni ospite è accolto come a casa propria.',
                colore: '#0d9488',
                bg: '#f0fdf4',
              },
              {
                nome: 'STRAUSS',
                emoji: '🎵',
                indirizzo: 'Palermo',
                desc: 'La nostra seconda struttura, caratterizzata da un\'atmosfera serena e armoniosa, ispirata alla musica e alla bellezza.',
                colore: '#2563eb',
                bg: '#eff6ff',
              },
            ].map(s => (
              <div key={s.nome} className="rounded-3xl p-8 border-2 border-white shadow-sm hover:shadow-md transition-all" style={{ background: s.bg }}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{s.emoji}</span>
                  <div>
                    <h3 className="text-2xl font-bold tracking-wide" style={{ color: s.colore }}>{s.nome}</h3>
                    <p className="text-sm text-gray-500">{s.indirizzo}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-base">{s.desc}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                  <span className="text-sm font-medium text-gray-500">Attiva · 10 posti</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVIZI */}
      <section id="servizi" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">I nostri servizi</h2>
          <p className="text-gray-500 text-center mb-12 text-lg">Tutto quello di cui il tuo caro ha bisogno, in un posto solo</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {[
              { icon: '🏥', title: 'Assistenza medica', desc: 'Medico e infermieri presenti ogni giorno per monitorare la salute degli ospiti.' },
              { icon: '🍽️', title: 'Pasti personalizzati', desc: 'Menu settimanale con diete speciali personalizzate su indicazione medica.' },
              { icon: '🎨', title: 'Attività ricreative', desc: 'Laboratori, musica e attività per mantenere mente e corpo attivi ogni giorno.' },
              { icon: '☀️', title: 'Spazio relax', desc: 'Ampio spiazzale condominiale dove gli ospiti possono rilassarsi e prendere aria.' },
              { icon: '👨‍👩‍👧', title: 'Portale parenti', desc: 'I familiari possono seguire ogni giorno la vita del loro caro dal proprio telefono.' },
              { icon: '🛏️', title: 'Camere confortevoli', desc: 'Camere private e accoglienti, personalizzabili con oggetti e ricordi da casa.' },
            ].map(s => (
              <div key={s.title} className="bg-gray-50 hover:bg-teal-50 rounded-2xl p-6 transition-colors border border-transparent hover:border-teal-100">
                <span className="text-3xl block mb-3">{s.icon}</span>
                <p className="text-base font-bold text-gray-800 mb-2">{s.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTALE PARENTI PROMO */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)' }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Portale Parenti</h2>
          <p className="text-teal-100 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Registrandoti al portale puoi vedere ogni giorno come sta il tuo caro: le note del personale,
            cosa ha mangiato, il suo umore, le foto delle attività e il menu della settimana.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {['📋 Note cliniche', '🍽️ Pasti giornalieri', '😊 Umore', '📸 Foto attività'].map(t => (
              <div key={t} className="bg-white/15 rounded-2xl py-4 px-3 text-base text-white font-medium backdrop-blur">{t}</div>
            ))}
          </div>
          <Link href="/portale" className="inline-block bg-white text-teal-700 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-teal-50 transition-colors shadow-lg">
            Accedi o registrati →
          </Link>
        </div>
      </section>

      {/* CONTATTI */}
      <section id="contatti" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Contatti</h2>
          <p className="text-gray-500 text-center mb-12 text-lg">Siamo a vostra disposizione</p>
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {[
              { icon: '📍', label: 'Indirizzo', val: 'Via Umberto Giordano 51, 90144 Palermo (PA)' },
              { icon: '✉️', label: 'Email', val: 'arcatranquillity@gmail.com' },
              { icon: '📧', label: 'PEC', val: 'arcascs@pec.it' },
              { icon: '🏢', label: 'Partita IVA', val: '06848690829' },
            ].map(c => (
              <div key={c.label} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                <span className="text-3xl block mb-3">{c.icon}</span>
                <p className="text-sm text-gray-400 font-medium mb-1">{c.label}</p>
                <p className="text-base text-gray-800 font-semibold">{c.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-gray-700">ELISIR · STRAUSS · Cooperativa ARCA</p>
            <p className="text-sm text-gray-400 mt-1">P.IVA 06848690829 · Via Umberto Giordano 51, Palermo</p>
          </div>
          <div className="flex gap-6">
            <Link href="/portale" className="text-sm text-gray-500 hover:text-teal-600 font-medium transition-colors">Portale parenti</Link>
            <Link href="/accesso-staff" className="text-sm text-gray-500 hover:text-teal-600 font-medium transition-colors">Accesso staff</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
