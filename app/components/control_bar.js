import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import css from '../containers/App.css';
import { ACTION_CONSTANTS } from '../utils/parser';

import * as SystemActions from '../core/system/actions';

@connect(
  state => ({
    queue: state.system.commands,
    index: state.system.index,
    play: state.system.play,
    speed: state.system.speed,
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
    this.update();
  }

  update() {
    const { queue, index, play } = this.props;
    const { runCommands, setIndex } = this.props;

    if(!play || index >= queue.length) {
      return;
    }

    const commands = queue[index].commands;
    runCommands(commands);

    const nextIndex = index + 1;
    setIndex(nextIndex);

    if(nextIndex < queue.length) {
      let delay;
      const nextCommands = queue[nextIndex].commands;
      const { APPEND_TEXT, DELETE_TEXT } = ACTION_CONSTANTS;
      if((commands.action == APPEND_TEXT || commands.action == DELETE_TEXT) &&
         (nextCommands.action == APPEND_TEXT || nextCommands.action == DELETE_TEXT)) {
        delay = 50;
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

  delayedUpdate(delay = 1000) {
    const { speed } = this.props;
    this.handler = setTimeout(() => this.update(), delay / speed);
  }

  render() {

    const { play, index, queue, speed } = this.props;

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

        <div className={menuItem}>({index}/{queue.length})</div> 
      </div>
    );
  }
}
