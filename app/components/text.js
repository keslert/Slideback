import React from 'react';
import css from '../containers/App.css';
import TextLine from './text_line';
import { find } from 'lodash';
import { TEXT_STYLES } from '../utils/parser';
import { getColor } from '../utils/color';

export default class Text extends React.Component {

  static propTypes = {
     styles: React.PropTypes.array,
     master: React.PropTypes.array,
     template: React.PropTypes.array,
     theme: React.PropTypes.array,
  };

  static defaultProps = {
    styles: [],
    master: [],
    template: [],
  }

  render() {
    const { text } = this.props;

    let index = 0;
    const lines = text.split('\n').map(line => {
      const ret = { text: line, index};
      index += line.length + 1;
      return ret;
    })

    return (
      <div className={css.text}>
        
        {lines.map((line, i) => 
          <TextLine {...this.props} {...line} key={`${i}~${line.text}`} />
        )}
      </div>
    );
  }

}
