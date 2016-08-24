/* eslint-disable no-case-declarations */
import { SET_QUEUE_INDEX } from './constants';
import { 
  ACTION_CONSTANTS, 
  SLIDE_TYPES, 
  OBJECT_TYPES,
  OBJECT_STYLES 
} from '../../utils/parser';
import parse from '../../utils/parser';
import _ from 'lodash';


let zIndex = 1;
export const initialState = {
  pageSize: { 
    width: 365760, 
    height: 205740 
  },
  slides: {
    "p": {
      id: "p",
      zIndex: 0,
      slide_type: SLIDE_TYPES.NORMAL,
      styles: {},
      props: {}
    },
  },
  objects: {},
  actionQueue: parse(require('json!../../../data/gehry.json')),
  actionQueueIndex: 0
};

export function presentationReducer(state = initialState, {type, payload}) {
  switch (type) {
    case SET_QUEUE_INDEX:

      const clean = (items) => (
        _.chain(items)
        .filter(item => !item.deleted)
        .map(item => _.omit(item, 'modified'))
        .keyBy('id')
        .value()
      )

      let actions, _state;
      if(payload < state.actionQueueIndex) {
        actions = state.actionQueue.slice(0, payload);
        _state = initialState;
      } else {
        actions = state.actionQueue.slice(state.actionQueueIndex, payload);
        _state = state;
      }

      _state = _.reduce(_.map(actions, 'action'), reduce, _state);
      _state = {..._state,
        slides: clean(_state.slides),
        objects: clean(_state.objects),
        actionQueueIndex: payload + 1
      }
      return reduce(_state, state.actionQueue[payload].action);
      
    default:
      return state;
  }
}

function reduce(state, payload) {
  let obj, text, slide, slides, objs;

  switch (payload.action_type) {

    case ACTION_CONSTANTS.BATCH_ACTION:
      if(!payload.details) {
        // debugger;
      }
      return _.reduce(payload.actions, reduce, state);

    case ACTION_CONSTANTS.DELETE_OBJECTS:
      objs = _.keyBy(_.map(payload.object_ids, object_id => (
        {...state.objects[object_id], modified: true, deleted: true}
      )), 'id')
      return {...state, objects: {...state.objects, ...objs}};
    case ACTION_CONSTANTS.RESIZE_PAGE:

      return {...state, pageSize: {width: payload.width, height: payload.height}};
    case ACTION_CONSTANTS.CREATE_OBJECT:

      return {...state, objects: {
        ...state.objects,
        [payload.id]: {..._.omit(payload, 'action_type'),
          styles: {...defaultObjectStyles(payload.object_type), ...payload.styles}, 
          text: '', 
          textStyles: [], 
          zIndex: zIndex++,
          modified: true,
        }
      }}

    case ACTION_CONSTANTS.STYLE_OBJECTS:
      objs = _.keyBy(_.map(payload.object_ids, object_id => {
        obj = state.objects[object_id];
        return {...obj, styles: {...obj.styles, ...payload.styles}, modified: true}
      }), 'id');
      return {...state, objects: {...state.objects, ...objs}}
        
    // case ACTION_CONSTANTS.ORDER_OBJECTS:
    //   objs = _.chain(state.objects)
    //     .pick(payload.object_ids)
    //     .filter(o => o.slide_id == payload.slide_id)
    //     .sortBy('zIndex');

    case ACTION_CONSTANTS.TRANSFORM_OBJECT:
      obj = state.objects[payload.object_id];
      return {...state, objects: {...state.objects,
        [payload.object_id]: {...obj, bb: payload.bb, modified: true}
      }}

    case ACTION_CONSTANTS.SLIDE_STYLE:
      slide = state.slides[payload.slide_id];
      return {...state, slides: {...state.slides,
        [payload.slide_id]: {...slide, styles: {...slide.styles, ...payload.styles}, modified: true} 
      }}

    case ACTION_CONSTANTS.CREATE_SLIDE:
      slide = {..._.omit(payload, 'action_type'), styles: {}, zIndex: zIndex++, modified: true};
      slides = _.sortBy([slide, ..._.filter(state.slides, s => s.slide_type == payload.slide_type)], 'zIndex');
      slides = rearrangeSlides(slides, _.size(slides) - 1, payload.index);

      return {...state, slides: {...state.slides, ...slides}}

    case ACTION_CONSTANTS.DELETE_SLIDE:
      slide = state.slides[payload.slide_id];
      if(!slide) {
        return state;
      } 

      return {...state, slides: {...state.slides,
        [payload.slide_id]: {...slide, modified: true, deleted: true}
      }}
    
    case ACTION_CONSTANTS.REARRANGE_SLIDE:
      slides = _.sortBy(_.filter(state.slides, s => s.slide_type == SLIDE_TYPES.NORMAL), 'zIndex');
      slides = rearrangeSlides(slides, payload.start_index, payload.end_index);

      return {...state, slides: {...state.slides, ...slides}}

    case ACTION_CONSTANTS.APPEND_TEXT:
      obj = {...state.objects[payload.object_id]};
      obj.text = [
        obj.text.slice(0, payload.index),
        payload.text,
        obj.text.slice(payload.index)
      ].join('')

      obj.textStyles = _.map(obj.textStyles, style => {
        if(payload.index <= style.start_index) {
          return {...style, 
            start_index: style.start_index + payload.text.length,
            end_index: style.end_index + payload.text.length
          }
        } else if(payload.index <= style.end_index) {
          return {...style,
            end_index: style.end_index + payload.text.length  
          }
        }
        return style;
      })

      obj.modified = true;

      return {...state, objects: {...state.objects,
        [payload.object_id]: obj
      }}

    case ACTION_CONSTANTS.DELETE_TEXT:
      obj = {...state.objects[payload.object_id]};
      obj.text = [
        obj.text.slice(0, payload.start_index),
        obj.text.slice(payload.end_index)
      ].join('')

      const length = payload.end_index - payload.start_index;
      obj.textStyles = _.filter(_.map(obj.textStyles, style => {
        if(payload.end_index < style.start_index) {
          return {...style,
            start_index: style.start_index - length,
            end_index: style.end_index - length,
          }
        } else if(payload.start_index <= style.start_index) {
          return {...style,
            start_index: payload.start_index,
            end_index: payload.start_index + style.end_index - payload.end_index
          }
        } else {
          return style;
        }
      }), style => style.end_index > style.start_index)
      obj.modified = true;

      return {...state, objects: {...state.objects,
        [payload.object_id]: obj
      }}

    case ACTION_CONSTANTS.STYLE_TEXT:
      obj = state.objects[payload.object_id];
      return {...state, objects: {...state.objects,
        [payload.object_id]: {...obj, modified: true,
          textStyles: [...obj.textStyles, _.omit(payload, 'action_type')]
        }
      }}

    // case ACTION_CONSTANTS.CREATE_LIST_ENTITY:
    //   return
    // case ACTION_CONSTANTS.STYLE_LIST_ENTITY:
    //   return
    case ACTION_CONSTANTS.CHANGE_SLIDE_PROPERTIES:
      slides = _.keyBy(_.map(payload.slide_ids, slide_id => {
        slide = state.slides[slide_id];
        return {...slide, props: _.extend({}, slide.props, payload.props), modified: true}
      }), 'id');

      return {...state, slides: {...state.slides, ...slides}}

    case ACTION_CONSTANTS.NO_OP:
      return state;
      
    default:
      console.log("Unknown Presentation Action: " + payload.action_type);
      return state;
  }


  function rearrange(arr, start_index, end_index) {
    let _arr = [...arr]; 
    const i = _arr.splice(start_index, 1)[0];
    return [
      ..._arr.slice(0, end_index),
      i,
      ..._arr.slice(end_index)
    ]
  }

  function rearrangeSlides(slides, start_index, end_index) {
    const zIndices = rearrange(_.map(slides, 'zIndex'), start_index, end_index); 
    return _.keyBy(slides.map((s, i) => ({...s, zIndex: zIndices[i]})), 'id');
  }

  function defaultObjectStyles(type) {
    switch(type) {
      case OBJECT_TYPES.RECTANGLE:
      case OBJECT_TYPES.ROUND_SINGLE_CORNER_RECTANGLE:
      case OBJECT_TYPES.ROUNDED_RECTANGLE:
        return { [OBJECT_STYLES.FILL]: 1 }
      default:
        return {}
    }
  }
}