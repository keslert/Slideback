import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import css from '../containers/App.css';
import { ACTION_CONSTANTS } from '../utils/parser';

import * as SystemActions from '../core/system/actions';
import { setQueueIndex } from '../core/presentation/actions';

import Checkbox from './checkbox';

@connect(
  state => ({
    actionQueue: state.presentation.actionQueue,
    actionQueueIndex: state.presentation.actionQueueIndex,
    play: state.system.play,
    speed: state.system.speed,
    collapse: state.system.collapse,
    realtime: state.system.realtime,
  }),
  dispatch => ({
    ...bindActionCreators(SystemActions, dispatch),
    setQueueIndex(index) {
      dispatch(setQueueIndex(index))
    }
  })
)
export default class ControlBar extends React.Component {

  static propTypes = {
    actionQueue: React.PropTypes.array.isRequired,
    actionQueueIndex: React.PropTypes.number.isRequired,
    setQueueIndex: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

  }

  componentWillMount() {
    const { play, setPlay } = this.props;
    this.update(true);
  }

  isTextAction(action) {
    return action.action_type == ACTION_CONSTANTS.APPEND_TEXT ||
           action.action_type == ACTION_CONSTANTS.DELETE_TEXT;
  }

  update(force) {
    const { actionQueue, actionQueueIndex, play, realtime, collapse } = this.props;
    const { setQueueIndex } = this.props;

    if((!play && !force) || actionQueueIndex >= actionQueue.length) {
      return;
    }

    let action = actionQueue[actionQueueIndex].action;
    let nextIndex = actionQueueIndex + 1;
    if(collapse && this.isTextAction(action)) {
      while(this.isTextAction(actionQueue[nextIndex].action)) {
        nextIndex++;
      }
    }

    setQueueIndex(nextIndex - 1);

    if(nextIndex < actionQueue.length) {
      let delay;
      const nextAction = actionQueue[nextIndex].action;
      if(this.isTextAction(action) && this.isTextAction(nextAction)) {
        delay = 50;
      }

      if(realtime) {
        delay = actionQueue[nextIndex].timestamp - actionQueue[nextIndex - 1].timestamp;
      }

      this.delayedUpdate(delay);
    }
  }

  togglePlay() {
    const { play, setPlay } = this.props;

    clearTimeout(this.handler);
    setPlay(!play);
    !play && this.delayedUpdate(1);
  }

  toggleSpeed() {
    const { speed, setSpeed } = this.props;
    setSpeed(speed >= 8 ? 0.5 : speed * 2)
  }

  toggleRealtime() {
    const { realtime, setRealtime } = this.props;
    setRealtime(!realtime);
  }

  toggleCollapseActions() {
    const { collapse, setCollapseActions } = this.props;
    setCollapseActions(!collapse);
  }

  delayedUpdate(delay = 1000) {
    const { speed } = this.props;
    this.handler = setTimeout(() => this.update(), delay / speed);
  }

  render() {

    const { play, speed, collapse, realtime } = this.props;

    const menuItem = css['menu-item'];
    return (
      <div className={css['control-bar']}>
        <div className={menuItem}>Slideback</div>
        <div className={menuItem}>
          <button className={css.primary} onClick={() => this.togglePlay()}>
            {play ? "Pause" : "Play"} 
          </button>
        </div>

        <div className={menuItem}>
          <button onClick={() => this.toggleSpeed()}>
            {`Speed ${speed}x`}
          </button>
        </div>

        <div className={menuItem}>
          <Checkbox label={"Realtime"} checked={realtime} onClick={() => this.toggleRealtime()} />
        </div>

        <div className={menuItem}>
          <Checkbox label={"Collapse Actions"} checked={collapse} onClick={() => this.toggleCollapseActions()} />
        </div> 
      </div>
    );
  }
}
