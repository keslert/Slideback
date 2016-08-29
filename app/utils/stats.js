import { 
  ACTION_CONSTANTS, 
  SLIDE_TYPES, 
  OBJECT_TYPES,
  OBJECT_STYLES 
} from './parser';

import { size, filter, keyBy, map, flattenDeep } from 'lodash';

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
          timestamp: actions[0].timestamp
        }
      },
      objects: {},
      activityTimeline: new Array(actions.length),
    }

    actions.forEach((action, i) => {
      runAction(action.action, stats, action.timestamp);

      const filteredSlides = keyBy(filter(stats.slides, s => s.slide_type == SLIDE_TYPES.NORMAL && !s.deleted), 'id');
      const filteredObjects = filter(stats.objects, o => !o.deleted && o.manuallyAdded && filteredSlides[o.slide_id])

      stats.activityTimeline[i] = {
        timestamp: action.timestamp,
        slides: size(filteredSlides),
        objects: size(filteredObjects)
      }
    });

    stats.slideTimeline = map(filter(stats.slides, s=> s.slide_type == SLIDE_TYPES.NORMAL), s => ({
      id: s.id,
      events: flattenDeep(
        [ 
          {timestamp: s.timestamp, type: 'slide_created'},
          s.deleted ? {timestamp: s.deleted, type: 'slide_deleted'} : null,

          map(filter(stats.objects, o => o.slide_id == s.id && o.manuallyAdded), o => [
            {timestamp: o.timestamp, type: 'object_created'},
            o.deleted ? {timestamp: o.deleted, type: 'object_deleted'} : null,
            map(o.styleChanges, ({timestamp}) => ({timestamp, type: 'style'})),
            map(o.transforms, ({timestamp}) => ({timestamp, type: 'transform'})),
            map(o.textStyleChanges, ({timestamp}) => ({timestamp, type: 'textStyle'})),
            map(o.textInserts, ({timestamp}) => ({timestamp, type: 'text_added'})),
            map(o.textDeletions, ({timestamp}) => ({timestamp, type: 'text_deleted'})),
          ])
        ]
      )
    }))

  }
  
  return stats;
}

function runAction(action, stats, timestamp) {

  switch (action.action_type) {

    case ACTION_CONSTANTS.BATCH_ACTION:
      if(action.detail) {
        stats[action.detail] = action.detail + 1 || 1;
      }
      action.actions.forEach(action => runAction(action, stats, timestamp));
      break;

    case ACTION_CONSTANTS.DELETE_OBJECTS:
      action.object_ids.forEach(id => {
        if(stats.objects[id]) {
          stats.objects[id].deleted = timestamp;
        }
      })
      break;

    case ACTION_CONSTANTS.CREATE_OBJECT:
      stats.objects[action.id] = {
        id: action.id,
        slide_id: action.slide_id,
        object_type: action.object_type,
        textInserts: [],
        textDeletions: [],
        textStyleChanges: [],
        styleChanges: [],
        transforms: [], 
        timestamp: timestamp,
        manuallyAdded: stats.slides[action.slide_id] && stats.slides[action.slide_id].timestamp < timestamp
      }
      break;

    case ACTION_CONSTANTS.STYLE_OBJECTS:
      action.object_ids.forEach(id => stats.objects[id].styleChanges.push({timestamp, styles: action.styles}));
      break;

    case ACTION_CONSTANTS.TRANSFORM_OBJECT:
      stats.objects[action.object_id] &&
      stats.objects[action.object_id].transforms.push({timestamp, bb: action.bb});
      break;

    case ACTION_CONSTANTS.SLIDE_STYLE:
      stats.slides[action.slide_id].styleChanges.push({timestamp, styles: action.styles});
      break;

    case ACTION_CONSTANTS.CREATE_SLIDE:
      if(stats.slides[action.id]) {
        stats.slides[action.id].undeleted = timestamp;
      } else {
        stats.slides[action.id] = {
          "id": action.id,
          slide_type: action.slide_type,
          styleChanges: [],
          propChanges: [],
          timestamp: timestamp
        }
      }
      break;

    case ACTION_CONSTANTS.DELETE_SLIDE:
      if(stats.slides[action.slide_id]) {
        stats.slides[action.slide_id].deleted = timestamp;
      }
      break;


    case ACTION_CONSTANTS.APPEND_TEXT:
      stats.objects[action.object_id] &&
      stats.objects[action.object_id].textInserts.push({timestamp, length: action.text.length});
      break;

    case ACTION_CONSTANTS.DELETE_TEXT:
      stats.objects[action.object_id] &&
      stats.objects[action.object_id].textDeletions.push({timestamp, length: action.end_index - action.start_index});
      break;

    case ACTION_CONSTANTS.STYLE_TEXT:
      stats.objects[action.object_id] &&
      stats.objects[action.object_id].textStyleChanges.push({timestamp, styles: action.textStyles});
      break;
      

    case ACTION_CONSTANTS.CHANGE_SLIDE_PROPERTIES:
      action.slide_ids.forEach(id => stats.slides[id].propChanges.push({timestamp, props: action.props}))
      break;

    case ACTION_CONSTANTS.ORDER_OBJECTS:
    case ACTION_CONSTANTS.RESIZE_PAGE:
    case ACTION_CONSTANTS.NO_OP:
    default:
      return;

  }
}
