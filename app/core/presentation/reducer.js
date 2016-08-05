/* eslint-disable no-case-declarations */
import { RUN_COMMANDS } from './constants';
import { ACTION_CONSTANTS, SLIDE_TYPES } from '../../utils/parser';
import _ from 'lodash';

let zIndex = 1;
export const initialState = {
  width: 800,
  height: 600,
  slides: {
    "p": {
      id: "p",
      zIndex: 0,
      type: SLIDE_TYPES.NORMAL,
      props: {}
    },
  },
  objects: {},
};

export function presentationReducer(state = initialState, {type, payload}) {



  switch (type) {
    case RUN_COMMANDS:
      const _payload = Array.isArray(payload) ? payload : [payload]
      return _.reduce(_payload, reduce, state);
    default:
      return state;
  }
}

function reduce(state, payload) {
  let obj, text, slide, slides, objs;
  switch (payload.action) {
    case ACTION_CONSTANTS.DELETE_OBJECTS:
      return {...state, objects: _.omit(state.objects, payload.object_id)};
    case ACTION_CONSTANTS.RESIZE_PAGE:
      return {...state, width: payload.width, height: payload.height};
    case ACTION_CONSTANTS.CREATE_OBJECT:
      return {...state, objects: {
        ...state.objects,
        [payload.id]: {..._.omit(payload, 'action'), zIndex: zIndex++}
      }}
    case ACTION_CONSTANTS.STYLE_OBJECT:
      obj = state.objects[payload.object_id];
      return {...state, objects: {...state.objects,
        [payload.object_id]: {...obj, styles: payload.styles}
      }}
    // case ACTION_CONSTANTS.ORDER_OBJECTS:
    //   objs = _.chain(state.objects)
    //     .pick(payload.object_ids)
    //     .filter(o => o.slide_id == payload.slide_id)
    //     .sortBy('zIndex');

    case ACTION_CONSTANTS.TRANSFORM_OBJECT:
      obj = state.objects[payload.object_id];
      return {...state, objects: {...state.objects,
        [payload.object_id]: {...obj, bb: payload.bb}
      }}
    // case ACTION_CONSTANTS.BACKGROUND_STYLE:
    //   return
    case ACTION_CONSTANTS.CREATE_SLIDE:
      // TODO: Figure out order
      return {...state, slides: {...state.slides,
        [payload.id]: {..._.omit(payload, 'action'), zIndex: zIndex++}
      }}
    case ACTION_CONSTANTS.DELETE_SLIDE:
      return {...state, slides: _.omit(state.slides, payload.slide_id)}
    // case ACTION_CONSTANTS.REARRANGE_SLIDE:
    //   return
    case ACTION_CONSTANTS.APPEND_TEXT:
      obj = {...state.objects[payload.object_id]};
      text = obj.text || '';
      obj.text = [
        text.slice(0, payload.index),
        payload.text,
        text.slice(payload.index)
      ].join('')
      return {...state, objects: {...state.objects,
        [payload.object_id]: obj
      }}
    case ACTION_CONSTANTS.DELETE_TEXT:
      obj = {...state.objects[payload.object_id]};
      text = obj.text || '';
      obj.text = [
        text.slice(0, payload.start_index),
        text.slice(payload.end_index)
      ].join('')
      return {...state, objects: {...state.objects,
        [payload.object_id]: obj
      }}
    // case ACTION_CONSTANTS.STYLE_TEXT:
    //   return
    // case ACTION_CONSTANTS.CREATE_LIST_ENTITY:
    //   return
    // case ACTION_CONSTANTS.STYLE_LIST_ENTITY:
    //   return
    // case ACTION_CONSTANTS.CHANGE_SLIDE_PROPERTIES:
    //   return
    case ACTION_CONSTANTS.NO_OP:
      return state;
    default:
      console.log("Unknown Presentation Action");
      return state;
  }
}
