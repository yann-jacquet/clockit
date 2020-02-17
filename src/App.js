import React, { useEffect } from 'react';
import {
  MemoryRouter,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import routes from "./views/routes";
import './App.css';

// hooks
import useFileSystem from './hooks/useFileSystem'

function App() {
  const [getParams] = useFileSystem();
  const userParams = getParams('appConfig');

  return (
    <MemoryRouter>
      <Switch>
        { routes.map(route => <Route key={route.path} {...route}/>) }
      </Switch>
      {userParams
        ? null
        : <Redirect to ="/integration-selection" />
      }
    </MemoryRouter>
  );
}

export default App;
