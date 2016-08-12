/* eslint-disable no-case-declarations */
import { 
  ADD_COMMANDS, 
  SET_PLAY, 
  SET_INDEX,
  SET_SPEED, 
} from './constants';
import parse from '../../utils/parser';

export const initialState = {
  commands: parse(require('json!../../../data/gehry.json')),
  index: 0,
  speed: 1,
  play: true,
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

    default:
      return state;
  }
}
