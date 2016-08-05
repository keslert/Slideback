import { ADD_COMMANDS } from './constants';

export function addCommands(commands) {
  return {
    type: ADD_COMMANDS,
    payload: commands
  }
}
