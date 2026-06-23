import z from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const preferencesSchema = z.object({
	units: z.enum(['metric', 'imperial'], 'Choose an option').default('metric'),
	timezone: z.string().default('UTC+00:00'),
	mapStyle: z
		.enum(['light', 'dark', 'auto'], 'Choose an option')
		.default('light'),
	searchRadius: z
		.enum(['close', 'medium', 'far'], 'Choose an option')
		.default('close'),
	enableSearchHistory: z.boolean().default(true),
	enableRecentViews: z.boolean().default(true),
	theme: z.enum(['light', 'dark', 'auto'], 'Choose an option').default('light'),
});

export type TPreferences = z.infer<typeof preferencesSchema>;

export type PreferencesState = {
	preferences: TPreferences;
	setPreferences: (preferences: Partial<TPreferences>) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
	persist(
		(set) => ({
			preferences: preferencesSchema.parse({}),
			setPreferences: (preferences) =>
				set((state) => ({
					preferences: preferencesSchema.parse({
						...state.preferences,
						...preferences,
					}),
				})),
		}),
		{
			name: 'wl-preferences',
		},
	),
);
