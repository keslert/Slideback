import { SET_QUEUE_INDEX } from './constants';

export function setQueueIndex(index) {
 return { type: SET_QUEUE_INDEX, payload: index };
}
