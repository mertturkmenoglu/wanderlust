import { Types } from '@wanderlust/common';
import z from 'zod';

export namespace dto {
	export const listInput = z.object({});

	export type ListInput = z.infer<typeof listInput>;

	export const listOutput = z.object({
		notifications: Types.Notification.array(),
	});

	export type ListOutput = z.infer<typeof listOutput>;

	export const markReadInput = Types.Notification.pick({
		id: true,
	});

	export type MarkReadInput = z.infer<typeof markReadInput>;

	export const markReadOutput = z.object({
		success: z.boolean(),
	});

	export type MarkReadOutput = z.infer<typeof markReadOutput>;

	export const markAllReadInput = z.object({});

	export type MarkAllReadInput = z.infer<typeof markAllReadInput>;

	export const markAllReadOutput = z.object({
		success: z.boolean(),
	});

	export type MarkAllReadOutput = z.infer<typeof markAllReadOutput>;

	export const clearInput = z.object({});

	export type ClearInput = z.infer<typeof clearInput>;

	export const clearOutput = z.object({});

	export type ClearOutput = z.infer<typeof clearOutput>;

	export const preferencesInput = z.object({});

	export type PreferencesInput = z.infer<typeof preferencesInput>;

	export const preferencesOutput = z.object({
		preferences: Types.Notifications.Preference.array(),
	});

	export type PreferencesOutput = z.infer<typeof preferencesOutput>;

	export const updatePreferencesInput = Types.Notifications.$Insert.Preference;

	export type UpdatePreferencesInput = z.infer<typeof updatePreferencesInput>;

	export const updatePreferencesOutput = z.object({
		success: z.boolean(),
	});

	export type UpdatePreferencesOutput = z.infer<typeof updatePreferencesOutput>;
}
