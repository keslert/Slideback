import React from 'react';
import SObject from './object';
import css from '../containers/App.css';
import { find, extend, map } from 'lodash';
import { OBJECT_STYLES } from '../utils/parser';
import { getColor } from '../utils/color';

export default class Slide extends React.Component {

  static propTypes = {
    pageSize: React.PropTypes.object.isRequired,
    styles: React.PropTypes.object.isRequired,
    objects: React.PropTypes.array.isRequired,
    maxWidth: React.PropTypes.number
  };

  shouldComponentUpdate(nextProps) {
    return !!(
      nextProps.modified || 
      this.props.modified || 
      _.some(this.props.objects, o => o.modified) ||
      nextProps.maxWidth != this.props.maxWidth
    )
  }

  render() {

    const { objects, template, master } = this.props;

    if(!master) {
      return null;
    }

    const style = this.buildStyle();
    const maxWidth = this.props.maxWidth || style.width;
    const scale = maxWidth / style.width;

    const wrapStyle = {
      width: maxWidth,
      height: style.height * scale
    }

    const theme = master.props["CREATE_THEME"][1];

    const templateObjects = _.filter(template ? template.objects : [], o => !o.styles[OBJECT_STYLES.PLACEHOLDER_TYPE])
    const masterObjects = _.filter(master.objects || [], o => !o.styles[OBJECT_STYLES.PLACEHOLDER_TYPE])

    return (
      <div className={css['slide-wrapper']} style={wrapStyle}>
        <div className={css['slide-transform']} style={{transform: `scale(${scale})`}}>
          <div className={css.slide} style={style}>
            {objects.map(o => 
              <SObject {...o} zIndex={o.zIndex + 300000} theme={theme} key={o.id} />
            )}
            {templateObjects.map(o => 
              <SObject {...o} zIndex={o.zIndex + 150000} theme={theme} key={o.id} />
            )}
            {masterObjects.map(o => 
              <SObject {...o} zIndex={o.zIndex} theme={theme} key={o.id} />
            )}
          </div>
        </div>
      </div>
    );
  }

  customStyles(styles = []) {
    return extend(...map(styles, (value, type) => {
      switch(type) {
        case OBJECT_STYLES.FILL:

          const color = getColor(
            value, 
            styles[OBJECT_STYLES.FILL_COLOR],
            styles[OBJECT_STYLES.FILL_OPACITY],
            this.props.master.props["CREATE_THEME"][1]
          );

          return { 'backgroundColor': color }
        default:
          return {};
      }
    }))
  }

  buildStyle() {
    const { template = {}, master = {}, styles, pageSize, modified, deleted } = this.props;
    return extend(
      { width: pageSize.width / 381, height: pageSize.height / 381 },
      this.customStyles(master.styles),
      this.customStyles(template.styles),
      this.customStyles(styles),
      modified ? { boxShadow: '0 0 4px 4px green' } : {},
      deleted ? { boxShadow: '0 0 4px 4px red' } : {}
    )
  }
}
