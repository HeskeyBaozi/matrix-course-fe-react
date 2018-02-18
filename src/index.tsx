import { useStrict } from 'mobx';
import React from 'react';
import { render } from 'react-dom';
import './index.less';
import App from './pages/index';
import registerServiceWorker from './registerServiceWorker';

useStrict(true);

render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
