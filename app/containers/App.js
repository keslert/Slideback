import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { runCommands } from '../core/presentation/actions'
import { connect } from 'react-redux';
import Filmstrip from '../components/filmstrip';
import Workspace from '../components/workspace';
import ControlBar from '../components/control_bar';
import style from './App.css';
import _ from 'lodash';

@connect(
  state => ({
    slides: state.presentation.slides,
    objects: state.presentation.objects,
    commands: state.history.commands,
    commandsIndex: state.history.index
  }),
  dispatch => ({
    runCommands(commands) {
      dispatch(runCommands(commands))
    }
  })
)
export default class App extends Component {

  render() {

    const { slides, objects, commands, commandsIndex } = this.props;
    const { runCommands } = this.props;

    const combined = _.map(slides, s => ({...s,
      objects: _.filter(objects, o => o.slide_id == s.id)
    }))

    return (
      <div className={style.app}>
        <ControlBar commands={commands}
                    runCommands={runCommands}
                    commandsIndex={commandsIndex}
                    />
        <div className={style.viewer}>
          <Filmstrip slides={combined} />
          <Workspace slides={combined} />
        </div>
      </div>
    );
  }
}