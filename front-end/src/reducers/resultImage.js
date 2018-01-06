const resultImage = (state = [], action) => {
  let newState = Object.assign({}, state.slice(-1)[0]);
  console.log(`action.type in reducer: ${action.type}`);
  switch (action.type) {
    case 'REQUEST_STARTED':
      newState['loading'] = true;
      return [...state, newState];
    case 'REQUEST_SUCCEEDED':
      newState['uploadID'] = action.uploadID;
      newState['loading'] = false;
      return [...state, newState];
    case 'REQUEST_FAILED':
      newState['loading'] = false;
      return [...state, newState];
    default:
      return state;
  }
};

export default resultImage;
