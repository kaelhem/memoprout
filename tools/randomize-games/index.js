const shuffleArray = require('shuffle-array')
const fs = require('fs')
const rimraf = require('rimraf')

const shuffle = (len) => {
  let arr = Array.from({length: len}, (v, k) => k + 1)
  return shuffleArray(arr)
}

const shuffleButtons = () => {
  let arr = Array.from({length: 28}, (v, k) => k)
  return shuffleArray(arr)
}

const generateBasicGame = () => {
  const buttons = shuffleButtons()
  const subject = shuffle(8)
  const verb = shuffle(8)
  const comp = shuffle(8)
  const inter = shuffleArray([1, 2, 3, 4, 1, 2, 3, 4])
  
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
  const sounds = shuffle(28)
  
  const game = new Uint8Array(3 * 28)
  for (let i  = 0; i < 28; ++i) {
    const idx = i * 3
    game[idx] = 0
  	game[idx + 1] = sounds.shift()
  	game[idx + 2] = buttons.shift()
  }
  return game
}

if (fs.existsSync('generated')) {
  rimraf.sync('generated')
}
fs.mkdirSync('generated')

for (let i = 0; i < 255; ++i) {
  const game = generateBasicGame()
  fs.appendFileSync('generated/BASIC.PRT', Buffer.from(game))
  fs.appendFileSync('generated/KIDS.PRT', Buffer.from(generateBasicGame()))
  fs.appendFileSync('generated/CINEMA.PRT', Buffer.from(generateSimpleGame()))
}

console.log('done.')