export const deleteImage = function deleteImage(imageId) {
  return function(dispatch) {
    dispatch({ type: 'DELETE_IMAGE_REQUEST', imageId: imageId });
    return fetch('/api/image/delete/' + imageId, {
      method: 'DELETE',
      credentials: 'same-origin',
    })
      .then(function(response) {
        if (response.status === 200) {
          response.text().then(data => {
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
