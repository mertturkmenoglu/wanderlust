import { oc } from '@orpc/contract';
import { ERRORS } from '../_common/errors';
import { dto } from './dto';

export const contract = oc
	.tag('Notifications')
	.errors(ERRORS)
	.router({
		list: oc.input(dto.listInput).output(dto.listOutput).route({
			method: 'GET',
			path: '/notifications',
			summary: 'List Notifications',
			description: 'List all notifications for the authenticated user',
		}),
		markRead: oc.input(dto.markReadInput).output(dto.markReadOutput).route({
			method: 'POST',
			path: '/notifications/mark-read',
			summary: 'Mark Notification as Read',
			description:
				'Mark a specific notification as read for the authenticated user',
		}),
		markAllRead: oc
			.input(dto.markAllReadInput)
			.output(dto.markAllReadOutput)
			.route({
				method: 'POST',
				path: '/notifications/mark-all-read',
				summary: 'Mark All Notifications as Read',
				description:
					'Mark all notifications as read for the authenticated user',
			}),
		clear: oc.input(dto.clearInput).output(dto.clearOutput).route({
			method: 'DELETE',
			path: '/notifications',
			summary: 'Clear Notifications',
			description: 'Clear all notifications for the authenticated user',
			successStatus: 204,
			successDescription: 'No Content',
		}),
		preferences: oc
			.input(dto.preferencesInput)
			.output(dto.preferencesOutput)
			.route({
				method: 'GET',
				path: '/notifications/preferences',
				summary: 'Get Notification Preferences',
				description: 'Get notification preferences for the authenticated user',
			}),
		updatePreferences: oc
			.input(dto.updatePreferencesInput)
			.output(dto.updatePreferencesOutput)
			.route({
				method: 'PATCH',
				path: '/notifications/preferences',
				summary: 'Update Notification Preferences',
				description:
					'Update notification preferences for the authenticated user',
			}),
	});

export type Contract = typeof contract;
