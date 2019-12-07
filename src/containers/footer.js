import React from 'react'
import logo from 'icons/logo-filled.svg'

const Footer = ({bgColor, color}) => (
  <div style={{ width: '100vw', height: 20, paddingTop: 1, textAlign: 'center', fontSize: 11, color: color || '#999', background: bgColor || '#fff' }}>
    <div>kaelhem © 2019 - Made with <img src={ logo } width="10" alt="logo" /> in Bouguenais-les-Couëts</div>
  </div>
)

export default Footer