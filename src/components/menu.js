import React, { Fragment } from 'react'
import logo from 'icons/logo-filled.svg'
import logoNotFilled from 'icons/logo.svg'
import { slide as Menu } from 'react-burger-menu'
import './burger-menu.css'

const MenuItems = () => (
  <Fragment>
    <div><a href="#description">MemoProut Pad</a></div>
    <div><a href="#opensource">Open Source</a></div>
    <div><a href="#faq">FAQ</a></div>
    <div><a href="#contact">Contact</a></div>
  </Fragment>
)

const PageHeader = () => (
  <div className="page-header">
    <a href="#top"><img src={ logo } width="15" alt="logo" /></a>
    <MenuItems />
  </div>
)

export const BurgerMenu = () => (
  <Menu>
    <div className="burger-menu-items">
      <a href="#top">
        <img src={ logoNotFilled } width="30" alt="logo" style={{ position: 'absolute' }} />
        <img className="logo-filled" src={ logo } width="30" alt="logo" />
      </a>
      <MenuItems />
    </div>
  </Menu>
)

export default PageHeader
