import React from 'react';
import Slide from './slide';
import css from '../containers/App.css';
import { filter, sortBy, find, some } from 'lodash';
import { SLIDE_TYPES } from '../utils/parser';
export default class Workspace extends React.Component {

  static propTypes = {
    slides: React.PropTypes.array.isRequired
  }

  render() {

    const { slides } = this.props;

    const filtered = sortBy(filter(slides, s => s.type == SLIDE_TYPES.NORMAL), 'zIndex');

    const slide = find(filtered, s => 
      s.modified || some(s.objects, 'modified')
    ) || filtered[0]

    return (
      <div className={css.workspace}>
        <Slide {...slide} />
      </div>
    );
  }
}
