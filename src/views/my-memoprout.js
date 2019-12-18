import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as deviceActions } from 'core/reducers/device'
import { LAST_FIRMWARE_VERSION } from 'core/mpp-constants'
import { Message, Button, Icon, Divider, Label, Modal } from 'semantic-ui-react'
import avrbro from 'avrbro'
const { isAvailable } = avrbro

const MyMemo = (props) => {

  const [modalIsOpen, setModalOpened] = useState(false)

  const handleUpdate = async () => {
    setModalOpened(true)
    props.flashFimware()
  }

  return (
    <Fragment>
    { !isAvailable() ? (
      <Message>
        <p></p>
        <p>Afin de connecter votre MemoProut Pad, vous devez utiliser Chrome <b>et</b> activer cette option:</p>
        <code>chrome://flags/#enable-experimental-web-platform-features</code>
        <p style={{fontStyle: 'italic'}}>Copier/coller cette adresse dans un nouvel onglet pour activer la Web Serial Api.</p>
      </Message>
    ) : (props.isConnected ? (
      <Message>
        { LAST_FIRMWARE_VERSION === props.version ? (
          <h3>Le firmware de votre MemoProut Pad est à jour !</h3>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h3>Une version plus récente du firmware est disponible !</h3>
            <Button onClick={ handleUpdate }>Mettre à jour</Button>
          </div>
        )}
        <Divider />
        <div style={{ fontWeight: 'bold', marginBottom: '.5em' }}>Modes de jeux installés ({ props.games ? props.games.length : '0' })</div>
        <div>
          { (props.games && props.games.length > 0) ? (
            props.games.map((game, idx) => <Label key={`game-${idx}`}>{game}</Label>)
          ) : (
            <p>Il n'y a aucun mode de jeu installé sur votre MemoProut Pad</p>
          )}
        </div>
        <Divider />
        <div style={{ textAlign: 'center' }}>
          <Button loading={ props.isPending } disabled={ props.isPending } onClick={ props.disconnect } color='red'>
            <Icon name='window close outline' />
            Déconnecter mon MemoProut Pad
          </Button>
        </div>
      </Message>
    ) : (
      <Message>
        <p>Afin de connecter votre MemoProut Pad, branchez-le via le port USB. La séquence de démarrage va se lancer.</p>
        <p>Une fois que les leds du menu sont éclairées, cliquez sur le bouton de connexion et sélectionnez <b>cu.usbserial-1410</b></p>
        <Divider />
        <div style={{ textAlign: 'center' }}>
          <Button loading={ props.isPending } disabled={ props.isPending } onClick={ props.connect }>
            <Icon name='usb' />
            Connecter mon MemoProut Pad
          </Button>
        </div>
      </Message>
    ))}
    <Modal
      open={modalIsOpen}
      closeOnEscape={false}
      closeOnDimmerClick={false}
      onClose={() => setModalOpened(false)}
    >
      <Modal.Header>Mise à jour du firmware</Modal.Header>
      <Modal.Content>
        { props.isFlashing ? (
          <Fragment>
            <h5>Flasher un firmware n'est pas une opération anodine. Pendant la mise à jour, merci de respecter ces consignes :</h5>
            <ul>
              <li>Ne fermez pas cette page</li>
              <li>Ne débranchez pas votre MemoProut Pad</li>
              <li>Ne pétez pas</li>
            </ul>
            <p>Opération en cours... Cela peut prendre une vingtaine de secondes</p>
          </Fragment>
        ) : (
          <div>
            { props.flashError ? (
              <div>
                <p>Bon ben ça à foiré... La bonne nouvelle c'est que vous avez de nouveau le droit de péter !</p>
                <Divider />
                <p>Vous pouvez ouvrir un ticket sur le <a href="https://github.com/kaelhem/memoprout/issues" target="_blank" rel="noopener noreferrer">github du projet</a> ou m'envoyer un message via le <a href="https://memoproutpad.netlify.com/#contact" target="_blank" rel="noopener noreferrer">formulaire de contact</a> du site web.</p>
                <p>Si j'ai le temps j'essaierai de voir ce que je peux faire !</p>
              </div>
            ) : (
              <p>Youpi ça a marché ! Vous avez de nouveau le droit de péter !</p>
            )}
          </div>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button loading={ props.isFlashing } disabled={ props.isFlashing } onClick={() => setModalOpened(false)} content='Fermer' />
      </Modal.Actions>
    </Modal>
    </Fragment>
  )
}

const mapStateToProps = ({ device }) => {
  return {
    isConnected: device.isConnected,
    isPending: device.isPending,
    isFlashing: device.isFlashing,
    flashError: device.flashError,
    version: device.version,
    games: device.games
  }
}

const mapDispatchToProps = (dispatch) => ({
  connect: bindActionCreators(deviceActions.connect, dispatch),
  disconnect: bindActionCreators(deviceActions.disconnect, dispatch),
  flashFimware: bindActionCreators(deviceActions.flash, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MyMemo)