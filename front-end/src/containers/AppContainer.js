import { connect } from 'react-redux';
import { isLoading } from '../actions';
import App from '../App.js';

const mapStateToProps = state => {
  const loading = state.App.slice(-1) ? state.App.slice(-1)[0].loading : false;
  return {
    loading: loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    isLoading: loading => {
      dispatch(isLoading(loading));
    },
  };
};
const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
