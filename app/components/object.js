import React from 'react';
import Text from './text';
import css from '../containers/App.css';
import { OBJECT_TYPES } from '../utils/parser';
import { OBJECT_STYLES } from '../utils/parser';
import { extend, map } from 'lodash';
import tinycolor from 'tinycolor2'; 

export default class SObject extends React.Component {

  static propTypes = {
    text: React.PropTypes.string,
    textStyles: React.PropTypes.array, 
    template: React.PropTypes.object,
    master: React.PropTypes.object
  };

  static defaultProps = {
    master: {},
    template: {}
  }

  render() {
    const { master, template, text, textStyles } = this.props;

    return (
      <div className={css.object} style={this.buildStyle()}>
        <Text text={text} 
              master={master.textStyles}
              template={template.textStyles}
              styles={textStyles} />
      </div>
    );
  }

  calculatePositionAndSize() {
    const { bb } = this.props;
    return {
      top: bb[5] / 381,
      left: bb[4] / 381,
      width: bb[0] * 315,
      height: bb[3] * 315
    }
  }

  defaultStyles() {
    const { type } = this.props;

    switch(type) {
      case OBJECT_TYPES.TEXT_BOX:
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


  customStyles(obj) {
    return extend(...map(obj.styles, (value, type) => {
      switch(type) {
        case OBJECT_STYLES.WIDTH:
        case OBJECT_STYLES.HEIGHT:
          return
        case OBJECT_STYLES.FILL: // OBJECT_STYLES.FILL_COLOR, OBJECT_STYLES.FILL_OPACITY
          const hex = obj.styles[OBJECT_STYLES.FILL_COLOR] || '#ddd';
          const opacity = obj.styles[OBJECT_STYLES.FILL_OPACITY];

          const color = tinycolor(hex);
          color.setAlpha(opacity);
          const background = value == 1 ? color.toRgbString() : 'none';

          return { 'backgroundColor': background }
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

    const { template, master } = this.props;
    return extend(
      this.defaultStyles(),
      this.customStyles(master),
      this.customStyles(template),
      this.customStyles(this.props),
      this.calculatePositionAndSize(),
    )
  }
}