import React from 'react';
import { connect } from 'react-redux';
import Slide from './slide';
import Timeline from './timeline';
import css from '../containers/App.css';
import { setQueueIndex } from '../core/presentation/actions';
import { setIndex } from '../core/system/actions';
import { filter, sortBy, find, some } from 'lodash';
import { SLIDE_TYPES, ACTION_CONSTANTS } from '../utils/parser';


@connect(
  state => ({
    actionQueue: state.presentation.actionQueue,
    actionQueueIndex: state.presentation.actionQueueIndex,
  }),
  dispatch => ({
    setQueueIndex(index) {
      dispatch(setQueueIndex(index))
    }
  })
)
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

    const { slides, actionQueue, actionQueueIndex } = this.props;
    const { maxWidth } = this.state;

    const filtered = sortBy(filter(slides, s => s.slide_type == SLIDE_TYPES.NORMAL), 'zIndex');

    const slide = find(filtered, s => 
      s.modified || some(s.objects, 'modified')
    ) || filtered[0]

    const lastAction = actionQueue[actionQueueIndex - 1] ? actionQueue[actionQueueIndex - 1].action.action_type : '';

    return (
      <div className={css.workspace}>
        <div>{lastAction}</div>
        <Timeline 
          width={maxWidth}
          events={actionQueue.map(item => colorMap[item.action.action_type])} 
          markerIndex={actionQueueIndex - 1}
          onClick={(index) => this.onTimelineClick(index)}
        />
        <div style={{flex: 1}}>
          <Slide {...slide} maxWidth={maxWidth} />
        </div>
      </div>
    );
  }

  onTimelineClick(index) {
    const { actionQueueIndex, setQueueIndex } = this.props;
    setQueueIndex(index);
  }

  getMaxWidth() {
    return Math.min(960, window.innerWidth - 300);
  }
}


const colorMap = {
  [ACTION_CONSTANTS.NO_OP]: '#000',
  [ACTION_CONSTANTS.BATCH_ACTION]: '#F8B5D2',
  [ACTION_CONSTANTS.DELETE_OBJECTS]: '#E574C3',
  [ACTION_CONSTANTS.CREATE_GROUP]: '#BCBF00',
  [ACTION_CONSTANTS.DELETE_GROUP]: '#BCBF00',
  [ACTION_CONSTANTS.RESIZE_PAGE]: '#C7C7C7',
  [ACTION_CONSTANTS.CREATE_OBJECT]: '#C59C93',
  [ACTION_CONSTANTS.STYLE_OBJECTS]: '#8D5649',
  [ACTION_CONSTANTS.ORDER_OBJECTS]: '#C5AFD6',
  [ACTION_CONSTANTS.TRANSFORM_OBJECT]: '#9564BF',
  [ACTION_CONSTANTS.SLIDE_STYLE]: '#1776B6',
  [ACTION_CONSTANTS.CREATE_SLIDE]: '#ADC6E9',
  [ACTION_CONSTANTS.DELETE_SLIDE]: '#FF7F00',
  [ACTION_CONSTANTS.REARRANGE_SLIDE]: '#FFBC72',
  [ACTION_CONSTANTS.APPEND_TEXT]: '#96E086',
  [ACTION_CONSTANTS.DELETE_TEXT]: '#D8241F',
  [ACTION_CONSTANTS.STYLE_TEXT]: '#FF9794',
  [ACTION_CONSTANTS.CREATE_LIST_ENTITY]: '#9CDAE6',
  [ACTION_CONSTANTS.STYLE_LIST_ENTITY]: '#9CDAE6',
  [ACTION_CONSTANTS.CHANGE_SLIDE_PROPERTIES]: '#7F7F7F',
}