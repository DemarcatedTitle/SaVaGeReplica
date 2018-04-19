export const SET_FRAME_COUNT = 'SET_FRAME_COUNT';

export const setFrameCount = (payload) => {

  return { type: SET_FRAME_COUNT, frameCount: payload.frameCount, imageID: payload.imageID };
};
