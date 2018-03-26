import { combineReducers } from 'redux';
import App from './App';
import { animator, animationInformation } from './animator';
import textApp from './textApp';
import resultImage from './resultImage';
import progress from './progress';
import allImages from './getAllImages';
import deleteImage from './deleteImage';
const TextApp = combineReducers({
  textApp,
  animator,
  App,
  resultImage,
  progress,
  allImages,
  deleteImage,
  animationInformation,
});

export default TextApp;
