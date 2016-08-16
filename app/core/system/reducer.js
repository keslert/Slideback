/* eslint-disable no-case-declarations */
import { 
  ADD_COMMANDS, 
  SET_PLAY, 
  SET_INDEX,
  SET_SPEED, 
  SET_COLLAPSE_COMMANDS,
  SET_REALTIME,
} from './constants';
import parse from '../../utils/parser';

export const initialState = {
  commands: parse(require('json!../../../data/gehry.json')),
  index: 0,
  speed: 2,
  play: false,
  realtime: false,
  collapse: true,
};

export function systemReducer(state = initialState, {type, payload}) {
  switch (type) {
    case ADD_COMMANDS:
      return {...state,
        commands: [...state.commands, ...payload]
      }
    case SET_PLAY:
      return {...state, play: payload }
    case SET_INDEX:
      return {...state, index: payload }
    case SET_SPEED:
      return {...state, speed: payload }
    case SET_REALTIME:
      return {...state, realtime: payload }
    case SET_COLLAPSE_COMMANDS:
      return {...state, collapse: payload } 

    default:
      return state;
  }
}
