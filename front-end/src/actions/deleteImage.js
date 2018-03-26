export const deleteImage = function deleteImage(imageID) {
  return function(dispatch) {
    dispatch({ type: 'DELETE_IMAGE_REQUEST' });
    return fetch('/api/image/delete/' + imageID, {
      method: 'DELETE',
      credentials: 'same-origin',
    })
      .then(function(response) {
        if (response.status === 200) {
          response.json().then(data => {
            console.log(data);
            dispatch({
              type: 'DELETE_IMAGE_REQUEST_SUCCESSFUL',
            });
          });
        } else {
          return dispatch({
            type: 'DELETE_IMAGE_REQUEST_FAILED',
            error: response.statusText,
          });
        }
      })
      .catch(error => {
        console.error(error);
        return dispatch({ type: 'DELETE_IMAGE_REQUEST_FAILED', error: error });
      });
  };
};
