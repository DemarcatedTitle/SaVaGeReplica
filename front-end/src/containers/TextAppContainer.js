import { connect } from 'react-redux';
import { isTyping, isLoading } from '../actions/actions';
import { fetchProgress } from '../actions/progress';
import { uploadImage } from '../actions/uploadImage';
import TextBox from '../components/TextBox.js';

const mapStateToProps = state => {
  const text = state.textApp.slice(-1)[0] ? state.textApp.slice(-1)[0] : {};
  const resultImage = state.resultImage.slice(-1)[0]
    ? state.resultImage.slice(-1)[0]
    : {};
  const loading = state.App.slice(-1) ? state.App.slice(-1)[0].loading : false;
  const progress = state.progress.slice(-1)[0]
    ? parseInt(state.progress.slice(-1)[0].progress, 10)
    : '';
  if (progress === undefined) {
    console.log('\n\n\nprogress is undefined\n\n\n');
  }
  const isFetching = state.progress.slice(-1)[0]
    ? state.progress.slice(-1)[0].isFetching
    : false;
  const imgurl = state.progress.slice(-1)[0]
    ? state.progress.slice(-1)[0].imgurl
    : '';
  console.log(state);

  return {
    text: text,
    loading: loading,
    resultImage: resultImage,
    progress: progress,
    isFetching: isFetching,
    imgurl: imgurl,
  };
};

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
    fetchProgress: payload => {
      dispatch(fetchProgress(payload));
    },
  };
};
const TextAppContainer = connect(mapStateToProps, mapDispatchToProps)(TextBox);

export default TextAppContainer;
