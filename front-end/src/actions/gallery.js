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
            idsToFetch.forEach(function(id) {
              dispatch({ type: 'IMAGE_REQUEST_STARTED' });
              fetch('/api/image/uploaded/' + id.image_id, {
                method: 'GET',
                credentials: 'same-origin',
              })
                .then(response =>
                  response
                    .blob()
                    .then(image => {
                      const imageLocation = URL.createObjectURL(image);
                      dispatch({
                        type: 'IMAGE_REQUEST_SUCCESSFUL',
                        payload: {
                          imageLocation: imageLocation,
                          id: id.image_id,
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
            });
          });
        }
      })
      .catch(error => {
        throw error;
      });
  };
};
