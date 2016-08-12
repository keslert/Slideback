import { 
  ADD_COMMANDS, 
  SET_PLAY, 
  SET_INDEX,
  SET_SPEED, 
} from './constants';

export function addCommands(commands) {
  return {
    type: ADD_COMMANDS,
    payload: commands
  }
}

export function setPlay(play) {
  return {
    type: SET_PLAY,
    payload: play
  }
}

export function setIndex(index) {
  return {
    type: SET_INDEX,
    payload: index
  }
}

export function setSpeed(speed) {
  return {
    type: SET_SPEED,
    payload: speed
  }
}