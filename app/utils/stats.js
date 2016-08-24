import { 
  ACTION_CONSTANTS, 
  SLIDE_TYPES, 
  OBJECT_TYPES,
  OBJECT_STYLES 
} from './parser';

import { size, filter } from 'lodash';

let stats = null;
export function calculateStats(actions) {
  if(!stats) {
    stats = {
      slides: {
        "p": {
          id: "p",
          slide_type: SLIDE_TYPES.NORMAL,
          styleChanges: [],
          propChanges: [],
        }
      },
      objects: {},
      activityTimeline: new Array(actions.length),
    }

    actions.forEach((action, i) => {
      runAction(action.action, stats, i);
      stats.activityTimeline[i] = {
        timestamp: action.timestamp,
        slides: size(stats.slides),
        objects:  size(stats.objects)
      }
    });
  }
  
  return stats;
}

function runAction(action, stats, i) {

  switch (action.action_type) {

    case ACTION_CONSTANTS.BATCH_ACTION:
      if(action.detail) {
        stats[action.detail] = action.detail + 1 || 1;
      }
      action.actions.forEach(action => runAction(action, stats, i));
      break;

    case ACTION_CONSTANTS.DELETE_OBJECTS:
      action.object_ids.forEach(id => {
        stats.objects[id].deleted = true;
      })
      break;

    case ACTION_CONSTANTS.CREATE_OBJECT:
      stats.objects[action.id] = {
        id: action.id,
        object_type: action.object_type,
        textInserts: [],
        textDeletions: [],
        textStyleChanges: [],
        styleChanges: [],
        transforms: [], 
      }
      break;

    case ACTION_CONSTANTS.STYLE_OBJECTS:
      action.object_ids.forEach(id => stats.objects[id].styleChanges.push(action.styles));
      break;

    case ACTION_CONSTANTS.TRANSFORM_OBJECT:
      stats.objects[action.object_id].transforms.push(action.bb);
      break;

    case ACTION_CONSTANTS.SLIDE_STYLE:
      stats.slides[action.slide_id].styleChanges.push(action.styles);
      break;

    case ACTION_CONSTANTS.CREATE_SLIDE:
      if(stats.slides[action.id]) {
        stats.slides[action.id].undeleted = true;
      } else {
        stats.slides[action.id] = {
          "id": action.id,
          slide_type: action.slide_type,
          styleChanges: [],
          propChanges: []
        }
      }
      break;

    case ACTION_CONSTANTS.DELETE_SLIDE:
      if(stats.slides[action.slide_id]) {
        stats.slides[action.slide_id].deleted = true;
      }
      break;


    case ACTION_CONSTANTS.APPEND_TEXT:
      stats.objects[action.object_id].textInserts.push(action.text.length);
      break;

    case ACTION_CONSTANTS.DELETE_TEXT:
      stats.objects[action.object_id].textDeletions.push(action.end_index - action.start_index);
      break;

    case ACTION_CONSTANTS.STYLE_TEXT:
      stats.objects[action.object_id].textStyleChanges.push(action.textStyles);
      break;
      

    case ACTION_CONSTANTS.CHANGE_SLIDE_PROPERTIES:
      action.slide_ids.forEach(id => stats.slides[id].propChanges.push(action.props))
      break;

    case ACTION_CONSTANTS.ORDER_OBJECTS:
    case ACTION_CONSTANTS.RESIZE_PAGE:
    case ACTION_CONSTANTS.NO_OP:
    default:
      return;

  }
}
