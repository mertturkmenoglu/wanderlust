import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		browser: {
			provider: playwright(),
			enabled: true,
			// at least one instance is required
			instances: [{ browser: 'chromium' }],
		},
	},
});
