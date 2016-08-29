import React from 'react';
import { connect } from 'react-redux';
import Slide from './slide';
import Timeline from './timeline';
import Stats from './stats';
import css from '../containers/App.css';
import { setQueueIndex } from '../core/presentation/actions';
import { filter, sortBy, find, some } from 'lodash';
import { SLIDE_TYPES, ACTION_CONSTANTS } from '../utils/parser';


@connect(
  state => ({
    actionQueue: state.presentation.actionQueue,
    actionQueueIndex: state.presentation.actionQueueIndex,
    activeSlide: state.system.activeSlide,
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

    const { slides, actionQueue, actionQueueIndex, activeSlide } = this.props;
    const { maxWidth } = this.state;

    const filtered = sortBy(filter(slides, s => s.slide_type == SLIDE_TYPES.NORMAL), 'zIndex');


    const slide = find(filtered, s => s.id == activeSlide) ||
                find(filtered, s =>  s.modified || some(s.objects, 'modified')) ||
                filtered[0]

    const events = actionQueue.map(item => ({
      color: this.getColor(item.action),
      highlight: item.action.slide_id == slide.id || 
                 slide.objects[item.object_id]
    }))

    const lastAction = actionQueue[actionQueueIndex - 1] || {action: {}};
    const lastActionText = lastAction.action.details || lastAction.action.action_type;
    console.log(lastAction);

    const stats = false;

    return (
      <div className={css.workspace}>
        <div>{lastActionText}</div>
        {stats
          ?
          <Stats slides={slides} width={maxWidth} />
          :
          <div>
            <Timeline 
              width={maxWidth}
              events={events} 
              markerIndex={actionQueueIndex - 1}
              onClick={(index) => this.onTimelineClick(index)}
            />
            <div style={{flex: 1}}>
              <Slide {...slide} maxWidth={maxWidth} key={slide.id} />
            </div>
          </div>
        }
      </div>
    );
  }

  onTimelineClick(index) {
    const { actionQueue, actionQueueIndex, setQueueIndex } = this.props;

    if(index == actionQueueIndex) {
      console.log(actionQueue[index]);
    }

    setQueueIndex(index);
  }

  getMaxWidth() {
    return Math.min(960, window.innerWidth - 300);
  }

  getColor(action) {
    const A = ACTION_CONSTANTS;

    const colorMap = {
      [A.NO_OP]: '#fff',
      [A.BATCH_ACTION]: '#333',
      [A.B_NEW_THEME]: '#215AB7',

      [A.CREATE_SLIDE]: '#1B969A',
      [A.B_COPY_PASTE_SLIDE]: '#1B969A',
      [A.CREATE_GROUP]: '#38D4D8',
      [A.CREATE_OBJECT]: '#38D4D8',
      [A.B_INSERT_IMAGE]: '#37D5A9',
      [A.APPEND_TEXT]: '#99D792',

      [A.B_DELETE_APPEND_TEXT]: '#FF9F3F',

	    [A.DELETE_SLIDE]: '#A72B13',
      [A.DELETE_GROUP]: '#ED2E19',
      [A.DELETE_OBJECTS]: '#ED2E19',
      [A.DELETE_TEXT]: '#E56F6F',

      [A.RESIZE_PAGE]: '#F4A9D5',
      [A.CHANGE_SLIDE_PROPERTIES]: '#F4A9D5',
      [A.B_CHANGE_SLIDE_TEMPLATE]: '#F5CDE4',
      [A.SLIDE_STYLE]: '#E23B9F',

      [A.STYLE_OBJECTS]: '#9241CF',
      [A.TRANSFORM_OBJECT]: '#9241CF',

      [A.STYLE_TEXT]: '#AE89CB',

      [A.ORDER_OBJECTS]: '#A9786D',
      [A.REARRANGE_SLIDE]: '#E1AA9C',
    }

    return colorMap[action.details] || colorMap[action.action_type];
  }
}