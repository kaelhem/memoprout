import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Responsive,
  Icon,
  Container,
  Segment,
  Menu,
  Sidebar
} from 'semantic-ui-react'
import Footer from './footer'
import NavItems from 'components/navitems'
import ConnectButtons from 'components/connect-buttons'

// Heads up!
// We using React Static to prerender our docs with server side rendering, this is a quite simple solution.
// For more advanced usage please check Responsive docs under the "Usage" section.
const getWidth = () => {
  const isSSR = typeof window === 'undefined'
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

const responsiveStyles = {
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
}

class DesktopContainer extends Component {
  render() {
    const { children, header } = this.props
    const PageHeader = header
    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth} style={ responsiveStyles }>
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
        { header && (
          <PageHeader />
        )}
        <Container text style={{ margin: '100px 0', flexGrow: 1 }}>
          { children }
        </Container>
        <Footer />
      </Responsive>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends Component {
  state = {}

  handleSidebarHide = () => this.setState({ sidebarOpened: false })

  handleToggle = () => this.setState({ sidebarOpened: true })

  render() {
    const { children, header } = this.props
    const { sidebarOpened } = this.state
    const PageHeader = header
    return (
      <Responsive
        as={ Sidebar.Pushable }
        getWidth={ getWidth }
        maxWidth={ Responsive.onlyTablet.minWidth-1 }
        style={ responsiveStyles }
      >
        <Sidebar
          as={ Menu }
          animation='push'
          inverted
          onHide={ this.handleSidebarHide }
          vertical
          visible={ sidebarOpened }
        >
          <Container>
            <NavItems />
          </Container>
        </Sidebar>

        <Sidebar.Pusher dimmed={ sidebarOpened }>
          <Segment
            id='topbar-mobile'
            inverted
            textAlign='center'
            style={{ padding: 0 }}
            vertical
          >
            <Container>
              <Menu inverted secondary size='tiny'>
                <Menu.Item onClick={ this.handleToggle }>
                  <Icon name='sidebar' size='large' />
                </Menu.Item>
                <ConnectButtons />
              </Menu>
            </Container>
          </Segment>
          { header && (
            <PageHeader isMobile />
          )}
          <Container text style={{ margin: '50px 0', flexGrow: 1 }}>
            { children }
          </Container>
          <Footer />
        </Sidebar.Pusher>
      </Responsive>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children, header }) => (
  <div>
    <DesktopContainer header={ header }>{children}</DesktopContainer>
    <MobileContainer header={ header }>{children}</MobileContainer>
  </div>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

export default ResponsiveContainer