import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <div>
            <span className="font-semibold text-gray-900 text-base">ArcaCura</span>
            <span className="text-xs text-gray-400 ml-2 hidden sm:inline">Casa di Riposo</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-4">
            <Link href="#servizi" className="text-sm text-gray-500 hover:text-gray-800 hidden sm:block">Servizi</Link>
            <Link href="#contatti" className="text-sm text-gray-500 hover:text-gray-800 hidden sm:block">Contatti</Link>
            <Link href="/portale" className="btn-primary text-sm !py-1.5">Portale Parenti</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-b from-teal-50 to-white py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full mb-5">
            Palermo
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight mb-5">
            Cura, rispetto e<br className="hidden sm:block" /> serenità ogni giorno
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto">
            ArcaCura è una casa di riposo a conduzione familiare dove ogni ospite
            è trattato con attenzione e affetto. I parenti possono restare sempre vicini
            grazie al nostro portale digitale.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/portale" className="btn-primary text-base !px-6 !py-3">
              Accedi al portale parenti
            </Link>
            <Link href="#contatti" className="btn-secondary text-base !px-6 !py-3">
              Contattaci
            </Link>
          </div>
        </div>
      </section>

      {/* NUMERI */}
      <section className="py-12 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-5 grid grid-cols-3 gap-6 text-center">
          {[
            { n: '28',  label: 'posti disponibili' },
            { n: '25+', label: 'anni di esperienza' },
            { n: '24h', label: 'assistenza continua' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-semibold text-teal-600">{s.n}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVIZI */}
      <section id="servizi" className="py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">I nostri servizi</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">Tutto quello di cui il tuo caro ha bisogno, in un posto solo</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: '🏥', title: 'Assistenza medica', desc: 'Medico e infermieri presenti ogni giorno per monitorare la salute degli ospiti.' },
              { icon: '🍽️', title: 'Pasti personalizzati', desc: 'Menu settimanale elaborato da dietisti, con diete speciali su indicazione medica.' },
              { icon: '🎨', title: 'Attività ricreative', desc: 'Laboratori, musica, gite e attività fisiche per mantenere mente e corpo attivi.' },
              { icon: '🌿', title: 'Giardino attrezzato', desc: 'Ampio giardino con percorsi accessibili per passeggiate in sicurezza.' },
              { icon: '👨‍👩‍👧', title: 'Portale parenti', desc: 'I familiari possono seguire ogni giorno la vita del loro caro dal proprio telefono.' },
              { icon: '🛏️', title: 'Camere singole', desc: 'Camere private e confortevoli, personalizzabili con oggetti da casa.' },
            ].map(s => (
              <div key={s.title} className="card">
                <span className="text-2xl block mb-3">{s.icon}</span>
                <p className="text-sm font-medium text-gray-800 mb-1">{s.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTALE PARENTI PROMO */}
      <section className="py-16 px-5 bg-teal-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl font-semibold mb-3">Portale Parenti</h2>
          <p className="text-teal-100 text-sm leading-relaxed mb-6 max-w-lg mx-auto">
            Registrandoti al portale puoi vedere ogni giorno come sta il tuo caro: le note del personale,
            cosa ha mangiato, il suo umore, le foto delle attività e il menu della settimana.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {['📋 Note cliniche','🍽️ Pasti e menu','😊 Umore','📸 Foto attività'].map(t => (
              <div key={t} className="bg-white/10 rounded-xl py-3 px-2 text-sm text-white">{t}</div>
            ))}
          </div>
          <Link href="/portale" className="inline-block bg-white text-teal-700 font-medium px-6 py-3 rounded-xl text-sm hover:bg-teal-50 transition-colors">
            Accedi o registrati →
          </Link>
        </div>
      </section>

      {/* CONTATTI */}
      <section id="contatti" className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">Contatti</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">Siamo a vostra disposizione</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: '📍', label: 'Indirizzo', val: 'Via Roma 123, Palermo (PA)' },
              { icon: '📞', label: 'Telefono', val: '+39 091 123 4567' },
              { icon: '✉️', label: 'Email', val: 'info@villaserena.it' },
            ].map(c => (
              <div key={c.label} className="card text-center">
                <span className="text-2xl block mb-2">{c.icon}</span>
                <p className="text-xs text-gray-400 mb-0.5">{c.label}</p>
                <p className="text-sm text-gray-700 font-medium">{c.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-6 px-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400">© 2026 ArcaCura · Casa di Riposo</p>
          <div className="flex gap-4">
            <Link href="/portale" className="text-xs text-gray-400 hover:text-gray-600">Portale parenti</Link>
            <Link href="/gestionale" className="text-xs text-gray-400 hover:text-gray-600">Accesso staff</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
