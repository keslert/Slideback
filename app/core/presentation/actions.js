import { RUN_COMMANDS } from './constants';

export function runCommands(commands) {
 return { type: RUN_COMMANDS, payload: commands };
}
