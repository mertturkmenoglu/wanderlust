import type { Tx } from '@/lib/transactions';

export type ListRow = NonNullable<
	Awaited<ReturnType<Tx['query']['lists']['findFirst']>>
>;

export function canDelete(list: ListRow, userId: string): boolean {
	return list.userId === userId;
}

export function canRead(list: ListRow, userId: string): boolean {
	if (list.isPublic) {
		return true;
	}

	return list.userId === userId;
}

export function canUpdate(list: ListRow, userId: string): boolean {
	return list.userId === userId;
}
