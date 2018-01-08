import { fetchProgress } from './progress';
export const uploadImage = function uploadImage(payload) {
  return function(dispatch) {
    dispatch({ type: 'UPLOAD_STARTED' });
    return fetch('/api/image', {
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
