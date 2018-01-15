import { combineReducers } from 'redux';
import App from './App';
import textApp from './textApp';
import resultImage from './resultImage';
import progress from './progress';
import allImages from './getAllImages';
const TextApp = combineReducers({
  textApp,
  App,
  resultImage,
  progress,
  allImages,
});

export default TextApp;
