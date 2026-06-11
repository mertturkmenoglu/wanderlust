import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		devtools({ consolePiping: { enabled: false } }),
		tanstackRouter({ target: 'react', autoCodeSplitting: true }),
		viteReact(),
		tailwindcss(),
	],
	server: {
		hmr: { port: 3004 },
	},
	resolve: {
		tsconfigPaths: true,
	},
});
