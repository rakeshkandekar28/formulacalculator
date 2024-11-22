import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { App } from './app';
import './global.css';

const history = createBrowserHistory();


ReactDOM.render(
    <Router history={history}>
      <App />
    </Router>,
  document.getElementById('root')
);
