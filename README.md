# ArcaCura · ArcApp

App di gestione per casa di riposo con portale parenti. Costruita con Next.js 14 + Supabase.

---

## Setup in 5 passi

### 1. Installa Node.js
Scarica e installa Node.js da https://nodejs.org (versione 18 o superiore)

### 2. Copia il file delle credenziali
```bash
cp .env.local.example .env.local
```
Poi apri `.env.local` e inserisci le tue credenziali Supabase.

**Dove le trovi:**
- Vai su https://supabase.com e apri il tuo progetto
- Clicca `Settings` → `API`
- Copia `Project URL` → incolla in `NEXT_PUBLIC_SUPABASE_URL`
- Copia `anon public` → incolla in `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Installa le dipendenze
Apri il terminale nella cartella del progetto e lancia:
```bash
npm install
```

### 4. Avvia in locale
```bash
npm run dev
```
Apri http://localhost:3000 nel browser.

### 5. Deploy su Vercel (gratis)
1. Crea un account su https://vercel.com
2. Carica il progetto su GitHub
3. Su Vercel clicca "New Project" → importa da GitHub
4. Nelle impostazioni del progetto aggiungi le variabili d'ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clicca "Deploy" — fatto!

---

## Struttura del progetto

```
src/
├── app/
│   ├── page.tsx              # Dashboard principale
│   ├── layout.tsx            # Layout con sidebar
│   ├── globals.css           # Stili globali
│   ├── ospiti/
│   │   ├── page.tsx          # Lista ospiti
│   │   └── [id]/page.tsx     # Scheda ospite (note, pasti, umore, foto)
│   ├── note/page.tsx         # Diario note del giorno
│   ├── pasti/page.tsx        # Registrazione pasti
│   ├── menu/page.tsx         # Menu settimanale
│   └── parenti/page.tsx      # Gestione accessi parenti
└── lib/
    ├── supabase.ts           # Client Supabase
    └── types.ts              # Tipi TypeScript
```

---

## Supabase Storage (per le foto)

Per abilitare il caricamento delle foto, vai su Supabase:
1. Clicca `Storage` nel menu a sinistra
2. Clicca `New bucket`
3. Nome bucket: `media`
4. Spunta `Public bucket`
5. Clicca `Create bucket`

---

## Prossimo step: Portale Parenti

Il portale parenti è un sito separato (o una sezione `/portale` di questo stesso progetto)
che permette ai parenti di:
- Registrarsi con email e codice ospite
- Visualizzare note, pasti, umore e foto del loro caro
- Vedere il menu settimanale

Questo verrà sviluppato nella Fase 3.
