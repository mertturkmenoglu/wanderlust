import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: './src/routes/index.ts',
	format: 'esm',
	outDir: './dist',
	dts: true,
	clean: true,
	noExternal: [/@wanderlust\/.*/],
});
