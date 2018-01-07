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
          response.json().then(data => {
            // const imgurl = URL.createObjectURL(data);
            const progress = data.progress;
            if (progress < 100) {
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
          });
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
