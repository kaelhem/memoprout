import React, { useEffect, useState, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as deviceActions } from 'core/reducers/device'
import { useFirebase } from 'react-redux-firebase'
import { Loader, Message, Button, Item, Label, Divider, Icon, Modal } from 'semantic-ui-react'
import { getGameByPath } from 'core/mpp-constants'
import './memo-store.css'

const GameItem = ({ game, deviceConnected, lsGames, handleInstall, handleUninstall }) => {
  const isInstalled = lsGames.indexOf(game.code) !== -1

  const toggleInstall = () => {
    if (!isInstalled) {
      handleInstall(game)
    } else {
      handleUninstall(game)
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

  const [preparingFiles, setPreparingFiles] = useState(false)
  const [installModalIsOpen, setInstallModalOpened] = useState(false)
  const [uninstallModalIsOpen, setUninstallModalOpened] = useState(false)

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

  const handleInstall = async (game) => {
    setPreparingFiles(true)
    setInstallModalOpened(true)
    let folder = firebase.storage().ref(game.storage)
    let subFiles = await folder.listAll()
    const fileNames = subFiles.items.map((fileref) => fileref.location.path.split('/').reverse()[0])
    const fileRefs = subFiles.items.map((fileref) => firebase.storage().ref(fileref.location.path))
    const urls = []
    for (let file of fileRefs) {
      const url = await file.getDownloadURL()
      urls.push(url)
    }
    props.install(game, urls, fileNames)
    setPreparingFiles(false)
  }

  const handleUninstall = (game) => {
    setPreparingFiles(true)
    
    setUninstallModalOpened(true)
    props.uninstall(game)
    setPreparingFiles(false)
  }

  const deviceConnected = props.isConnected
  const lsGames = props.games ? props.games.join(',') : ''

  return (
    <Fragment>
      { (defaultGames && contribGames) ? (
        <div className='store-container'>
          <h2>Modes de jeu par défaut</h2>
          <Divider />
          <Item.Group divided>
          { defaultGames && defaultGames.map((path) => getGameByPath(path)).map((game, idx) => (
            <GameItem key={`default-game-${idx}`} {...{game, deviceConnected, lsGames, handleInstall, handleUninstall}} />
          ))}
          </Item.Group>
          <h2 style={{ marginTop: 100 }}>Modes de jeu créés par la communauté</h2>
          <Divider />
          <Item.Group divided>
          { contribGames && contribGames.map((path) => getGameByPath(path)).map((game, idx) => (
            <GameItem key={`contrib-game-${idx}`} {...{game, deviceConnected, lsGames, handleInstall, handleUninstall}} />
          ))}
          </Item.Group>
        </div>
      ) : (error ? (
        <Message>Ho non, c'est tout cassé ! Réessayes plus tard, on sait jamais...</Message>
      ) : (
        <div className='games-loader'>
          <Loader active={true} inline='centered' />
        </div>
      ))}
      <Modal
        open={installModalIsOpen}
        closeOnEscape={false}
        closeOnDimmerClick={false}
        onClose={() => setInstallModalOpened(false)}
      >
        <Modal.Header>Installation...</Modal.Header>
        <Modal.Content>
          { props.isInstalling || preparingFiles ? (
            <Fragment>
              <p>y'a plus qu'à...</p>
            </Fragment>
          ) : (
            <div>
              { props.installError ? (
                <div>
                  <p>Bon ben ça à foiré... !</p>
                  <Divider />
                  <p>Vous pouvez ouvrir un ticket sur le <a href="https://github.com/kaelhem/memoprout/issues" target="_blank" rel="noopener noreferrer">github du projet</a> ou m'envoyer un message via le <a href="https://memoproutpad.netlify.com/#contact" target="_blank" rel="noopener noreferrer">formulaire de contact</a> du site web.</p>
                  <p>Si j'ai le temps j'essaierai de voir ce que je peux faire !</p>
                </div>
              ) : (
                <p>Installation réussie !</p>
              )}
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button loading={ props.isInstalling } disabled={ props.isInstalling } onClick={() => setInstallModalOpened(false)} content='Fermer' />
        </Modal.Actions>
      </Modal>
      <Modal
        open={uninstallModalIsOpen}
        closeOnEscape={false}
        closeOnDimmerClick={false}
        onClose={() => setUninstallModalOpened(false)}
      >
        <Modal.Header>Désinstallation...</Modal.Header>
        <Modal.Content>
          { props.isUninstalling || preparingFiles ? (
            <Fragment>
              <p>y'a plus qu'à...</p>
            </Fragment>
          ) : (
            <div>
              { props.uninstallError ? (
                <div>
                  <p>Bon ben ça à foiré... !</p>
                  <Divider />
                  <p>Vous pouvez ouvrir un ticket sur le <a href="https://github.com/kaelhem/memoprout/issues" target="_blank" rel="noopener noreferrer">github du projet</a> ou m'envoyer un message via le <a href="https://memoproutpad.netlify.com/#contact" target="_blank" rel="noopener noreferrer">formulaire de contact</a> du site web.</p>
                  <p>Si j'ai le temps j'essaierai de voir ce que je peux faire !</p>
                </div>
              ) : (
                <p>Désinstallation réussie !</p>
              )}
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button loading={ props.isUninstalling } disabled={ props.isUninstalling } onClick={() => setUninstallModalOpened(false)} content='Fermer' />
        </Modal.Actions>
      </Modal>
    </Fragment>
  )
}

const mapStateToProps = ({ device }) => {
  return {
    isConnected: device.isConnected,
    isInstalling: device.isInstalling,
    installError: device.installError,
    isUninstalling: device.isUninstalling,
    uninstallError: device.uninstallError,
    games: device.games
  }
}

const mapDispatchToProps = (dispatch) => ({
  install: bindActionCreators(deviceActions.install, dispatch),
  uninstall: bindActionCreators(deviceActions.uninstall, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MemoStore)