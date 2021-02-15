import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import store from './stores/configureStore';
import ReduxIntlProvider from './app/ReduxIntlProvider';
import App from './app/App';

import './scss/index.scss';

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <ReduxIntlProvider>
        <AppContainer>
          <Component />
        </AppContainer>
      </ReduxIntlProvider>
    </Provider>,
    document.getElementById('app')
  );
};

render(App);
if (module.hot) {
  module.hot.accept('./app/App', () => {
    render(App);
  });
}
