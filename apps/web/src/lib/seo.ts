import { createMetadataGenerator } from 'tanstack-meta';

export const seo = createMetadataGenerator({
	titleTemplate: {
		default: 'Wanderlust',
		template: '%s | Wanderlust',
	},
	baseUrl: globalThis?.location.origin ?? 'http://localhost:3000',
});
