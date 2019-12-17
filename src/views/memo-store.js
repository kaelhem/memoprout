import React, { useEffect, useState } from 'react'
import { useFirebase } from 'react-redux-firebase'
import { Loader, Message } from 'semantic-ui-react'

const MemoStore = () => {
  const firebase = useFirebase()
  const storageRef = firebase.storage().ref('')

  const [error, setError] = useState(null)
  const [defaultGames, setDefaultGames] = useState(null)
  const [contribGames, setContribGames] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        let folderRef = storageRef.child('default')
        let subFiles = await folderRef.listAll()
        setDefaultGames(subFiles.prefixes.map(f => f.location.path))

        folderRef = storageRef.child('contrib')
        subFiles = await folderRef.listAll()
        setContribGames(subFiles.prefixes.map(f => f.location.path))
      } catch(e) {
        console.log(e)
        setError(e)
      }
    })()
  }, [])

  return (
    (defaultGames && contribGames) ? (
      <div>
        <div>Modes de jeu par défaut</div>
        { defaultGames && defaultGames.map((game, idx) => (
          <div key={`default-game-${idx}`}>{ game }</div>
        ))}
        <hr/>
        <div>Modes de jeu créés par la communauté</div>
        { contribGames && contribGames.map((game, idx) => (
          <div key={`contrib-game-${idx}`}>{ game }</div>
        ))}
      </div>
    ) : (error ? (
      <Message>Ho non, c'est tout cassé ! Réessayes plus tard, on sait jamais...</Message>
    ) : <Loader active={true} />)
  )
}

export default MemoStore