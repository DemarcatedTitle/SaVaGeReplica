import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppContainer from './containers/AppContainer';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import TextApp from './reducers/index.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Root from './Root';
// import createHistory from 'history/createBrowserHistory';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
// import {
//   ConnectedRouter,
//   routerReducer,
//   routerMiddleware,
//   push,
// } from 'react-router-redux';

// const history = createHistory();
// const middleware = routerMiddleware(history);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(TextApp, composeEnhancers(applyMiddleware(thunk)));
// ReactDOM.render(
//   <MuiThemeProvider>
//     <Provider store={store}>
//       <AppContainer />
//     </Provider>
//   </MuiThemeProvider>,
//   document.getElementById('root')
// );
ReactDOM.render(
  <MuiThemeProvider>
    <Root store={store} />
  </MuiThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
export { store };
