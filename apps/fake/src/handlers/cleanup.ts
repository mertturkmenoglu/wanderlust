// Called generate to keep the naming consistent with other handlers.
// This handler is responsible for cleaning up any other side effects of the other handlers.

import { paths } from '..';

// Remove temp files, reset any in-memory state, etc.
export async function generate() {
	for (const filePath of Object.values(paths)) {
		await Bun.file(filePath).delete();
	}
}
