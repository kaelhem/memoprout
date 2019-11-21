import React, { Fragment } from 'react'

const Description = () => (
  <Fragment>
    <h2>MemoProut Pad est LE jeu audio adapté aux pas trop petits et aux plus grands.</h2>
    <div>
      <img className="small-picture" src="assets/pics/mmpp-toilet.jpg" alt="Memoprout Pad - toilet. Photo by Filios Sazeides on Unsplash" />
      <div className="picture-caption">Votre compagnon de toilettes idéal !</div>
    </div>
    <div style={{ fontSize: '0.8em', padding: '1em' }}>
      <p>MemoProut Pad est un jeu de mémorisation.</p>
      <p>Au début de la partie, un son est joué et un bouton est rétro-éclairé. Il faut alors appuyer sur ce bouton. Ensuite, un autre son est joué lié à un autre bouton. Il faut maintenant répéter la séquence complète en repartant du premier bouton. Et ainsi de suite...</p>
      <p>Alors, saurez-vous faire <span style={{fontStyle: 'italic'}}>péter</span> les scores ?</p>
    </div>
    <div style={{ background: '#ccc', width: '60vw', padding: '1.5em' }}>
      <ul className="features-list">
        <li>4 modes de jeu : <i>classic</i>, <i>kids</i>, <i>cinema</i>, <i>music</i></li>
        <li>enregistrement du meilleur score</li>
        <li>interface audio-flatulente</li>
        <li>autonomie démentielle</li>
        <li>hardware et software en <i>open source</i></li>
      </ul>
    </div>
  </Fragment>
)

export default Description
