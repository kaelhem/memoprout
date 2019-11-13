const shuffle = require('shuffle-array')
const fs = require('fs')

const shuffle8 = () => shuffle([1, 2, 3, 4, 5, 6, 7, 8])

const shuffleButtons = () => {
  let arr = Array.from({length: 28}, (v, k) => k + 1)
  return shuffle(arr)
}

const generateBasicGame = () => {
  const buttons = shuffleButtons()
  const subject = shuffle8()
  const verb = shuffle8()
  const comp = shuffle8()
  const inter = shuffle([1, 2, 3, 4, 1, 2, 3, 4])
  
  let kind = 0
  let currentWordArray = subject
  const game = new Uint8Array(3 * 28)
  for (let i  = 0; i < 28; ++i) {
    const idx = i * 3
    game[idx] = kind
  	game[idx + 1] = currentWordArray.shift()
  	game[idx + 2] = buttons.shift()
  	if (++kind == 4) {
  	  kind = 0
  	}
  	switch(kind) {
  	  case 0: currentWordArray = subject; break;
  	  case 1: currentWordArray = verb; break;
  	  case 2: currentWordArray = comp; break;
  	  default: currentWordArray = inter; break;
  	}
  }
  return game
}

const generateSimpleGame = () => {
  const buttons = shuffleButtons()
  const sounds = shuffleButtons()
  
  const game = new Uint8Array(3 * 28)
  for (let i  = 0; i < 28; ++i) {
    const idx = i * 3
    game[idx] = 0
  	game[idx + 1] = sounds.shift()
  	game[idx + 2] = buttons.shift()
  }
  return game
}


fs.unlinkSync('BASIC.PRT')
fs.unlinkSync('KIDS.PRT')
fs.unlinkSync('CINEMA.PRT')

for (let i = 0; i < 255; ++i) {
  const game = generateBasicGame()
  if (i === 129) {
  	console.log(game.join(','))
  }
  fs.appendFileSync('BASIC.PRT', Buffer.from(game))
  fs.appendFileSync('KIDS.PRT', Buffer.from(generateBasicGame()))
  fs.appendFileSync('CINEMA.PRT', Buffer.from(generateSimpleGame()))
}

console.log('done.')