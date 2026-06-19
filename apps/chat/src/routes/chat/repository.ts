import { DatabaseService, type TDatabaseService } from "@wanderlust/db";
import { inject, injectable } from "inversify";

@injectable()
export class ChatRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}
}
