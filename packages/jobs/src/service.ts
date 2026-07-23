import type { Dependencies } from './internal/types';
import { defineEmailJobs } from './jobs/emails';
import { defineNotificationsJobs } from './jobs/notifications';

export function createJobs(deps: Dependencies) {
	return {
		emails: defineEmailJobs(deps),
		notifications: defineNotificationsJobs(deps),
	};
}

export type JobsService = ReturnType<typeof createJobs>;
