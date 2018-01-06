const App = (state = [{ loading: false }], action) => {
  switch (action.type) {
    case 'IS_LOADING':
      return [
        ...state,
        {
          loading: action.loading,
        },
      ];
    default:
      return state;
  }
};

export default App;
