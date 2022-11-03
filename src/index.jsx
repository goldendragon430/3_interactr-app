const process = import.meta;

import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
// import Honeybadger from 'honeybadger-js'
// import ErrorBoundary from 'honeybadger-io'
import "./index.scss"

const config = {
  api_key: 'eeff9826',
  environment: import.meta.env.NODE_ENV,
}


//const honeybadger = Honeybadger.configure(config)

const container = document.getElementById('appRoot');
const root = createRoot(container);
root.render(<App tab="home"/> )

