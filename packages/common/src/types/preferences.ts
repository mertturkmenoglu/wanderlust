import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Resources } from './resources';
import { Timezone } from './timezone';

export const Preference = createSelectSchema(schema.preferences, {
	userId: Resources.id,
	enableRecentViews: z.boolean().meta({
		description: 'Whether recent views are enabled or not',
		examples: [true, false],
	}),
	enableSearchHistory: z.boolean().meta({
		description: 'Whether search history is enabled or not',
		examples: [true, false],
	}),
	mapStyle: z.enum(schema.preferenceMapStyleEnum.enumValues).meta({
		description: 'Map style preference',
		examples: ['auto', 'light', 'dark'],
	}),
	units: z.enum(schema.preferenceUnitsEnum.enumValues).meta({
		description: 'Units preference',
		examples: ['metric', 'imperial'],
	}),
	searchRadius: z.enum(schema.preferenceSearchRadiusEnum.enumValues).meta({
		description: 'Search radius preference',
		examples: ['close', 'medium', 'far'],
	}),
	theme: z.enum(schema.preferenceThemeEnum.enumValues).meta({
		description: 'Theme preference',
		examples: ['system', 'light', 'dark'],
	}),
	timezone: Timezone,
}).meta({
	description: 'All the preferences of a user',
});

export namespace Preferences {
	export namespace $Insert {
		export const Preference = createInsertSchema(schema.preferences);
	}
}
