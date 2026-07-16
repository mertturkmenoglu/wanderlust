import { createMetadataGenerator } from 'tanstack-meta';

export const seo = createMetadataGenerator({
	titleTemplate: {
		default: 'Wanderlust',
		template: '%s | Wanderlust',
	},
	baseUrl: 'http://localhost:3000',
});
