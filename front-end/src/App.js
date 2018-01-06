import React from 'react';
import './App.css';
// import Loading from './components/Loading';
import AppBar from 'material-ui/AppBar';
import TextAppContainer from './containers/TextAppContainer.js';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
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

    return (
      <div className="App">
        <AppBar
          title="Replicator"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          showMenuIconButton={true}
          onLeftIconButtonClick={this.handleToggle}
        />
        <div>
          <a href={loginLink}>Log In</a>
        </div>
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          <MenuItem checked={true} onClick={this.handleClose}>
            Replicator
          </MenuItem>
          <MenuItem onClick={this.handleClose}>Gallery</MenuItem>
        </Drawer>
        {this.props.loading ? '' : <TextAppContainer />}
      </div>
    );
  }
}

export default App;
