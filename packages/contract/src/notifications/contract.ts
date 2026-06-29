import { oc } from '@orpc/contract';
import * as dto from './dto';

export const contract = {
	list: oc
		.input(dto.listInput)
		.output(dto.listOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'GET',
			path: '/notifications',
			summary: 'List Notifications',
			description: 'List all notifications for the authenticated user',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Notifications'],
		}),
	markRead: oc
		.input(dto.markReadInput)
		.output(dto.markReadOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'POST',
			path: '/notifications/mark-read',
			summary: 'Mark Notification as Read',
			description:
				'Mark a specific notification as read for the authenticated user',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Notifications'],
		}),
	markAllRead: oc
		.input(dto.markAllReadInput)
		.output(dto.markAllReadOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'POST',
			path: '/notifications/mark-all-read',
			summary: 'Mark All Notifications as Read',
			description: 'Mark all notifications as read for the authenticated user',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Notifications'],
		}),
	clear: oc
		.input(dto.clearInput)
		.output(dto.clearOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'DELETE',
			path: '/notifications',
			summary: 'Clear Notifications',
			description: 'Clear all notifications for the authenticated user',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Notifications'],
		}),
	preferences: oc
		.input(dto.preferencesInput)
		.output(dto.preferencesOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'GET',
			path: '/notifications/preferences',
			summary: 'Get Notification Preferences',
			description: 'Get notification preferences for the authenticated user',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Notifications'],
		}),
	updatePreferences: oc
		.input(dto.updatePreferencesInput)
		.output(dto.updatePreferencesOutput)
		.errors({
			BAD_REQUEST: {},
			UNAUTHORIZED: {},
			FORBIDDEN: {},
			NOT_FOUND: {},
			CONFLICT: {},
			UNPROCESSABLE_CONTENT: {},
			INTERNAL_SERVER_ERROR: {},
		})
		.route({
			method: 'PATCH',
			path: '/notifications/preferences',
			summary: 'Update Notification Preferences',
			description: 'Update notification preferences for the authenticated user',
			successStatus: 200,
			successDescription: 'OK',
			tags: ['Notifications'],
		}),
};

export type Contract = typeof contract;
