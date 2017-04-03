import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import createAppStore from './createStore';
import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={createAppStore()}>
    <App />
  </Provider>,
  document.querySelector('.app')
);

if (module.hot) {
  module.hot.accept();
}
