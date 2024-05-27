import { initLocationsEventHandlers } from './locations';
import { initUsersEventHandlers } from './users';

// Don't await any of these functions, as they are meant to run in the background
export async function initEventHandlers() {
  initUsersEventHandlers();
  initLocationsEventHandlers();
}
