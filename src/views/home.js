import React from 'react'
import { Label, Divider } from 'semantic-ui-react'

const Home = () => {
  return (
    <div>
      <h1>MemoProut Pad Connect <Label color='pink' style={{ fontStyle: 'italic', position: 'relative', top: -5 }}>Beta</Label></h1>
      <Divider />
      <p>Cher MemoProuteur, cette humble webapp va te permettre de mettre ton MemoProut Pad à jour et d'installer les différents modes de jeux disponibles.</p>
      <p>Cette webapp utilise des fonctionalités qui ne sont pas encore complètement implémentés par les navigateurs (et ne fonctionne qu'avec Chrome avec une option expériementale).</p>
      <p>Soit donc indulgent si ça ne marche pas et n'hésite pas à m'en informer via <a href="https://memoproutpad.netlify.com/#contact" target="_blank" rel="noopener noreferrer">le formulaire de contact du site web</a>.</p>
      <p>Enjoy ;)</p>
    </div>
  )
}

export default Home
