import { combineReducers } from 'redux';
import { systemReducer } from './system/reducer';
import { presentationReducer } from './presentation/reducer';

export default combineReducers({
  system: systemReducer,
  presentation: presentationReducer
})
