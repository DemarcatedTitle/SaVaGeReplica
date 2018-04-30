import { store } from '../index';
export const fetchAllImages = function fetchAllImages() {
  return function(dispatch) {
    dispatch({ type: 'FETCHALLIMAGES_STARTED' });
    return fetch('/api/image/all', {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(id => {
        if (id.status === 200) {
          id.json().then(ids => {
            dispatch({ type: 'FETCHALLIMAGES_IDS_ACQUIRED', payload: ids });
            const idsToFetch = ids.filter(id => {
              return !store
                .getState()
                .allImages.slice(-1)[0]
                .downloaded.includes(id.image_id);
            });
            idsToFetch.forEach(fetchImage(dispatch));
          });
        }
      })
      .catch(error => {
        throw error;
      });
  };
};

export const fetchImage = dispatch =>
  function(image) {
    dispatch({ type: 'IMAGE_REQUEST_STARTED' });
    fetch('/api/image/uploaded/' + image.image_id, {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.status < 400) {
          return response
            .blob()
            .then(imageBlob => {
              const imageLocation = URL.createObjectURL(imageBlob);
              dispatch({
                type: 'IMAGE_REQUEST_SUCCESSFUL',
                payload: {
                  imageLocation: imageLocation,
                  name: image.name,
                  id: image.image_id,
                },
              });
            })
            .catch(err => {
              throw err;
            });
        }
      })
      .catch(err => {
        throw err;
      });
  };
