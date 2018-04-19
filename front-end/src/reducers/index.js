import { combineReducers } from 'redux';
import App from './App';
import { animator, animationInformation } from './animator';
import textApp from './textApp';
import resultImage from './resultImage';
import progress from './progress';
import allImages from './getAllImages';
import deleteImage from './deleteImage';
import frameCount from './frameCount';
const TextApp = combineReducers({
  textApp,
  animator,
  App,
  resultImage,
  progress,
  allImages,
  deleteImage,
  frameCount,
  animationInformation,
});

export default TextApp;
