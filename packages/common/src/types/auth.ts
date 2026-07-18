import { schema } from '@wanderlust/db';
import { createInsertSchema } from 'drizzle-orm/zod';
import type { z } from 'zod';

export namespace Auth {
	export namespace $Insert {
		export const Account = createInsertSchema(schema.accounts);

		export type Account = z.infer<typeof Account>;
	}
}
