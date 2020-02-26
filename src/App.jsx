/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  MemoryRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import routes from './views/routes';
import './App.css';

// Components
import Notification from './components/molecules/Notification';

// hooks
import useFileSystem from './hooks/useFileSystem';

const electron = window.require('electron');

function App() {
  const [getParams] = useFileSystem({ src: 'user-preferences' });
  const userParams = getParams('appConfig');
  const [notificationState, setNotificationState] = useState('');

  useEffect(() => {
    electron.ipcRenderer.on('update_available', () => {
      console.log('update available');
      setNotificationState('available');
    });
    electron.ipcRenderer.on('update_downloaded', () => {
      electron.ipcRenderer.removeAllListeners('update_downloaded');
      console.log('update downloaded');
      setNotificationState('ready');
    });
  }, []);

  const handleUpdateClick = () => electron.ipcRenderer.send('restart_app');

  return (
    <MemoryRouter>
      <Switch>
        { routes.map((route) => <Route key={route.path} {...route} />) }
      </Switch>
      {userParams
        ? null
        : <Redirect to="/integration-selection" />}
      {notificationState === 'available'
        || notificationState === 'ready'
        ? (
          <Notification>
            <span>
              {notificationState === 'available'
                ? 'An update is downloading...'
                : 'Update ready to be installed'}
            </span>
            {notificationState === 'ready'
              ? (
                <button
                  className="mt-2 bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-b-4 border-blue-500 hover:border-blue-300"
                  type="button"
                  onClick={handleUpdateClick}
                >
                  Restart & Install
                </button>
              )
              : null}
          </Notification>
        )
        : null}
    </MemoryRouter>
  );
}

export default App;
