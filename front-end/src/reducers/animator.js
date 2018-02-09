function newFrame() {
  return new Map([
    ['numberOfShapes', ''],
    ['mode', 'triangle'],
    ['rep', ''],
    ['nth', ''],
    ['alpha', ''],
    ['backgroundcolor', ''],
  ]);
}
function increaseFrames(currentFrameMap, currentFrameNumber, newFrameNumber) {
  const nextFrameMap = new Map(
    Array.from(currentFrameMap.entries()).concat(currentFrameNumber, newFrame())
  );
  if (currentFrameNumber === newFrameNumber) {
    return currentFrameMap;
  } else {
    return increaseFrames(nextFrameMap, currentFrameNumber + 1, newFrameNumber);
  }
}
function removeFrames(currentFrameMap, currentFrameNumber, newFrameNumber) {
  const numFramesToRemove = currentFrameNumber - newFrameNumber;
  return new Map(Array.from(currentFrameMap).slice(0, -numFramesToRemove));
}
const animator = (state = [new Map([[0, newFrame()]])], action) => {
  const newState = new Map(state.slice(-1)[0]);
  const prevState = state.slice(-1)[0];

  switch (action.type) {
    case 'FRAME_NUMBER_MODIFIED':
      if (action.number > prevState.size) {
        // const nextFrameNumber = prevState.size + action.number;
        return [
          ...state,
          increaseFrames(prevState, prevState.size, action.number),
        ];
      } else if (action.number < prevState.size) {
        return [
          ...state,
          removeFrames(prevState, prevState.size, action.number),
        ];
      }
      // newState[action.number.id] = {
      //   id: action.number.id,
      //   value: action.number.value,
      // };

      return [...state, newState];
    case 'INCREMENT_FRAME_NUMBER':
      return [...state, prevState.set(prevState.size, newFrame())];
    case 'DECREMENT_FRAME_NUMBER':
      if (prevState.size > 2) {
        prevState.delete(prevState.size - 1);
      }
      return [...state, prevState];

    default:
      console.log('DEFAULT');
      return state;
  }
};

export default animator;