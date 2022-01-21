import React from 'react';
import ReactDOM from 'react-dom';
import { StoreContext } from 'storeon/react';

import './index.css';
import Main from './Main';
import { store } from './store';


ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <Main />
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

