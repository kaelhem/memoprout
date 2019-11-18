import React, { Fragment } from 'react'
import iconArduino from 'icons/arduino.svg'
import icon3dPrint from 'icons/3d-print.svg'
import iconCncMill from 'icons/cnc-mill.svg'

const Opensource = () => (
  <Fragment>
    <h2>Il est libre, Memo !</h2>
    <p>Entièrement open-source, MemoProut Pad est fabriqué uniquement avec des matériaux et composants peu chers et facilement trouvables.</p>
    <div className="opensource-icons">
      <div>
        <img src={icon3dPrint} alt="3D printing by Oleksandr Panasovskyi from the Noun Project" />
      </div>
      <div>
        <img src={iconArduino} alt="arduino by uizin from the Noun Project" />
      </div>
      <div>
        <img src={iconCncMill} alt="CNC Router by Nick Green from the Noun Project" />
      </div>
    </div>
    <p>L'intégralité des sources (schèma électronique, plans de découpe cnc/laser, fichiers d'impression 3D, code source et données) sont disponibles sur le <a href="https://github.com/kaelhem/memoprout">dépôt github du projet</a></p>
  </Fragment>
)

export default Opensource
