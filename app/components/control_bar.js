import React from 'react';
import { connect } from 'redux';

import style from '../containers/App.css';

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
    this.handle = setInterval(() => {
      const { commandsIndex } = this.props;
      runCommands(commands[i++].commands);

      if(i == commands.length) {
        clearInterval(this.handle);
      }
    }, 50);
  }

  render() {
    return (
      <div className={style['control-bar']}>
        <ul>
          <li className="logo">Slideback</li>
          <li><i className="fa fa-play"></i></li>
        </ul>
      </div>
    );
  }
}
