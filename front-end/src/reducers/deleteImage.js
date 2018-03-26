const deleteImage = (
  state = [{ deleteImage: 0, fetching: false, imageId: '' }],
  action
) => {
  let newState = Object.assign({}, state.slice(-1)[0]);
  switch (action.type) {
    case 'DELETE_IMAGE_REQUEST':
      newState['isFetching'] = true;
      newState['imageId'] = action.imageId;
      return [...state, newState];
    case 'DELETE_IMAGE_REQUEST_SUCCESSFUL':
      newState['isFetching'] = false;
      newState['imageId'] = '';
      return [...state, newState];
    case 'DELETE_IMAGE_REQUEST_FAILED':
      newState['isFetching'] = false;
      newState['imageId'] = '';
      return [...state, newState];
    default:
      return state;
  }
};

export default deleteImage;
