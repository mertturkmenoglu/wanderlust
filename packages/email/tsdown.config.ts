import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['emails/**/*.ts', 'emails/**/*.tsx'],
	format: 'esm',
	outDir: './dist',
	dts: true,
	clean: true,
});
