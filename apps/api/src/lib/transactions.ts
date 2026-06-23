import type { TDatabaseService } from "@wanderlust/db";

export type TxFn = Parameters<TDatabaseService['transaction']>[0];

export type Tx = Parameters<TxFn>[0];
