import React from 'react';
import Slide from './slide';
import css from '../containers/App.css';

export default class Workspace extends React.Component {

  static propTypes = {
    slides: React.PropTypes.array.isRequired
  }

  render() {

    const { slides } = this.props;
    const slide = slides[0];

    return (
      <div className={css.workspace}>
        <Slide {...slide} />
      </div>
    );
  }
}
