import type { TDatabaseService } from '@/db';

export class EventsRepository {
	constructor(private readonly db: TDatabaseService) {}
}
