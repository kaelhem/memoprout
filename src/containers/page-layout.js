import React, { Fragment } from 'react'
import Menu from 'containers/menu'
import Footer from 'containers/footer'

const PageLayout = ({ children }) => (
  <Fragment>
    <div style={{ minHeight: 'calc(100% - 20px)', display: 'flex' }}>
      <Menu />
      <div style={{ margin: '2em auto' }}>
        { children }
      </div>
    </div>
    <Footer bgColor='#666' color='#fff' />
  </Fragment>
)

export default PageLayout