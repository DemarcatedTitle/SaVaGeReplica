const textApp = (state = [], action) => {
  let newState = Object.assign({}, state.slice(-1)[0]);
  switch (action.type) {
    case 'IS_TYPING':
      newState[action.text.id] = {
        id: action.text.id,
        value: action.text.value,
      };

      return [...state, newState];
    default:
      return state;
  }
};

export default textApp;
