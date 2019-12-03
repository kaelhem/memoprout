import React, { Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push as navigateTo } from 'connected-react-router'
import { actions as userActions, selectors as userSelectors } from 'core/reducers/user'
import { actions as modalActions, modalConstants } from 'core/reducers/modal'
import { Menu, Label, Dropdown, Button } from 'semantic-ui-react'

const options = [
  { key: 'user', text: 'USER_MENU_PROFILE', icon: 'user', value: 'profile' },
  { key: 'sign-out', text: 'USER_MENU_LOGOUT', icon: 'sign out', value: 'logout' }
]

const ProfileMenu = (props) => {

  const { isLogged, initials, fullname, logout, openModal, navigateTo } = props

  const profileMenuHandler = (e, { value }) => {
    switch (value) {
      case 'logout': {
        logout()
        break
      }
      case 'profile': {
        navigateTo('/profile')
        break
      }
      default: {
        console.log('I dont know this menu entry:', value)
      }
    }
  }

  const profileLabel = (
    <div>
      <Label circular color='blue'>{ initials }</Label>
      <span> { fullname }</span>
    </div>
  )

  return (
    <Menu.Item position='right'>    
      { isLogged ? (
        <Dropdown
          selectOnBlur={ false }
          trigger={ profileLabel }
          options={ options.map(x => ({ ...x, active: false })) }
          onChange={ profileMenuHandler }
          pointing='top left'
          icon={ null }
          id='topbar-profile-menu'
        />
      ) : (
        <Fragment>
          <Button
            onClick={ () => openModal(modalConstants.LOGIN) }
            inverted
            compact
            color='blue'
            icon='user'
            content={ 'LOGIN_BUTTON_LABEL' }
            id='topbar-login-button'
          />
          <Button
            onClick={ () => openModal(modalConstants.REGISTER) }
            compact
            inverted
            style={{ marginLeft: '0.5em' }}
            id='topbar-register-button'
          >{ 'REGISTER_BUTTON_LABEL' }</Button>
        </Fragment>
      )}
    </Menu.Item>
  )
}

const mapStateToProps = (state) => ({
  isLogged: userSelectors.isLogged(state),
  initials: userSelectors.initials(state),
  fullname: userSelectors.fullname(state)
})

const mapDispatchToProps = (dispatch) => ({
  logout: bindActionCreators(userActions.logout, dispatch),
  openModal: bindActionCreators(modalActions.open, dispatch),
  navigateTo: bindActionCreators(navigateTo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMenu)