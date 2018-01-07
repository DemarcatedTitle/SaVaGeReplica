import { combineReducers } from 'redux';
import App from './App';
import textApp from './textApp';
import resultImage from './resultImage';
import progress from './progress';
const TextApp = combineReducers({
  textApp,
  App,
  resultImage,
  progress,
});

export default TextApp;
