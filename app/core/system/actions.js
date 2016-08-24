import { 
  ADD_COMMANDS, 
  SET_PLAY, 
  SET_SPEED, 
  SET_COLLAPSE_ACTIONS,
  SET_REALTIME,
  SET_ACTIVE_SLIDE,
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

export function setSpeed(speed) {
  return {
    type: SET_SPEED,
    payload: speed
  }
}

export function setCollapseActions(bool) {
  return {
    type: SET_COLLAPSE_ACTIONS,
    payload: bool
  }
}

export function setRealtime(bool) {
  return {
    type: SET_REALTIME,
    payload: bool
  }
}

export function setActiveSlide(id) {
  return {
    type: SET_ACTIVE_SLIDE,
    payload: id
  }
}