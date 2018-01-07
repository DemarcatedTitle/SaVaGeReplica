const resultImage = (state = [], action) => {
  let newState = Object.assign({}, state.slice(-1)[0]);
  switch (action.type) {
    case 'UPLOAD_STARTED':
      newState['loading'] = true;
      return [...state, newState];
    case 'UPLOAD_SUCCEEDED':
      newState['uploadID'] = action.uploadID;
      newState['loading'] = false;
      return [...state, newState];
    case 'UPLOAD_FAILED':
      newState['loading'] = false;
      return [...state, newState];
    default:
      return state;
  }
};

export default resultImage;
