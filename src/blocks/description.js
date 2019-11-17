import React, { Fragment } from 'react'
import logoPad from './logo-pad.svg'

const Description = () => (
  <Fragment>
    <img src={logoPad} alt="logo-pad" />
    <h2>Votre compagnon de toilettes idéal !</h2>
    <img className="small-picture" src="assets/pics/mmpp-toilet.jpg" alt="Memoprout Pad© - toilet" />
    <p>MemoProut Pad© est LE jeu audio adapté aux pas trop petits et aux plus grands.</p>
    <ul className="features-list">
      <li>4 modes de jeu : <i>classic</i>, <i>kids</i>, <i>cinema</i>, <i>music</i></li>
      <li>enregistrement du meilleur score</li>
      <li>messages défilant sur les 28 boutons rétro-éclairés</li>
      <li>interface audio flatulente</li>
      <li>autonomie démentielle</li>
      <li>hardware et software en <i>open-source</i></li>
    </ul>
  </Fragment>
)

export default Description
