import { connect } from 'react-redux';
import { isTyping, isLoading } from '../actions';
import TextBox from '../components/TextBox.js';

const mapStateToProps = state => {
  const text = state.textApp.slice(-1)[0] ? state.textApp.slice(-1)[0] : {};
  const resultImage = state.resultImage.slice(-1)[0]
    ? state.resultImage.slice(-1)[0]
    : {};
  const loading = state.App.slice(-1) ? state.App.slice(-1)[0].loading : false;
  return {
    text: text,
    loading: loading,
    resultImage: resultImage,
  };
};

function uploadImage(payload) {
  return function(dispatch) {
    dispatch({ type: 'REQUEST_STARTED' });
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
            return dispatch({
              type: 'REQUEST_SUCCEEDED',
              uploadID: uploadID,
            });
          });
        } else {
          return dispatch({
            type: 'REQUEST_FAILED',
            error: response.statusText,
          });
        }
      })
      .catch(error => {
        console.error(error);
        return dispatch({ type: 'REQUEST_FAILED', error: error });
      });
  };
}
const mapDispatchToProps = dispatch => {
  return {
    onTextTyped: text => {
      dispatch(isTyping(text));
    },
    onSubmit: loading => {
      dispatch(isLoading(loading));
    },
    onUpload: payload => {
      dispatch(uploadImage(payload));
    },
  };
};
const TextAppContainer = connect(mapStateToProps, mapDispatchToProps)(TextBox);

export default TextAppContainer;
