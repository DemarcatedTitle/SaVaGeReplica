import { fetchProgress } from './progress';
export const isTyping = number => {
  return {
    type: 'FRAME_NUMBER_MODIFIED',
    number,
  };
};
export const VALUE_CHANGED = value => {
  return {
    type: 'VALUE_CHANGED',
    value,
  };
};
export const INCREMENT_FRAME_NUMBER = { type: 'INCREMENT_FRAME_NUMBER' };
export const DECREMENT_FRAME_NUMBER = { type: 'DECREMENT_FRAME_NUMBER' };
export const uploadImageToAnimate = function uploadImageToAnimate(payload) {
  return function(dispatch) {
    dispatch({ type: 'UPLOAD_STARTED' });
    return fetch('/api/animator/create', {
      method: 'POST',
      body: payload,
      credentials: 'same-origin',
    })
      .then(function(response) {
        if (response.status === 200) {
          response.json().then(data => {
            // const imgurl = URL.createObjectURL(data);
            const uploadID = data.uploadID;
            dispatch({
              type: 'UPLOAD_SUCCEEDED',
              uploadID: uploadID,
            });
            var formData = new FormData();
            formData.append('uploadID', uploadID);
            dispatch(fetchProgress(formData));
          });
        } else {
          return dispatch({
            type: 'UPLOAD_FAILED',
            error: response.statusText,
          });
        }
      })
      .catch(error => {
        console.error(error);
        return dispatch({ type: 'UPLOAD_FAILED', error: error });
      });
  };
};
export const animationInformationChange = function AnimationInformationChange(
  payload
) {
  return {
    type: 'ANIMATION_INFORMATION_CHANGE',
    payload,
  };
};
