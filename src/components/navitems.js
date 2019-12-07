import React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { getLocation } from 'connected-react-router'

const entries = [
  {name: 'Mon MemoProut Pad', uid: '/mon-memoprout-pad'},
  {name: 'Memo Store', uid: '/memo-store'},
  {name: 'Memo Maker', uid: '/memo-maker'}
]

const NavItems = ({ activePath }) => {
  return entries.map(({name, uid}, idx) => (
    <Menu.Item
      as={ Link }
      to={ `${uid}` }
      key={ idx }
      active={ uid === activePath }
    >{ name }</Menu.Item>
  ))
}


const mapStateToProps = (state) => ({
  activePath: getLocation(state).pathname
})

export default connect(mapStateToProps)(NavItems)