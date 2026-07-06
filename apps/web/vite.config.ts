import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		devtools({ consolePiping: { enabled: false } }),
		tanstackStart(),
		viteReact(),
		tailwindcss(),
	],
	ssr: {
		noExternal: ['typesense-instantsearch-adapter'],
	},
	server: {
		hmr: { port: 3001 },
	},
	resolve: {
		tsconfigPaths: true,
	},
	envDir: '../../',
});
