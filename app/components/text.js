import React from 'react';
import css from '../containers/App.css';
import { find } from 'lodash';

export default class Text extends React.Component {

  static propTypes = {
     
  };

  render() {

    const { text } = this.props;

    return (
      <div>
        { text } 
      </div>
    );
  }
}
