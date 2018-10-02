import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

import './index.css';

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';

import App from './App';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
