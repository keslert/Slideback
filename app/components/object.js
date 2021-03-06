import React from 'react';
import Text from './text';
import css from '../containers/App.css';
import { OBJECT_TYPES, OBJECT_STYLES } from '../utils/parser';
import { getColor } from '../utils/color';
import { extend, map, pick } from 'lodash';
import { getImage } from '../utils/image';
import BlobImage from 'react-image-file';

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

  shouldComponentUpdate(nextProps) {
    return !!(nextProps.modified || this.props.modified)
  }

  render() {
    const { theme, master, template, text, textStyles } = this.props;

    const styles = this.buildStyles();
    return (
      <div className={css.object} style={styles}>
        <Text text={text} 
              master={master.textStyles}
              template={template.textStyles}
              styles={textStyles}
              theme={theme} />
        {this.renderImage(styles)}
      </div>
    );
  }

  renderImage(styles) {
    if(styles['image']) {
      const blob = getImage(styles['image']);
      if(blob) {
        return <img src={blob} />
      }
      return <div className={css['image-placeholder']}></div>
    }
  }

  calculatePositionAndSize() {
    const { bb, zIndex } = this.props;

    let top = bb[5] / 381;
    let left = bb[4] / 381;
    let width = bb[0] * 315.125;
    let height = bb[3] * 315.125;
    let transform = '';

    if(width < 0) {
      width *= -1;
      left -= width;
      transform += 'scaleX(-1) ';
    }
    if(height < 0) {
      height *= -1;
      top -= height;
      transform += 'scaleY(-1) ';
    }

    return { top, left, width, height, transform, zIndex }
  }

  defaultStyles() {
    const { object_type, styles, theme } = this.props;

    switch(object_type) {
      case OBJECT_TYPES.ROUND_SINGLE_CORNER_RECTANGLE:
        return { borderTopRightRadius: '10%' }
      case OBJECT_TYPES.RIGHT_TRIANGLE:
        const bb = this.calculatePositionAndSize();

        const color = getColor(
          styles[OBJECT_STYLES.FILL],
          styles[OBJECT_STYLES.FILL_COLOR],
          styles[OBJECT_STYLES.FILL_OPACITY],
          theme
        );

        return {
          width: 0,
          height: 0,
          padding: 0,
          borderBottom: `${bb.width / 2}px solid ${color}`,
          borderTop: `${bb.width / 2}px solid transparent`,
          borderLeft: `${bb.height / 2}px solid ${color}`,
          borderRight: `${bb.height / 2}px solid transparent`,
          background: 'transparent',
        }
        
      case OBJECT_TYPES.TEXT_BOX:
        return { padding: 10, border: '1px dashed #ddd' }
      case OBJECT_TYPES.IMAGE:
        return { backgroundColor: 'transparent' } 
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

      if(this.props.object_type == OBJECT_TYPES.RIGHT_TRIANGLE) {
        if(type == OBJECT_STYLES.LINE ||
           type == OBJECT_STYLES.LINE_COLOR ||
           type == OBJECT_STYLES.LINE_WIDTH) {
           return {}
        }
      }


      switch(type) {
        case OBJECT_STYLES.WIDTH:
          return { width: this.props.bb[0] / 381 * value }
        case OBJECT_STYLES.HEIGHT:
          return { height: this.props.bb[3] / 381 * value }
        case OBJECT_STYLES.FILL_COLOR:
        case OBJECT_STYLES.FILL:
          const color = getColor(
            value,
            obj.styles[OBJECT_STYLES.FILL_COLOR],
            obj.styles[OBJECT_STYLES.FILL_OPACITY],
            this.props.theme
          );

          return { 'backgroundColor': color }
        case OBJECT_STYLES.LINE:
          return { border: value == 0 ? 'none' : `1px solid #333` }
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
          return { image: value, background: 'none' };
          // return { background: `url(${value})` }
        case OBJECT_STYLES.LINE_DASH:
          return
        case OBJECT_STYLES.VERTICAL_ALIGNMENT: // 0=top, 1=middle, 2=bottom
          let alignment = value == 0 ? 'flex-start' : ((value == 1) ? 'center' : 'flex-end');
          return { alignItems: alignment }
        case OBJECT_STYLES.DESCRIPTION:
        case OBJECT_STYLES.PLACEHOLDER_TYPE:
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

  buildStyles() {

    const { template, master, modified, deleted } = this.props;
    return extend(
      this.calculatePositionAndSize(),
      this.customStyles(master),
      this.customStyles(template),
      this.customStyles(this.props),
      modified ? { boxShadow: '0 0 4px 4px green' } : {},
      deleted ? { boxShadow: '0 0 4px 4px red', background: 'rgba(255,0,0,0.1)' } : {},
      this.defaultStyles()
    )
  }
}

// TODO: If a object from higher contains a null, just get rid of it from the object so it doesn't
// override lower styles.