import type { DatabaseService } from '@wanderlust/db';

export type TxFn = Parameters<DatabaseService['transaction']>[0];

export type Tx = Parameters<TxFn>[0];

export type DbOrTx = DatabaseService | Tx;
