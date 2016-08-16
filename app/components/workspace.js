import React from 'react';
import Slide from './slide';
import Timeline from './timeline';
import css from '../containers/App.css';
import { filter, sortBy, find, some } from 'lodash';
import { SLIDE_TYPES } from '../utils/parser';


export default class Workspace extends React.Component {

  static propTypes = {
    slides: React.PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { maxWidth: this.getMaxWidth() }
  }

  componentDidMount() {
    this.handler = window.addEventListener('resize', () => 
      this.setState({maxWidth: this.getMaxWidth()})
    );
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handler);
  }

  render() {

    const { slides, commands, commandsIndex } = this.props;
    const { maxWidth } = this.state;

    const filtered = sortBy(filter(slides, s => s.type == SLIDE_TYPES.NORMAL), 'zIndex');

    const slide = find(filtered, s => 
      s.modified || some(s.objects, 'modified')
    ) || filtered[0]

    return (
      <div className={css.workspace}>
        <Timeline commands={commands} width={maxWidth} index={commandsIndex} />
        <Slide {...slide} maxWidth={maxWidth} />
      </div>
    );
  }

  getMaxWidth() {
    return Math.min(960, window.innerWidth - 300);
  }
}
