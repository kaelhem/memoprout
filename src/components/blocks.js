import React from 'react'

const footerStyle = {
  minHeight: 80,
  fontSize: '0.8em',
  padding: 0,
  width: '100vw'
}

const Blocks = ({ children }) => (
  <div className="blocks-container">
    { React.Children.map(children, (child, idx) => (
      <div
        className={ idx % 2 === 0 ? 'block' : 'inverted-block' }
        style={ idx === children.length-1 ? footerStyle : {}}
        id={ child.props.id || 'block-' + idx }
      >{child}</div> 
    ))}
  </div>
)

export default Blocks