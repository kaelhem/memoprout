import React from 'react'
import PageHeader from './components/page-header'
import Blocks from './components/blocks'
import Header from './blocks/header'
import Picture from './blocks/picture'
import Description from './blocks/description'
import Opensource from './blocks/opensource'
import FAQ from './blocks/faq'
import Contact from './blocks/contact'
import Footer from './blocks/footer'
import './app.css'

function App() {
  return (
    <div>
      <PageHeader />
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
}

export default App
