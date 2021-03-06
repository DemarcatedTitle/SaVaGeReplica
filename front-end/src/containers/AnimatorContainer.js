import { connect } from 'react-redux';
import {
  isTyping,
  INCREMENT_FRAME_NUMBER,
  DECREMENT_FRAME_NUMBER,
  VALUE_CHANGED,
} from '../actions/animator';
import { fetchProgress } from '../actions/progress';
import { setFrameCount } from '../actions/frameCount';
import {
  uploadImageToAnimate,
  animationInformationChange,
} from '../actions/animator';
import Animator from '../components/Animator.js';

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
    console.error('\n\n\nprogress is undefined\n\n\n');
  }
  const isFetching = state.progress.slice(-1)[0]
    ? state.progress.slice(-1)[0].isFetching
    : false;
  const imgurl = state.progress.slice(-1)[0]
    ? state.progress.slice(-1)[0].imgurl
    : '';
  const animator = state.animator.slice(-1)[0]
    ? state.animator.slice(-1)[0]
    : '';
  const frameCount = state.frameCount.slice(-1)[0];
  const animationInformation = state.animationInformation.slice(-1)[0];


  return {
    animator: animator,
    frames: animator,
    frameCount: frameCount,
    text: text,
    loading: loading,
    resultImage: resultImage,
    progress: progress,
    isFetching: isFetching,
    imgurl: imgurl,
    animationInformation,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    frameNumberChange: number => {
      dispatch(isTyping(number));
    },
    incrementFrameNumber: () => dispatch(INCREMENT_FRAME_NUMBER),
    decrementFrameNumber: () => dispatch(DECREMENT_FRAME_NUMBER),
    valueChanged: value => dispatch(VALUE_CHANGED(value)),
    animationInformationChange: value =>
      dispatch(animationInformationChange(value)),
    // onSubmit: loading => {
    //   dispatch(isLoading(loading));
    // },
    onUpload: payload => {
      dispatch(uploadImageToAnimate(payload));
    },
    fetchProgress: payload => {
      dispatch(fetchProgress(payload));
    },
    dispatchFrameCount: payload => {
      dispatch(setFrameCount(payload));
    },
  };
};
const AnimatorContainer = connect(mapStateToProps, mapDispatchToProps)(
  Animator
);

export default AnimatorContainer;
