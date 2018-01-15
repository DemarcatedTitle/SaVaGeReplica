const allImages = (
  state = [{ isFetching: false, IDS: [], imageLocations: [] }],
  action
) => {
  let newState = Object.assign({}, state.slice(-1)[0]);
  switch (action.type) {
    case 'FETCHALLIMAGES_STARTED':
      newState['isFetching'] = true;
      return [...state, newState];
    case 'FETCHALLIMAGES_IDS_ACQUIRED':
      newState['IDS'] = action.payload;
      return [...state, newState];
    case 'IMAGE_REQUEST_SUCCESSFUL':
      newState['imageLocations'] = newState['imageLocations'].concat([
        action.payload,
      ]);
      return [...state, newState];
    default:
      return state;
  }
};

export default allImages;
