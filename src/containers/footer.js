import React from 'react'
import whiteLogo from 'icons/logo-filled.svg'
import greyLogo from 'icons/logo-filled-grey.svg'

const Footer = ({bgColor, color}) => {
  const img = color ? whiteLogo : greyLogo
  return (
    <div style={{ width: '100vw', height: 20, paddingTop: 1, textAlign: 'center', fontSize: 11, color: color || '#999', background: bgColor || '#fff' }}>
      <div>kaelhem © 2019 - Made with <img src={ img } width="10" alt="logo" /> in Bouguenais-les-Couëts</div>
    </div>
  )
}

export default Footer