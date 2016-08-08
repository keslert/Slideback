import React from 'react';
import SObject from './object';
import css from '../containers/App.css';
import { find } from 'lodash';
import { OBJECT_STYLES } from '../utils/parser';

export default class Slide extends React.Component {

  static propTypes = {
     objects: React.PropTypes.array.isRequired,
     maxWidth: React.PropTypes.number
  };

  render() {

    const { objects, template, master } = this.props;

    const style = { width: 960, height: 600 }
    const maxWidth = this.props.maxWidth || style.width;
    const scale = maxWidth / style.width;

    const wrapStyle = {
      width: maxWidth,
      height: style.height * scale
    }

    return (
      <div className={css['slide-wrapper']} style={wrapStyle}>
        <div className={css['slide-transform']} style={{transform: `scale(${scale})`}}>
          <div className={css.slide} style={style}>
            {objects.map(o => 
              <SObject {...o} key={o.id} 
                template={find(template.objects, o2 => 
                  o.styles[OBJECT_STYLES.INHERITED_STYLES] == o2.styles[OBJECT_STYLES.INHERITED_STYLES])}
                master={find(master.objects, o2 => 
                  o.styles[OBJECT_STYLES.INHERITED_STYLES] == o2.styles[OBJECT_STYLES.INHERITED_STYLES])} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
