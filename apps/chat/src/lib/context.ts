import type { TAuthService } from '@wanderlust/auth';
import type { EvlogVariables } from 'evlog/hono';

export type THonoContext = EvlogVariables & {
	Variables: {
		user: TAuthService['$Infer']['Session']['user'];
		session: TAuthService['$Infer']['Session']['session'];
	};
};
