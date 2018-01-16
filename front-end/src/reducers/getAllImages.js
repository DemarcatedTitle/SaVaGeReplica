const allImages = (
  state = [{ isFetching: false, IDS: [], imageLocations: [], downloaded: [] }],
  action
) => {
  let newState = Object.assign({}, state.slice(-1)[0]);
  switch (action.type) {
    case 'FETCHALLIMAGES_STARTED':
      newState['isFetching'] = true;
      return [...state, newState];
    case 'FETCHALLIMAGES_IDS_ACQUIRED':
      newState['FETCH_QUEUE'] = action.payload;
      return [...state, newState];
    case 'IMAGE_REQUEST_SUCCESSFUL':
      if (!newState['imageLocations'].includes(action.payload)) {
        newState['imageLocations'] = newState['imageLocations'].concat([
          {
            image_location: action.payload.imageLocation,
            id: action.payload.id,
            name: action.payload.name,
          },
        ]);
      }
      newState['downloaded'] = newState['downloaded'].concat([
        action.payload.id,
      ]);
      return [...state, newState];
    default:
      return state;
  }
};

export default allImages;
