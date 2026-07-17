import { schema } from '@wanderlust/db';
import { createInsertSchema } from 'drizzle-orm/zod';

export namespace Auth {
	export namespace $Insert {
		export const Account = createInsertSchema(schema.accounts);
	}
}
