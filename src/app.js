import React from 'react'
import logo from './logo.svg'
import './app.css'

function App() {
  return (
    <div className="app">
      <header className="block">
        <img src={logo} className="app-logo" alt="logo" />
        <h2>Ceci est une révolution.</h2>
      </header>
      <div className="inverted-block">
        <h2>Un design unique aux courbes élégantes.</h2>
        <img src="assets/pics/mmpp-front.png" alt="Memoprout Pad© - face avant" />
        <img src="assets/pics/mmpp-side.png" alt="Memoprout Pad© - côté droit" />
      </div>
      <div className="block">
        <h2>Votre compagnon de toilette idéal !</h2>
        <p>MemoProut Pad© est LE jeu audio adapté aux pas trop petits et aux plus grands.</p>
      </div>
      <div className="inverted-block">
        <h2>Il est libre, Memo !</h2>
        <p>Entièrement open-source, MemoProut Pad© est fabriqué uniquement avec des matériaux pas cher et facilement trouvables. L'intégralité des sources (schèma électronique, plans de découpe cnc/laser, fichiers d'impression 3D, code source et données) sont disponibles sur le <a href="https://github.com/kaelhem/memoprout">dépôt github du projet</a></p>
      </div>
    </div>
  )
}

export default App
