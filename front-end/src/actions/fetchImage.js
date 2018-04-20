export const fetchImageById = (dispatch, type) => function(imageId) {
  dispatch({ type: 'IMAGE_REQUEST_STARTED' });
  fetch('/api/image/uploaded/' + imageId, {
    method: 'GET',
    credentials: 'same-origin',
  })
    .then(response =>
      response
        .blob()
        .then(imageBlob => {
          const imageLocation = URL.createObjectURL(imageBlob);
          dispatch({
            type: type,
            payload: {
              imageLocation: imageLocation,
            },
          });
        })
        .catch(err => {
          throw err;
        })
    )
    .catch(err => {
      throw err;
    });
};
