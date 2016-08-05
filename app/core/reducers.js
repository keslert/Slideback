import { combineReducers } from 'redux';
import { historyReducer } from './history/reducer';
import { presentationReducer } from './presentation/reducer';

export default combineReducers({
  history: historyReducer,
  presentation: presentationReducer
})
