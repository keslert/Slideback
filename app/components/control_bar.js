import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import css from '../containers/App.css';
import { ACTION_CONSTANTS } from '../utils/parser';

import * as SystemActions from '../core/system/actions';
import Checkbox from './checkbox';

@connect(
  state => ({
    queue: state.system.commands,
    index: state.system.index,
    play: state.system.play,
    speed: state.system.speed,
    collapse: state.system.collapse,
    realtime: state.system.realtime,
  }),
  dispatch => ({
    ...bindActionCreators(SystemActions, dispatch)
  })
)
export default class ControlBar extends React.Component {

  static propTypes = {
    queue: React.PropTypes.array.isRequired,
    index: React.PropTypes.number.isRequired,
    runCommands: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

  }

  componentWillMount() {
    const { play, setPlay } = this.props;
    this.update(true);
  }

  isTextAction(command) {
    return command.action == ACTION_CONSTANTS.APPEND_TEXT ||
           command.action == ACTION_CONSTANTS.DELETE_TEXT;
  }





  update(force) {
    const { queue, index, play, realtime, collapse } = this.props;
    const { runCommands, setIndex } = this.props;

    if((!play && !force) || index >= queue.length) {
      return;
    }

    let commands = queue[index].commands;
    let nextIndex = index + 1;
    if(collapse && this.isTextAction(commands)) {
      commands = [commands];
      while(this.isTextAction(queue[nextIndex].commands)) {
        commands.push(queue[nextIndex].commands);
        nextIndex++;
      }
      commands = {
        action: ACTION_CONSTANTS.BATCH_COMMANDS,
        type: 'Text Collapse',
        commands
      }
    }

    runCommands(commands);
    setIndex(nextIndex);

    if(nextIndex < queue.length) {
      let delay;
      const nextCommands = queue[nextIndex].commands;
      if(this.isTextAction(commands) && this.isTextAction(nextCommands)) {
        delay = 50;
      }

      if(realtime) {
        delay = queue[nextIndex].timestamp - queue[nextIndex - 1].timestamp;
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

  toggleCollapseCommands() {
    const { collapse, setCollapseCommands } = this.props;
    setCollapseCommands(!collapse);
  }

  delayedUpdate(delay = 1000) {
    const { speed } = this.props;
    this.handler = setTimeout(() => this.update(), delay / speed);
  }

  render() {

    const { play, index, queue, speed, collapse, realtime } = this.props;

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
          <Checkbox label={"Collapse Actions"} checked={collapse} onClick={() => this.toggleCollapseCommands()} />
        </div>

        <div className={menuItem}>Actions ({index}/{queue.length})</div> 
      </div>
    );
  }
}
