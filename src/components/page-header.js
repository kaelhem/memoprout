import React from 'react'
import logo from './logo-filled.svg'

const PageHeader = () => (
  <div className="page-header">
    <a href="#top"><img src={ logo } width="15" alt="logo" /></a>
    <a href="#description">MemoProut Pad©</a>
    <a href="#opensource">Open Source</a>
    <a href="#faq">FAQ</a>
    <a href="#contact">Contact</a>
  </div>
)

export default PageHeader