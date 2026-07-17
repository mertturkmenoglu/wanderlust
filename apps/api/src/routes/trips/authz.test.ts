import type { Types } from '@wanderlust/common';
import { describe, expect, test } from 'vitest';
import {
	canCreateInvite,
	canDeleteInvite,
	canDeleteParticipant,
	canDeleteTrip,
	canRead,
	isOwner,
	isOwnerOrParticipant,
	isParticipant,
	isPrivilegedUser,
} from './authz';

type Trip = Types.Trips.ExtendedWithParticipantsAndLocations;

describe('Trips Authorization', () => {
	const privateTrip: Trip = {
		id: 'trip-1',
		createdAt: new Date(),
		updatedAt: new Date(),
		ownerId: 'user-1',
		title: 'Trip to Squirrel Land',
		description: 'A fun trip to see squirrels in their natural habitat.',
		startAt: new Date('2077-01-01'),
		endAt: new Date('2077-01-10'),
		participants: [
			{
				id: 'user-2',
				role: 'editor',
				tripId: 'trip-1', // Doesn't matter for this test
				userId: 'user-2',
				user: {
					id: 'user-2',
					name: 'Bella',
					image: 'https://example.com/bella.jpg',
					username: 'bella',
				},
			},
			{
				id: 'user-3',
				role: 'member',
				tripId: 'trip-1', // Doesn't matter for this test
				userId: 'user-3',
				user: {
					id: 'user-3',
					name: 'clara',
					image: 'https://example.com/clara.jpg',
					username: 'clara',
				},
			},
			{
				id: 'user-4',
				role: 'member',
				tripId: 'trip-1', // Doesn't matter for this test
				userId: 'user-4',
				user: {
					id: 'user-4',
					name: 'diana',
					image: 'https://example.com/diana.jpg',
					username: 'diana',
				},
			},
		],
		locations: [],
		owner: {
			id: 'user-1',
			name: 'Alice',
			image: 'https://example.com/alice.jpg',
			username: 'alice',
		},
		requestedAmenities: [],
		visibilityLevel: 'private',
	};

	const friendsTrip: Trip = {
		...privateTrip,
		id: 'trip-2',
		visibilityLevel: 'friends',
	};

	const publicTrip: Trip = {
		...privateTrip,
		id: 'trip-3',
		visibilityLevel: 'public',
	};

	const ownerId = 'user-1';
	const editorId = 'user-2';
	const memberId = 'user-3';
	const nonParticipantId = 'user-5';

	describe('isPrivilegedUser', () => {
		test.for([
			{
				type: 'private',
				userType: 'owner',
				trip: privateTrip,
				userId: ownerId,
				expected: true,
			},
			{
				type: 'private',
				userType: 'editor',
				trip: privateTrip,
				userId: editorId,
				expected: true,
			},
			{
				type: 'private',
				userType: 'member',
				trip: privateTrip,
				userId: memberId,
				expected: false,
			},
			{
				type: 'private',
				userType: 'non-participant',
				trip: privateTrip,
				userId: nonParticipantId,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'owner',
				trip: friendsTrip,
				userId: ownerId,
				expected: true,
			},
			{
				type: 'friends',
				userType: 'editor',
				trip: friendsTrip,
				userId: editorId,
				expected: true,
			},
			{
				type: 'friends',
				userType: 'member',
				trip: friendsTrip,
				userId: memberId,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'non-participant',
				trip: friendsTrip,
				userId: nonParticipantId,
				expected: false,
			},
			{
				type: 'public',
				userType: 'owner',
				trip: publicTrip,
				userId: ownerId,
				expected: true,
			},
			{
				type: 'public',
				userType: 'editor',
				trip: publicTrip,
				userId: editorId,
				expected: true,
			},
			{
				type: 'public',
				userType: 'member',
				trip: publicTrip,
				userId: memberId,
				expected: false,
			},
			{
				type: 'public',
				userType: 'non-participant',
				trip: publicTrip,
				userId: nonParticipantId,
				expected: false,
			},
		])('$type trip | user=$userType | expected=$expected', ({
			trip,
			userId,
			expected,
		}) => {
			const result = isPrivilegedUser(trip, userId);
			expect(result).toBe(expected);
		});
	});

	describe('isOwner', () => {
		test.for([
			{
				type: 'private',
				userType: 'owner',
				userId: ownerId,
				trip: privateTrip,
				expected: true,
			},
			{
				type: 'private',
				userType: 'editor',
				userId: editorId,
				trip: privateTrip,
				expected: false,
			},
			{
				type: 'private',
				userType: 'member',
				userId: memberId,
				trip: privateTrip,
				expected: false,
			},
			{
				type: 'private',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: privateTrip,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'owner',
				userId: ownerId,
				trip: friendsTrip,
				expected: true,
			},
			{
				type: 'friends',
				userType: 'editor',
				userId: editorId,
				trip: friendsTrip,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'member',
				userId: memberId,
				trip: friendsTrip,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: friendsTrip,
				expected: false,
			},
			{
				type: 'public',
				userType: 'owner',
				userId: ownerId,
				trip: publicTrip,
				expected: true,
			},
			{
				type: 'public',
				userType: 'editor',
				userId: editorId,
				trip: publicTrip,
				expected: false,
			},
			{
				type: 'public',
				userType: 'member',
				userId: memberId,
				trip: publicTrip,
				expected: false,
			},
			{
				type: 'public',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: publicTrip,
				expected: false,
			},
		])('$type trip | user=$userType | expected=$expected', ({
			trip,
			userId,
			expected,
		}) => {
			const result = isOwner(trip, userId);
			expect(result).toBe(expected);
		});
	});

	describe('isParticipant', () => {
		test.for([
			{
				type: 'private',
				userType: 'owner',
				userId: ownerId,
				trip: privateTrip,
				expected: false,
			},
			{
				type: 'private',
				userType: 'editor',
				userId: editorId,
				trip: privateTrip,
				expected: true,
			},
			{
				type: 'private',
				userType: 'member',
				userId: memberId,
				trip: privateTrip,
				expected: true,
			},
			{
				type: 'private',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: privateTrip,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'owner',
				userId: ownerId,
				trip: friendsTrip,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'editor',
				userId: editorId,
				trip: friendsTrip,
				expected: true,
			},
			{
				type: 'friends',
				userType: 'member',
				userId: memberId,
				trip: friendsTrip,
				expected: true,
			},
			{
				type: 'friends',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: friendsTrip,
				expected: false,
			},
			{
				type: 'public',
				userType: 'owner',
				userId: ownerId,
				trip: publicTrip,
				expected: false,
			},
			{
				type: 'public',
				userType: 'editor',
				userId: editorId,
				trip: publicTrip,
				expected: true,
			},
			{
				type: 'public',
				userType: 'member',
				userId: memberId,
				trip: publicTrip,
				expected: true,
			},
			{
				type: 'public',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: publicTrip,
				expected: false,
			},
		])('$type trip | user=$userType | expected=$expected', ({
			trip,
			userId,
			expected,
		}) => {
			const result = isParticipant(trip, userId);
			expect(result).toBe(expected);
		});
	});

	describe('isOwnerOrParticipant', () => {
		test.for([
			{
				type: 'private',
				userType: 'owner',
				userId: ownerId,
				trip: privateTrip,
				expected: true,
			},
			{
				type: 'private',
				userType: 'editor',
				userId: editorId,
				trip: privateTrip,
				expected: true,
			},
			{
				type: 'private',
				userType: 'member',
				userId: memberId,
				trip: privateTrip,
				expected: true,
			},
			{
				type: 'private',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: privateTrip,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'owner',
				userId: ownerId,
				trip: friendsTrip,
				expected: true,
			},
			{
				type: 'friends',
				userType: 'editor',
				userId: editorId,
				trip: friendsTrip,
				expected: true,
			},
			{
				type: 'friends',
				userType: 'member',
				userId: memberId,
				trip: friendsTrip,
				expected: true,
			},
			{
				type: 'friends',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: friendsTrip,
				expected: false,
			},
			{
				type: 'public',
				userType: 'owner',
				userId: ownerId,
				trip: publicTrip,
				expected: true,
			},
			{
				type: 'public',
				userType: 'editor',
				userId: editorId,
				trip: publicTrip,
				expected: true,
			},
			{
				type: 'public',
				userType: 'member',
				userId: memberId,
				trip: publicTrip,
				expected: true,
			},
			{
				type: 'public',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: publicTrip,
				expected: false,
			},
		])('$type trip | user=$userType | expected=$expected', ({
			trip,
			userId,
			expected,
		}) => {
			const result = isOwnerOrParticipant(trip, userId);
			expect(result).toBe(expected);
		});
	});

	describe('canDeleteTrip', () => {
		test.for([
			{
				type: 'private',
				userType: 'owner',
				userId: ownerId,
				trip: privateTrip,
				expected: true,
			},
			{
				type: 'private',
				userType: 'editor',
				userId: editorId,
				trip: privateTrip,
				expected: false,
			},
			{
				type: 'private',
				userType: 'member',
				userId: memberId,
				trip: privateTrip,
				expected: false,
			},
			{
				type: 'private',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: privateTrip,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'owner',
				userId: ownerId,
				trip: friendsTrip,
				expected: true,
			},
			{
				type: 'friends',
				userType: 'editor',
				userId: editorId,
				trip: friendsTrip,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'member',
				userId: memberId,
				trip: friendsTrip,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: friendsTrip,
				expected: false,
			},
			{
				type: 'public',
				userType: 'owner',
				userId: ownerId,
				trip: publicTrip,
				expected: true,
			},
			{
				type: 'public',
				userType: 'editor',
				userId: editorId,
				trip: publicTrip,
				expected: false,
			},
			{
				type: 'public',
				userType: 'member',
				userId: memberId,
				trip: publicTrip,
				expected: false,
			},
			{
				type: 'public',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: publicTrip,
				expected: false,
			},
		])('$type trip | user=$userType | expected=$expected', ({
			trip,
			userId,
			expected,
		}) => {
			const result = canDeleteTrip(trip, userId);
			expect(result).toBe(expected);
		});
	});

	describe('canCreateInvite', () => {
		test.for([
			{
				type: 'private',
				userType: 'owner',
				userId: ownerId,
				trip: privateTrip,
				expected: true,
			},
			{
				type: 'private',
				userType: 'editor',
				userId: editorId,
				trip: privateTrip,
				expected: true,
			},
			{
				type: 'private',
				userType: 'member',
				userId: memberId,
				trip: privateTrip,
				expected: false,
			},
			{
				type: 'private',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: privateTrip,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'owner',
				userId: ownerId,
				trip: friendsTrip,
				expected: true,
			},
			{
				type: 'friends',
				userType: 'editor',
				userId: editorId,
				trip: friendsTrip,
				expected: true,
			},
			{
				type: 'friends',
				userType: 'member',
				userId: memberId,
				trip: friendsTrip,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: friendsTrip,
				expected: false,
			},
			{
				type: 'public',
				userType: 'owner',
				userId: ownerId,
				trip: publicTrip,
				expected: true,
			},
			{
				type: 'public',
				userType: 'editor',
				userId: editorId,
				trip: publicTrip,
				expected: true,
			},
			{
				type: 'public',
				userType: 'member',
				userId: memberId,
				trip: publicTrip,
				expected: false,
			},
			{
				type: 'public',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: publicTrip,
				expected: false,
			},
		])('$type trip | user=$userType | expected=$expected', ({
			trip,
			userId,
			expected,
		}) => {
			const result = canCreateInvite(trip, userId);
			expect(result).toBe(expected);
		});
	});

	describe('canDeleteInvite', () => {
		test.for([
			{
				type: 'private',
				userType: 'owner',
				userId: ownerId,
				trip: privateTrip,
				expected: true,
			},
			{
				type: 'private',
				userType: 'editor',
				userId: editorId,
				trip: privateTrip,
				expected: true,
			},
			{
				type: 'private',
				userType: 'member',
				userId: memberId,
				trip: privateTrip,
				expected: false,
			},
			{
				type: 'private',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: privateTrip,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'owner',
				userId: ownerId,
				trip: friendsTrip,
				expected: true,
			},
			{
				type: 'friends',
				userType: 'editor',
				userId: editorId,
				trip: friendsTrip,
				expected: true,
			},
			{
				type: 'friends',
				userType: 'member',
				userId: memberId,
				trip: friendsTrip,
				expected: false,
			},
			{
				type: 'friends',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: friendsTrip,
				expected: false,
			},
			{
				type: 'public',
				userType: 'owner',
				userId: ownerId,
				trip: publicTrip,
				expected: true,
			},
			{
				type: 'public',
				userType: 'editor',
				userId: editorId,
				trip: publicTrip,
				expected: true,
			},
			{
				type: 'public',
				userType: 'member',
				userId: memberId,
				trip: publicTrip,
				expected: false,
			},
			{
				type: 'public',
				userType: 'non-participant',
				userId: nonParticipantId,
				trip: publicTrip,
				expected: false,
			},
		])('$type trip | user=$userType | expected=$expected', ({
			trip,
			userId,
			expected,
		}) => {
			const result = canDeleteInvite(trip, userId);
			expect(result).toBe(expected);
		});
	});

	describe('canDeleteParticipant', () => {
		// actorType, actorId, targetType, targetId, expected
		test.for([
			// Owner tries to remove participants
			['owner', ownerId, 'owner', ownerId, false],
			['owner', ownerId, 'editor', editorId, true],
			['owner', ownerId, 'member', memberId, true],
			['owner', ownerId, 'non-participant', nonParticipantId, false],
			// Editor tries to remove participants
			['editor', editorId, 'owner', ownerId, false],
			['editor', editorId, 'editor', editorId, true],
			['editor', editorId, 'member', memberId, true],
			['editor', editorId, 'non-participant', nonParticipantId, false],
			// Member tries to remove participants
			['member', memberId, 'owner', ownerId, false],
			['member', memberId, 'editor', editorId, false],
			// Member tries to remove themselves
			['member', memberId, 'member', memberId, true],
			// Member tries to remove another member
			['member', memberId, 'member', 'user-4', false],
			['member', memberId, 'non-participant', nonParticipantId, false],
			// Non-participant tries to remove participants
			['non-participant', nonParticipantId, 'owner', ownerId, false],
			['non-participant', nonParticipantId, 'editor', editorId, false],
			['non-participant', nonParticipantId, 'member', memberId, false],
			[
				'non-participant',
				nonParticipantId,
				'non-participant',
				nonParticipantId,
				false,
			],
		])('can $0 remove $2 expected=$4', ([, actorId, , targetId, expected]) => {
			const result = canDeleteParticipant(
				privateTrip,
				actorId as string,
				targetId as string,
			);
			expect(result).toBe(expected);
		});
	});

	describe('canRead', () => {
		// actorType, actorId, tripType, trip, expected
		test.for([
			// Owner tries to read
			['owner', ownerId, 'private', privateTrip, true],
			['owner', ownerId, 'friends', friendsTrip, true],
			['owner', ownerId, 'public', publicTrip, true],
			// Editor tries to read
			['editor', editorId, 'private', privateTrip, false],
			['editor', editorId, 'friends', friendsTrip, true],
			['editor', editorId, 'public', publicTrip, true],
			// Member tries to read
			['member', memberId, 'private', privateTrip, false],
			['member', memberId, 'friends', friendsTrip, true],
			['member', memberId, 'public', publicTrip, true],
			// Non-participant tries to read
			['non-participant', nonParticipantId, 'private', privateTrip, false],
			['non-participant', nonParticipantId, 'friends', friendsTrip, false],
			['non-participant', nonParticipantId, 'public', publicTrip, true],
		])('can $0 read $1 trip expected=$4', ([, actorId, , trip, expected]) => {
			const result = canRead(trip as Trip, actorId as string);
			expect(result).toBe(expected);
		});
	});
});
