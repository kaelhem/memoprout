import React from 'react'
import withSizes from 'react-sizes'
import Menu, { BurgerMenu } from './components/menu'
import Blocks from './components/blocks'
import Header from './blocks/header'
import Picture from './blocks/picture'
import Description from './blocks/description'
import Opensource from './blocks/opensource'
import FAQ from './blocks/faq'
import Contact from './blocks/contact'
import Footer from './blocks/footer'
import './app.css'

const App = ({ isLargeScreen }) => (
  <div>
    { isLargeScreen ? (
      <Menu />
    ) : (
      <div className="burger-menu">
        <div className="bg-burger-button" />
        <BurgerMenu />
      </div>
    ) }
    <Blocks>
      <Header id="top" />
      <Picture id="description" />
      <Description />
      <Opensource id="opensource" />
      <FAQ id="faq" />
      <Contact id="contact" />
      <Footer />
    </Blocks>
  </div>
)

const mapSizesToProps = ({ width }) => ({
  isLargeScreen: width >= 600,
})

export default withSizes(mapSizesToProps)(App)