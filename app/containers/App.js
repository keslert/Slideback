import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { runCommands } from '../core/presentation/actions'
import { connect } from 'react-redux';
import Filmstrip from '../components/filmstrip';
import Workspace from '../components/workspace';
import ControlBar from '../components/control_bar';
import style from './App.css';
import _ from 'lodash';

import { SLIDE_TYPES, SLIDE_PROPERTIES, OBJECT_STYLES } from '../utils/parser';

@connect(
  state => ({
    pageSize: state.presentation.pageSize,
    slides: state.presentation.slides,
    objects: state.presentation.objects,
    commands: state.system.commands,
    commandsIndex: state.system.index
  }),
  dispatch => ({
    runCommands(commands) {
      dispatch(runCommands(commands))
    }
  })
)
export default class App extends Component {

  render() {

    const { slides, objects, pageSize } = this.props;
    const { runCommands } = this.props;

    let combined = _.map(slides, s => ({...s,
      objects: _.filter(objects, o => o.slide_id == s.id),
      pageSize
    }))

    combined = _.map(combined, s => ({...s,  
      master: _.find(combined, s2 => s2.type == SLIDE_TYPES.MASTER)}
    ))

    combined = _.map(combined, s => {
      if(s.type == SLIDE_TYPES.NORMAL) {
        const template = _.find(combined, s2 => 
          s2.type == SLIDE_TYPES.TEMPLATE && 
          s2.props[SLIDE_PROPERTIES.LAYOUT] == s.props[SLIDE_PROPERTIES.LAYOUT]
        )

        const objects = _.map(s.objects, o => {
          const pType = o.styles[OBJECT_STYLES.PLACEHOLDER_TYPE];
          if(!pType) { // Not a placeholder
            return o;
          }

          const templateObject = _.find(template.objects, o2 => (
            pType == o2.styles[OBJECT_STYLES.PLACEHOLDER_TYPE] &&
            o.styles[OBJECT_STYLES.PLACEHOLDER_ID] == o2.styles[OBJECT_STYLES.PLACEHOLDER_ID]
          ))
          const masterObject = _.find(s.master.objects, o2 => {
            if(pType == 15 || pType == 4) {
              return o2.styles[OBJECT_STYLES.PLACEHOLDER_TYPE] == 15;
            }
            return o2.styles[OBJECT_STYLES.PLACEHOLDER_TYPE] == 1;
          })
          return {...o, master: masterObject, template: templateObject}

        }) 

        return {...s, template, objects} 
      }
      
      return s;
    })


    return (
      <div className={style.app}>
        <ControlBar runCommands={runCommands}   />
        <div className={style.viewer}>
          <Filmstrip slides={combined} />
          <Workspace slides={combined} />
        </div>
      </div>
    );
  }
}
