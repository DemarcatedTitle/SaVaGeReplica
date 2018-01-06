import { combineReducers } from 'redux';
import App from './App';
import textApp from './textApp';
import resultImage from './resultImage';
const TextApp = combineReducers({
  textApp,
  App,
  resultImage,
});

export default TextApp;
