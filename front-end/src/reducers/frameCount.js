import { SET_FRAME_COUNT } from '../actions/frameCount';

const frameCount = (state = [], action) => {
  let newState = Object.assign({}, state.slice(-1)[0]);
  switch (action.type) {
    case SET_FRAME_COUNT:
      newState[action.imageID] = action.frameCount;

      return [...state, newState];
    default:
      return state;
  }
};

export default frameCount;
