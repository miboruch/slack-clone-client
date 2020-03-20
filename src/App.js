import React, { useEffect } from 'react';
import './App.css';
import Layout from './components/templates/Layout';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/ServerPage';
import { authenticationCheck } from './actions/authenticationActions';

function App({ isLoggedIn, loading, authenticationCheck }) {
  useEffect(() => {
    authenticationCheck();
  }, []);

  return (
    <Router>
      <Layout>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Switch>
            {isLoggedIn ? (
              <>
                <Route path={'/'} component={LandingPage} />
              </>
            ) : (
              <>
                <Route path={'/'} component={AuthPage} />
                <Redirect exact from={'/'} to={'/login'} />
              </>
            )}
          </Switch>
        )}
      </Layout>
    </Router>
  );
}

const mapStateToProps = ({ authenticationReducer: { isLoggedIn, loading } }) => {
  return { isLoggedIn, loading };
};

const mapDispatchToProps = dispatch => {
  return {
    authenticationCheck: () => dispatch(authenticationCheck())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
