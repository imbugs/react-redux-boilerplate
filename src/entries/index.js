import './index.html';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer as routing } from 'react-router-redux';
import reducers from '../reducers/index';
import sagas from '../sagas/index';

//////////////////////
// Store

const initialState = {};
const enhancer = compose(
  applyMiddleware(createSagaMiddleware(sagas)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);
const store = createStore(combineReducers({
  ...reducers, routing,
}), initialState, enhancer);

if (module.hot) {
  module.hot.accept('../reducers', () => {
    const reducers = require('../reducers');
    const combinedReducers = combineReducers({...reducers, routing});
    store.replaceReducer(combinedReducers);
  });
}

//////////////////////
// Render

const history = syncHistoryWithStore(browserHistory, store);

const render = () => {
  const Routes = require('../routes/index');
  ReactDOM.render(
    <Provider store={store}>
      <Routes history={history} />
    </Provider>
  , document.getElementById('root'));
};

if (module.hot) {
  module.hot.accept('../routes/index', () => {
    setTimeout(render);
  });
}

render();
