import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import SavageGallery from './components/SavageGallery';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import { NavLink } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import TextAppContainer from './containers/TextAppContainer.js';

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <div>
        <Route path="/:page?" component={App} />
      </div>
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
