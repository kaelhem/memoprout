import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as deviceActions } from 'core/reducers/device'
import { Message, Button, Icon, Divider } from 'semantic-ui-react'
import avrbro from 'avrbro'
const { isAvailable } = avrbro

const MyMemo = (props) => {
  return !isAvailable() ? (
    <Message>
      <p></p>
      <p>Afin de connecter votre MemoProut Pad, vous devez utiliser Chrome <b>et</b> activer cette option:</p>
      <code>chrome://flags/#enable-experimental-web-platform-features</code>
      <p style={{fontStyle: 'italic'}}>Copier/coller cette adresse dans un nouvel onglet pour activer la Web Serial Api.</p>
    </Message>
  ) : (props.isConnected ? (
    <Message>
      <Button loading={ props.isPending } disabled={ props.isPending } onClick={ props.disconnect }>
        <Icon name='usb' />
        Déconnecter mon MemoProut Pad
      </Button>
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
  ))
}

const mapStateToProps = ({ device }) => {
  return {
    isConnected: device.isConnected,
    isPending: device.isPending,
    version: device.getVersion,
    games: device.getGames
  }
}

const mapDispatchToProps = (dispatch) => ({
  connect: bindActionCreators(deviceActions.connect, dispatch),
  disconnect: bindActionCreators(deviceActions.disconnect, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MyMemo)