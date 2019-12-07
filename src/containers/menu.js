import React from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { useFirebase } from 'react-redux-firebase'
import { Menu, Container, Button } from 'semantic-ui-react'
import NavItems from 'components/navitems'
import logo from 'icons/logo.svg'

const AppMenu = (props) => {
  const firebase = useFirebase()

  const logOut = async () => {
    await firebase.logout()
  }

  return (
    <div style={{ background: '#aaa', paddingTop: '2em' }}>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1em auto', width: 60, height: 60, padding: 10, borderRadius: 35, background: '#eee', borderWidth: 3, borderColor: '#999', borderStyle: 'solid' }}>
        <img src={ logo } alt="" onClick={ () => props.push('/') } style={{ cursor: 'pointer' }} />
      </div>
      <Menu text vertical size='large'>
        <Container>
          <NavItems />
          <div style={{ display: 'block', height: 1, width: 200, background: '#e2e2e2', margin: '2em auto' }}></div>
          <Button
            style={{ width: 150, margin: 'auto' }}
            onClick={ logOut }
          >Se déconnecter</Button>
        </Container>
      </Menu>
    </div>
  )
}

export default connect(null, { push })(AppMenu)