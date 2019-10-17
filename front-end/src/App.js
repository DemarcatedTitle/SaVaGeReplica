import React from "react";
import "./App.css";
// import Loading from './components/Loading';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import TextAppContainer from "./containers/TextAppContainer.js";
import GalleryContainer from "./containers/GalleryContainer.js";
import AnimatorContainer from "./containers/AnimatorContainer.js";
import Drawer from "@material-ui/core/Drawer";
import { NavLink } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import { store } from "./index";

import { ROUTE_CHANGE } from "./actions/routeChange";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, component: "" };
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
    const prevPage = prevProps.match.params.page;
    const currentPage = this.props.match.params.page;

    if (prevPage !== currentPage) {
      store.dispatch(ROUTE_CHANGE);
    }
  }

  render() {
    const page = this.props.match.params.page
      ? this.props.match.params.page
      : "replicator";
    const pageTitle = page.charAt(0).toUpperCase() + page.slice(1);
    const validRoutes = ["replicator", "gallery", "animator"];

    return (
      <div className="App">
        <AppBar
          title={pageTitle}
          position="static"
          // iconClassNameRight="muidocs-icon-navigation-expand-more"
          // showMenuIconButton={true}
        >
          <Toolbar>
            <IconButton onClick={this.handleToggle} edge="start">
              <MenuIcon></MenuIcon>
            </IconButton>
          </Toolbar>
          <Drawer
            width={200}
            open={this.state.open}
            // onRequestChange={open => this.setState({ open })}
          >
            <NavLink to="/replicator">
              <MenuItem
                checked={page === "replicator"}
                onClick={this.handleClose}
              >
                Replicator
              </MenuItem>
            </NavLink>
            <NavLink to="/gallery">
              <MenuItem checked={page === "gallery"} onClick={this.handleClose}>
                Gallery{" "}
              </MenuItem>
            </NavLink>
            <NavLink to="/animator">
              <MenuItem
                checked={page === "animator"}
                onClick={this.handleClose}
              >
                Animator
              </MenuItem>
            </NavLink>
          </Drawer>
        </AppBar>
        {page === "replicator" ? <TextAppContainer /> : ""}
        {page === "gallery" ? <GalleryContainer /> : ""}
        {page === "animator" ? <AnimatorContainer /> : ""}
        {!validRoutes.includes(page) ? "Page not found" : ""}
      </div>
    );
  }
}

export default App;
// {this.props.loading ? '' : <TextAppContainer />}
