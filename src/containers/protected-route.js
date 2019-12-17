import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

const ProtectedRoute = (props) => {
  const {component: Component, path, isLogged} = props
  return !isLogged ? <Redirect to="/" /> : <Route exact path={ path } component={ Component } />
}

const mapStateToProps = ({ firebase }) => {
  const { auth } = firebase
  return {
    isLogged: !!auth && !!auth.uid && auth.emailVerified
  }
}

export default connect(mapStateToProps)(ProtectedRoute)