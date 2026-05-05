export default function AccessoStaffPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" style={{ fontFamily: "'Georgia', serif" }}>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-gray-900 text-xl tracking-wide">ELISIR · STRAUSS</a>
          <a href="/" className="text-sm text-gray-500 hover:text-gray-800 font-medium">← Torna al sito</a>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">

        <div className="w-20 h-20 bg-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl">🔐</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Accesso Staff</h1>
        <p className="text-gray-500 text-lg mb-12 max-w-sm mx-auto">
          Seleziona la struttura a cui vuoi accedere.
        </p>

        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          <a href="https://gestionale.arcacura.it" className="group block bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-lg rounded-3xl p-8 text-left transition-all duration-200">
            <span className="text-4xl block mb-4">🌿</span>
            <p className="font-bold text-gray-900 text-2xl tracking-wide mb-1">ELISIR</p>
            <p className="text-sm text-gray-400 mb-4">Via Umberto Giordano 51, Palermo</p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-gray-400"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>Attiva · 10 posti</span>
              <span className="text-sm text-teal-600 font-bold group-hover:underline">Accedi →</span>
            </div>
          </a>

          <a href="https://gestionale.arcacura.it" className="group block bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg rounded-3xl p-8 text-left transition-all duration-200">
            <span className="text-4xl block mb-4">🎵</span>
            <p className="font-bold text-gray-900 text-2xl tracking-wide mb-1">STRAUSS</p>
            <p className="text-sm text-gray-400 mb-4">Palermo</p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-gray-400"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>Attiva · 10 posti</span>
              <span className="text-sm text-blue-600 font-bold group-hover:underline">Accedi →</span>
            </div>
          </a>
        </div>

        <p className="text-sm text-gray-300">
          Accesso riservato al personale autorizzato di Cooperativa ARCA
        </p>
      </div>

    </div>
  )
}
