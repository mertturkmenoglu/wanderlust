import type { TDatabaseService } from '@wanderlust/db';
import type {
	PgAsyncPreparedQuery,
	PreparedQueryConfig,
} from 'drizzle-orm/pg-core';
import type z from 'zod';
import type { Tx } from './transactions';

type DbOrTx = TDatabaseService | Tx;

export type DefinePreparedStatementOptions<
	T extends PreparedQueryConfig,
	S extends z.ZodObject<z.core.$ZodLooseShape, z.core.$strip>,
> = {
	schema: S;
	statement: (db: DbOrTx) => PgAsyncPreparedQuery<T>;
};

export type StatementWithSchema<
	T extends PreparedQueryConfig,
	S extends z.ZodObject<z.core.$ZodLooseShape, z.core.$strip>,
> = DefinePreparedStatementOptions<T, S> & {
	execute: (
		db: DbOrTx,
		params: z.infer<S>,
	) => ReturnType<PgAsyncPreparedQuery<T>['execute']>;
};

export function definePreparedStatement<
	T extends PreparedQueryConfig,
	S extends z.ZodObject<z.core.$ZodLooseShape, z.core.$strip>,
>(options: DefinePreparedStatementOptions<T, S>): StatementWithSchema<T, S> {
	return {
		...options,
		execute(db: DbOrTx, params: z.infer<S>) {
			return options.statement(db).execute(params);
		},
	};
}
