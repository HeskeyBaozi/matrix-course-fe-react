import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './index.less';
import registerServiceWorker from './registerServiceWorker';

render(
  <App/>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
