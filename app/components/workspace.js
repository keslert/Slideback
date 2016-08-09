import React from 'react';
import Slide from './slide';
import css from '../containers/App.css';
import { filter } from 'lodash';
import { SLIDE_TYPES } from '../utils/parser';
export default class Workspace extends React.Component {

  static propTypes = {
    slides: React.PropTypes.array.isRequired
  }

  render() {

    const { slides } = this.props;

    const filtered = filter(slides, s => s.type == SLIDE_TYPES.NORMAL);
    const slide = filtered[0];

    return (
      <div className={css.workspace}>
        <Slide {...slide} />
      </div>
    );
  }
}
