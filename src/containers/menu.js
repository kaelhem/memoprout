import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { useFirebase } from 'react-redux-firebase'
import { Menu, Container, Button, Icon } from 'semantic-ui-react'
import NavItems from 'components/navitems'
import logo from 'icons/logo.svg'

const Separator = () => <div style={{ display: 'block', height: 1, background: '#e2e2e2', margin: '1em' }}></div>

const AppMenu = (props) => {
  const firebase = useFirebase()

  const logOut = async () => {
    await firebase.logout()
  }

  return (
    <div style={{ background: '#ccc', paddingTop: '2em' }}>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1em auto', width: 60, height: 60, padding: 10, borderRadius: 35, background: '#eee', borderWidth: 3, borderColor: '#999', borderStyle: 'solid' }}>
        <img src={ logo } alt="" onClick={ () => props.push('/') } style={{ cursor: 'pointer' }} />
      </div>
      <Menu text vertical size='large'>
        <Container>
          <NavItems />
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <Separator />
            <div style={{ fontWeight: 'bold', marginBottom: '0.5em', display: 'inline-flex' }}><Icon name='user' />{ props.profile.email }</div>
            <Button onClick={ logOut }>Se déconnecter</Button>
            { props.deviceConnected && (
              <Fragment>
                <Separator />
                <div style={{ fontWeight: 'bold', marginBottom: '0.5em', display: 'inline-flex' }}><Icon name='usb' />MemoProut Pad connecté</div>
                <div>Version du firmware: { props.deviceVersion }</div>
              </Fragment>
            )}
          </div>
        </Container>
      </Menu>
    </div>
  )
}

const mapStateToProps = ({ device, firebase }) => {
  const { profile } = firebase
  const { isConnected, version } = device
  return {
    deviceConnected: isConnected,
    deviceVersion: version,
    profile
  }
}

export default connect(mapStateToProps, { push })(AppMenu)