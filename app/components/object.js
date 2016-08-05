import React from 'react';
import css from '../containers/App.css';
import { OBJECT_TYPES } from '../utils/parser';
import { OBJECT_STYLES } from '../utils/parser';
import { extend, map } from 'lodash';

export default class SObject extends React.Component {

  static propTypes = {

  };

  render() {

    const { text } = this.props;

    return (
      <div className={css.object} style={this.buildStyle()}>
        <p>{text}</p>
      </div>
    );
  }

  calculatePosition() {
    const { bb } = this.props;
    // Position & Size
    
    return {
      top: bb[5] / 381,
      left: bb[4] / 381,
      width: bb[0] * 315,
      height: bb[3] * 315
    }
  }

  defaultStyle() {
    const { type } = this.props;

    switch(type) {
      case OBJECT_TYPES.TEXT_BOX:
        return { alignItems: 'flex-end', justifyContent: 'center' }
      case OBJECT_TYPES.IMAGE:
      case OBJECT_TYPES.RECTANGLE:
      case OBJECT_TYPES.ROUNDED_RECTANGLE:
      case OBJECT_TYPES.LINE:
      case OBJECT_TYPES.VIDEO:
      case OBJECT_TYPES.SCRIBBLE:
      case OBJECT_TYPES.WORD_ART:
      default:
        return {};
    }
  }

  customStyles() {
    return extend(...map(this.props.styles, (value, type) => {
      switch(type) {
        case OBJECT_STYLES.WIDTH:
        case OBJECT_STYLES.HEIGHT:
          return
        case OBJECT_STYLES.FILL:
          return { 'backgroundColor': '#ddd' }
        case OBJECT_STYLES.FILL_COLOR:
          return { 'backgroundColor': value } 
        case OBJECT_STYLES.FILL_OPACITY:
          return {}
        case OBJECT_STYLES.LINE:
          return { border: '1px solid #333' }
        case OBJECT_STYLES.LINE_COLOR:
          return  { borderColor: value }
        case OBJECT_STYLES.LINE_WIDTH:
          return  { borderWidth: value / 381 }
        case OBJECT_STYLES.LINE_START_ENDPOINT:
          return {}
        case OBJECT_STYLES.LINE_END_ENDPOINT:
          return {}
        case OBJECT_STYLES.TEXT:
          return {}
        case OBJECT_STYLES.IMAGE_URL:
          return { background: url(value) }
        case OBJECT_STYLES.LINE_DASH:
          return
        case OBJECT_STYLES.VERTICAL_ALIGNMENT: // 0=top, 1=middle, 2=bottom
          let alignment = value == 0 ? 'flex-start' : ((value == 1) ? 'center' : 'flex-end');
          return { alignItems: alignment }
        case OBJECT_STYLES.DESCRIPTION:
          return {}
        case OBJECT_STYLES.INHERITED_STYLES:
        case OBJECT_STYLES.LINK:
        case OBJECT_STYLES.LINE_TYPE:
        case OBJECT_STYLES.CHARTS_1:
        case OBJECT_STYLES.CHARTS_2:
        case OBJECT_STYLES.CHARTS_3:
        case OBJECT_STYLES.CHARTS_4:
        default:
          return {};
      }
    }))
  }

  buildStyle() {
    return extend(
      this.defaultStyle(),
      this.calculatePosition(),
      this.customStyles()
    )
  }
}

// 3048 = 0.0254


/*



width: 365760
height: 205740


         22860

       365760
       365760


365760,
205740
205740

0.0254



3.048,0,0,1.7145
[3.048,0,0,1.905,0,0]]

0:2.8402
1:0
2:0
3:0.6842
4:12468.334

[
  3.048,  // a
  0,      // b
  0,      // c
  1.7145, // d
  0,      // e
  0       // f
]
[3.048,0,0,1.7145,3048,0]]]
[3.048,0,0,1.7145,362.2183,0]]


[3.048,0,0,0.2482,0,0]]]


0.2482 = 30480

0.254


3.048 = Full Across?




(e,f)       (e + a, f + b)
-----------------------
|                     |
|                     |
|                     |
-----------------------
(e + c, f + d)
*/
