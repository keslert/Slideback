import React from 'react';
import css from '../containers/App.css';
import { find } from 'lodash';
import { TEXT_STYLES } from '../utils/parser';
import { getColor } from '../utils/color';

export default class TextLine extends React.Component {

  static propTypes = {
     styles: React.PropTypes.array,
     master: React.PropTypes.array,
     template: React.PropTypes.array,
     theme: React.PropTypes.array,
  };


  render() {

    const { text, index } = this.props;

    const styles = _.map(text.split(''), (char, char_index) => 
      this.calculateStylesForIndex(index + char_index)
    );

    const spans = _.reduce(styles, (result, style) => {
      const last = _.last(result);

      if(_.isEqual(style, last.style)) {
        return [..._.slice(result, 0, -1), {
          start: last.start,
          end: last.end + 1,
          style: last.style
        }]
      }
      return [...result, {
        start: last.end,
        end: last.end + 1,
        style
      }] 
    }, [{start: 0, end: 0, style: null}])


    const lineStyles = this.calculateStylesForIndex(index + text.length);
    const _lineStyles = { textAlign: lineStyles.textAlign, minHeight: lineStyles.fontSize }

    return (
      <div style={_lineStyles} key={index}>
        {spans.slice(1).map(s => 
          <span style={s.style} key={`${s.start}-${s.end}`}>
            {text.slice(s.start, s.end)}
          </span>
        )}
      </div>
    )
  }

  calculateStylesForIndex(index) {
    const { master, template, styles } = this.props;
    let _styles = {};
    
    _.forEach([...master, ...template], style => {
      // if(style.end_index - style.start_index > 1) {
        _.extend(_styles, ..._.map(style.styles, _style => this.mapStyles(_style)));
      // }
    })
    
    _.forEach(styles, style => {
      if(index >= style.start_index && index < style.end_index) {
        _.extend(_styles, ..._.map(style.styles, _style => this.mapStyles(_style)));
      }
    })

    return _styles;
  }

  mapStyles({style, value}) {
    switch(style) {
      case TEXT_STYLES.BOLD:
        return { fontWeight: value ? 'bold' : 'normal' }
      case TEXT_STYLES.ITALICS:
        return { fontStyle: value ? 'italic' : 'normal' }
      case TEXT_STYLES.UNDERLINE:
        return { textDecoration: value ? 'underline' : 'none' }
      case TEXT_STYLES.TEXT_HIGHLIGHT:
        return { backgroundColor: value ? value : 'none' }
      case TEXT_STYLES.TEXT_COLOR:
        const color = getColor(1,value,1,this.props.theme);
        return { color } 
      case TEXT_STYLES.FONT:
        return { fontFamily: value }
      case TEXT_STYLES.FONT_SIZE:
        const size = value * 1.3333333;
        return { fontSize: `${size}px`, lineHeight: `${size}px` }
      case TEXT_STYLES.LINE_HEIGHT:
        return { lineHeight: `${value}px` } // TODO: This will mess up font size...
      case TEXT_STYLES.TEXT_ALIGNMENT:
        let textAlign = 'left';
        if(value == 2) textAlign = 'center';
        else if(value == 3) textAlign = 'right';
        else if(value == 4) textAlign = 'justify'; 

        return { textAlign }
      default:
        return {};
    }
  }

}
