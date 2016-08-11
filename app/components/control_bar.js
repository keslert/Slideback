import React from 'react';
import { connect } from 'redux';

import css from '../containers/App.css';
import { ACTION_CONSTANTS } from '../utils/parser';

export default class ControlBar extends React.Component {

  static propTypes = {
    commands: React.PropTypes.array.isRequired,
    commandsIndex: React.PropTypes.number.isRequired,
    runCommands: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

  }

  componentWillMount() {
    const { commands, runCommands } = this.props;

    let i = 0;


    function next() {
      const _commands = commands[i++].commands; 
      runCommands(_commands);

      if(i < commands.length) {

        let delay = 500;
        if(_commands.action == ACTION_CONSTANTS.APPEND_TEXT ||
           _commands.action == ACTION_CONSTANTS.DELETE_TEXT)
        {
          delay = 50;
        }

        setTimeout(() => next(), delay);
      }
    }
    next();

  }

  render() {
    return (
      <div className={css['control-bar']}>
        <ul>
          <li className="logo">Slideback</li>
          <li><i className="fa fa-play"></i></li>
        </ul>
      </div>
    );
  }
}
