import React, { Fragment } from 'react'
import logo from './logo.svg'

const Header = () => (
  <Fragment>
    <img src={logo} className="app-logo" alt="logo" />
    <h2>Ceci est une mémolution.</h2>
    <p>(qui est en construction)</p>
  </Fragment>
)

export default Header