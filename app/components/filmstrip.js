import React from 'react';
import style from '../containers/App.css';
import Slide from './slide';
import { SLIDE_TYPES } from '../utils/parser';
import { filter } from 'lodash';

export default class Filmstrip extends React.Component {

  static propTypes = {
     slides: React.PropTypes.array.isRequired,
  };

  render() {
    const { slides } = this.props;

    const filtered = _.sortBy(filter(slides, s => s.type == SLIDE_TYPES.NORMAL), 'zIndex');
    return (
      <div className={style.filmstrip}>
        {filtered.map(s => <Slide {...s} maxWidth={200} key={s.id}/>)}
      </div>
    );
  }
}
