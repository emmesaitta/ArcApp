export type Ospite = {
  id: string
  nome: string
  cognome: string
  data_nascita: string | null
  camera: string | null
  data_ingresso: string | null
  foto_url: string | null
  note_generali: string | null
  attivo: boolean
  created_at: string
}

export type Personale = {
  id: string
  user_id: string
  nome: string
  cognome: string
  ruolo: string | null
  created_at: string
}

export type Parente = {
  id: string
  user_id: string
  nome: string
  cognome: string
  telefono: string | null
  relazione: string | null
  approvato: boolean
  created_at: string
  // join
  parenti_ospiti?: { ospite: Ospite }[]
}

export type Nota = {
  id: string
  ospite_id: string
  autore_id: string | null
  tipo: 'generale' | 'clinica' | 'comportamento'
  contenuto: string
  visibile_parenti: boolean
  data: string
  created_at: string
  // join
  ospite?: Pick<Ospite, 'nome' | 'cognome'>
  autore?: Pick<Personale, 'nome' | 'cognome' | 'ruolo'>
}

export type Pasto = {
  id: string
  ospite_id: string
  autore_id: string | null
  data: string
  tipo: 'colazione' | 'pranzo' | 'cena' | 'spuntino'
  cosa_ha_mangiato: string | null
  quantita: 'tutto' | 'metà' | 'poco' | 'niente' | null
  note: string | null
  created_at: string
  ospite?: Pick<Ospite, 'nome' | 'cognome'>
}

export type Umore = {
  id: string
  ospite_id: string
  autore_id: string | null
  data: string
  valore: 1 | 2 | 3 | 4 | 5
  nota: string | null
  created_at: string
}

export type Media = {
  id: string
  ospite_id: string
  autore_id: string | null
  url: string
  tipo: 'foto' | 'video'
  didascalia: string | null
  data: string
  created_at: string
}

export type MenuSettimanale = {
  id: string
  settimana_inizio: string
  giorno: string
  colazione: string | null
  pranzo_primo: string | null
  pranzo_secondo: string | null
  pranzo_contorno: string | null
  cena_primo: string | null
  cena_secondo: string | null
  cena_contorno: string | null
  note: string | null
  created_at: string
}
