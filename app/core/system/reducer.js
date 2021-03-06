/* eslint-disable no-case-declarations */
import { 
  ADD_COMMANDS, 
  SET_PLAY, 
  SET_INDEX,
  SET_SPEED, 
  SET_COLLAPSE_ACTIONS,
  SET_REALTIME,
  SET_ACTIVE_SLIDE,
} from './constants';

export const initialState = {
  speed: 2,
  play: false,
  realtime: false,
  collapse: true,
  activeSlide: null,
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
    case SET_COLLAPSE_ACTIONS:
      return {...state, collapse: payload } 
    case SET_ACTIVE_SLIDE:
      return {...state, activeSlide: payload }

    default:
      return state;
  }
}
