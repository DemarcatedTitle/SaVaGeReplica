import React from 'react';
import './App.css';
// import Loading from './components/Loading';
import AppBar from 'material-ui/AppBar';
import TextAppContainer from './containers/TextAppContainer.js';
import SavageGallery from './components/SavageGallery';
import Drawer from 'material-ui/Drawer';
import { NavLink } from 'react-router-dom';
import MenuItem from 'material-ui/MenuItem';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();
const location = history.location;

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
  render() {
    // ${providerDomain}/op/auth
    // ?client_id=${clientId}
    // &response_type=code
    // &scope=${scope}
    // &redirect_uri=${config.redirectUri}
    // &nonce=nonce
    const loginLink = `http://localhost.test:7000/op/auth?client_id=client_id&response_type=code&scope=openid&redirect_uri=http://localhost:3000&nonce=1531abc`;
    const page = this.props.match.params.page;
    const pageTitle = page.charAt(0).toUpperCase() + page.slice(1);
    console.log(pageTitle);

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
        </Drawer>
        {page === 'replicator' ? <TextAppContainer /> : ''}
        {page === 'gallery' ? <SavageGallery /> : ''}
        {page !== 'replicator' || 'gallery' ? 'Page not found' : ''}
      </div>
    );
  }
}

export default App;
// {this.props.loading ? '' : <TextAppContainer />}
