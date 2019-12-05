import React from 'react'
import { Segment, Menu, Container } from 'semantic-ui-react'
import NavItems from 'components/navitems'
import ConnectButtons from 'components/connect-buttons'

const AppMenu = () => (
  <Segment
    id='topbar-desktop'
    inverted
    textAlign='center'
    style={{ padding: 0, height: 50 }}
    vertical
  >
    <Menu inverted fixed={'top'} size='large' style={{ borderBottom: '1px rgba(255,255,255,.08) solid' }}>
      <Container>
        <NavItems />
        <ConnectButtons />
      </Container>
    </Menu>
  </Segment>
)

export default AppMenu