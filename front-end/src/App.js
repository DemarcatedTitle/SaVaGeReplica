import React from 'react';
import './App.css';
// import Loading from './components/Loading';
import AppBar from 'material-ui/AppBar';
import TextAppContainer from './containers/TextAppContainer.js';
import GalleryContainer from './containers/GalleryContainer.js';
import AnimatorContainer from './containers/AnimatorContainer.js';
import Drawer from 'material-ui/Drawer';
import { NavLink } from 'react-router-dom';
import MenuItem from 'material-ui/MenuItem';
import { store } from './index';

import { ROUTE_CHANGE } from './actions/routeChange';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, component: '' };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleToggle() {
    this.setState({ open: !this.state.open });
  }
  handleClose() {
    this.setState({ open: false });
  }

  componentDidUpdate(prevProps, prevState) {
    const  prevPage  = prevProps.match.params.page;
    const currentPage = this.props.match.params.page;

    if (prevPage !== currentPage) {
      store.dispatch(ROUTE_CHANGE);
    }

  }

  render() {
    // ${providerDomain}/op/auth
    // ?client_id=${clientId}
    // &response_type=code
    // &scope=${scope}
    // &redirect_uri=${config.redirectUri}
    // &nonce=nonce
    const page = this.props.match.params.page
      ? this.props.match.params.page
      : 'replicator';
    const pageTitle = page.charAt(0).toUpperCase() + page.slice(1);
    const validRoutes = ['replicator', 'gallery', 'animator'];

    return (
      <div className="App">
        <AppBar
          title={pageTitle}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          showMenuIconButton={true}
          onLeftIconButtonClick={this.handleToggle}
        />
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          <NavLink to="/replicator">
            <MenuItem
              checked={page === 'replicator'}
              onClick={this.handleClose}
            >
              Replicator
            </MenuItem>
          </NavLink>
          <NavLink to="/gallery">
            <MenuItem checked={page === 'gallery'} onClick={this.handleClose}>
              Gallery{' '}
            </MenuItem>
          </NavLink>
          <NavLink to="/animator">
            <MenuItem checked={page === 'animator'} onClick={this.handleClose}>
              Animator
            </MenuItem>
          </NavLink>
        </Drawer>
        {page === 'replicator' ? <TextAppContainer /> : ''}
        {page === 'gallery' ? <GalleryContainer /> : ''}
        {page === 'animator' ? <AnimatorContainer /> : ''}
        {!validRoutes.includes(page) ? 'Page not found' : ''}
      </div>
    );
  }
}

export default App;
// {this.props.loading ? '' : <TextAppContainer />}
