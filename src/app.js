import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import { Loader } from 'semantic-ui-react'
import LoginView from 'containers/login/login-view'
import ProtectedRoute from 'containers/protected-route'
import PageLayout from 'containers/page-layout'
import withSizes from 'react-sizes'

// views
import Home from 'views/home'
import MyMemo from 'views/my-memoprout'
import MemoStore from 'views/memo-store'
import MemoMaker from 'views/create-game'
import Mentions from './views/legal-mentions'

const Routes = ({ isLargeScreen }) => {
  const auth = useSelector(state => state.firebase.auth)
  if (!isLoaded(auth)) {
    return <Loader active={true} />
  } else if (isEmpty(auth) || (auth.uid && !auth.emailVerified)) {
    if (window.location.pathname === '/mentions') {
      return <Mentions />
    } else {
      return <LoginView {...{isLargeScreen}}  />
    }
  } else {
    return (
      <PageLayout>
        <Switch>
          <Route exact path="/" component={ Home } />
          <Route path="/mentions" component={ Mentions } />
          <ProtectedRoute path="/mon-memoprout-pad" component={ MyMemo } />
          <ProtectedRoute path="/memo-store" component={ MemoStore } />
          <ProtectedRoute path="/memo-maker" component={ MemoMaker } />
          <Redirect to="/" />
        </Switch>
      </PageLayout>
    )
  }
}

export default withSizes(({ width }) => ({ isLargeScreen: width >= 768 }))(Routes)
