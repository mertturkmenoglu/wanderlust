import { z } from 'zod';

export const LatLng = z
	.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)])
	.meta({
		description: 'Latitude and longitude coordinates',
		examples: [
			[51.5074, -0.1278],
			[40.7128, -74.006],
		],
	});
