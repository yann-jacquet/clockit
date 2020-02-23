/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  MemoryRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import routes from './views/routes';
import './App.css';

// hooks
import useFileSystem from './hooks/useFileSystem';

function App() {
  const [getParams] = useFileSystem({ src: 'user-preferences' });
  const userParams = getParams('appConfig');

  // TODO: if no user-pref and unsync-task files created, should create them

  return (
    <MemoryRouter>
      <Switch>
        { routes.map((route) => <Route key={route.path} {...route} />) }
      </Switch>
      {userParams
        ? null
        : <Redirect to="/integration-selection" />}
    </MemoryRouter>
  );
}

export default App;
