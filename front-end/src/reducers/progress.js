import { ROUTE_CHANGE } from '../actions/routeChange.js';
const progress = (
  state = [{ progress: 0, fetching: false, imgurl: '' }],
  action
) => {
  let newState = Object.assign({}, state.slice(-1)[0]);
  // console.log(`${action.type} in reducer: ${JSON.stringify(action)}`);
  switch (action.type) {
    case 'PROGRESS_STARTED':
      newState['isFetching'] = true;
      return [...state, newState];
    case 'PROGRESS_CHECKED':
      if (action.progress === undefined) {
        console.log('\n\n\naction.progress is undefined\n\n\n');
      }
      newState['progress'] = action.progress;
      newState['isFetching'] = false;
      return [...state, newState];
    case 'PROGRESS_COMPLETE':
      newState['progress'] = 100;
      newState['imgurl'] = action.payload.imageLocation;
      return [...state, newState];
    case 'PROGRESS_FAILED':
      newState['progress'] = action.progress;
      return [...state, newState];
    case 'RECEIVED_IMAGE':
      newState['imgurl'] = action.payload.imageLocation;
      return [...state, newState];
    case 'UPLOAD_SUCCEEDED':
      newState['imgurl'] = '';
      newState['progress'] = 0;
      return [...state, newState];
    case ROUTE_CHANGE:
      newState['imgurl'] = '';
      newState['progress'] = 0;
      return [...state, newState];
    default:
      return state;
  }
};

export default progress;
