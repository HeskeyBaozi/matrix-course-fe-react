import { observer, Provider } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import React from 'react';
import { Router } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { stores } from '../stores';
import { history } from '../utils/history';
import { rootRoutes } from './router';

@observer
export default class App extends React.Component {

  render() {
    return (
      <Provider { ...stores }>
        <div id={ 'app' }>
          <DevTools/>
          <Router history={ history }>
            { renderRoutes(rootRoutes) }
          </Router>
        </div>
      </Provider>
    );
  }
}
