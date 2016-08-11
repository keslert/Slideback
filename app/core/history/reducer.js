/* eslint-disable no-case-declarations */
import { ADD_COMMANDS } from './constants';
import parse from '../../utils/parser';

export const initialState = {
  commands: parse(require('json!../../../data/dreams.json')),
  index: 0
};

export function historyReducer(state = initialState, {type, payload}) {
  switch (type) {
    case ADD_COMMANDS:
      return {...state,
        commands: [...state.commands, ...payload]
      }

    default:
      return state;
  }
}
