export const fetchProgress = function fetchProgress(payload) {
  console.log(`fetchProgress payload is ${JSON.stringify(payload)}`);
  const path = `/image/${payload.get('uploadID')}`;
  return function(dispatch) {
    console.log('fetchProgress');
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
                console.log(data);
                const progress = data.progress;
                if (isNaN(progress)) {
                } else if (progress < 100) {
                  console.log('setTimeout');
                  setTimeout(
                    (dispatch, payload) => {
                      console.log(
                        `setTimeout payload is ${JSON.stringify(
                          payload.get('uploadID')
                        )}`
                      );
                      dispatch(fetchProgress(payload));
                    },
                    2000,
                    dispatch,
                    payload
                  );
                }
                return dispatch({
                  type: 'PROGRESS_CHECKED',
                  progress: progress,
                });
              })
              .catch(err => console.log(err));
          } else if (contentType === 'image/svg+xml') {
            response
              .blob()
              .then(data => {
                console.log("It's an image");
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
