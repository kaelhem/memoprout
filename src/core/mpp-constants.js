export const LAST_FIRMWARE_VERSION = '1.0'

export const KEYWORDS = [
  'UI',
  'PROUTS',
  'SCORE',
  'MUSIC',
  'GAMES',
  'KIDS',
  'CINEMA',
  'BASIC',
  'MRMME',
  'ORDI'
]

export const gamesData = [{
  name: "Classic",
  description: "Le MemoProut originel, créé en l'an de grâce 2009. Dans cette version, les sons joués forment des phrases hallucinées à l'humour parfois douteux",
  code: 'BASIC',
  credit_icon: "Banana by MemoProut",
  icon: 'classic',
  storage: 'default/basic'
}, {
  name: "Kids",
  description: "Basée sur la version Classic, cette version édulcorée est agréablement vocalisée par les plus beaux enfants du monde.",
  code: 'KIDS',
  credit_icon: "Music by Three Six Five from the Noun Project",
  icon: 'kids',
  storage: 'default/kids'
}, {
  name: "Cinema",
  description: "Des extraits de films choisis minutieusement en guise de sons. Ces moments cultes sont autant de délicieuses petites madeleines de Prout !",
  code: "CINEMA",
  credit_icon: "Cinema by Marco Galtarossa from the Noun Project",
  icon: 'cinema',
  storage: 'default/cinema'
}, {
  name: "Music",
  description: "La rock n' roll attitude façon MemoProut !",
  code: "MUSIC",
  credit_icon: "Music by Three Six Five from the Noun Project",
  icon: 'music',
  storage: 'default/music'
}, {
  name: "Ordimini 84",
  description: "Si vous avez eu un Ordimini dans votre jeunesse, la nostalgie vous tend les bras avec cette version",
  code: "ORDI",
  credit_icon: "Robot by Jugalbandi from the Noun Project",
  icon: 'ordimini',
  storage: 'contrib/ordimini84'
}, {
  name: "Monsieur / Madame",
  description: "Un mode de jeu réservé aux adultes",
  code: "MRMME",
  credit_icon: "Sex by P Thanga Vignesh from the Noun Project",
  icon: 'mr-mme',
  storage: 'contrib/monsieur-madame'
}]

export const getGameById = (id) => {
  const filtered = gamesData.filter(game => game.code === id)
  if (filtered.length > 0) {
    return filtered[0]
  }
  return id
}

export const getGameByPath = (path) => {
  const filtered = gamesData.filter(game => game.storage === path)
  if (filtered.length > 0) {
    return filtered[0]
  }
  return { name: 'null' }
}