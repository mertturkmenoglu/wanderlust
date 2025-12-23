/// <reference types="vitest/config" />

import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({ autoCodeSplitting: true }),
		viteReact(),
		tailwindcss(),
	],
	test: {
		globals: true,
		environment: 'jsdom',
	},
	// https://github.com/vitejs/vite/discussions/17738
	optimizeDeps: {
		exclude: ['node_modules/.cache'],
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	build: {
		rollupOptions: {
			external: ['../../packages/ui'],
		},
	},
});
