import { combineReducers } from 'redux';
import App from './App';
import animator from './animator';
import textApp from './textApp';
import resultImage from './resultImage';
import progress from './progress';
import allImages from './getAllImages';
const TextApp = combineReducers({
  textApp,
  animator,
  App,
  resultImage,
  progress,
  allImages,
});

export default TextApp;
