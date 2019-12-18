import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as deviceActions } from 'core/reducers/device'
import { useFirebase } from 'react-redux-firebase'
import { Loader, Message, Button, Item, Label, Divider, Icon, Confirm } from 'semantic-ui-react'
import { getGameByPath } from 'core/mpp-constants'
import './memo-store.css'

const GameItem = ({ game, deviceConnected, lsGames }) => {
  const isInstalled = lsGames.indexOf(game.code) !== -1

  const toggleInstall = () => {
    if (!isInstalled) {
      console.log('install !', game.storage)
    } else {
      console.log('uninstall !', game.code)
    }
  }

  return (
    <Item>
      <Item.Image alt={game.credit_icon} style={{ width: 60 }} src={`assets/game-icons/${game.icon}.svg`} />
      <Item.Content>
        <Item.Header>{ game.name } {isInstalled && (<Label size='mini' color='green' className='installed-game-label'><Icon name='check' /> Installé</Label>)}</Item.Header>
        <Item.Description>{ game.description }</Item.Description>
        { game.code !== 'BASIC' && (
          deviceConnected ? (
            <Item.Extra>
            { isInstalled ? (
              <Button basic onClick={ toggleInstall } color='red'>
                <Icon name='close' /> Désinstaller
              </Button>
            ) : (
              <Button basic onClick={ toggleInstall } color='green'>
                <Icon name='upload' /> Installer
              </Button>
            )}
            </Item.Extra>
          ) : (
            <Label>Connectez votre MemoProut Pad pour l'installer</Label>
          )
        )}
      </Item.Content>
    </Item>
  )
}

const MemoStore = (props) => {
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

  const deviceConnected = props.isConnected
  const lsGames = props.games ? props.games.join(',') : ''

  return (
    (defaultGames && contribGames) ? (
      <div className='store-container'>
        <h2>Modes de jeu par défaut</h2>
        <Divider />
        <Item.Group divided>
        { defaultGames && defaultGames.map((path) => getGameByPath(path)).map((game, idx) => (
          <GameItem key={`default-game-${idx}`} {...{game, deviceConnected, lsGames}} />
        ))}
        </Item.Group>
        <h2 style={{ marginTop: 100 }}>Modes de jeu créés par la communauté</h2>
        <Divider />
        <Item.Group divided>
        { contribGames && contribGames.map((path) => getGameByPath(path)).map((game, idx) => (
          <GameItem key={`contrib-game-${idx}`} {...{game, deviceConnected, lsGames}} />
        ))}
        </Item.Group>
      </div>
    ) : (error ? (
      <Message>Ho non, c'est tout cassé ! Réessayes plus tard, on sait jamais...</Message>
    ) : (
      <div className='games-loader'>
        <Loader active={true} inline='centered' />
      </div>
    )
  ))
}

const mapStateToProps = ({ device }) => {
  return {
    isConnected: device.isConnected,
    isInstalling: device.isInstalling,
    games: device.games
  }
}

const mapDispatchToProps = (dispatch) => ({
  install: bindActionCreators(deviceActions.install, dispatch),
  uninstall: bindActionCreators(deviceActions.uninstall, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MemoStore)