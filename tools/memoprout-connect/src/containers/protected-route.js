import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

const ProtectedRoute = ({component: Component, ...props}) => {
  const { path, isLogged } = props
  if( !isLogged ){
    return <Redirect to="/" />
  }
  return (
    <Route exact path={ path } component={ Component } />
  )
}

const mapStateToProps = ({user}) => ({
  isLogged: user.isLogged
})

export default connect(mapStateToProps)(ProtectedRoute)