import { fetchImageById } from './fetchImage';
export const fetchProgress = function fetchProgress(payload) {
  const path = `/image/${payload.get('uploadID')}`;
  return function(dispatch) {
    dispatch({ type: 'PROGRESS_STARTED' });
    return fetch(path, {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(function(response) {
        if (response.status === 200) {
          const contentType = response.headers.get('content-type');
          if (contentType === 'application/json; charset=utf-8') {
            response
              .json()
              .then(data => {
                const progress = data.progress;
                if (progress < 100) {
                  setTimeout(
                    (dispatch, payload) => {
                      dispatch(fetchProgress(payload));
                    },
                    2000,
                    dispatch,
                    payload
                  );
                  return dispatch({
                    type: 'PROGRESS_CHECKED',
                    progress: progress,
                  });

                } else {
                  fetchImageById(dispatch, 'PROGRESS_COMPLETE')(payload.get('uploadID'));
                  return dispatch({
                    type: 'PROGRESS_CHECKED',
                    progress: progress,
                  });
                }
	      })
              .catch(err => console.log(err));
          } else if (contentType === 'image/svg+xml') {
            response
              .blob()
              .then(data => {
                const imgurl = URL.createObjectURL(data);
                dispatch({ type: 'RECEIVED_IMAGE', imgurl: imgurl });
              })
              .catch(err => console.log(err));
          }
        } else {
          return dispatch({
            type: 'PROGRESS_FAILED',
            error: response.statusText,
          });
        }
      })
      .catch(error => {
        console.error(error);
        return dispatch({ type: 'PROGRESS_FAILED', error: error });
      });
  };
};
