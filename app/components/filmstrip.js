import React from 'react';
import { connect } from 'react-redux';
import css from '../containers/App.css';
import Slide from './slide';
import { SLIDE_TYPES } from '../utils/parser';
import { filter } from 'lodash';

import { setActiveSlide } from '../core/system/actions';
import cs from 'classnames';

@connect(
  state => ({
    activeSlide: state.system.activeSlide
  }),
  dispatch => ({
    setActiveSlide(id) { dispatch(setActiveSlide(id)); }
  })
)
export default class Filmstrip extends React.Component {

  static propTypes = {
     slides: React.PropTypes.array.isRequired,
  };

  render() {
    const { slides, activeSlide } = this.props;

    const filtered = _.sortBy(filter(slides, s => s.slide_type == SLIDE_TYPES.NORMAL), s => s.zIndex);
    return (
      <div className={css.filmstrip}>
        {filtered.map(s => 
          <div 
            className={cs({[css.active]: s.id == activeSlide})} 
            key={s.id} 
            onClick={() => this.setActiveSlide(s.id)}
          >
            <Slide {...s} maxWidth={220} />
          </div>
        )}
      </div>
    );
  }

  setActiveSlide(id) {
    console.log(id);
    const { activeSlide, setActiveSlide } = this.props;
    setActiveSlide(id == activeSlide ? null : id);
  }
}
