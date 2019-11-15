import React from 'react'

const Blocks = ({ children }) => (
  <div className="blocks-container">
    { React.Children.map(children, (child, idx) => (
      <div 
        className={ idx % 2 === 0 ? 'block' : 'inverted-block' }
        id={ child.props.id || 'block-' + idx }
      >{child}</div> 
    ))}
  </div>
)

export default Blocks