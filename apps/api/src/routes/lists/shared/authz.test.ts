import { describe, expect, test } from 'vitest';
import { canDelete, canRead, canUpdate, type ListRow } from './authz';

describe('List Authorization', () => {
	const publicList: ListRow = {
		id: 'list-1',
		userId: 'user-1',
		name: 'My Public List',
		isPublic: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const privateList: ListRow = {
		id: 'list-2',
		userId: 'user-1',
		name: 'My Private List',
		isPublic: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const ownerId = 'user-1';
	const nonOwnerId = 'user-2';

	test('owner can delete their own list', () => {
		const resultPublic = canDelete(publicList, ownerId);
		const resultPrivate = canDelete(privateList, ownerId);

		expect(resultPublic).toBe(true);
		expect(resultPrivate).toBe(true);
	});

	test("non-owner cannot delete someone else's list", () => {
		const resultPublic = canDelete(publicList, nonOwnerId);
		const resultPrivate = canDelete(privateList, nonOwnerId);

		expect(resultPublic).toBe(false);
		expect(resultPrivate).toBe(false);
	});

	test('owner can read their own public list', () => {
		const result = canRead(publicList, ownerId);
		expect(result).toBe(true);
	});

	test('owner can read their own private list', () => {
		const result = canRead(privateList, ownerId);
		expect(result).toBe(true);
	});

	test("non-owner can read someone else's public list", () => {
		const result = canRead(publicList, nonOwnerId);
		expect(result).toBe(true);
	});

	test("non-owner cannot read someone else's private list", () => {
		const result = canRead(privateList, nonOwnerId);
		expect(result).toBe(false);
	});

	test('owner can update their own list', () => {
		const resultPublic = canUpdate(publicList, ownerId);
		const resultPrivate = canUpdate(privateList, ownerId);

		expect(resultPublic).toBe(true);
		expect(resultPrivate).toBe(true);
	});

	test("non-owner cannot update someone else's list", () => {
		const resultPublic = canUpdate(publicList, nonOwnerId);
		const resultPrivate = canUpdate(privateList, nonOwnerId);

		expect(resultPublic).toBe(false);
		expect(resultPrivate).toBe(false);
	});
});
